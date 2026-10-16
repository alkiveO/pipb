<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NavbarItem;
use Illuminate\Http\JsonResponse;

class NavbarItemController extends Controller
{
    public function index(): JsonResponse
    {
        $items = NavbarItem::query()
            ->where('is_visible', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get([
                'id',
                'label',
                'href',
                'type',
                'sort_order',
            ]);

        return response()->json([
            'success' => true,
            'data' => $items,
        ]);
    }
}