@extends('emails.layout')

@section('content')
    <h2>{{ __('booking.confirmed.greeting', ['name' => $booking->guest->name]) }}</h2>
    
    <p>{{ __('booking.confirmed.intro') }}</p>

    <div class="alert-success">
        <strong style="font-size: 18px;">✓ {{ __('booking.confirmed.confirmation') }}</strong>
    </div>

    <h3 style="color: #111827; margin-top: 30px;">{{ __('booking.confirmed.details') }}</h3>
    
    <div class="info-box">
        <p><strong>{{ __('booking.confirmed.property') }}:</strong> {{ $booking->property->title }}</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">{{ $booking->property->address }}, {{ $booking->property->city }}, {{ $booking->property->country }}</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 12px 0;">
        <p><strong>{{ __('booking.confirmed.check_in') }}:</strong> {{ \Carbon\Carbon::parse($booking->check_in)->format('l, F j, Y') }} (after 3:00 PM)</p>
        <p><strong>{{ __('booking.confirmed.check_out') }}:</strong> {{ \Carbon\Carbon::parse($booking->check_out)->format('l, F j, Y') }} (before 11:00 AM)</p>
        <p><strong>{{ __('booking.confirmed.guests') }}:</strong> {{ $booking->guests_count }}</p>
        <p><strong>{{ __('booking.confirmed.nights') }}:</strong> {{ $booking->nights }}</p>
    </div>

    <h3 style="color: #111827; margin-top: 30px;">{{ __('booking.confirmed.payment_title') }}</h3>
    
    <p>{{ __('booking.confirmed.payment_intro') }}</p>

    <div class="info-box" style="border-left-color: #10b981;">
        <p style="font-size: 24px; margin: 0; color: {{ config('app-info.primary_color') }};"><strong>${{ number_format($booking->total_price, 2) }}</strong></p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 4px;">{{ __('booking.confirmed.total') }}</p>
    </div>

    <center>
        <a href="{{ config('app.url') }}/account/bookings" class="btn">
            {{ __('booking.confirmed.action') }}
        </a>
    </center>

    <h3 style="color: #111827; margin-top: 30px;">{{ __('booking.confirmed.next_steps') }}</h3>
    
    <p><strong>1.</strong> {{ __('booking.confirmed.step1') }}</p>
    <p><strong>2.</strong> {{ __('booking.confirmed.step2') }}</p>
    <p><strong>3.</strong> {{ __('booking.confirmed.step3') }}</p>

    <hr class="divider">

    <p style="font-size: 14px; color: #6b7280;">
        {{ __('booking.confirmed.footer') }}
    </p>
@endsection
