<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function index($productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.'
            ], 404);
        }

        $images = $product->images()
            ->orderByDesc('is_primary')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $images
        ]);
    }

    public function store(Request $request, $productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.'
            ], 404);
        }

        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengubah gambar produk ini.'
            ], 403);
        }

        if ($product->approval_status === 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Gambar produk yang sudah disetujui tidak dapat diubah.'
            ], 422);
        }

        $validated = $request->validate([
            'images' => 'required|array|size:4',
            'images.*' => 'required|image|mimes:jpg,jpeg,png,webp|max:1024',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Hapus gambar lama jika produk ditolak
        |--------------------------------------------------------------------------
        */

        if ($product->approval_status === 'rejected') {
            $oldImages = $product->images()->get();

            foreach ($oldImages as $oldImage) {
                if ($oldImage->image_path) {
                    Storage::disk('public')->delete(
                        $oldImage->image_path
                    );
                }

                $oldImage->delete();
            }
        } elseif ($product->images()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Gambar produk sudah pernah ditambahkan.'
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Upload tepat 4 gambar
        |--------------------------------------------------------------------------
        */

        $images = [];

        foreach ($validated['images'] as $index => $imageFile) {
            $path = $imageFile->store(
                'products',
                'public'
            );

            $image = ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $path,
                'is_primary' => $index === 0,
            ]);

            $images[] = $image;
        }

        return response()->json([
            'success' => true,
            'message' => '4 gambar produk berhasil ditambahkan.',
            'data' => $images
        ], 201);
    }

    public function destroy($id)
    {
        $image = ProductImage::with('product')->find($id);

        if (!$image) {
            return response()->json([
                'success' => false,
                'message' => 'Gambar produk tidak ditemukan.'
            ], 404);
        }

        $user = request()->user();
        $product = $image->product;

        if ($product->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk menghapus gambar ini.'
            ], 403);
        }

        if ($product->approval_status !== 'rejected') {
            return response()->json([
                'success' => false,
                'message' => 'Gambar hanya dapat dihapus ketika pengajuan produk ditolak.'
            ], 422);
        }

        if ($image->image_path) {
            Storage::disk('public')->delete(
                $image->image_path
            );
        }

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gambar produk berhasil dihapus.'
        ]);
    }
}