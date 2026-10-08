<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('products', 'initial_fund')) {
            Schema::table('products', function (Blueprint $table) {
                $table->decimal('initial_fund', 15, 2)
                    ->default(0)
                    ->after('target_fund');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('products', 'initial_fund')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('initial_fund');
            });
        }
    }
};