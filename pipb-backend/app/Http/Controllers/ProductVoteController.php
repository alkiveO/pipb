<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVote;
use Illuminate\Http\Request;

class ProductVoteController extends Controller
{
    /**
     * Content Manager memberikan score dan feedback
     * terhadap produk yang sedang menunggu review.
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

        if (!$product->isPendingReview()) {
            return response()->json([
                'success' => false,
                'message' => 'Produk hanya dapat dinilai ketika sedang menunggu review.',
            ], 422);
        }

        $validated = $request->validate([
            'score' => 'required|integer|min:10|max:100',
            'feedback' => 'required|string|max:2000',
        ]);

        $existingVote = ProductVote::where('product_id', $product->id)
            ->where('content_manager_id', $request->user()->id)
            ->first();

        if ($existingVote) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memberikan penilaian untuk produk ini.',
            ], 422);
        }

        $vote = ProductVote::create([
            'product_id' => $product->id,
            'content_manager_id' => $request->user()->id,
            'score' => $validated['score'],
            'feedback' => $validated['feedback'],
        ]);

        $voteSummary = $product->votes()
            ->selectRaw(
                'AVG(score) as average_score, COUNT(*) as total_votes'
            )
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Score dan feedback berhasil diberikan.',
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