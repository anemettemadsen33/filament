<?php

namespace App\Filament\Widgets;

use App\Models\Property;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class TopPropertiesChart extends ChartWidget
{
    protected ?string $heading = 'Top Revenue Properties';
    protected static ?int $sort = 4;
    protected int | string | array $columnSpan = 'md:col-span-4';

    protected function getData(): array
    {
        $topProperties = Property::select('properties.id', 'properties.title', DB::raw('SUM(bookings.total_price) as revenue'))
            ->join('bookings', 'properties.id', '=', 'bookings.property_id')
            ->where('bookings.status', '!=', 'cancelled')
            ->whereBetween('bookings.created_at', [now()->subMonths(3), now()])
            ->groupBy('properties.id', 'properties.title')
            ->orderBy('revenue', 'desc')
            ->limit(8)
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Revenue ($)',
                    'data' => $topProperties->pluck('revenue')->toArray(),
                    'backgroundColor' => [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(249, 115, 22, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(14, 165, 233, 0.8)',
                        'rgba(132, 204, 22, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                    ],
                ],
            ],
            'labels' => $topProperties->pluck('title')->map(fn($title) => 
                strlen($title) > 25 ? substr($title, 0, 25) . '...' : $title
            )->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
