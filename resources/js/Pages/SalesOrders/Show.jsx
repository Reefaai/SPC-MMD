import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const fmt = (v) => `Rp ${Number(v ?? 0).toLocaleString('id-ID')}`;

function StatusBadge({ status }) {
    const map = {
        Pending:   'scm-badge scm-badge-yellow',
        Approved:  'scm-badge scm-badge-blue',
        Completed: 'scm-badge scm-badge-green',
        Cancelled: 'scm-badge scm-badge-red',
    };
    return <span className={map[status] ?? 'scm-badge scm-badge-gray'}>{status}</span>;
}

export default function Show({ salesOrder }) {
    const totalValue = (salesOrder.items ?? []).reduce((s, it) => s + (Number(it.price ?? it.unit_price ?? 0) * Number(it.quantity ?? 0)), 0);

    return (
        <AuthenticatedLayout header={`SO-${String(salesOrder.id).padStart(4, '0')}`}>
            <Head title={`SO-${String(salesOrder.id).padStart(4, '0')}`}>
                <style>{`@media print { .no-print { display: none !important; } .scm-sidebar { display: none !important; } .scm-topbar { display: none !important; } .scm-main { margin-left: 0 !important; } body { background: white; color: black; } .scm-card { border: 1px solid #e5e7eb; } .scm-table th { background: #f9fafb; color: #374151; } .scm-table td { color: #111827; border-color: #e5e7eb; } }`}</style>
            </Head>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800, margin: '0 auto' }}>
                {/* Back + Print */}
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href={route('sales-orders.index')} className="scm-btn scm-btn-ghost" style={{ fontSize: 13 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><polyline points="15 18 9 12 15 6"/></svg>
                        Kembali ke Daftar
                    </Link>
                    <button onClick={() => window.print()} className="scm-btn scm-btn-secondary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        Print
                    </button>
                </div>

                {/* SO Detail Card */}
                <div className="scm-card">
                    <div className="scm-card-header">
                        <div>
                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
                                Sales Order #{String(salesOrder.id).padStart(4, '0')}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--color-text-faint)', marginTop: 2 }}>
                                Dibuat pada {new Date(salesOrder.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                        <StatusBadge status={salesOrder.status} />
                    </div>
                    <div className="scm-card-body">
                        {/* Responsive Metadata Grid */}
                        <div className="scm-detail-grid">
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 4 }}>Pelanggan</div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>{salesOrder.customer_name}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 4 }}>Gudang</div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>{salesOrder.warehouse?.name ?? '—'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 4 }}>Tanggal</div>
                                <div style={{ fontSize: 14, color: 'var(--color-text)' }}>{salesOrder.date}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 4 }}>Total Nilai</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-secondary)', fontFamily: 'var(--font-heading)' }}>{fmt(salesOrder.total_amount ?? totalValue)}</div>
                            </div>
                        </div>

                        {/* 1. Desktop Items Table */}
                        <div className="scm-desktop-view">
                            <div className="scm-table-responsive">
                                <table className="scm-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Produk</th>
                                            <th style={{ textAlign: 'center' }}>Qty</th>
                                            <th style={{ textAlign: 'right' }}>Harga Satuan</th>
                                            <th style={{ textAlign: 'right' }}>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(salesOrder.items ?? []).map((item, i) => {
                                            const unitPrice = Number(item.price ?? item.unit_price ?? 0);
                                            return (
                                                <tr key={item.id}>
                                                    <td style={{ color: 'var(--color-text-faint)', fontSize: 12 }}>{i + 1}</td>
                                                    <td style={{ fontWeight: 500 }}>{item.product?.name ?? '—'}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.quantity} {item.product?.unit}</td>
                                                    <td style={{ textAlign: 'right' }}>{fmt(unitPrice)}</td>
                                                    <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>{fmt(unitPrice * Number(item.quantity))}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'right', fontWeight: 700, fontSize: 14, color: 'var(--color-text-muted)', padding: '12px 16px' }}>TOTAL</td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-heading)', color: 'var(--color-secondary)', padding: '12px 16px' }}>{fmt(salesOrder.total_amount ?? totalValue)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* 2. Mobile Items Cards */}
                        <div className="scm-mobile-view">
                            <div className="scm-detail-items-mobile">
                                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                                    Daftar Item ({salesOrder.items?.length ?? 0})
                                </div>
                                {(salesOrder.items ?? []).map((item, i) => {
                                    const unitPrice = Number(item.price ?? item.unit_price ?? 0);
                                    return (
                                        <div key={item.id} className="scm-detail-item-card">
                                            <div className="scm-detail-item-card-top">
                                                <span className="scm-detail-item-card-name">
                                                    {item.product?.name ?? '—'}
                                                </span>
                                                <span className="scm-detail-item-card-index">#{i + 1}</span>
                                            </div>
                                            <div className="scm-detail-item-card-calc">
                                                <span className="scm-detail-item-card-qty">
                                                    {item.quantity} {item.product?.unit ?? 'pcs'}
                                                </span>
                                                <span>@ {fmt(unitPrice)}</span>
                                            </div>
                                            <div className="scm-detail-item-card-subtotal-row">
                                                <span style={{ fontSize: 12, color: 'var(--color-text-faint)' }}>Subtotal</span>
                                                <span className="scm-detail-item-card-subtotal-val">
                                                    {fmt(unitPrice * Number(item.quantity))}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="scm-detail-summary-card">
                                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                                        Total Akhir
                                    </span>
                                    <span className="scm-detail-summary-total">
                                        {fmt(salesOrder.total_amount ?? totalValue)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
