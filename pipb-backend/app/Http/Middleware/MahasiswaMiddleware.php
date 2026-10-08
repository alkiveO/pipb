<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MahasiswaMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        if ($request->user()->role !== 'mahasiswa') {
            return response()->json([
                'success' => false,
                'message' => 'Akses hanya untuk mahasiswa.'
            ], 403);
        }

        return $next($request);
    }
}