import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

function StatusBadge({ status }) {
    const map = {
        Pending:   'scm-badge scm-badge-yellow',
        Approved:  'scm-badge scm-badge-blue',
        Completed: 'scm-badge scm-badge-green',
        Cancelled: 'scm-badge scm-badge-red',
    };
    return <span className={map[status] ?? 'scm-badge scm-badge-gray'}>{status}</span>;
}

export default function Index({ purchaseOrders, suppliers, products }) {
    const [showPanel, setShowPanel] = useState(false);
    const [filterStatus, setFilterStatus]     = useState('');
    const [filterSupplier, setFilterSupplier] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo]     = useState('');

    const filteredPOs = purchaseOrders.filter((po) => {
        if (filterStatus   && po.status !== filterStatus) return false;
        if (filterSupplier && !(po.supplier?.name ?? '').toLowerCase().includes(filterSupplier.toLowerCase())) return false;
        if (filterDateFrom && po.date < filterDateFrom) return false;
        if (filterDateTo   && po.date > filterDateTo)   return false;
        return true;
    });

    const resetFilters = () => { setFilterStatus(''); setFilterSupplier(''); setFilterDateFrom(''); setFilterDateTo(''); };
    const hasFilter = filterStatus || filterSupplier || filterDateFrom || filterDateTo;

    const { data, setData, post, processing, errors, reset } = useForm({
        supplier_id: '',
        date: new Date().toISOString().split('T')[0],
        items: [{ product_id: '', quantity: 1 }],
    });

    const addItem    = () => setData('items', [...data.items, { product_id: '', quantity: 1 }]);
    const removeItem = (i) => setData('items', data.items.filter((_, idx) => idx !== i));
    const updateItem = (i, field, value) => {
        const u = [...data.items]; u[i][field] = value; setData('items', u);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('purchase-orders.store'), {
            onSuccess: () => { reset(); setShowPanel(false); },
        });
    };

    const totalValue = (po) => (po.items ?? []).reduce((s, it) => s + (Number(it.price ?? 0) * Number(it.quantity ?? 0)), 0);
    const fmt = (v) => `Rp ${Number(v).toLocaleString('id-ID')}`;

    return (
        <AuthenticatedLayout header="Purchase Orders">
            <Head title="Purchase Orders" />

            {/* Slide-in Panel */}
            {showPanel && (
                <>
                    <div className="scm-panel-overlay" onClick={() => setShowPanel(false)} />
                    <div className="scm-panel">
                        <div className="scm-panel-header">
                            <span className="scm-panel-title">Buat Purchase Order Baru</span>
                            <button onClick={() => setShowPanel(false)} className="scm-btn scm-btn-ghost scm-btn-sm">✕</button>
                        </div>
                        <div className="scm-panel-body">
                            <form id="po-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label className="scm-label">Supplier</label>
                                    <select value={data.supplier_id} onChange={e => setData('supplier_id', e.target.value)} className="scm-select" required>
                                        <option value="">-- Pilih Supplier --</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    {errors.supplier_id && <p className="scm-form-error">{errors.supplier_id}</p>}
                                </div>
                                <div>
                                    <label className="scm-label">Tanggal PO</label>
                                    <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="scm-input" required />
                                    {errors.date && <p className="scm-form-error">{errors.date}</p>}
                                </div>

                                {/* Items */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <label className="scm-label" style={{ margin: 0 }}>Item Produk</label>
                                        <button type="button" onClick={addItem} className="scm-btn scm-btn-ghost scm-btn-sm" style={{ color: 'var(--color-secondary)' }}>
                                            + Tambah Item
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {data.items.map((item, index) => (
                                            <div key={index} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                                <div style={{ flex: 1 }}>
                                                    <select value={item.product_id} onChange={e => updateItem(index, 'product_id', e.target.value)} className="scm-select" required>
                                                        <option value="">-- Produk --</option>
                                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                    </select>
                                                </div>
                                                <div style={{ width: 80 }}>
                                                    <input type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} className="scm-input" placeholder="Qty" required />
                                                </div>
                                                {data.items.length > 1 && (
                                                    <button type="button" onClick={() => removeItem(index)} className="scm-btn scm-btn-danger scm-btn-sm" style={{ marginTop: 0, flexShrink: 0 }}>✕</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="scm-panel-footer">
                            <button type="button" onClick={() => setShowPanel(false)} className="scm-btn scm-btn-secondary">Batal</button>
                            <button type="submit" form="po-form" disabled={processing} className="scm-btn scm-btn-primary">
                                {processing ? 'Menyimpan...' : 'Simpan PO'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Header */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Purchase Orders</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>
                            {filteredPOs.length} dari {purchaseOrders.length} PO
                        </p>
                    </div>
                    <button onClick={() => setShowPanel(true)} className="scm-btn scm-btn-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Buat PO Baru
                    </button>
                </div>

                {/* Filters */}
                <div className="scm-card">
                    <div className="scm-filter-bar">
                        <div>
                            <label className="scm-label">Status</label>
                            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="scm-select" style={{ width: 140 }}>
                                <option value="">Semua</option>
                                {['Pending','Approved','Completed','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="scm-label">Supplier</label>
                            <input type="text" value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)} placeholder="Nama supplier..." className="scm-input" style={{ width: 180 }} />
                        </div>
                        <div>
                            <label className="scm-label">Dari</label>
                            <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} className="scm-input" style={{ width: 150 }} />
                        </div>
                        <div>
                            <label className="scm-label">Sampai</label>
                            <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} className="scm-input" style={{ width: 150 }} />
                        </div>
                        {hasFilter && (
                            <div style={{ alignSelf: 'flex-end' }}>
                                <button onClick={resetFilters} className="scm-btn scm-btn-ghost scm-btn-sm" style={{ color: '#F87171' }}>✕ Reset</button>
                            </div>
                        )}
                    </div>

                    {/* Table */}
                    <div className="scm-table-responsive">
                        <table className="scm-table">
                            <thead>
                                <tr>
                                    <th>No. PO</th>
                                    <th>Supplier</th>
                                    <th>Tanggal</th>
                                    <th style={{ textAlign: 'right' }}>Nilai</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPOs.length === 0 ? (
                                    <tr><td colSpan="5">
                                        <div className="scm-empty">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 40, height: 40 }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                                            <div className="scm-empty-title">{hasFilter ? 'Tidak ada PO sesuai filter' : 'Belum ada Purchase Order'}</div>
                                        </div>
                                    </td></tr>
                                ) : filteredPOs.map((po) => (
                                    <tr key={po.id}>
                                        <td>
                                            <Link href={route('purchase-orders.show', po.id)} style={{ color: 'var(--color-secondary)', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-heading)' }}>
                                                PO-{String(po.id).padStart(4, '0')}
                                            </Link>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{po.supplier?.name ?? '—'}</td>
                                        <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{po.date}</td>
                                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{fmt(totalValue(po))}</td>
                                        <td><StatusBadge status={po.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
