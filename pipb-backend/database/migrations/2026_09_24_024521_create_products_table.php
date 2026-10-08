<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // Pemilik produk
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Kategori produk
            $table->foreignId('category_id')
                ->constrained('categories')
                ->onDelete('cascade');

            // Informasi produk
            $table->string('name');
            $table->text('description');

            // Dana
            $table->decimal('target_fund', 15, 2)->default(0);
            $table->decimal('investment_amount', 15, 2)->default(0);

            // Launch
            $table->date('launch_date')->nullable();

            // Status approval
            $table->enum('approval_status', [
                'pending',
                'approved',
                'rejected'
            ])->default('pending');

            // Status launch
            $table->enum('launch_status', [
                'belum_launch',
                'launch'
            ])->default('belum_launch');

            // Alasan jika ditolak
            $table->text('rejection_reason')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};