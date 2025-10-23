<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class InvoiceIssuedNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Invoice $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $invoice = $this->invoice->load(['booking.property']);
        $mail = (new MailMessage)
            ->subject('Factura ' . $invoice->invoice_number . ' - ' . config('billing.company_name'))
            ->greeting('Factura emisă')
            ->line('Vă mulțumim pentru rezervare. Atașat/Disponibilă este factura pentru plată prin transfer bancar.')
            ->line('Suma: ' . number_format($invoice->amount, 2) . ' ' . $invoice->currency)
            ->line('Scadență: ' . optional($invoice->due_date)->format('d.m.Y'))
            ->line('Referință plată: ' . $invoice->invoice_number)
            ->action('Vizualizează factura', url('/api/invoices/'.$invoice->id));

        // Attach PDF if e disponibil
        if ($invoice->pdf_path && file_exists($invoice->pdf_path)) {
            $mail->attach($invoice->pdf_path, [
                'as' => 'Factura-'.$invoice->invoice_number.'.pdf',
                'mime' => 'application/pdf',
            ]);
        }

        return $mail;
    }
}
