<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FooterLink;
use Illuminate\Http\JsonResponse;

class FooterLinkController extends Controller
{
    public function index(): JsonResponse
    {
        $links = FooterLink::query()
            ->where('is_visible', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get([
                'id',
                'section_title',
                'label',
                'href',
                'sort_order',
            ])
            ->groupBy('section_title')
            ->map(fn ($items, $title) => [
                'title' => $title,
                'links' => $items->values(),
            ])
            ->values();

        return response()->json([
            'success' => true,
            'data' => $links,
        ]);
    }
}