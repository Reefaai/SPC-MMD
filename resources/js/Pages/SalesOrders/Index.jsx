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

export default function Index({ salesOrders, products, warehouses }) {
    const [showPanel, setShowPanel]           = useState(false);
    const [filterCustomer, setFilterCustomer] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo]     = useState('');

    const filteredSOs = salesOrders.filter((so) => {
        if (filterCustomer && !so.customer_name.toLowerCase().includes(filterCustomer.toLowerCase())) return false;
        if (filterDateFrom && so.date < filterDateFrom) return false;
        if (filterDateTo   && so.date > filterDateTo)   return false;
        return true;
    });

    const resetFilters = () => { setFilterCustomer(''); setFilterDateFrom(''); setFilterDateTo(''); };
    const hasFilter = filterCustomer || filterDateFrom || filterDateTo;

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        date: new Date().toISOString().split('T')[0],
        warehouse_id: '',
        items: [{ product_id: '', quantity: 1 }],
    });

    const addItem    = () => setData('items', [...data.items, { product_id: '', quantity: 1 }]);
    const removeItem = (i) => setData('items', data.items.filter((_, idx) => idx !== i));
    const updateItem = (i, field, value) => {
        const u = [...data.items]; u[i][field] = value; setData('items', u);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('sales-orders.store'), {
            onSuccess: () => { reset(); setShowPanel(false); },
        });
    };

    const fmt = (v) => `Rp ${Number(v ?? 0).toLocaleString('id-ID')}`;

    return (
        <AuthenticatedLayout header="Sales Orders">
            <Head title="Sales Orders" />

            {/* Slide-in Panel */}
            {showPanel && (
                <>
                    <div className="scm-panel-overlay" onClick={() => setShowPanel(false)} />
                    <div className="scm-panel">
                        <div className="scm-panel-header">
                            <span className="scm-panel-title">Buat Sales Order Baru</span>
                            <button onClick={() => setShowPanel(false)} className="scm-btn scm-btn-ghost scm-btn-sm">✕</button>
                        </div>
                        <div className="scm-panel-body">
                            <form id="so-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label className="scm-label">Nama Pelanggan</label>
                                    <input type="text" value={data.customer_name} onChange={e => setData('customer_name', e.target.value)} className="scm-input" placeholder="Nama pelanggan..." required />
                                    {errors.customer_name && <p className="scm-form-error">{errors.customer_name}</p>}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div>
                                        <label className="scm-label">Tanggal</label>
                                        <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="scm-input" required />
                                    </div>
                                    <div>
                                        <label className="scm-label">Gudang</label>
                                        <select value={data.warehouse_id} onChange={e => setData('warehouse_id', e.target.value)} className="scm-select" required>
                                            <option value="">-- Pilih --</option>
                                            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                        </select>
                                        {errors.warehouse_id && <p className="scm-form-error">{errors.warehouse_id}</p>}
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <label className="scm-label" style={{ margin: 0 }}>Item Produk</label>
                                        <button type="button" onClick={addItem} className="scm-btn scm-btn-ghost scm-btn-sm" style={{ color: 'var(--color-secondary)' }}>
                                            + Tambah Item
                                        </button>
                                    </div>
                                    {errors.items && <p className="scm-form-error" style={{ marginBottom: 8 }}>{errors.items}</p>}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {data.items.map((item, index) => (
                                            <div key={index}>
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <select value={item.product_id} onChange={e => updateItem(index, 'product_id', e.target.value)} className="scm-select" required>
                                                            <option value="">-- Produk --</option>
                                                            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Rp {Number(p.price).toLocaleString('id-ID')})</option>)}
                                                        </select>
                                                    </div>
                                                    <div style={{ width: 80 }}>
                                                        <input
                                                            type="number" min="1" value={item.quantity}
                                                            onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                            className={`scm-input${errors[`items.${index}.quantity`] ? ' error' : ''}`}
                                                            placeholder="Qty" required
                                                        />
                                                    </div>
                                                    {data.items.length > 1 && (
                                                        <button type="button" onClick={() => removeItem(index)} className="scm-btn scm-btn-danger scm-btn-sm">✕</button>
                                                    )}
                                                </div>
                                                {errors[`items.${index}.quantity`] && (
                                                    <p className="scm-form-error" style={{ textAlign: 'right', marginRight: data.items.length > 1 ? 44 : 0 }}>
                                                        {errors[`items.${index}.quantity`]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="scm-panel-footer">
                            <button type="button" onClick={() => setShowPanel(false)} className="scm-btn scm-btn-secondary">Batal</button>
                            <button type="submit" form="so-form" disabled={processing} className="scm-btn scm-btn-primary">
                                {processing ? 'Menyimpan...' : 'Simpan SO'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Header */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Sales Orders</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>
                            {filteredSOs.length} dari {salesOrders.length} SO
                        </p>
                    </div>
                    <button onClick={() => setShowPanel(true)} className="scm-btn scm-btn-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Buat SO Baru
                    </button>
                </div>

                {/* Filters + Table */}
                <div className="scm-card">
                    <div className="scm-filter-bar">
                        <div>
                            <label className="scm-label">Pelanggan</label>
                            <input type="text" value={filterCustomer} onChange={e => setFilterCustomer(e.target.value)} placeholder="Cari pelanggan..." className="scm-input" style={{ width: 200 }} />
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
                    <div className="scm-table-responsive">
                        <table className="scm-table">
                            <thead>
                                <tr>
                                    <th>No. SO</th>
                                    <th>Pelanggan</th>
                                    <th>Gudang</th>
                                    <th>Tanggal</th>
                                    <th style={{ textAlign: 'right' }}>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSOs.length === 0 ? (
                                    <tr><td colSpan="6">
                                        <div className="scm-empty">
                                            <div className="scm-empty-title">{hasFilter ? 'Tidak ada SO sesuai filter' : 'Belum ada Sales Order'}</div>
                                        </div>
                                    </td></tr>
                                ) : filteredSOs.map((so) => (
                                    <tr key={so.id}>
                                        <td>
                                            <Link href={route('sales-orders.show', so.id)} style={{ color: 'var(--color-secondary)', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-heading)' }}>
                                                SO-{String(so.id).padStart(4, '0')}
                                            </Link>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{so.customer_name}</td>
                                        <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{so.warehouse?.name ?? '—'}</td>
                                        <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{so.date}</td>
                                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{fmt(so.total_amount)}</td>
                                        <td><StatusBadge status={so.status} /></td>
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
