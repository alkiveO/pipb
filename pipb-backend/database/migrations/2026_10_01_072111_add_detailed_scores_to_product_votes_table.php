<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_votes', function (Blueprint $table) {
            $table->unsignedTinyInteger('design_score')
                ->nullable()
                ->after('score');

            $table->unsignedTinyInteger('usability_score')
                ->nullable()
                ->after('design_score');

            $table->unsignedTinyInteger('creativity_score')
                ->nullable()
                ->after('usability_score');

            $table->unsignedTinyInteger('content_score')
                ->nullable()
                ->after('creativity_score');

            $table->decimal('overall_score', 5, 2)
                ->nullable()
                ->after('content_score');
        });
    }

    public function down(): void
    {
        Schema::table('product_votes', function (Blueprint $table) {
            $table->dropColumn([
                'design_score',
                'usability_score',
                'creativity_score',
                'content_score',
                'overall_score',
            ]);
        });
    }
};