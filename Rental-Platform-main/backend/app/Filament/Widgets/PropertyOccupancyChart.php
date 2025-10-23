<?php

namespace App\Filament\Widgets;

use App\Models\Property;
use Filament\Widgets\ChartWidget;

class PropertyOccupancyChart extends ChartWidget
{
    protected ?string $heading = 'Property Occupancy Rate';
    protected static ?int $sort = 3;
    protected int | string | array $columnSpan = 'md:col-span-4';

    protected function getData(): array
    {
        $properties = Property::withCount(['bookings' => function ($query) {
            $query->where('status', 'confirmed')
                  ->whereBetween('check_in', [now()->startOfMonth(), now()->endOfMonth()]);
        }])
        ->orderBy('bookings_count', 'desc')
        ->limit(10)
        ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Bookings',
                    'data' => $properties->pluck('bookings_count')->toArray(),
                    'backgroundColor' => [
                        'rgba(34, 197, 94, 0.7)',
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(249, 115, 22, 0.7)',
                        'rgba(168, 85, 247, 0.7)',
                        'rgba(236, 72, 153, 0.7)',
                        'rgba(14, 165, 233, 0.7)',
                        'rgba(132, 204, 22, 0.7)',
                        'rgba(251, 146, 60, 0.7)',
                        'rgba(217, 70, 239, 0.7)',
                        'rgba(99, 102, 241, 0.7)',
                    ],
                ],
            ],
            'labels' => $properties->pluck('title')->map(fn($title) => 
                strlen($title) > 20 ? substr($title, 0, 20) . '...' : $title
            )->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
