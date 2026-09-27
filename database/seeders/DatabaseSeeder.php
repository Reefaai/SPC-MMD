<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\InventoryTransaction;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Receipt;
use App\Models\ReceiptItem;
use App\Models\Role;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Warehouse;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. ROLES & USERS ──────────────────────────────────────────────────
        $roleData = [
            ['name' => 'Admin'],
            ['name' => 'Procurement'],
            ['name' => 'Gudang'],
            ['name' => 'Sales'],
        ];

        $roles = [];
        foreach ($roleData as $r) {
            $roles[$r['name']] = Role::create($r);
        }

        $users = [
            ['name' => 'Admin Utama',        'email' => 'admin@example.com',       'role' => 'Admin'],
            ['name' => 'Budi Hartono',        'email' => 'procurement@example.com', 'role' => 'Procurement'],
            ['name' => 'Andi Wijaya',         'email' => 'gudang@example.com',      'role' => 'Gudang'],
            ['name' => 'Sinta Rahayu',        'email' => 'sales@example.com',       'role' => 'Sales'],
            ['name' => 'Rudi Setiawan',       'email' => 'rudi@example.com',        'role' => 'Procurement'],
            ['name' => 'Dewi Kusuma',         'email' => 'dewi@example.com',        'role' => 'Sales'],
        ];

        $createdUsers = [];
        foreach ($users as $u) {
            $createdUsers[$u['email']] = User::create([
                'name' => $u['name'],
                'email' => $u['email'],
                'password' => Hash::make('password'),
                'role_id' => $roles[$u['role']]->id,
            ]);
        }

        $adminUser = $createdUsers['admin@example.com'];
        $procurementUser = $createdUsers['procurement@example.com'];
        $gudangUser = $createdUsers['gudang@example.com'];
        $salesUser = $createdUsers['sales@example.com'];

        // ─── 2. CATEGORIES ────────────────────────────────────────────────────
        $categories = [];
        $categoryData = [
            'Elektronik', 'Furnitur', 'Perlengkapan Kantor',
            'Alat Tulis', 'Komputer & Aksesoris',
        ];
        foreach ($categoryData as $name) {
            $categories[] = Category::create(['name' => $name]);
        }

        // ─── 3. SUPPLIERS ──────────────────────────────────────────────────────
        $supplierData = [
            ['code' => 'SUP-001', 'name' => 'PT Maju Bersama',        'contact' => '021-1234567', 'address' => 'Jl. Sudirman No. 10, Jakarta'],
            ['code' => 'SUP-002', 'name' => 'CV Teknologi Nusantara',  'contact' => '022-2345678', 'address' => 'Jl. Asia Afrika No. 5, Bandung'],
            ['code' => 'SUP-003', 'name' => 'PT Sumber Makmur',        'contact' => '031-3456789', 'address' => 'Jl. Pemuda No. 20, Surabaya'],
            ['code' => 'SUP-004', 'name' => 'UD Karya Sejahtera',      'contact' => '0274-4567890', 'address' => 'Jl. Malioboro No. 15, Yogyakarta'],
            ['code' => 'SUP-005', 'name' => 'PT Indo Digital Supply',  'contact' => '021-5678901', 'address' => 'Jl. TB Simatupang No. 88, Jakarta'],
        ];

        $suppliers = [];
        foreach ($supplierData as $s) {
            $suppliers[] = Supplier::create($s);
        }

        // ─── 4. WAREHOUSES ────────────────────────────────────────────────────
        $warehouseData = [
            ['code' => 'GDG-001', 'name' => 'Gudang Utama Jakarta',   'location' => 'Jakarta Timur'],
            ['code' => 'GDG-002', 'name' => 'Gudang Cabang Bandung',   'location' => 'Bandung'],
            ['code' => 'GDG-003', 'name' => 'Gudang Distribusi Bekasi', 'location' => 'Bekasi'],
        ];

        $warehouses = [];
        foreach ($warehouseData as $w) {
            $warehouses[] = Warehouse::create($w);
        }

        $mainWarehouse = $warehouses[0];
        $secondWarehouse = $warehouses[1];

        // ─── 5. PRODUCTS ──────────────────────────────────────────────────────
        $productData = [
            // Elektronik
            ['category_id' => $categories[0]->id, 'sku' => 'ELK-001', 'name' => 'Laptop Asus VivoBook 14', 'unit' => 'pcs', 'min_stock' => 5,  'price' => 7500000],
            ['category_id' => $categories[0]->id, 'sku' => 'ELK-002', 'name' => 'Monitor LG 24 inch FHD',   'unit' => 'pcs', 'min_stock' => 3,  'price' => 2200000],
            ['category_id' => $categories[0]->id, 'sku' => 'ELK-003', 'name' => 'Keyboard Mechanical RGB',  'unit' => 'pcs', 'min_stock' => 10, 'price' => 350000],
            ['category_id' => $categories[0]->id, 'sku' => 'ELK-004', 'name' => 'Mouse Wireless Logitech',  'unit' => 'pcs', 'min_stock' => 10, 'price' => 250000],
            ['category_id' => $categories[0]->id, 'sku' => 'ELK-005', 'name' => 'Headset Gaming Rexus',     'unit' => 'pcs', 'min_stock' => 8,  'price' => 450000],
            // Furnitur
            ['category_id' => $categories[1]->id, 'sku' => 'FRN-001', 'name' => 'Kursi Ergonomis Mesh',     'unit' => 'pcs', 'min_stock' => 5,  'price' => 1800000],
            ['category_id' => $categories[1]->id, 'sku' => 'FRN-002', 'name' => 'Meja Kerja Minimalis',     'unit' => 'pcs', 'min_stock' => 3,  'price' => 1200000],
            // Perlengkapan Kantor
            ['category_id' => $categories[2]->id, 'sku' => 'PKN-001', 'name' => 'Printer Canon PIXMA',      'unit' => 'pcs', 'min_stock' => 3,  'price' => 950000],
            ['category_id' => $categories[2]->id, 'sku' => 'PKN-002', 'name' => 'Tinta Printer Hitam',      'unit' => 'box', 'min_stock' => 20, 'price' => 85000],
            ['category_id' => $categories[2]->id, 'sku' => 'PKN-003', 'name' => 'Laminator A4',             'unit' => 'pcs', 'min_stock' => 2,  'price' => 350000],
            // Alat Tulis
            ['category_id' => $categories[3]->id, 'sku' => 'ALT-001', 'name' => 'Pulpen Pilot G2 (1 box)',  'unit' => 'box', 'min_stock' => 30, 'price' => 45000],
            ['category_id' => $categories[3]->id, 'sku' => 'ALT-002', 'name' => 'Buku Tulis 58 lembar',     'unit' => 'rim', 'min_stock' => 20, 'price' => 35000],
            ['category_id' => $categories[3]->id, 'sku' => 'ALT-003', 'name' => 'Staples Besar',            'unit' => 'pcs', 'min_stock' => 10, 'price' => 55000],
            // Komputer & Aksesoris
            ['category_id' => $categories[4]->id, 'sku' => 'KMP-001', 'name' => 'Flashdisk SanDisk 64GB',   'unit' => 'pcs', 'min_stock' => 15, 'price' => 120000],
            ['category_id' => $categories[4]->id, 'sku' => 'KMP-002', 'name' => 'Kabel HDMI 2m',            'unit' => 'pcs', 'min_stock' => 10, 'price' => 75000],
        ];

        $products = [];
        foreach ($productData as $p) {
            $products[] = Product::create($p);
        }

        // ─── 6. PURCHASE ORDERS + RECEIPTS (Stok Masuk) ──────────────────────
        // Buat 3 PO di bulan-bulan lalu, sudah Completed & diterima
        $poScenarios = [
            [
                'date' => Carbon::now()->subMonths(3)->format('Y-m-d'),
                'supplier' => $suppliers[0],
                'items' => [
                    ['product' => $products[0],  'qty' => 20, 'price' => 7200000],
                    ['product' => $products[1],  'qty' => 15, 'price' => 2100000],
                    ['product' => $products[2],  'qty' => 30, 'price' => 320000],
                    ['product' => $products[3],  'qty' => 30, 'price' => 230000],
                ],
            ],
            [
                'date' => Carbon::now()->subMonths(2)->format('Y-m-d'),
                'supplier' => $suppliers[1],
                'items' => [
                    ['product' => $products[4],  'qty' => 25, 'price' => 420000],
                    ['product' => $products[5],  'qty' => 10, 'price' => 1700000],
                    ['product' => $products[6],  'qty' => 8,  'price' => 1100000],
                    ['product' => $products[13], 'qty' => 50, 'price' => 110000],
                    ['product' => $products[14], 'qty' => 40, 'price' => 70000],
                ],
            ],
            [
                'date' => Carbon::now()->subMonths(1)->format('Y-m-d'),
                'supplier' => $suppliers[2],
                'items' => [
                    ['product' => $products[7],  'qty' => 10, 'price' => 900000],
                    ['product' => $products[8],  'qty' => 60, 'price' => 80000],
                    ['product' => $products[9],  'qty' => 5,  'price' => 320000],
                    ['product' => $products[10], 'qty' => 80, 'price' => 42000],
                    ['product' => $products[11], 'qty' => 50, 'price' => 32000],
                    ['product' => $products[12], 'qty' => 25, 'price' => 50000],
                ],
            ],
        ];

        foreach ($poScenarios as $scenario) {
            $totalAmount = 0;
            foreach ($scenario['items'] as $item) {
                $totalAmount += $item['qty'] * $item['price'];
            }

            $po = PurchaseOrder::create([
                'supplier_id' => $scenario['supplier']->id,
                'date' => $scenario['date'],
                'status' => 'Completed',
                'total_amount' => $totalAmount,
                'created_by' => $procurementUser->id,
            ]);

            foreach ($scenario['items'] as $item) {
                PurchaseOrderItem::create([
                    'purchase_order_id' => $po->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['qty'],
                    'price' => $item['price'],
                    'subtotal' => $item['qty'] * $item['price'],
                ]);
            }

            // Buat Receipt untuk setiap PO
            $receipt = Receipt::create([
                'purchase_order_id' => $po->id,
                'warehouse_id' => $mainWarehouse->id,
                'date' => Carbon::parse($scenario['date'])->addDays(3)->format('Y-m-d'),
                'status' => 'Completed',
                'received_by' => $gudangUser->id,
            ]);

            foreach ($scenario['items'] as $item) {
                ReceiptItem::create([
                    'receipt_id' => $receipt->id,
                    'product_id' => $item['product']->id,
                    'quantity_received' => $item['qty'],
                ]);

                // Catat transaksi stok masuk
                InventoryTransaction::create([
                    'product_id' => $item['product']->id,
                    'warehouse_id' => $mainWarehouse->id,
                    'type' => 'IN',
                    'quantity' => $item['qty'],
                    'reference_id' => $receipt->id,
                    'reference_type' => Receipt::class,
                    'date' => $receipt->date,
                ]);
            }
        }

        // ─── 7. PO PENDING (belum diterima) ───────────────────────────────────
        $pendingPO = PurchaseOrder::create([
            'supplier_id' => $suppliers[3]->id,
            'date' => Carbon::now()->subWeeks(1)->format('Y-m-d'),
            'status' => 'Pending',
            'total_amount' => 0,
            'created_by' => $procurementUser->id,
        ]);

        $pendingItems = [
            ['product' => $products[0], 'qty' => 10, 'price' => 7400000],
            ['product' => $products[5], 'qty' => 5,  'price' => 1750000],
        ];
        $pendingTotal = 0;
        foreach ($pendingItems as $item) {
            PurchaseOrderItem::create([
                'purchase_order_id' => $pendingPO->id,
                'product_id' => $item['product']->id,
                'quantity' => $item['qty'],
                'price' => $item['price'],
                'subtotal' => $item['qty'] * $item['price'],
            ]);
            $pendingTotal += $item['qty'] * $item['price'];
        }
        $pendingPO->update(['total_amount' => $pendingTotal]);

        // PO Approved
        $approvedPO = PurchaseOrder::create([
            'supplier_id' => $suppliers[4]->id,
            'date' => Carbon::now()->subDays(3)->format('Y-m-d'),
            'status' => 'Approved',
            'total_amount' => 0,
            'created_by' => $procurementUser->id,
        ]);

        $approvedItems = [
            ['product' => $products[2], 'qty' => 20, 'price' => 340000],
            ['product' => $products[3], 'qty' => 20, 'price' => 240000],
            ['product' => $products[4], 'qty' => 15, 'price' => 430000],
        ];
        $approvedTotal = 0;
        foreach ($approvedItems as $item) {
            PurchaseOrderItem::create([
                'purchase_order_id' => $approvedPO->id,
                'product_id' => $item['product']->id,
                'quantity' => $item['qty'],
                'price' => $item['price'],
                'subtotal' => $item['qty'] * $item['price'],
            ]);
            $approvedTotal += $item['qty'] * $item['price'];
        }
        $approvedPO->update(['total_amount' => $approvedTotal]);

        // ─── 8. SALES ORDERS (Stok Keluar) ────────────────────────────────────
        $soScenarios = [
            [
                'customer' => 'PT Solusi Digital Indonesia',
                'date' => Carbon::now()->subMonths(2)->subDays(5)->format('Y-m-d'),
                'items' => [
                    ['product' => $products[0],  'qty' => 3],
                    ['product' => $products[1],  'qty' => 3],
                    ['product' => $products[3],  'qty' => 5],
                ],
            ],
            [
                'customer' => 'CV Mitra Teknologi',
                'date' => Carbon::now()->subMonths(2)->format('Y-m-d'),
                'items' => [
                    ['product' => $products[2],  'qty' => 10],
                    ['product' => $products[3],  'qty' => 10],
                    ['product' => $products[13], 'qty' => 20],
                ],
            ],
            [
                'customer' => 'Universitas Nusantara',
                'date' => Carbon::now()->subMonth()->subDays(10)->format('Y-m-d'),
                'items' => [
                    ['product' => $products[5],  'qty' => 5],
                    ['product' => $products[6],  'qty' => 5],
                    ['product' => $products[10], 'qty' => 30],
                    ['product' => $products[11], 'qty' => 20],
                ],
            ],
            [
                'customer' => 'PT Bangun Abadi',
                'date' => Carbon::now()->subMonth()->format('Y-m-d'),
                'items' => [
                    ['product' => $products[7],  'qty' => 3],
                    ['product' => $products[8],  'qty' => 20],
                    ['product' => $products[12], 'qty' => 10],
                ],
            ],
            [
                'customer' => 'Toko Komputer Setia',
                'date' => Carbon::now()->subWeeks(2)->format('Y-m-d'),
                'items' => [
                    ['product' => $products[0],  'qty' => 2],
                    ['product' => $products[4],  'qty' => 5],
                    ['product' => $products[13], 'qty' => 15],
                    ['product' => $products[14], 'qty' => 10],
                ],
            ],
            [
                'customer' => 'Sekolah Dasar Harapan Bangsa',
                'date' => Carbon::now()->subWeek()->format('Y-m-d'),
                'items' => [
                    ['product' => $products[10], 'qty' => 20],
                    ['product' => $products[11], 'qty' => 15],
                    ['product' => $products[12], 'qty' => 5],
                ],
            ],
            [
                'customer' => 'Kantor Dinas Pendidikan',
                'date' => Carbon::now()->subDays(3)->format('Y-m-d'),
                'items' => [
                    ['product' => $products[1],  'qty' => 2],
                    ['product' => $products[2],  'qty' => 5],
                    ['product' => $products[9],  'qty' => 2],
                ],
            ],
            [
                'customer' => 'PT Media Kreatif',
                'date' => Carbon::now()->format('Y-m-d'),
                'items' => [
                    ['product' => $products[0],  'qty' => 1],
                    ['product' => $products[3],  'qty' => 2],
                    ['product' => $products[8],  'qty' => 5],
                ],
            ],
        ];

        foreach ($soScenarios as $scenario) {
            $totalAmount = 0;
            $so = SalesOrder::create([
                'customer_name' => $scenario['customer'],
                'date' => $scenario['date'],
                'warehouse_id' => $mainWarehouse->id,
                'status' => 'Completed',
                'total_amount' => 0,
                'created_by' => $salesUser->id,
            ]);

            foreach ($scenario['items'] as $item) {
                $subtotal = $item['product']->price * $item['qty'];
                SalesOrderItem::create([
                    'sales_order_id' => $so->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['qty'],
                    'price' => $item['product']->price,
                    'subtotal' => $subtotal,
                ]);

                InventoryTransaction::create([
                    'product_id' => $item['product']->id,
                    'warehouse_id' => $mainWarehouse->id,
                    'type' => 'OUT',
                    'quantity' => $item['qty'],
                    'reference_id' => $so->id,
                    'reference_type' => SalesOrder::class,
                    'date' => $scenario['date'],
                ]);

                $totalAmount += $subtotal;
            }

            $so->update(['total_amount' => $totalAmount]);
        }

        // ─── 9. Sedikit stok di gudang kedua ──────────────────────────────────
        foreach ([$products[2], $products[3], $products[10], $products[11]] as $p) {
            InventoryTransaction::create([
                'product_id' => $p->id,
                'warehouse_id' => $secondWarehouse->id,
                'type' => 'IN',
                'quantity' => 15,
                'date' => Carbon::now()->subMonths(2)->format('Y-m-d'),
            ]);
        }
    }
}
