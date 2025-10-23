<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Models\User;
use App\Notifications\BookingRequestedNotification;
use App\Notifications\BookingConfirmedNotification;
use App\Notifications\BookingCancelledNotification;

class PreviewEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:preview {type} {--locale=en}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Preview email templates (types: requested, confirmed, cancelled)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->argument('type');
        $locale = $this->option('locale');
        
        // Set locale for preview
        app()->setLocale($locale);
        
        // Get a sample booking with relations
        $booking = Booking::with(['property', 'guest'])->first();
        
        if (!$booking) {
            $this->error('No bookings found in database. Please seed data first.');
            return 1;
        }
        
        // Create notification based on type
        $notification = match($type) {
            'requested' => new BookingRequestedNotification($booking),
            'confirmed' => new BookingConfirmedNotification($booking),
            'cancelled' => new BookingCancelledNotification($booking),
            default => null,
        };
        
        if (!$notification) {
            $this->error('Invalid email type. Use: requested, confirmed, or cancelled');
            return 1;
        }
        
        // Get the notifiable (owner for requested, guest for others)
        $notifiable = $type === 'requested' ? $booking->property->owner : $booking->guest;
        $notifiable->locale = $locale;
        
        // Generate the mail message
        $mailMessage = $notification->toMail($notifiable);
        
        $this->info("Email preview generated successfully!");
        $this->info("Type: {$type}");
        $this->info("Locale: {$locale}");
        $this->newLine();
        $this->info("To view the email, open it in a browser:");
        $this->comment("php artisan serve");
        $this->comment("Then create a route to render the view");
        
        // Output the rendered HTML to a temp file
        $outputPath = storage_path("app/email-preview-{$type}-{$locale}.html");
        
        // Render the view
        $html = view($mailMessage->view, $mailMessage->viewData)->render();
        file_put_contents($outputPath, $html);
        
        $this->info("HTML saved to: {$outputPath}");
        $this->comment("You can open this file in your browser to preview the email.");
        
        return 0;
    }
}
