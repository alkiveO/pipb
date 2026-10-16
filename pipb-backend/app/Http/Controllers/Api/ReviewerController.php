<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reviewer;
use Illuminate\Http\JsonResponse;

class ReviewerController extends Controller
{
    public function index(): JsonResponse
    {
        $reviewers = Reviewer::query()
            ->orderBy('order')
            ->orderBy('id')
            ->get([
                'id',
                'name',
                'role',
                'photo',
                'order',
            ]);

        return response()->json([
            'success' => true,
            'data' => $reviewers,
        ]);
    }
}