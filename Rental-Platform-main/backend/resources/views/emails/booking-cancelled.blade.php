@extends('emails.layout')

@section('content')
    <h2>{{ __('booking.cancelled.greeting', ['name' => $booking->guest->name]) }}</h2>
    
    <p>{{ __('booking.cancelled.intro') }}</p>

    <div class="alert-warning">
        <strong style="font-size: 16px;">⚠️ Booking #{{ $booking->id }} has been cancelled</strong>
    </div>

    <div class="info-box">
        <p><strong>{{ __('booking.cancelled.property') }}:</strong> {{ $booking->property->title }}</p>
        <p><strong>{{ __('booking.cancelled.check_in') }}:</strong> {{ \Carbon\Carbon::parse($booking->check_in)->format('l, F j, Y') }}</p>
        <p><strong>{{ __('booking.cancelled.check_out') }}:</strong> {{ \Carbon\Carbon::parse($booking->check_out)->format('l, F j, Y') }}</p>
    </div>

    @if($booking->cancellation_reason)
        <p><strong>{{ __('booking.cancelled.reason') }}:</strong></p>
        <p style="background-color: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            {{ $booking->cancellation_reason }}
        </p>
    @endif

    @if($booking->payment_status === 'paid')
        <h3 style="color: #111827; margin-top: 30px;">{{ __('booking.cancelled.refund_info') }}</h3>
        <p>{{ __('booking.cancelled.refund_text') }}</p>
    @endif

    <center>
        <a href="{{ config('app.url') }}/properties" class="btn">
            {{ __('booking.cancelled.action') }}
        </a>
    </center>

    <hr class="divider">

    <p style="font-size: 14px; color: #6b7280;">
        {{ __('booking.cancelled.footer') }}
    </p>
@endsection
