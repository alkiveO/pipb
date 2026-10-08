<?php

namespace App\Http\Controllers;

use App\Models\News;

class NewsController extends Controller
{
    /**
     * Menampilkan semua berita untuk user/public.
     */
    public function index()
    {
        $news = News::with('admin')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $news
        ]);
    }

    /**
     * Menampilkan detail berita.
     */
    public function show($id)
    {
        $news = News::with('admin')->find($id);

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $news
        ]);
    }
}