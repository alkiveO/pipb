<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVote;
use App\Notifications\ProductEvaluated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductVoteController extends Controller
{
    /**
     * Content Manager memberikan rating per kategori
     * dan feedback untuk produk yang menunggu review.
     */
    public function store(Request $request, $productId)
    {
        $product = Product::with('user')->find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        if (!$product->isPendingReview()) {
            return response()->json([
                'success' => false,
                'message' => 'Produk hanya dapat dinilai ketika sedang menunggu review.',
            ], 422);
        }

        $validated = $request->validate([
            'design_score' => 'required|integer|min:1|max:10',
            'usability_score' => 'required|integer|min:1|max:10',
            'creativity_score' => 'required|integer|min:1|max:10',
            'content_score' => 'required|integer|min:1|max:10',
            'feedback' => 'required|string|max:2000',
        ]);

        $existingVote = ProductVote::where('product_id', $product->id)
            ->where('content_manager_id', $request->user()->id)
            ->exists();

        if ($existingVote) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memberikan penilaian untuk produk ini.',
            ], 422);
        }

        // Rata-rata empat kategori, skala 1–10.
        $overallScore = round(
            (
                $validated['design_score'] +
                $validated['usability_score'] +
                $validated['creativity_score'] +
                $validated['content_score']
            ) / 4,
            2
        );

        // Konversi ke skala 10–100 untuk kompatibilitas
        // dengan kolom score lama yang memiliki batas minimal 10.
        $legacyScore = (int) round($overallScore * 10);

        $vote = DB::transaction(function () use (
            $product,
            $request,
            $validated,
            $overallScore,
            $legacyScore
        ) {
            return ProductVote::create([
                'product_id' => $product->id,
                'content_manager_id' => $request->user()->id,
                'score' => $legacyScore,
                'design_score' => $validated['design_score'],
                'usability_score' => $validated['usability_score'],
                'creativity_score' => $validated['creativity_score'],
                'content_score' => $validated['content_score'],
                'overall_score' => $overallScore,
                'feedback' => $validated['feedback'],
            ]);
        });

        // Kirim notifikasi ke mahasiswa pemilik produk.
        $product->user->notify(
            new ProductEvaluated($product, $vote)
        );

        $voteSummary = $product->votes()
            ->selectRaw(
                'AVG(overall_score) as average_score, COUNT(*) as total_votes'
            )
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Rating dan feedback berhasil diberikan.',
            'data' => [
                'vote' => $vote->load('contentManager'),
                'average_score' => round(
                    (float) $voteSummary->average_score,
                    2
                ),
                'total_votes' => (int) $voteSummary->total_votes,
            ],
        ], 201);
    }
}