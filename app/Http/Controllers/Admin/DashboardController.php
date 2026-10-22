<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $thirtyDaysAgo = $now->copy()->subDays(30);
        $sixtyDaysAgo = $now->copy()->subDays(60);

        // 1. Sales Growth Logic (Compare this 30 days vs last 30 days)
        $currentSales = Order::where('status', 'completed')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->sum('total');

        $prevSales = Order::where('status', 'completed')
            ->whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])
            ->sum('total');

        $diff = $currentSales - $prevSales;
        $growth = $prevSales > 0 ? ($diff / $prevSales) * 100 : 100;

        // 2. Chart Data (Last 6 Months of Sales)
        $months = [];
        $salesData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $months[] = $month->format('M');
            $salesData[] = Order::where('status', 'completed')
                ->whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->sum('total');
        }

        return Inertia::render('Admin/Dashboard', [
            'growth' => [
                'percentage' => round($growth, 1),
                'isUp' => $growth >= 0,
                'total_sales' => Order::where('status', 'completed')->sum('total'),
            ],
            'chartData' => [
                'labels' => $months,
                'datasets' => [[
                    'label' => 'Monthly Revenue ($)',
                    'data' => $salesData,
                    'borderColor' => '#10b981', // Emerald 500
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'fill' => true,
                    'tension' => 0.4,
                ]]
            ],
            'stats' => [
                [
                    'name' => 'Total Orders',
                    'value' => number_format(Order::count()),
                    'icon' => 'ShoppingCart',
                    'color' => 'text-blue-600',
                    'bg' => 'bg-blue-50',
                ],
                [
                    'name' => 'Total Customers',
                    'value' => number_format(User::role('user')->count()),
                    'icon' => 'Users',
                    'color' => 'text-purple-600',
                    'bg' => 'bg-purple-50',
                ],
                [
                    'name' => 'Low Stock Items',
                    'value' => Product::whereColumn('stock', '<', 'low_stock_threshold')->count(),
                    'icon' => 'AlertTriangle',
                    'color' => 'text-amber-600',
                    'bg' => 'bg-amber-50',
                ],
            ],
            'lowStockProducts' => Product::whereColumn('stock', '<', 'low_stock_threshold')
                ->orWhere('stock', '<=', 0)
                ->take(5)
                ->get(),
            'recentOrders' => Order::with('user')->latest()->take(5)->get(),
        ]);
    }
}