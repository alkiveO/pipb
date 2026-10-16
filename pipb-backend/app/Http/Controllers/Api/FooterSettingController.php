<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FooterSetting;
use Illuminate\Http\JsonResponse;

class FooterSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $setting = FooterSetting::query()->first();

        if (! $setting) {
            return response()->json([
                'success' => true,
                'data' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'brand_name' => $setting->brand_name,
                'logo_url' => $setting->logo_path
                    ? asset('storage/' . $setting->logo_path)
                    : null,
                'description' => $setting->description,
                'institution_name' => $setting->institution_name,
                'copyright_text' => $setting->copyright_text,
                'use_current_year' => $setting->use_current_year,
                'copyright_year' => $setting->use_current_year
                    ? now()->year
                    : $setting->copyright_year,
                'back_to_top_label' => $setting->back_to_top_label,
                'back_to_top_href' => $setting->back_to_top_href,
                'show_back_to_top' => $setting->show_back_to_top,
            ],
        ]);
    }
}