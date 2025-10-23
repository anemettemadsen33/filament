<?php

use Illuminate\Support\Facades\Route;
use App\Models\Invoice;

Route::middleware('api')->group(function () {
    Route::get('/api/invoices/{invoice}', function (Invoice $invoice) {
        $invoice->load(['booking.property']);
        // Basic auth check: only the guest (owner of booking) or admin/owner can view
        $user = request()->user();
        if (!$user) {
            abort(401);
        }
        if (!($user->isAdmin() || $user->id === $invoice->booking->guest_id || $user->id === $invoice->booking->property->owner_id)) {
            abort(403);
        }
        return response()->view('invoices.invoice', ['invoice' => $invoice]);
    });
});
