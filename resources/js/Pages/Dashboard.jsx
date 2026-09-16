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

export default function Dashboard({ metrics = {}, stockSummary = [], recentTransactions = [] }) {
    const formatRupiah = (val) => `Rp ${Number(val ?? 0).toLocaleString('id-ID')}`;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard — Supply Chain Management
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                        <MetricCard title="Total Produk" value={metrics.total_products ?? 0} icon="📦" color="indigo" />
                        <MetricCard title="Total Supplier" value={metrics.total_suppliers ?? 0} icon="🏭" color="blue" />
                        <MetricCard title="PO Pending" value={metrics.pending_pos ?? 0} icon="🕐" color="yellow" />
                        <MetricCard
                            title="Stok Menipis"
                            value={metrics.low_stock_count ?? 0}
                            subtitle="Produk di bawah minimum"
                            icon="⚠️"
                            color={metrics.low_stock_count > 0 ? 'red' : 'green'}
                        />
                        <MetricCard title="Total Nilai PO" value={formatRupiah(metrics.total_po_value)} icon="🛒" color="purple" />
                        <MetricCard title="Total Penjualan" value={formatRupiah(metrics.total_so_value)} icon="💰" color="green" />
                        <MetricCard title="Sales Order" value={metrics.total_sos ?? 0} subtitle="Total transaksi penjualan" icon="📋" color="indigo" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                        {/* Stock Summary Table */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-base font-semibold text-gray-900">📊 Ringkasan Stok Produk</h3>
                            </div>
                            <div className="p-0">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stok Saat Ini</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Minimum</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {stockSummary.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-400">Belum ada data stok. Tambahkan produk dan lakukan transaksi terlebih dahulu.</td>
                                            </tr>
                                        )}
                                        {stockSummary.map((product) => (
                                            <tr key={product.id} className={product.is_low_stock ? 'bg-red-50' : ''}>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">{product.current_stock}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-500">{product.min_stock}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-center">
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
                        </div>

                        {/* Recent Transactions */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-base font-semibold text-gray-900">🔄 Transaksi Inventori Terakhir</h3>
                            </div>
                            <div className="p-0">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentTransactions.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-400">Belum ada transaksi inventori.</td>
                                            </tr>
                                        )}
                                        {recentTransactions.map((trx) => (
                                            <tr key={trx.id}>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{trx.product?.name ?? '-'}</td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${trx.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {trx.type === 'IN' ? '↑ Masuk' : '↓ Keluar'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">{trx.quantity}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{trx.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">⚡ Aksi Cepat</h3>
                        </div>
                        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Link href={route('purchase-orders.index')} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition">
                                <span className="text-3xl mb-2">🛒</span>
                                <span className="text-sm font-medium text-gray-700">Purchase Order</span>
                            </Link>
                            <Link href={route('receipts.index')} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition">
                                <span className="text-3xl mb-2">📥</span>
                                <span className="text-sm font-medium text-gray-700">Terima Barang</span>
                            </Link>
                            <Link href={route('sales-orders.index')} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition">
                                <span className="text-3xl mb-2">📤</span>
                                <span className="text-sm font-medium text-gray-700">Sales Order</span>
                            </Link>
                            <Link href={route('products.index')} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition">
                                <span className="text-3xl mb-2">📦</span>
                                <span className="text-sm font-medium text-gray-700">Manajemen Produk</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
