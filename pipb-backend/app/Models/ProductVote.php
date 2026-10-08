<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVote extends Model
{
    protected $fillable = [
        'product_id',
        'content_manager_id',
        'score',
        'design_score',
        'usability_score',
        'creativity_score',
        'content_score',
        'overall_score',
        'feedback',
    ];

    protected $casts = [
        'score' => 'integer',
        'design_score' => 'integer',
        'usability_score' => 'integer',
        'creativity_score' => 'integer',
        'content_score' => 'integer',
        'overall_score' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function contentManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'content_manager_id');
    }
}