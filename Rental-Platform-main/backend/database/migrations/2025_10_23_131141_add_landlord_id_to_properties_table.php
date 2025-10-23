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
        Schema::table('properties', function (Blueprint $table) {
            $table->foreignId('landlord_id')->nullable()->after('owner_id')->constrained()->onDelete('set null');
            $table->integer('views')->default(0)->after('status');
            $table->integer('favorites')->default(0)->after('views');
            $table->json('blocked_dates')->nullable()->after('favorites');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropForeign(['landlord_id']);
            $table->dropColumn(['landlord_id', 'views', 'favorites', 'blocked_dates']);
        });
    }
};
