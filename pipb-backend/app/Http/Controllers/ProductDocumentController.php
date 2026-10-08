<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductDocumentController extends Controller
{
    public function index(Request $request, $productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        if (
            $product->user_id !== $request->user()->id
            && $product->approval_status !== Product::STATUS_PUBLISHED
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke dokumen produk ini.',
            ], 403);
        }

        $documents = $product->documents()
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $documents,
        ]);
    }

    public function store(Request $request, $productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengubah dokumen produk ini.',
            ], 403);
        }

        if ($product->isPublished()) {
            return response()->json([
                'success' => false,
                'message' => 'Dokumen produk yang sudah published tidak dapat diubah.',
            ], 422);
        }

        $validated = $request->validate([
            'document' => [
                'required',
                'file',
                'mimes:pdf',
                'min:10240',
            ],
        ], [
            'document.required' => 'Dokumen pendukung wajib diunggah.',
            'document.file' => 'File dokumen tidak valid.',
            'document.mimes' => 'Dokumen pendukung harus berupa file PDF.',
            'document.min' => 'Dokumen pendukung minimal berukuran 10 MB.',
        ]);

        if ($product->documents()->exists()) {
            $oldDocuments = $product->documents()->get();

            foreach ($oldDocuments as $oldDocument) {
                if ($oldDocument->file_path) {
                    Storage::disk('public')->delete(
                        $oldDocument->file_path
                    );
                }

                $oldDocument->delete();
            }
        }

        $documentFile = $validated['document'];

        $path = $documentFile->store(
            'product-documents',
            'public'
        );

        $document = ProductDocument::create([
            'product_id' => $product->id,
            'file_name' => $documentFile->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $documentFile->getClientMimeType(),
            'file_size' => $documentFile->getSize(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Dokumen pendukung berhasil diunggah.',
            'data' => $document,
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $document = ProductDocument::with('product')->find($id);

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Dokumen tidak ditemukan.',
            ], 404);
        }

        $product = $document->product;

        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk menghapus dokumen ini.',
            ], 403);
        }

        if ($product->isPublished()) {
            return response()->json([
                'success' => false,
                'message' => 'Dokumen dari produk yang sudah published tidak dapat dihapus.',
            ], 422);
        }

        if ($document->file_path) {
            Storage::disk('public')->delete(
                $document->file_path
            );
        }

        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dokumen pendukung berhasil dihapus.',
        ]);
    }
}