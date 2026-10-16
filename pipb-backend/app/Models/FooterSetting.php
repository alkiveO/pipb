<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterSetting extends Model
{
    protected $fillable = [
        'brand_name',
        'logo_path',
        'description',
        'institution_name',
        'copyright_text',
        'use_current_year',
        'copyright_year',
        'back_to_top_label',
        'back_to_top_href',
        'show_back_to_top',
    ];

    protected function casts(): array
    {
        return [
            'use_current_year' => 'boolean',
            'show_back_to_top' => 'boolean',
            'copyright_year' => 'integer',
        ];
    }
}