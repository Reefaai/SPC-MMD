<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SalesOrderController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    // Master Data (Bisa diakses Admin & Procurement, dll sesuai kebutuhan)
    Route::middleware('role:Admin,Procurement')->group(function () {
        Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);
        Route::resource('products', ProductController::class)->except(['create', 'show', 'edit']);
        Route::resource('suppliers', SupplierController::class)->except(['create', 'show', 'edit']);
        Route::resource('purchase-orders', PurchaseOrderController::class)->except(['create', 'edit']);
    });

    // Warehouse Data (Bisa diakses Admin & Gudang)
    Route::middleware('role:Admin,Gudang')->group(function () {
        Route::resource('warehouses', WarehouseController::class)->except(['create', 'show', 'edit']);
        Route::resource('receipts', ReceiptController::class)->except(['create', 'edit', 'update', 'destroy']);
        Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
    });

    // Sales Data (Bisa diakses Admin & Sales)
    Route::middleware('role:Admin,Sales')->group(function () {
        Route::resource('sales-orders', SalesOrderController::class)->except(['create', 'edit', 'update', 'destroy']);
    });

    // Reports & User Management (Admin only)
    Route::middleware('role:Admin')->group(function () {
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
        Route::resource('users', UserController::class)->except(['create', 'show', 'edit']);
    });
});

require __DIR__.'/auth.php';
