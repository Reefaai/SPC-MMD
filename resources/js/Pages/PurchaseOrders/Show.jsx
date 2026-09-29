import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function StatusBadge({ status }) {
    const map = {
        Pending:   'scm-badge scm-badge-yellow',
        Approved:  'scm-badge scm-badge-blue',
        Completed: 'scm-badge scm-badge-green',
        Cancelled: 'scm-badge scm-badge-red',
        Draft:     'scm-badge scm-badge-gray',
    };
    return <span className={map[status] ?? 'scm-badge scm-badge-gray'}>{status}</span>;
}

const fmt = (v) => `Rp ${Number(v ?? 0).toLocaleString('id-ID')}`;

export default function Show({ purchaseOrder }) {
    const { data, setData, put, processing } = useForm({ status: purchaseOrder.status });

    const handleStatusChange = (e) => {
        e.preventDefault();
        put(route('purchase-orders.update', purchaseOrder.id));
    };

    const statusOptions = ['Draft', 'Pending', 'Approved', 'Completed', 'Cancelled'];
    const totalValue = (purchaseOrder.items ?? []).reduce((s, it) => s + (Number(it.price ?? 0) * Number(it.quantity ?? 0)), 0);

    return (
        <AuthenticatedLayout header={`PO-${String(purchaseOrder.id).padStart(4, '0')}`}>
            <Head title={`PO-${String(purchaseOrder.id).padStart(4, '0')}`}>
                <style>{`@media print { .no-print { display: none !important; } .scm-sidebar { display: none !important; } .scm-topbar { display: none !important; } .scm-main { margin-left: 0 !important; } body { background: white; color: black; } .scm-card { border: 1px solid #e5e7eb; } .scm-table th { background: #f9fafb; color: #374151; } .scm-table td { color: #111827; border-color: #e5e7eb; } }`}</style>
            </Head>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800, margin: '0 auto' }}>
                {/* Back + Print */}
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href={route('purchase-orders.index')} className="scm-btn scm-btn-ghost" style={{ fontSize: 13 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><polyline points="15 18 9 12 15 6"/></svg>
                        Kembali ke Daftar
                    </Link>
                    <button onClick={() => window.print()} className="scm-btn scm-btn-secondary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        Print
                    </button>
                </div>

                {/* PO Detail Card */}
                <div className="scm-card">
                    <div className="scm-card-header">
                        <div>
                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
                                Purchase Order #{String(purchaseOrder.id).padStart(4, '0')}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--color-text-faint)', marginTop: 2 }}>
                                Dibuat pada {new Date(purchaseOrder.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                        <StatusBadge status={purchaseOrder.status} />
                    </div>
                    <div className="scm-card-body">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 4 }}>Supplier</div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>{purchaseOrder.supplier?.name ?? '—'}</div>
                                {purchaseOrder.supplier?.contact && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{purchaseOrder.supplier.contact}</div>}
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 4 }}>Tanggal PO</div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>{purchaseOrder.date}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 4 }}>Total Nilai</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-secondary)', fontFamily: 'var(--font-heading)' }}>{fmt(totalValue)}</div>
                            </div>
                        </div>

                        {/* Items table */}
                        <div className="scm-table-responsive">
                            <table className="scm-table" style={{ marginBottom: 16 }}>
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
                                    {(purchaseOrder.items ?? []).map((item, i) => (
                                        <tr key={item.id}>
                                            <td style={{ color: 'var(--color-text-faint)', fontSize: 12 }}>{i + 1}</td>
                                            <td style={{ fontWeight: 500 }}>{item.product?.name ?? '—'}</td>
                                            <td style={{ textAlign: 'center' }}>{item.quantity} {item.product?.unit}</td>
                                            <td style={{ textAlign: 'right' }}>{fmt(item.price)}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>{fmt(Number(item.price) * Number(item.quantity))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'right', fontWeight: 700, fontSize: 14, color: 'var(--color-text-muted)', padding: '12px 16px' }}>TOTAL</td>
                                        <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-heading)', color: 'var(--color-secondary)', padding: '12px 16px' }}>{fmt(totalValue)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Status Update */}
                <div className="scm-card no-print">
                    <div className="scm-card-header"><span className="scm-card-title">Ubah Status PO</span></div>
                    <div className="scm-card-body">
                        <form onSubmit={handleStatusChange} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <label className="scm-label">Status</label>
                                <select value={data.status} onChange={e => setData('status', e.target.value)} className="scm-select">
                                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <button type="submit" disabled={processing} className="scm-btn scm-btn-primary">
                                {processing ? 'Menyimpan...' : 'Perbarui Status'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
