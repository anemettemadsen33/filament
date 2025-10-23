<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
 public function up(): void
 {
 Schema::table('settings', function (Blueprint $table) {
 $table->string('bank_name')->nullable();
 $table->string('bank_account_name')->nullable();
 $table->string('bank_account_number')->nullable();
 $table->string('bank_iban')->nullable();
 $table->string('bank_swift_bic')->nullable();
 $table->string('bank_address')->nullable();
 $table->text('payment_instructions')->nullable();
 });
 }

 public function down(): void
 {
 Schema::table('settings', function (Blueprint $table) {
 $table->dropColumn([
 'bank_name',
 'bank_account_name',
 'bank_account_number',
 'bank_iban',
 'bank_swift_bic',
 'bank_address',
 'payment_instructions',
 ]);
 });
 }
};
