<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $columns = [
            'design_score' => fn (Blueprint $table) => $table->unsignedTinyInteger('design_score')->nullable(),
            'usability_score' => fn (Blueprint $table) => $table->unsignedTinyInteger('usability_score')->nullable(),
            'creativity_score' => fn (Blueprint $table) => $table->unsignedTinyInteger('creativity_score')->nullable(),
            'content_score' => fn (Blueprint $table) => $table->unsignedTinyInteger('content_score')->nullable(),
            'overall_score' => fn (Blueprint $table) => $table->decimal('overall_score', 5, 2)->nullable(),
            'feedback' => fn (Blueprint $table) => $table->text('feedback')->nullable(),
        ];

        foreach ($columns as $column => $definition) {
            if (! Schema::hasColumn('product_votes', $column)) {
                Schema::table('product_votes', function (Blueprint $table) use ($definition) {
                    $definition($table);
                });
            }
        }
    }

    public function down(): void
    {
        // Tidak menghapus kolom agar data yang sudah ada tetap aman.
    }
};
