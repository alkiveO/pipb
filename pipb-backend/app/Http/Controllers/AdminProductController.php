<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\Request;
use Illuminate\Support\Facades\Storage;
use App\Notifications\ProductRevisionRequested;

class AdminProductController extends Controller
{
    /**
     * Menampilkan seluruh produk untuk Content Manager / Judge.
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
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Approve / Publish produk.
     */
    public function approve($id)
    {
        $product = Product::with('images')->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        if (!$product->isPendingReview()) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya produk yang sedang menunggu review yang dapat dipublish.',
            ], 422);
        }

        $imageCount = $product->images()->count();

        if ($imageCount !== 4) {
            return response()->json([
                'success' => false,
                'message' => 'Produk harus memiliki tepat 4 gambar sebelum dapat dipublish.',
            ], 422);
        }

        $product->update([
            'approval_status' => Product::STATUS_PUBLISHED,
            'rejection_reason' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dipublish.',
            'data' => $product->load([
                'user',
                'category',
                'images',
            ]),
        ]);
    }

    /**
     * Request Revision.
     *
     * Flow:
     * Evaluate Product
     * → Write Review / Feedback
     * → Request Revision
     * → Notify Owner for Revision
     * → Status: Needs Revision
     */
    public function requestRevision(Request $request, $id)
    {
        $product = Product::with('user')->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        if (!$product->isPendingReview()) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya produk yang sedang menunggu review yang dapat diminta revisi.',
            ], 422);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $product->update([
            'approval_status' => Product::STATUS_NEEDS_REVISION,
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        $product->refresh();

        $product->user->notify(
            new ProductRevisionRequested($product)
        );

        return response()->json([
            'success' => true,
            'message' => 'Produk dikembalikan kepada mahasiswa untuk direvisi.',
            'data' => $product->load([
                'user',
                'category',
                'images',
            ]),
        ]);
    }

    /**
     * Reject produk.
     *
     * Flow:
     * Evaluate Product
     * → Write Review / Feedback
     * → Reject
     * → Send Rejection Feedback
     * → Status: Rejected
     */
    public function reject(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        if (!$product->isPendingReview()) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya produk yang sedang menunggu review yang dapat ditolak.',
            ], 422);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $product->update([
            'approval_status' => Product::STATUS_REJECTED,
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditolak.',
            'data' => $product->load([
                'user',
                'category',
                'images',
            ]),
        ]);
    }

    /**
     * Memperbarui total dana produk yang sudah published.
     */
    public function investment(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        if (!$product->isPublished()) {
            return response()->json([
                'success' => false,
                'message' => 'Total dana hanya dapat diperbarui untuk produk yang sudah published.',
            ], 422);
        }

        $validated = $request->validate([
            'investment_amount' => 'required|numeric|min:0',
        ]);

        $product->update([
            'investment_amount' => $validated['investment_amount'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Total dana terkumpul berhasil diperbarui.',
            'data' => $product->load([
                'user',
                'category',
                'images',
            ]),
        ]);
    }

    /**
     * Menghapus produk yang belum published.
     */
    public function destroy($id)
    {
        $product = Product::with('images')->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

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

        $product->images()->delete();
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus.',
        ]);
    }
}