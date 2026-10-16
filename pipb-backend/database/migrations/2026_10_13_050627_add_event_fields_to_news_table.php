<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->string('image')->nullable()->after('content');
            $table->date('event_date')->nullable()->after('image');
            $table->time('event_time')->nullable()->after('event_date');
            $table->string('location')->nullable()->after('event_time');
        });
    }

    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn([
                'image',
                'event_date',
                'event_time',
                'location',
            ]);
        });
    }
};