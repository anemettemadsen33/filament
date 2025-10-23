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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('subject')->nullable();
            $table->enum('status', ['active', 'archived', 'closed'])->default('active');
            $table->json('participants'); // Array of user IDs [tenant_id, landlord_id, admin_id, etc.]
            $table->timestamp('last_message_at')->nullable();
            $table->integer('total_messages')->default(0);
            $table->json('unread_count')->nullable(); // {user_id: count} for each participant
            $table->string('conversation_type')->default('property_inquiry'); // property_inquiry, booking, maintenance, support
            $table->timestamps();
            
            $table->index('property_id');
            $table->index('status');
            $table->index('last_message_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
