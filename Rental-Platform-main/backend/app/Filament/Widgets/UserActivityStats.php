<?php

namespace App\Filament\Widgets;

use App\Models\User;
use App\Models\Property;
use App\Models\Booking;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserActivityStats extends BaseWidget
{
    protected static ?int $sort = 1;
    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $totalUsers = User::count();
        $newUsersThisMonth = User::whereBetween('created_at', [now()->startOfMonth(), now()])->count();
        $activeProperties = Property::where('status', 'published')->count();
        $pendingProperties = Property::where('status', 'pending')->count();
        $todayBookings = Booking::whereDate('created_at', today())->count();
        $pendingBookings = Booking::where('status', 'pending')->count();

        return [
            Stat::make('Total Users', number_format($totalUsers))
                ->description("$newUsersThisMonth new this month")
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->chart([7, 12, 15, 18, 22, 25, $newUsersThisMonth]),
            
            Stat::make('Active Properties', number_format($activeProperties))
                ->description("$pendingProperties pending approval")
                ->descriptionIcon('heroicon-m-home-modern')
                ->color('info'),
            
            Stat::make('Today\'s Bookings', number_format($todayBookings))
                ->description("$pendingBookings pending confirmation")
                ->descriptionIcon('heroicon-m-calendar-days')
                ->color($todayBookings > 0 ? 'success' : 'warning'),
        ];
    }
}
