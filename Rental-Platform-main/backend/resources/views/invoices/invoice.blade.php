<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura {{ $invoice->invoice_number }}</title>
    <style>
        body { font-family: DejaVu Sans, Arial, Helvetica, sans-serif; font-size: 12px; color: #111; }
        .header { display:flex; justify-content: space-between; margin-bottom: 20px; }
        .box { border: 1px solid #ccc; padding: 10px; }
        h1 { font-size: 18px; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f7f7f7; text-align: left; }
        .right { text-align: right; }
        .muted { color: #555; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Factura {{ $invoice->invoice_number }}</h1>
            <div>Data emiterii: {{ $invoice->issue_date->format('d.m.Y') }}</div>
            <div>Scadență: {{ optional($invoice->due_date)->format('d.m.Y') }}</div>
        </div>
        <div class="box">
            <div><strong>{{ config('billing.company_name') }}</strong></div>
            @if(config('billing.company_vat'))<div>CUI: {{ config('billing.company_vat') }}</div>@endif
            @if(config('billing.company_reg'))<div>Reg. Com.: {{ config('billing.company_reg') }}</div>@endif
            <div>{{ config('billing.company_address') }}</div>
            <div>{{ config('billing.company_email') }} | {{ config('billing.company_phone') }}</div>
        </div>
    </div>

    <div class="box" style="margin-bottom: 10px;">
        <div><strong>Cumpărător</strong></div>
        <div>{{ $invoice->customer_name }}</div>
        <div class="muted">{{ $invoice->customer_email }}</div>
        @if($invoice->customer_address)
            <div>{{ $invoice->customer_address }}</div>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Descriere</th>
                <th class="right">Cant.</th>
                <th class="right">Preț</th>
                <th class="right">Valoare</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Rezervare proprietate: {{ $invoice->booking->property->title }} ({{ $invoice->booking->check_in->format('d.m.Y') }} → {{ $invoice->booking->check_out->format('d.m.Y') }})</td>
                <td class="right">1</td>
                <td class="right">{{ number_format($invoice->amount, 2) }} {{ $invoice->currency }}</td>
                <td class="right">{{ number_format($invoice->amount, 2) }} {{ $invoice->currency }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th colspan="3" class="right">Total</th>
                <th class="right">{{ number_format($invoice->amount, 2) }} {{ $invoice->currency }}</th>
            </tr>
        </tfoot>
    </table>

    <div class="box" style="margin-top: 12px;">
        <div><strong>Plată prin transfer bancar</strong></div>
        <div>Banca: {{ config('billing.bank_name') }}</div>
        <div>IBAN: {{ config('billing.bank_account_iban') }}</div>
        <div>SWIFT: {{ config('billing.bank_swift') }}</div>
        <div>Monedă: {{ config('billing.currency') }}</div>
        <div class="muted">Referință plată: {{ $invoice->invoice_number }}</div>
    </div>

    <p class="muted" style="margin-top: 10px;">Vă rugăm efectuați plata până la data scadenței și includeți numărul facturii ca referință.</p>
</body>
</html>
