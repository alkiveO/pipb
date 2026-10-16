<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About;
use Illuminate\Http\JsonResponse;

class AboutController extends Controller
{
    public function index(): JsonResponse
    {
        $about = About::query()
            ->latest('id')
            ->first();

        return response()->json([
            'success' => true,
            'data' => $about,
        ]);
    }
}