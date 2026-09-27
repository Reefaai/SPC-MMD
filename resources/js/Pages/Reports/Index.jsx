import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const fmt = (val) => `Rp ${Number(val ?? 0).toLocaleString('id-ID')}`;

function SummaryCard({ title, value, sub, color = 'indigo' }) {
    const colors = {
        indigo: 'border-indigo-400 bg-indigo-50',
        green: 'border-green-400 bg-green-50',
        blue: 'border-blue-400 bg-blue-50',
        yellow: 'border-yellow-400 bg-yellow-50',
    };
    return (
        <div className={`rounded-lg border-l-4 p-4 shadow-sm ${colors[color]}`}>
            <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    );
}

function BarChart({ data, color = '#6366f1', label }) {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
        <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">{label}</p>
            <div className="space-y-2">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <p className="w-20 text-xs text-gray-500 text-right shrink-0">{d.label}</p>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                            <div
                                className="h-5 rounded-full transition-all duration-500"
                                style={{
                                    width: `${(d.value / max) * 100}%`,
                                    backgroundColor: color,
                                    minWidth: d.value > 0 ? '4px' : '0',
                                }}
                            />
                        </div>
                        <p className="w-28 text-xs text-gray-700 font-medium shrink-0">{fmt(d.value)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Index({
    summary = {},
    monthlyPO = [],
    monthlySO = [],
    topProducts = [],
    topSuppliers = [],
}) {
    const { data, setData } = useForm({
        type: 'purchase_orders',
        date_from: '',
        date_to: '',
    });

    const handleExport = (e) => {
        e.preventDefault();
        const params = new URLSearchParams({
            type: data.type,
            date_from: data.date_from,
            date_to: data.date_to,
        });
        window.location.href = `/reports/export?${params.toString()}`;
    };

    const growth = (current, last) => {
        if (!last) return null;
        const pct = (((current - last) / last) * 100).toFixed(1);
        return pct > 0 ? `▲ ${pct}%` : `▼ ${Math.abs(pct)}%`;
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Laporan & Analitik</h2>}>
            <Head title="Laporan" />
            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <SummaryCard
                            title="Pembelian Bulan Ini"
                            value={fmt(summary.total_po_this_month)}
                            sub={growth(summary.total_po_this_month, summary.total_po_last_month)}
                            color="blue"
                        />
                        <SummaryCard
                            title="Penjualan Bulan Ini"
                            value={fmt(summary.total_so_this_month)}
                            sub={growth(summary.total_so_this_month, summary.total_so_last_month)}
                            color="green"
                        />
                        <SummaryCard
                            title="Total Pembelian"
                            value={fmt(summary.total_po_all)}
                            sub="Sepanjang waktu"
                            color="indigo"
                        />
                        <SummaryCard
                            title="Total Penjualan"
                            value={fmt(summary.total_so_all)}
                            sub="Sepanjang waktu"
                            color="yellow"
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-sm font-bold text-gray-800 mb-4">📊 Nilai Pembelian (PO) per Bulan</h3>
                            <BarChart data={monthlyPO} color="#3b82f6" label="6 Bulan Terakhir" />
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-sm font-bold text-gray-800 mb-4">📈 Nilai Penjualan (SO) per Bulan</h3>
                            <BarChart data={monthlySO} color="#22c55e" label="6 Bulan Terakhir" />
                        </div>
                    </div>

                    {/* Top Products & Suppliers */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800">🏆 Top 5 Produk Terlaris</h3>
                            </div>
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                                        <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase">Terjual</th>
                                        <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {topProducts.length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-400">Belum ada data penjualan</td></tr>
                                    )}
                                    {topProducts.map((p, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 text-sm font-bold text-gray-400">{i + 1}</td>
                                            <td className="px-6 py-3">
                                                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                                                <p className="text-xs text-gray-400">{p.sku}</p>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-right text-gray-700">{p.total_qty} unit</td>
                                            <td className="px-6 py-3 text-sm text-right font-semibold text-green-700">{fmt(p.total_revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800">🏭 Top 5 Supplier (Nilai PO)</h3>
                            </div>
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                                        <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah PO</th>
                                        <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total Nilai</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {topSuppliers.length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-400">Belum ada data pembelian</td></tr>
                                    )}
                                    {topSuppliers.map((s, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 text-sm font-bold text-gray-400">{i + 1}</td>
                                            <td className="px-6 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                                            <td className="px-6 py-3 text-sm text-right text-gray-700">{s.po_count} PO</td>
                                            <td className="px-6 py-3 text-sm text-right font-semibold text-blue-700">{fmt(s.total_value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Export CSV */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-800 mb-4">⬇ Export Data CSV</h3>
                        <form onSubmit={handleExport} className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { value: 'purchase_orders', label: '🛒 Purchase Orders' },
                                    { value: 'sales_orders', label: '📋 Sales Orders' },
                                    { value: 'inventory', label: '📦 Transaksi Inventori' },
                                ].map((rt) => (
                                    <label key={rt.value} className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition text-sm ${data.type === rt.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                                        <input type="radio" name="type" value={rt.value} checked={data.type === rt.value} onChange={() => setData('type', rt.value)} className="sr-only" />
                                        {rt.label}
                                    </label>
                                ))}
                            </div>
                            <div className="flex items-center gap-4">
                                <input type="date" value={data.date_from} onChange={(e) => setData('date_from', e.target.value)} className="rounded-md border-gray-300 text-sm shadow-sm" placeholder="Dari tanggal" />
                                <span className="text-gray-400 text-sm">s/d</span>
                                <input type="date" value={data.date_to} onChange={(e) => setData('date_to', e.target.value)} className="rounded-md border-gray-300 text-sm shadow-sm" placeholder="Sampai tanggal" />
                                <button type="submit" className="ml-auto inline-flex items-center gap-2 rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700">
                                    ⬇ Unduh CSV
                                </button>
                            </div>
                            <p className="text-xs text-gray-400">* Kosongkan tanggal untuk mengunduh seluruh data.</p>
                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
