<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class AdminNewsController extends Controller
{
    /**
     * Menampilkan semua berita.
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
     * Menampilkan detail satu berita.
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

    /**
     * Membuat berita baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $news = News::create([
            'admin_id' => $request->user()->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil dibuat.',
            'data' => $news->load('admin')
        ], 201);
    }

    /**
     * Mengubah berita.
     */
    public function update(Request $request, $id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan.'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
        ]);

        $news->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil diperbarui.',
            'data' => $news->load('admin')
        ]);
    }

    /**
     * Menghapus berita.
     */
    public function destroy($id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan.'
            ], 404);
        }

        $news->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil dihapus.'
        ]);
    }
}