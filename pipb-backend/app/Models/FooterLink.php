<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterLink extends Model
{
    protected $fillable = [
        'section_title',
        'label',
        'href',
        'sort_order',
        'is_visible',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_visible' => 'boolean',
    ];
}