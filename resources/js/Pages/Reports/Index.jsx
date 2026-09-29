import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const fmt = (val) => `Rp ${Number(val ?? 0).toLocaleString('id-ID')}`;

function MetricCard({ title, value, sub, color }) {
    return (
        <div className="scm-metric">
            <div style={{ flex: 1, minWidth: 0 }}>
                <div className="scm-metric-label">{title}</div>
                <div className="scm-metric-value" style={{ fontSize: 18 }}>{value}</div>
                {sub && (
                    <div className="scm-metric-sub" style={{
                        color: sub?.startsWith('▲') ? '#34D399' : sub?.startsWith('▼') ? '#F87171' : 'var(--color-text-faint)',
                        fontWeight: sub?.startsWith('▲') || sub?.startsWith('▼') ? 600 : 400,
                    }}>{sub}</div>
                )}
            </div>
            <div style={{
                width: 4, height: 40, borderRadius: 2,
                background: color, flexShrink: 0, alignSelf: 'center',
            }} />
        </div>
    );
}

function BarChart({ data, color = '#93D78C', label }) {
    if (!data?.length) return <div style={{ textAlign: 'center', color: 'var(--color-text-faint)', padding: '24px 0', fontSize: 13 }}>Belum ada data</div>;
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 12 }}>{label}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 64, fontSize: 11, color: 'var(--color-text-faint)', textAlign: 'right', flexShrink: 0 }}>{d.label}</div>
                        <div style={{ flex: 1, background: 'var(--color-surface-2)', borderRadius: 4, height: 22, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: 4,
                                width: `${(d.value / max) * 100}%`,
                                background: `linear-gradient(90deg, ${color}cc, ${color})`,
                                minWidth: d.value > 0 ? 4 : 0,
                                transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
                            }} />
                        </div>
                        <div style={{ width: 110, fontSize: 11.5, color: 'var(--color-text)', fontWeight: 500, flexShrink: 0, textAlign: 'right' }}>{fmt(d.value)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Index({ summary = {}, monthlyPO = [], monthlySO = [], topProducts = [], topSuppliers = [] }) {
    const { data, setData } = useForm({
        type: 'purchase_orders',
        date_from: '',
        date_to: '',
    });

    const handleExport = (e) => {
        e.preventDefault();
        const params = new URLSearchParams({ type: data.type, date_from: data.date_from, date_to: data.date_to });
        window.location.href = `/reports/export?${params.toString()}`;
    };

    const growth = (current, last) => {
        if (!last) return null;
        const pct = (((current - last) / last) * 100).toFixed(1);
        return pct > 0 ? `▲ ${pct}% dari bulan lalu` : `▼ ${Math.abs(pct)}% dari bulan lalu`;
    };

    return (
        <AuthenticatedLayout header="Laporan & Analitik">
            <Head title="Laporan" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="scm-section-header">
                    <h1 className="scm-section-title">Laporan & Analitik</h1>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                    <MetricCard title="Pembelian Bulan Ini" value={fmt(summary.total_po_this_month)} sub={growth(summary.total_po_this_month, summary.total_po_last_month)} color="#3B82F6" />
                    <MetricCard title="Penjualan Bulan Ini" value={fmt(summary.total_so_this_month)} sub={growth(summary.total_so_this_month, summary.total_so_last_month)} color="#10B981" />
                    <MetricCard title="Total Pembelian" value={fmt(summary.total_po_all)} sub="Sepanjang waktu" color="#93D78C" />
                    <MetricCard title="Total Penjualan" value={fmt(summary.total_so_all)} sub="Sepanjang waktu" color="#F59E0B" />
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="scm-card">
                        <div className="scm-card-header"><span className="scm-card-title">Nilai Pembelian (PO) per Bulan</span></div>
                        <div className="scm-card-body"><BarChart data={monthlyPO} color="#3B82F6" label="6 Bulan Terakhir" /></div>
                    </div>
                    <div className="scm-card">
                        <div className="scm-card-header"><span className="scm-card-title">Nilai Penjualan (SO) per Bulan</span></div>
                        <div className="scm-card-body"><BarChart data={monthlySO} color="#10B981" label="6 Bulan Terakhir" /></div>
                    </div>
                </div>

                {/* Top Tables */}
                <div className="scm-dashboard-tables-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="scm-card">
                        <div className="scm-card-header"><span className="scm-card-title">Top 5 Produk Terjual</span></div>
                        <div className="scm-table-responsive">
                            <table className="scm-table">
                                <thead><tr><th>#</th><th>Produk</th><th style={{ textAlign: 'right' }}>Terjual</th></tr></thead>
                                <tbody>
                                    {topProducts.length === 0 ? (
                                        <tr><td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-faint)' }}>Belum ada data</td></tr>
                                    ) : topProducts.map((p, i) => (
                                        <tr key={i}>
                                            <td style={{ color: 'var(--color-text-faint)', fontSize: 12 }}>{i + 1}</td>
                                            <td style={{ fontWeight: 500 }}>{p.name}</td>
                                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{Number(p.total_qty).toLocaleString()} {p.unit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="scm-card">
                        <div className="scm-card-header"><span className="scm-card-title">Top 5 Supplier</span></div>
                        <div className="scm-table-responsive">
                            <table className="scm-table">
                                <thead><tr><th>#</th><th>Supplier</th><th style={{ textAlign: 'right' }}>Nilai PO</th></tr></thead>
                                <tbody>
                                    {topSuppliers.length === 0 ? (
                                        <tr><td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-faint)' }}>Belum ada data</td></tr>
                                    ) : topSuppliers.map((s, i) => (
                                        <tr key={i}>
                                            <td style={{ color: 'var(--color-text-faint)', fontSize: 12 }}>{i + 1}</td>
                                            <td style={{ fontWeight: 500 }}>{s.name}</td>
                                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{fmt(s.total_value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Export */}
                <div className="scm-card">
                    <div className="scm-card-header"><span className="scm-card-title">Export Data</span></div>
                    <div className="scm-card-body">
                        <form onSubmit={handleExport} style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end' }}>
                            <div>
                                <label className="scm-label">Jenis Laporan</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} className="scm-select" style={{ width: 200 }}>
                                    <option value="purchase_orders">Purchase Orders</option>
                                    <option value="sales_orders">Sales Orders</option>
                                    <option value="inventory">Inventori</option>
                                </select>
                            </div>
                            <div>
                                <label className="scm-label">Dari Tanggal</label>
                                <input type="date" value={data.date_from} onChange={e => setData('date_from', e.target.value)} className="scm-input" style={{ width: 160 }} />
                            </div>
                            <div>
                                <label className="scm-label">Sampai Tanggal</label>
                                <input type="date" value={data.date_to} onChange={e => setData('date_to', e.target.value)} className="scm-input" style={{ width: 160 }} />
                            </div>
                            <button type="submit" className="scm-btn scm-btn-primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                Export Excel
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
