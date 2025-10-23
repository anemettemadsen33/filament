@extends('emails.layout')

@section('content')
    <h2>{{ __('booking.requested.greeting', ['name' => $booking->property->owner->name]) }}</h2>
    
    <p>{{ __('booking.requested.intro') }}</p>

    <div class="info-box">
        <p><strong>{{ __('booking.requested.property') }}:</strong> {{ $booking->property->title }}</p>
        <p><strong>{{ __('booking.requested.guest') }}:</strong> {{ $booking->guest->name }} ({{ $booking->guest->email }})</p>
        <p><strong>{{ __('booking.requested.check_in') }}:</strong> {{ \Carbon\Carbon::parse($booking->check_in)->format('l, F j, Y') }}</p>
        <p><strong>{{ __('booking.requested.check_out') }}:</strong> {{ \Carbon\Carbon::parse($booking->check_out)->format('l, F j, Y') }}</p>
        <p><strong>{{ __('booking.requested.guests') }}:</strong> {{ $booking->guests_count }}</p>
        <p><strong>{{ __('booking.requested.nights') }}:</strong> {{ $booking->nights }}</p>
        <p style="font-size: 18px; margin-top: 12px;"><strong>{{ __('booking.requested.total') }}:</strong> <span style="color: {{ config('app-info.primary_color') }};">${{ number_format($booking->total_price, 2) }}</span></p>
    </div>

    @if($booking->special_requests)
        <div class="alert-warning">
            <strong>{{ __('booking.requested.special_requests') }}:</strong><br>
            {{ $booking->special_requests }}
        </div>
    @endif

    <center>
        <a href="{{ config('app.url') }}/admin/bookings/{{ $booking->id }}" class="btn">
            {{ __('booking.requested.action') }}
        </a>
    </center>

    <hr class="divider">

    <p style="font-size: 14px; color: #6b7280;">
        {{ __('booking.requested.footer') }}
    </p>
@endsection
