<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HowItWorks;
use Illuminate\Http\JsonResponse;

class HowItWorksController extends Controller
{
    public function index(): JsonResponse
    {
        $steps = HowItWorks::query()
            ->orderBy('number')
            ->get([
                'id',
                'number',
                'title',
                'description',
            ]);

        return response()->json([
            'success' => true,
            'data' => $steps,
        ]);
    }
}