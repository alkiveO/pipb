<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_votes', function (Blueprint $table) {
            if (! Schema::hasColumn('product_votes', 'design_score')) {
                $table->unsignedTinyInteger('design_score')->nullable();
            }

            if (! Schema::hasColumn('product_votes', 'usability_score')) {
                $table->unsignedTinyInteger('usability_score')->nullable();
            }

            if (! Schema::hasColumn('product_votes', 'creativity_score')) {
                $table->unsignedTinyInteger('creativity_score')->nullable();
            }

            if (! Schema::hasColumn('product_votes', 'content_score')) {
                $table->unsignedTinyInteger('content_score')->nullable();
            }

            if (! Schema::hasColumn('product_votes', 'overall_score')) {
                $table->decimal('overall_score', 5, 2)->nullable();
            }

            if (! Schema::hasColumn('product_votes', 'feedback')) {
                $table->text('feedback')->nullable();
            }
        });
    }

    public function down(): void
    {
        // Kolom tidak dihapus karena mungkin sudah digunakan
        // oleh migration sebelumnya atau data yang tersimpan.
    }
};