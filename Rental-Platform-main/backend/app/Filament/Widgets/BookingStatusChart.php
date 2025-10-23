<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\ChartWidget;

class BookingStatusChart extends ChartWidget
{
    protected ?string $heading = 'Booking Status Distribution';
    protected static ?int $sort = 5;
    protected int | string | array $columnSpan = 'md:col-span-4';

    protected function getData(): array
    {
        $statusCounts = Booking::select('status')
            ->selectRaw('count(*) as count')
            ->whereBetween('created_at', [now()->subMonth(), now()])
            ->groupBy('status')
            ->get();

        $statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        $data = [];
        $labels = [];
        
        foreach ($statuses as $status) {
            $count = $statusCounts->firstWhere('status', $status)?->count ?? 0;
            if ($count > 0) {
                $data[] = $count;
                $labels[] = ucfirst($status);
            }
        }

        return [
            'datasets' => [
                [
                    'label' => 'Bookings',
                    'data' => $data,
                    'backgroundColor' => [
                        'rgba(251, 191, 36, 0.8)',  // pending - yellow
                        'rgba(34, 197, 94, 0.8)',   // confirmed - green
                        'rgba(239, 68, 68, 0.8)',   // cancelled - red
                        'rgba(59, 130, 246, 0.8)',  // completed - blue
                    ],
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'pie';
    }
}
