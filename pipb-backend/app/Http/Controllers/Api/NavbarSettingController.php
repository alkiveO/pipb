<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NavbarSetting;
use Illuminate\Http\JsonResponse;

class NavbarSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $setting = NavbarSetting::query()->first();

        return response()->json([
            'success' => true,
            'data' => [
                'brand_name' => $setting?->brand_name ?? 'PIPB',
                'logo_url' => $setting?->logo_path
                    ? asset('storage/' . $setting->logo_path)
                    : null,
            ],
        ]);
    }
}