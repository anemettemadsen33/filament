<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class RevenueChart extends ChartWidget
{
    protected ?string $heading = 'Revenue Overview (Last 6 Months)';
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'md:col-span-8';

    protected function getData(): array
    {
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months->push([
                'month' => $date->format('Y-m'),
                'label' => $date->format('M Y'),
            ]);
        }

        $revenue = Booking::select(
                DB::raw("strftime('%Y-%m', created_at) as month"),
                DB::raw('SUM(total_price) as total')
            )
            ->where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [now()->subMonths(6), now()])
            ->groupBy('month')
            ->pluck('total', 'month');

        $data = $months->map(function ($month) use ($revenue) {
            return $revenue->get($month['month'], 0);
        });

        return [
            'datasets' => [
                [
                    'label' => 'Revenue ($)',
                    'data' => $data->toArray(),
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                    'borderColor' => 'rgb(59, 130, 246)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
            ],
            'labels' => $months->pluck('label')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
