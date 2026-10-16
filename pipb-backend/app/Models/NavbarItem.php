<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavbarItem extends Model
{
    protected $fillable = [
        'label',
        'href',
        'type',
        'sort_order',
        'is_visible',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_visible' => 'boolean',
    ];
}