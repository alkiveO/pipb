<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ContentManagerMiddleware
{
    /**
     * Menangani request yang hanya boleh diakses content manager.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        if ($request->user()->role !== 'content_manager') {
            return response()->json([
                'success' => false,
                'message' => 'Akses hanya untuk content manager.'
            ], 403);
        }

        return $next($request);
    }
}