<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    public const STATUS_PENDING_REVIEW = 'pending_review';

    public const STATUS_NEEDS_REVISION = 'needs_revision';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_PUBLISHED = 'published';

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'description',
        'initial_fund',
        'target_fund',
        'investment_amount',
        'launch_date',
        'approval_status',
        'launch_status',
        'rejection_reason',
    ];

    protected $casts = [
        'initial_fund' => 'decimal:2',
        'target_fund' => 'decimal:2',
        'investment_amount' => 'decimal:2',
        'launch_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ProductDocument::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(ProductVote::class);
    }

    public function isPendingReview(): bool
    {
        return $this->approval_status === self::STATUS_PENDING_REVIEW;
    }

    public function needsRevision(): bool
    {
        return $this->approval_status === self::STATUS_NEEDS_REVISION;
    }

    public function isRejected(): bool
    {
        return $this->approval_status === self::STATUS_REJECTED;
    }

    public function isPublished(): bool
    {
        return $this->approval_status === self::STATUS_PUBLISHED;
    }
}