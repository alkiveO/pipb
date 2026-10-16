<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reviewer extends Model
{
    protected $fillable = [
        'name',
        'role',
        'photo',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }
}