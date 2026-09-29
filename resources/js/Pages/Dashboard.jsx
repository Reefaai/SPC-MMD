import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// ── Metric Card ───────────────────────────────────────────────────
function MetricCard({ title, value, subtitle, iconBg = '#6366F1', icon, vertical = false }) {
    return (
        <div className="scm-metric" style={vertical ? { flexDirection: 'column', alignItems: 'flex-start', gap: 12 } : {}}>
            <div className="scm-metric-icon" style={{ background: iconBg + '22', border: `1px solid ${iconBg}44` }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={iconBg} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                    {icon}
                </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                <div className="scm-metric-label">{title}</div>
                <div className="scm-metric-value">{value}</div>
                {subtitle && <div className="scm-metric-sub">{subtitle}</div>}
            </div>
        </div>
    );
}

// ── Chart ─────────────────────────────────────────────────────────
function BarChart({ data, color = '#6366F1', label }) {
    if (!data?.length) return <div style={{ textAlign: 'center', color: 'var(--color-text-faint)', padding: '24px 0', fontSize: 13 }}>Belum ada data</div>;
    const max = Math.max(...data.map(d => d.value), 1);
    const fmt = (val) => `Rp ${Number(val ?? 0).toLocaleString('id-ID')}`;
    return (
        <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 12 }}>{label}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 44, fontSize: 11, color: 'var(--color-text-faint)', textAlign: 'right', flexShrink: 0 }}>{d.label.split(' ')[0]}</div>
                        <div style={{ flex: 1, background: 'var(--color-surface-2)', borderRadius: 4, height: 22, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: 4,
                                width: `${(d.value / max) * 100}%`,
                                background: `linear-gradient(90deg, ${color}cc, ${color})`,
                                minWidth: d.value > 0 ? 4 : 0,
                                transition: 'width 600ms ease',
                            }} />
                        </div>
                        <div style={{ width: 90, fontSize: 11.5, color: 'var(--color-text)', fontWeight: 500, flexShrink: 0, textAlign: 'right' }}>{fmt(d.value)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Quick Action Card ─────────────────────────────────────────────
function QuickAction({ href, label, desc, iconPath, color = '#6366F1' }) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-2)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = color + '60';
                e.currentTarget.style.background = color + '12';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border-2)';
                e.currentTarget.style.background = 'var(--color-surface-2)';
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius)',
                    background: color + '22', border: `1px solid ${color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                        {iconPath}
                    </svg>
                </div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--color-text-faint)' }}>{desc}</div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginLeft: 'auto', flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </div>
        </Link>
    );
}

// ── Status Badge ──────────────────────────────────────────────────
function StockBadge({ isLow }) {
    return isLow
        ? <span className="scm-badge scm-badge-red">⚠ Menipis</span>
        : <span className="scm-badge scm-badge-green">✓ Aman</span>;
}

function TxTypeBadge({ type }) {
    return type === 'IN'
        ? <span className="scm-badge scm-badge-green">↑ Masuk</span>
        : <span className="scm-badge scm-badge-red">↓ Keluar</span>;
}

// ─────────────────────────────────────────────────────────────────
export default function Dashboard({ metrics = {}, charts = {}, stockSummary = [], recentTransactions = [], userRole = '' }) {
    const fmt = (val) => `Rp ${Number(val ?? 0).toLocaleString('id-ID')}`;

    const isAdmin       = userRole === 'Admin';
    const isProcurement = userRole === 'Procurement' || isAdmin;
    const isGudang      = userRole === 'Gudang' || isAdmin;
    const isSales       = userRole === 'Sales' || isAdmin;

    // Icon paths
    const iconPaths = {
        box:      <><path d="M12 22l-8-4V6l8-4 8 4v12z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
        truck:    <><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
        clock:    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
        alert:    <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
        cart:     <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></>,
        dollar:   <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
        list:     <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
        download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    };

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* ── Welcome Banner ──────────────────────────── */}
                <div className="scm-welcome-banner" style={{
                    background: 'linear-gradient(135deg, #2C322C 0%, #384038 100%)',
                    border: '1px solid rgba(147,215,140,0.3)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#B8F2B0', marginBottom: 4 }}>
                            Supply Chain Management
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--color-text)', margin: 0, lineHeight: 1.2 }}>
                            Selamat Datang
                        </h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4, marginBottom: 0 }}>
                            Ringkasan aktivitas dan status operasional hari ini
                        </p>
                    </div>
                    {metrics.low_stock_count > 0 && (
                        <Link href={route('inventory.index')} style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'rgba(239,68,68,0.12)',
                                border: '1px solid rgba(239,68,68,0.35)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '10px 16px',
                                display: 'flex', alignItems: 'center', gap: 10,
                                cursor: 'pointer',
                            }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
                                    {iconPaths.alert}
                                </svg>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#F87171', fontFamily: 'var(--font-heading)' }}>{metrics.low_stock_count} Produk Menipis</div>
                                    <div style={{ fontSize: 11, color: '#F8717199' }}>Klik untuk detail →</div>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>

                {/* ── Admin Metrics (Bento Box) ───────────────────────────── */}
                {isAdmin && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="scm-grid-metrics">
                            <MetricCard title="Total Penjualan" value={fmt(metrics.total_so_value)} iconBg="#5FD475" icon={iconPaths.dollar} />
                            <MetricCard title="Total Nilai PO" value={fmt(metrics.total_po_value)} iconBg="#B8F2B0" icon={iconPaths.cart} />
                            <MetricCard title="PO Pending" value={metrics.pending_pos ?? 0} subtitle="Menunggu Persetujuan" iconBg="#FFB951" icon={iconPaths.clock} />
                            <MetricCard title="Stok Menipis" value={metrics.low_stock_count ?? 0} subtitle="Di bawah minimum" iconBg={metrics.low_stock_count > 0 ? '#FFB4AB' : '#10B981'} icon={iconPaths.alert} />
                        </div>
                        <div className="scm-bento-grid">
                            <div className="scm-card scm-bento-chart">
                                <div className="scm-card-header">
                                    <span className="scm-card-title">Tren Transaksi (6 Bulan Terakhir)</span>
                                </div>
                                <div className="scm-card-body scm-bento-chart-inner">
                                    <div style={{ flex: 1 }}><BarChart label="Penjualan (SO)" data={charts.monthlySO} color="#5FD475" /></div>
                                    <div style={{ flex: 1 }}><BarChart label="Pembelian (PO)" data={charts.monthlyPO} color="#B8F2B0" /></div>
                                </div>
                            </div>
                            <div className="scm-bento-metrics">
                                <MetricCard vertical title="Total Produk" value={metrics.total_products ?? 0} iconBg="#93D78C" icon={iconPaths.box} />
                                <MetricCard vertical title="Total Supplier" value={metrics.total_suppliers ?? 0} iconBg="#A8C7FA" icon={iconPaths.truck} />
                                <MetricCard vertical title="Sales Order" value={metrics.total_sos ?? 0} subtitle="Total Trx" iconBg="#93D78C" icon={iconPaths.list} />
                                <MetricCard vertical title="Penerimaan" value={metrics.today_receipts ?? 0} subtitle="Hari ini" iconBg="#A8C7FA" icon={iconPaths.download} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Procurement Metrics ─────────────────────── */}
                {!isAdmin && isProcurement && (
                    <div className="scm-grid-metrics">
                        <MetricCard title="Total Produk" value={metrics.total_products ?? 0} iconBg="#93D78C" icon={iconPaths.box} />
                        <MetricCard title="Total Supplier" value={metrics.total_suppliers ?? 0} iconBg="#A8C7FA" icon={iconPaths.truck} />
                        <MetricCard title="PO Pending" value={metrics.pending_pos ?? 0} subtitle="Menunggu persetujuan" iconBg="#FFB951" icon={iconPaths.clock} />
                        <MetricCard title="Total Nilai PO" value={fmt(metrics.total_po_value)} subtitle="Sepanjang waktu" iconBg="#B8F2B0" icon={iconPaths.cart} />
                    </div>
                )}

                {/* ── Gudang Metrics ──────────────────────────── */}
                {!isAdmin && isGudang && !isProcurement && (
                    <div className="scm-grid-metrics">
                        <MetricCard title="Total Produk" value={metrics.total_products ?? 0} iconBg="#93D78C" icon={iconPaths.box} />
                        <MetricCard title="Penerimaan Hari Ini" value={metrics.today_receipts ?? 0} subtitle="Barang masuk hari ini" iconBg="#A8C7FA" icon={iconPaths.download} />
                        <MetricCard title="Stok Menipis" value={metrics.low_stock_count ?? 0} subtitle="Di bawah minimum" iconBg={metrics.low_stock_count > 0 ? '#FFB4AB' : '#10B981'} icon={iconPaths.alert} />
                    </div>
                )}

                {/* ── Sales Metrics ────────────────────────────── */}
                {!isAdmin && !isProcurement && !isGudang && isSales && (
                    <div className="scm-grid-metrics">
                        <MetricCard title="SO Hari Ini" value={metrics.today_sos ?? 0} subtitle="Order masuk hari ini" iconBg="#5FD475" icon={iconPaths.list} />
                        <MetricCard title="Nilai SO Hari Ini" value={fmt(metrics.today_so_value)} iconBg="#FFB951" icon={iconPaths.dollar} />
                        <MetricCard title="Total Sales Order" value={metrics.total_sos ?? 0} subtitle="Semua transaksi" iconBg="#93D78C" icon={iconPaths.list} />
                        <MetricCard title="Total Penjualan" value={fmt(metrics.total_so_value)} subtitle="Sepanjang waktu" iconBg="#B8F2B0" icon={iconPaths.dollar} />
                    </div>
                )}

                {/* ── Tables Row ──────────────────────────────── */}
                <div className="scm-dashboard-tables-grid" style={{ display: 'grid', gridTemplateColumns: (isAdmin || isGudang) ? '1fr 1fr' : '1fr', gap: 16 }}>

                    {/* Stock Summary */}
                    {(isAdmin || isGudang) && (
                        <div className="scm-card">
                            <div className="scm-card-header">
                                <span className="scm-card-title">Ringkasan Stok Produk</span>
                                <Link href={route('inventory.index')} style={{ fontSize: 12, color: 'var(--color-secondary)', textDecoration: 'none' }}>
                                    Lihat Detail →
                                </Link>
                            </div>
                            <div className="scm-table-responsive">
                                <table className="scm-table">
                                    <thead>
                                        <tr>
                                            <th>Produk</th>
                                            <th style={{ textAlign: 'right' }}>Stok</th>
                                            <th style={{ textAlign: 'right' }}>Min.</th>
                                            <th style={{ textAlign: 'center' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockSummary.length === 0 ? (
                                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-faint)' }}>Belum ada data stok.</td></tr>
                                        ) : stockSummary.slice(0, 8).map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{product.name}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--color-text-faint)' }}>{product.sku}</div>
                                                </td>
                                                <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'var(--font-heading)', color: product.is_low_stock ? '#F87171' : 'var(--color-text)' }}>{product.current_stock}</td>
                                                <td style={{ textAlign: 'right', color: 'var(--color-text-faint)' }}>{product.min_stock}</td>
                                                <td style={{ textAlign: 'center' }}><StockBadge isLow={product.is_low_stock} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Recent Transactions */}
                    <div className="scm-card">
                        <div className="scm-card-header">
                            <span className="scm-card-title">Transaksi Inventori Terakhir</span>
                        </div>
                        <div className="scm-table-responsive">
                            <table className="scm-table">
                                <thead>
                                    <tr>
                                        <th>Produk</th>
                                        <th>Tipe</th>
                                        <th style={{ textAlign: 'right' }}>Qty</th>
                                        <th>Gudang</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-faint)' }}>Belum ada transaksi.</td></tr>
                                    ) : recentTransactions.map((trx) => (
                                        <tr key={trx.id}>
                                            <td style={{ fontWeight: 500 }}>{trx.product?.name ?? '—'}</td>
                                            <td><TxTypeBadge type={trx.type} /></td>
                                            <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>{trx.quantity}</td>
                                            <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{trx.warehouse?.name ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ── Quick Actions ────────────────────────────── */}
                <div className="scm-card">
                    <div className="scm-card-header">
                        <span className="scm-card-title">Aksi Cepat</span>
                    </div>
                    <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                        {isProcurement && (
                            <QuickAction href={route('purchase-orders.index')} label="Purchase Order" desc="Buat & pantau PO"
                                color="#93D78C" iconPath={<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></>} />
                        )}
                        {isGudang && (
                            <QuickAction href={route('receipts.index')} label="Terima Barang" desc="Konfirmasi penerimaan"
                                color="#5FD475" iconPath={<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} />
                        )}
                        {isGudang && (
                            <QuickAction href={route('inventory.index')} label="Cek Stok" desc="Lihat stok per gudang"
                                color="#A8C7FA" iconPath={<><path d="M12 22l-8-4V6l8-4 8 4v12z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>} />
                        )}
                        {isSales && (
                            <QuickAction href={route('sales-orders.index')} label="Sales Order" desc="Buat pesanan penjualan"
                                color="#FFB951" iconPath={<><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></>} />
                        )}
                        {isProcurement && (
                            <QuickAction href={route('suppliers.index')} label="Kelola Supplier" desc="Tambah & edit supplier"
                                color="#B8F2B0" iconPath={<><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>} />
                        )}
                        {isAdmin && (
                            <QuickAction href={route('reports.index')} label="Laporan" desc="Export data & laporan"
                                color="#EC4899" iconPath={<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></>} />
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
