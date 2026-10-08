<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('products_new', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('category_id')
                ->constrained('categories')
                ->onDelete('cascade');

            $table->string('name');
            $table->text('description');

            $table->decimal('target_fund', 15, 2)->default(0);
            $table->decimal('investment_amount', 15, 2)->default(0);

            $table->date('launch_date')->nullable();

            $table->enum('approval_status', [
                'pending_review',
                'needs_revision',
                'rejected',
                'published',
            ])->default('pending_review');

            $table->enum('launch_status', [
                'belum_launch',
                'launch',
            ])->default('belum_launch');

            $table->text('rejection_reason')->nullable();

            $table->timestamps();
        });

        DB::statement("
            INSERT INTO products_new (
                id,
                user_id,
                category_id,
                name,
                description,
                target_fund,
                investment_amount,
                launch_date,
                approval_status,
                launch_status,
                rejection_reason,
                created_at,
                updated_at
            )
            SELECT
                id,
                user_id,
                category_id,
                name,
                description,
                target_fund,
                investment_amount,
                launch_date,
                CASE
                    WHEN approval_status = 'pending'
                        THEN 'pending_review'
                    WHEN approval_status = 'approved'
                        THEN 'published'
                    WHEN approval_status = 'rejected'
                        THEN 'rejected'
                    ELSE 'pending_review'
                END,
                launch_status,
                rejection_reason,
                created_at,
                updated_at
            FROM products
        ");

        Schema::drop('products');

        Schema::rename('products_new', 'products');

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('products_old', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('category_id')
                ->constrained('categories')
                ->onDelete('cascade');

            $table->string('name');
            $table->text('description');

            $table->decimal('target_fund', 15, 2)->default(0);
            $table->decimal('investment_amount', 15, 2)->default(0);

            $table->date('launch_date')->nullable();

            $table->enum('approval_status', [
                'pending',
                'approved',
                'rejected',
            ])->default('pending');

            $table->enum('launch_status', [
                'belum_launch',
                'launch',
            ])->default('belum_launch');

            $table->text('rejection_reason')->nullable();

            $table->timestamps();
        });

        DB::statement("
            INSERT INTO products_old (
                id,
                user_id,
                category_id,
                name,
                description,
                target_fund,
                investment_amount,
                launch_date,
                approval_status,
                launch_status,
                rejection_reason,
                created_at,
                updated_at
            )
            SELECT
                id,
                user_id,
                category_id,
                name,
                description,
                target_fund,
                investment_amount,
                launch_date,
                CASE
                    WHEN approval_status = 'pending_review'
                        THEN 'pending'
                    WHEN approval_status = 'published'
                        THEN 'approved'
                    WHEN approval_status = 'rejected'
                        THEN 'rejected'
                    ELSE 'pending'
                END,
                launch_status,
                rejection_reason,
                created_at,
                updated_at
            FROM products
        ");

        Schema::drop('products');

        Schema::rename('products_old', 'products');

        Schema::enableForeignKeyConstraints();
    }
};