import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function MetricCard({ title, value, subtitle, color = 'indigo', icon }) {
    const colors = {
        indigo: 'bg-indigo-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
    };

    return (
        <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 ${colors[color]} rounded-md p-3`}>
                        <span className="text-white text-xl">{icon}</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="text-2xl font-bold text-gray-900">{value}</dd>
                            {subtitle && <dd className="text-xs text-gray-400 mt-1">{subtitle}</dd>}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuickLink({ href, icon, label, color = 'indigo' }) {
    const hovers = {
        indigo: 'hover:bg-indigo-50 hover:border-indigo-300',
        green: 'hover:bg-green-50 hover:border-green-300',
        yellow: 'hover:bg-yellow-50 hover:border-yellow-300',
        purple: 'hover:bg-purple-50 hover:border-purple-300',
        blue: 'hover:bg-blue-50 hover:border-blue-300',
    };
    return (
        <Link href={href} className={`flex flex-col items-center p-4 border border-gray-200 rounded-lg transition ${hovers[color]}`}>
            <span className="text-3xl mb-2">{icon}</span>
            <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
        </Link>
    );
}

export default function Dashboard({ metrics = {}, stockSummary = [], recentTransactions = [], userRole = '' }) {
    const fmt = (val) => `Rp ${Number(val ?? 0).toLocaleString('id-ID')}`;

    const isAdmin = userRole === 'Admin';
    const isProcurement = userRole === 'Procurement' || isAdmin;
    const isGudang = userRole === 'Gudang' || isAdmin;
    const isSales = userRole === 'Sales' || isAdmin;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard — Supply Chain Management
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {userRole || 'User'}
                    </span>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">

                    {/* Metric Cards — Admin lihat semua */}
                    {isAdmin && (
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                            <MetricCard title="Total Produk" value={metrics.total_products ?? 0} icon="📦" color="indigo" />
                            <MetricCard title="Total Supplier" value={metrics.total_suppliers ?? 0} icon="🏭" color="blue" />
                            <MetricCard title="PO Pending" value={metrics.pending_pos ?? 0} icon="🕐" color="yellow" />
                            <MetricCard title="Stok Menipis" value={metrics.low_stock_count ?? 0} subtitle="Di bawah minimum" icon="⚠️" color={metrics.low_stock_count > 0 ? 'red' : 'green'} />
                            <MetricCard title="Total Nilai PO" value={fmt(metrics.total_po_value)} icon="🛒" color="purple" />
                            <MetricCard title="Total Penjualan" value={fmt(metrics.total_so_value)} icon="💰" color="green" />
                            <MetricCard title="Total Sales Order" value={metrics.total_sos ?? 0} subtitle="Semua transaksi" icon="📋" color="indigo" />
                            <MetricCard title="Penerimaan Hari Ini" value={metrics.today_receipts ?? 0} subtitle="Receipt masuk" icon="📥" color="blue" />
                        </div>
                    )}

                    {/* Metric Cards — Procurement */}
                    {!isAdmin && isProcurement && (
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                            <MetricCard title="Total Produk" value={metrics.total_products ?? 0} icon="📦" color="indigo" />
                            <MetricCard title="Total Supplier" value={metrics.total_suppliers ?? 0} icon="🏭" color="blue" />
                            <MetricCard title="PO Pending" value={metrics.pending_pos ?? 0} subtitle="Menunggu persetujuan" icon="🕐" color="yellow" />
                            <MetricCard title="Total Nilai PO" value={fmt(metrics.total_po_value)} subtitle="Sepanjang waktu" icon="🛒" color="purple" />
                        </div>
                    )}

                    {/* Metric Cards — Gudang */}
                    {!isAdmin && isGudang && !isProcurement && (
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                            <MetricCard title="Total Produk" value={metrics.total_products ?? 0} icon="📦" color="indigo" />
                            <MetricCard title="Penerimaan Hari Ini" value={metrics.today_receipts ?? 0} subtitle="Barang masuk hari ini" icon="📥" color="blue" />
                            <MetricCard title="Stok Menipis" value={metrics.low_stock_count ?? 0} subtitle="Di bawah minimum" icon="⚠️" color={metrics.low_stock_count > 0 ? 'red' : 'green'} />
                        </div>
                    )}

                    {/* Metric Cards — Sales */}
                    {!isAdmin && !isProcurement && !isGudang && isSales && (
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                            <MetricCard title="SO Hari Ini" value={metrics.today_sos ?? 0} subtitle="Order masuk hari ini" icon="📋" color="green" />
                            <MetricCard title="Nilai SO Hari Ini" value={fmt(metrics.today_so_value)} icon="💰" color="yellow" />
                            <MetricCard title="Total Sales Order" value={metrics.total_sos ?? 0} subtitle="Semua transaksi" icon="📈" color="indigo" />
                            <MetricCard title="Total Penjualan" value={fmt(metrics.total_so_value)} subtitle="Sepanjang waktu" icon="🏆" color="purple" />
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                        {/* Stock Summary — hanya Admin & Gudang */}
                        {(isAdmin || isGudang) && (
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-gray-900">📊 Ringkasan Stok Produk</h3>
                                    <Link href={route('inventory.index')} className="text-xs text-indigo-600 hover:underline">Lihat Detail →</Link>
                                </div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stok</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Min.</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {stockSummary.length === 0 && (
                                            <tr><td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-400">Belum ada data stok.</td></tr>
                                        )}
                                        {stockSummary.slice(0, 8).map((product) => (
                                            <tr key={product.id} className={product.is_low_stock ? 'bg-red-50' : ''}>
                                                <td className="px-6 py-3 text-sm text-gray-900">
                                                    <p>{product.name}</p>
                                                    <p className="text-xs text-gray-400">{product.sku}</p>
                                                </td>
                                                <td className="px-6 py-3 text-sm text-right font-medium text-gray-900">{product.current_stock}</td>
                                                <td className="px-6 py-3 text-sm text-right text-gray-500">{product.min_stock}</td>
                                                <td className="px-6 py-3 text-center">
                                                    {product.is_low_stock
                                                        ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">⚠️ Menipis</span>
                                                        : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">✓ Aman</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Recent Transactions */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-base font-semibold text-gray-900">🔄 Transaksi Inventori Terakhir</h3>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gudang</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentTransactions.length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-400">Belum ada transaksi inventori.</td></tr>
                                    )}
                                    {recentTransactions.map((trx) => (
                                        <tr key={trx.id}>
                                            <td className="px-6 py-3 text-sm text-gray-900">{trx.product?.name ?? '-'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${trx.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {trx.type === 'IN' ? '↑ Masuk' : '↓ Keluar'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{trx.quantity}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{trx.warehouse?.name ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Links per role */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">⚡ Aksi Cepat</h3>
                        </div>
                        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {isProcurement && <QuickLink href={route('purchase-orders.index')} icon="🛒" label="Purchase Order" color="indigo" />}
                            {isGudang && <QuickLink href={route('receipts.index')} icon="📥" label="Terima Barang" color="green" />}
                            {isGudang && <QuickLink href={route('inventory.index')} icon="📦" label="Cek Stok" color="blue" />}
                            {isSales && <QuickLink href={route('sales-orders.index')} icon="📤" label="Sales Order" color="yellow" />}
                            {isProcurement && <QuickLink href={route('suppliers.index')} icon="🏭" label="Supplier" color="purple" />}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
