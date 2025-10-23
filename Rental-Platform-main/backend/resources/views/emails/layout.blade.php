<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ config('app.name') }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f3f4f6;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .email-header {
            background-color: {{ config('app-info.primary_color') }};
            padding: 30px 40px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
        }
        .email-logo {
            max-height: 50px;
            margin-bottom: 10px;
        }
        .email-body {
            padding: 40px;
        }
        .email-body h2 {
            color: #111827;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .email-body p {
            margin: 0 0 16px 0;
            color: #4b5563;
        }
        .info-box {
            background-color: #f9fafb;
            border-left: 4px solid {{ config('app-info.primary_color') }};
            padding: 20px;
            margin: 20px 0;
        }
        .info-box p {
            margin: 8px 0;
        }
        .info-box strong {
            color: #111827;
        }
        .btn {
            display: inline-block;
            padding: 14px 32px;
            background-color: {{ config('app-info.primary_color') }};
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .email-footer {
            background-color: #f9fafb;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .email-footer p {
            margin: 8px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .divider {
            border: 0;
            border-top: 1px solid #e5e7eb;
            margin: 30px 0;
        }
        .alert-warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin: 20px 0;
            color: #92400e;
        }
        .alert-success {
            background-color: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 16px;
            margin: 20px 0;
            color: #065f46;
        }
        @media only screen and (max-width: 600px) {
            .email-header, .email-body, .email-footer {
                padding: 20px !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="email-header">
            @if(config('app-info.logo_url'))
                <img src="{{ config('app-info.logo_url') }}" alt="{{ config('app.name') }}" class="email-logo">
            @endif
            <h1>🏠 {{ config('app.name') }}</h1>
        </div>

        <!-- Body -->
        <div class="email-body">
            @yield('content')
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p><strong>{{ config('app.name') }}</strong></p>
            <p>{{ config('app-info.contact.address') }}</p>
            <p>
                📧 <a href="mailto:{{ config('app-info.contact.email') }}" style="color: {{ config('app-info.primary_color') }};">{{ config('app-info.contact.email') }}</a> | 
                📞 {{ config('app-info.contact.phone') }}
            </p>
            @if(config('app-info.social.facebook') || config('app-info.social.instagram'))
                <p style="margin-top: 16px;">
                    @if(config('app-info.social.facebook'))
                        <a href="{{ config('app-info.social.facebook') }}" style="color: {{ config('app-info.primary_color') }}; margin: 0 8px;">Facebook</a>
                    @endif
                    @if(config('app-info.social.instagram'))
                        <a href="{{ config('app-info.social.instagram') }}" style="color: {{ config('app-info.primary_color') }}; margin: 0 8px;">Instagram</a>
                    @endif
                </p>
            @endif
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
