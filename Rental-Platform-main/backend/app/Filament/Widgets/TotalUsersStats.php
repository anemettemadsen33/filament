<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TotalUsersStats extends BaseWidget
{
    protected function getStats(): array
    {
        $totalUsers = User::count();
        $adminUsers = User::where('role', 'admin')->count();
        $verifiedUsers = User::where('is_verified', true)->count();
        $newUsersThisMonth = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return [
            Stat::make('Total Users', $totalUsers)
                ->description('All registered users')
                ->descriptionIcon('heroicon-o-users')
                ->color('success'),
            
            Stat::make('Admin Users', $adminUsers)
                ->description('Users with admin role')
                ->descriptionIcon('heroicon-o-shield-check')
                ->color('warning'),
            
            Stat::make('Verified Users', $verifiedUsers)
                ->description("{$verifiedUsers} of {$totalUsers} users verified")
                ->descriptionIcon('heroicon-o-check-badge')
                ->color('info'),
            
            Stat::make('New This Month', $newUsersThisMonth)
                ->description('Users registered this month')
                ->descriptionIcon('heroicon-o-arrow-trending-up')
                ->color('primary'),
        ];
    }
}
