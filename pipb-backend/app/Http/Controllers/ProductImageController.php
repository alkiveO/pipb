<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProductImageController extends Controller
{
    /**
     * Menampilkan gambar produk.
     */
    public function index($productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        $images = $product->images()
            ->orderByDesc('is_primary')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $images,
        ]);
    }

    /**
     * Menambahkan gambar untuk pengajuan baru atau
     * mengganti seluruh gambar saat revisi/penolakan.
     *
     * Jumlah gambar wajib tepat 4 jika upload dilakukan.
     */
    public function store(Request $request, $productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        if (
            (int) $product->user_id !==
            (int) $request->user()->id
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengubah gambar produk ini.',
            ], 403);
        }

        // Produk yang sudah masuk katalog publik tidak dapat diubah.
        if ($product->isPublished()) {
            return response()->json([
                'success' => false,
                'message' => 'Gambar produk yang sudah published tidak dapat diubah.',
            ], 422);
        }

        /*
         * Gambar hanya dapat diunggah:
         * 1. Saat produk baru belum memiliki gambar.
         * 2. Saat produk membutuhkan revisi.
         * 3. Saat produk ditolak.
         */
        $canReplaceImages =
            $product->needsRevision() ||
            $product->isRejected();

        $hasExistingImages = $product->images()->exists();

        if (
            $product->approval_status ===
                Product::STATUS_PENDING_REVIEW &&
            $hasExistingImages
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Gambar tidak dapat diubah ketika pengajuan sedang menunggu review.',
            ], 422);
        }

        if (
            $hasExistingImages &&
            !$canReplaceImages
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Gambar hanya dapat diganti saat produk membutuhkan revisi atau ditolak.',
            ], 422);
        }

        /*
         * Validasi dijalankan sebelum gambar lama dihapus.
         * Jadi jika file tidak valid, gambar lama tetap aman.
         */
        $validated = $request->validate([
            'images' => 'required|array|size:4',
            'images.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:1024',
            ],
        ]);

        $oldImages = $product->images()->get();
        $newImages = [];
        $newPaths = [];

        try {
            DB::transaction(function () use (
                $product,
                $validated,
                $oldImages,
                &$newImages,
                &$newPaths
            ) {
                /*
                 * Simpan empat gambar baru terlebih dahulu.
                 */
                foreach (
                    $validated['images'] as $index => $imageFile
                ) {
                    $path = $imageFile->store(
                        'products',
                        'public'
                    );

                    if (!$path) {
                        throw new \RuntimeException(
                            'Gagal menyimpan gambar produk.'
                        );
                    }

                    $newPaths[] = $path;

                    $newImages[] = [
                        'product_id' => $product->id,
                        'image_path' => $path,
                        'is_primary' => $index === 0,
                    ];
                }

                /*
                 * Setelah file baru tersimpan, hapus record
                 * gambar lama dan masukkan empat gambar baru.
                 */
                if ($oldImages->isNotEmpty()) {
                    $product->images()->delete();
                }

                foreach ($newImages as $imageData) {
                    ProductImage::create($imageData);
                }
            });
        } catch (\Throwable $error) {
            /*
             * Jika proses database gagal, bersihkan file baru
             * agar tidak meninggalkan file yatim.
             */
            foreach ($newPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            report($error);

            return response()->json([
                'success' => false,
                'message' => 'Gambar gagal disimpan. Gambar sebelumnya dipertahankan jika proses database gagal.',
            ], 500);
        }

        /*
         * Record gambar lama sudah diganti.
         * Sekarang hapus file lama dari storage.
         */
        foreach ($oldImages as $oldImage) {
            if ($oldImage->image_path) {
                Storage::disk('public')->delete(
                    $oldImage->image_path
                );
            }
        }

        $images = $product->images()
            ->orderByDesc('is_primary')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'message' => $oldImages->isNotEmpty()
                ? '4 gambar produk berhasil diganti.'
                : '4 gambar produk berhasil ditambahkan.',
            'data' => $images,
        ], 201);
    }

    /**
     * Menghapus gambar milik mahasiswa.
     *
     * Penghapusan satu gambar hanya diperbolehkan ketika
     * produk berstatus needs_revision atau rejected.
     */
    public function destroy($id)
    {
        $image = ProductImage::with('product')->find($id);

        if (!$image) {
            return response()->json([
                'success' => false,
                'message' => 'Gambar produk tidak ditemukan.',
            ], 404);
        }

        $user = request()->user();
        $product = $image->product;

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        if (
            (int) $product->user_id !==
            (int) $user->id
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk menghapus gambar ini.',
            ], 403);
        }

        if (
            !$product->needsRevision() &&
            !$product->isRejected()
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Gambar hanya dapat dihapus ketika produk membutuhkan revisi atau ditolak.',
            ], 422);
        }

        $imagePath = $image->image_path;

        $image->delete();

        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        return response()->json([
            'success' => true,
            'message' => 'Gambar produk berhasil dihapus.',
        ]);
    }
}