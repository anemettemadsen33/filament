<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class InvoiceService
{
    public function nextInvoiceNumber(): string
    {
        // Default format: YYYY-#### (prefix from config + zero-padded sequence)
        $prefix = config('billing.number_prefix');
        $padding = (int) config('billing.number_padding');

        $last = Invoice::where('invoice_number', 'like', $prefix . '%')
            ->orderByDesc('id')
            ->value('invoice_number');

        $seq = 0;
        if ($last && str_starts_with($last, $prefix)) {
            $tail = substr($last, strlen($prefix));
            if (ctype_digit($tail)) {
                $seq = (int) $tail;
            }
        }
        $seq++;
        return $prefix . str_pad((string) $seq, $padding, '0', STR_PAD_LEFT);
    }

    public function createForBooking(Booking $booking): Invoice
    {
        return DB::transaction(function () use ($booking) {
            if ($booking->invoice) {
                return $booking->invoice;
            }

            $number = $this->nextInvoiceNumber();
            $issue = now();
            $due = now()->addDays(5);

            $invoice = Invoice::create([
                'booking_id' => $booking->id,
                'invoice_number' => $number,
                'issue_date' => $issue->toDateString(),
                'due_date' => $due->toDateString(),
                'amount' => $booking->total_price,
                'currency' => config('billing.currency'),
                'status' => 'sent',
                'customer_name' => $booking->guest->name,
                'customer_email' => $booking->guest->email,
                'customer_address' => null,
            ]);

            $booking->invoice_id = $invoice->id;
            $booking->save();

            // Try to generate a PDF (if a compatible PDF library is installed)
            $this->tryGeneratePdf($invoice);

            return $invoice;
        });
    }

    public function tryGeneratePdf(Invoice $invoice): bool
    {
        try {
            // Attempt using barryvdh/laravel-dompdf if available
            if (class_exists('Barryvdh\\DomPDF\\Facade\\Pdf')) {
                /** @var \Barryvdh\DomPDF\Facade\Pdf $pdf */
                $pdf = app('dompdf.wrapper');
                $html = view('invoices.invoice', ['invoice' => $invoice->load(['booking.property'])])->render();
                $pdf->loadHTML($html);
                $pdf->setPaper('a4');

                $fileName = 'invoices/' . $invoice->invoice_number . '.pdf';
                Storage::disk('local')->put($fileName, $pdf->output());

                $invoice->pdf_path = Storage::disk('local')->path($fileName);
                $invoice->save();
                return true;
            }
        } catch (\Throwable $e) {
            // Silently ignore, will fallback to HTML link in emails
        }
        return false;
    }
}
