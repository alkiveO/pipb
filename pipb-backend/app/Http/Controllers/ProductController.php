<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Menampilkan produk yang sudah published
     * untuk katalog publik.
     */
    public function index()
    {
        $products = Product::with([
                'user',
                'category',
                'images',
            ])
            ->withCount('votes')
            ->withAvg('votes', 'score')
            ->where(
                'approval_status',
                Product::STATUS_PUBLISHED
            )
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Menampilkan detail produk yang sudah published.
     */
    public function show($id)
    {
        $product = Product::with([
                'user',
                'category',
                'images',
            ])
            ->withCount('votes')
            ->withAvg('votes', 'score')
            ->where(
                'approval_status',
                Product::STATUS_PUBLISHED
            )
            ->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    /**
     * Menampilkan seluruh produk milik mahasiswa.
     */
    public function myProducts(Request $request)
    {
        $products = Product::with([
                'category',
                'images',
            ])
            ->withCount('votes')
            ->withAvg('votes', 'score')
            ->where(
                'user_id',
                $request->user()->id
            )
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Mahasiswa mengajukan produk baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'initial_fund' => 'required|numeric|min:0',
            'target_fund' => 'required|numeric|min:0',
            'launch_date' => 'nullable|date',
        ]);

        $product = Product::create([
            'user_id' => $request->user()->id,
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'initial_fund' => $validated['initial_fund'],
            'target_fund' => $validated['target_fund'],
            'investment_amount' => $validated['initial_fund'],
            'launch_date' => $validated['launch_date'] ?? null,

            // Sesuai flow mentor:
            // produk baru masuk Pending Review.
            'approval_status' => Product::STATUS_PENDING_REVIEW,

            'launch_status' => 'belum_launch',
            'rejection_reason' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diajukan dan menunggu review.',
            'data' => $product->load([
                'user',
                'category',
                'images',
            ]),
        ], 201);
    }

    /**
     * Mahasiswa memperbaiki produk
     * setelah Content Manager meminta revisi.
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengubah produk ini.',
            ], 403);
        }

        /*
         * Sesuai flow mentor:
         *
         * Content Manager
         *        ↓
         * Request Revision
         *        ↓
         * Needs Revision
         *        ↓
         * Owner Revise Product
         *
         * Jadi produk hanya dapat diedit ketika
         * statusnya needs_revision.
         */
        if (!$product->needsRevision()) {
            return response()->json([
                'success' => false,
                'message' => 'Produk hanya dapat diedit ketika membutuhkan revisi.',
            ], 422);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'initial_fund' => 'sometimes|numeric|min:0',
            'target_fund' => 'sometimes|numeric|min:0',
            'launch_date' => 'nullable|date',
        ]);

        /*
         * Jika initial_fund diubah, investment_amount
         * mengikuti nilai initial_fund mahasiswa.
         */
        $updateData = $validated;

        if (array_key_exists('initial_fund', $validated)) {
            $updateData['investment_amount'] =
                $validated['initial_fund'];
        }

        /*
         * Setelah direvisi dan dikirim kembali,
         * status kembali ke Pending Review.
         */
        $updateData['approval_status'] =
            Product::STATUS_PENDING_REVIEW;

        $updateData['rejection_reason'] = null;

        $product->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diperbarui dan diajukan kembali untuk review.',
            'data' => $product->load([
                'user',
                'category',
                'images',
            ]),
        ]);
    }

    /**
     * Mahasiswa menghapus produk miliknya
     * yang belum published.
     */
    public function destroy(Request $request, $id)
    {
        $product = Product::with('images')->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk menghapus produk ini.',
            ], 403);
        }

        /*
         * Produk yang sudah published sudah menjadi
         * bagian dari katalog publik.
         *
         * Karena itu mahasiswa tidak boleh menghapus
         * produk yang sudah published.
         */
        if ($product->isPublished()) {
            return response()->json([
                'success' => false,
                'message' => 'Produk yang sudah published tidak dapat dihapus.',
            ], 422);
        }

        foreach ($product->images as $image) {
            if ($image->image_path) {
                Storage::disk('public')->delete(
                    $image->image_path
                );
            }
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan produk berhasil dihapus.',
        ]);
    }
}