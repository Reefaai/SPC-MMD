import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

// ── SVG Icons ────────────────────────────────────────────────────
const icons = {
    cart: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
    ),
    warehouse: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M2 22V12L12 2l10 10v10" /><path d="M2 22h20" /><path d="M9 22V12h6v10" />
        </svg>
    ),
    calendar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    box: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M12 22l-8-4V6l8-4 8 4v12z" />
        </svg>
    ),
    filter: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    ),
    search: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    chevronRight: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <polyline points="9 18 15 12 9 6" />
        </svg>
    ),
    plus: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
    ),
};

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
    const [filterStatus, setFilterStatus]     = useState('');
    const [filterWarehouse, setFilterWarehouse] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo]     = useState('');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const filteredSOs = salesOrders.filter((so) => {
        if (filterStatus && so.status !== filterStatus) return false;
        if (filterWarehouse && String(so.warehouse_id) !== String(filterWarehouse)) return false;
        if (filterCustomer) {
            const query = filterCustomer.toLowerCase();
            const custName = (so.customer_name ?? '').toLowerCase();
            const soCode = `so-${String(so.id).padStart(4, '0')}`.toLowerCase();
            const rawId = String(so.id);
            if (!custName.includes(query) && !soCode.includes(query) && !rawId.includes(query)) {
                return false;
            }
        }
        if (filterDateFrom && so.date < filterDateFrom) return false;
        if (filterDateTo   && so.date > filterDateTo)   return false;
        return true;
    });

    const resetFilters = () => {
        setFilterCustomer('');
        setFilterStatus('');
        setFilterWarehouse('');
        setFilterDateFrom('');
        setFilterDateTo('');
        setMobileFilterOpen(false);
    };

    const hasFilter = Boolean(filterCustomer || filterStatus || filterWarehouse || filterDateFrom || filterDateTo);
    const drawerFilterCount = [filterStatus, filterWarehouse, filterDateFrom, filterDateTo].filter(Boolean).length;

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
                                        <input
                                            type="date"
                                            value={data.date}
                                            onChange={e => setData('date', e.target.value)}
                                            onClick={e => { try { e.currentTarget.showPicker(); } catch {} }}
                                            className="scm-input"
                                            required
                                        />
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Sales Orders</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                            <span className="scm-stat-chip scm-stat-chip-green">
                                <strong>{filteredSOs.length}</strong> SO Ditampilkan
                            </span>
                            <span className="scm-stat-chip scm-stat-chip-blue">
                                <strong>{salesOrders.length}</strong> Total SO
                            </span>
                        </div>
                    </div>
                    <button onClick={() => setShowPanel(true)} className="scm-btn scm-btn-primary">
                        {icons.plus}
                        <span>Buat SO Baru</span>
                    </button>
                </div>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* 1. DESKTOP VIEW (Table Grid)                             */}
                {/* ═════════════════════════════════════════════════════════ */}
                <div className="scm-desktop-view">
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
                                <label className="scm-label">Pelanggan / No. SO</label>
                                <input type="text" value={filterCustomer} onChange={e => setFilterCustomer(e.target.value)} placeholder="Cari SO atau pelanggan..." className="scm-input" style={{ width: 200 }} />
                            </div>
                            <div>
                                <label className="scm-label">Gudang</label>
                                <select value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)} className="scm-select" style={{ width: 150 }}>
                                    <option value="">Semua Gudang</option>
                                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </select>
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
                                                <Link href={route('sales-orders.show', so.id)} className="scm-sku-chip" style={{ textDecoration: 'none' }}>
                                                    SO-{String(so.id).padStart(4, '0')}
                                                </Link>
                                            </td>
                                            <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{so.customer_name}</td>
                                            <td>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: 'var(--radius)', fontSize: 12 }}>
                                                    {so.warehouse?.name ?? '—'}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--color-text-muted)', fontSize: 12.5 }}>{so.date}</td>
                                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-primary)' }}>{fmt(so.total_amount)}</td>
                                            <td><StatusBadge status={so.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* 2. MOBILE VIEW (Smart Filter + Data Cards)                */}
                {/* ═════════════════════════════════════════════════════════ */}
                <div className="scm-mobile-view">
                    {/* Smart Mobile Filter Bar */}
                    <div className="scm-mobile-filter-container">
                        <div className="scm-mobile-filter-search-row">
                            <div className="scm-mobile-filter-input-wrap">
                                {icons.search}
                                <input
                                    type="text"
                                    value={filterCustomer}
                                    onChange={e => setFilterCustomer(e.target.value)}
                                    placeholder="Cari SO atau pelanggan..."
                                    className="scm-input scm-mobile-filter-input"
                                />
                                {filterCustomer && (
                                    <button
                                        type="button"
                                        onClick={() => setFilterCustomer('')}
                                        aria-label="Hapus pencarian"
                                        style={{
                                            position: 'absolute',
                                            right: 8,
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--color-text-faint)',
                                            cursor: 'pointer',
                                            padding: '4px 6px',
                                            fontSize: 12,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                                className={`scm-mobile-filter-toggle-btn${drawerFilterCount > 0 ? ' active' : ''}`}
                            >
                                {icons.filter}
                                <span>Filter</span>
                                {drawerFilterCount > 0 && <span className="scm-mobile-filter-badge" />}
                            </button>
                        </div>

                        {/* Collapsible Mobile Filter Drawer */}
                        {mobileFilterOpen && (
                            <div className="scm-mobile-filter-expandable">
                                <div>
                                    <label className="scm-label">Status Pesanan</label>
                                    <select
                                        value={filterStatus}
                                        onChange={e => setFilterStatus(e.target.value)}
                                        className="scm-select"
                                    >
                                        <option value="">Semua Status</option>
                                        {['Pending','Approved','Completed','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="scm-label">Gudang</label>
                                    <select
                                        value={filterWarehouse}
                                        onChange={e => setFilterWarehouse(e.target.value)}
                                        className="scm-select"
                                    >
                                        <option value="">Semua Gudang</option>
                                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <div>
                                        <label className="scm-label">Dari Tanggal</label>
                                        <input
                                            type="date"
                                            value={filterDateFrom}
                                            onChange={e => setFilterDateFrom(e.target.value)}
                                            className="scm-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="scm-label">Sampai</label>
                                        <input
                                            type="date"
                                            value={filterDateTo}
                                            onChange={e => setFilterDateTo(e.target.value)}
                                            className="scm-input"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
                                    <button
                                        type="button"
                                        onClick={() => setMobileFilterOpen(false)}
                                        className="scm-btn scm-btn-primary scm-btn-sm"
                                        style={{ flex: 1, justifyContent: 'center' }}
                                    >
                                        Terapkan Filter
                                    </button>
                                    {hasFilter && (
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="scm-btn scm-btn-secondary scm-btn-sm"
                                            style={{ color: '#F87171' }}
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Active Filter Chips / Pills */}
                        {drawerFilterCount > 0 && !mobileFilterOpen && (
                            <div className="scm-filter-pills-row">
                                {filterStatus && (
                                    <span className="scm-filter-pill">
                                        Status: {filterStatus}
                                        <button onClick={() => setFilterStatus('')} className="scm-filter-pill-remove">✕</button>
                                    </span>
                                )}
                                {filterWarehouse && (
                                    <span className="scm-filter-pill">
                                        Gudang: {warehouses.find(w => String(w.id) === String(filterWarehouse))?.name ?? '—'}
                                        <button onClick={() => setFilterWarehouse('')} className="scm-filter-pill-remove">✕</button>
                                    </span>
                                )}
                                {(filterDateFrom || filterDateTo) && (
                                    <span className="scm-filter-pill">
                                        Tanggal: {filterDateFrom || '...'} s/d {filterDateTo || '...'}
                                        <button onClick={() => { setFilterDateFrom(''); setFilterDateTo(''); }} className="scm-filter-pill-remove">✕</button>
                                    </span>
                                )}
                                <button
                                    onClick={resetFilters}
                                    style={{ background: 'transparent', border: 'none', color: '#F87171', fontSize: 11, cursor: 'pointer', padding: '2px 4px' }}
                                >
                                    Reset
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Data Cards List */}
                    {filteredSOs.length === 0 ? (
                        <div className="scm-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
                            <div className="scm-empty-title" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                                {hasFilter ? 'Tidak ada SO sesuai filter' : 'Belum ada Sales Order'}
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--color-text-faint)', marginTop: 4 }}>
                                {hasFilter ? 'Coba ubah kata kunci pencarian atau filter.' : 'Mulai buat SO baru untuk pesanan pelanggan.'}
                            </p>
                            {hasFilter && (
                                <button onClick={resetFilters} className="scm-btn scm-btn-secondary scm-btn-sm" style={{ marginTop: 14 }}>
                                    Reset Semua Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="scm-data-card-list">
                            {filteredSOs.map((so) => {
                                const itemCount = so.items?.length ?? 0;
                                return (
                                    <Link
                                        key={so.id}
                                        href={route('sales-orders.show', so.id)}
                                        className="scm-data-card"
                                    >
                                        {/* Card Header: Code & Status */}
                                        <div className="scm-data-card-header">
                                            <span className="scm-data-card-code">
                                                {icons.cart}
                                                SO-{String(so.id).padStart(4, '0')}
                                            </span>
                                            <StatusBadge status={so.status} />
                                        </div>

                                        {/* Card Body: Customer & Meta */}
                                        <div className="scm-data-card-body">
                                            <div className="scm-data-card-title">
                                                {so.customer_name}
                                            </div>
                                            <div className="scm-data-card-meta">
                                                <span className="scm-data-card-meta-item">
                                                    {icons.warehouse}
                                                    {so.warehouse?.name ?? '—'}
                                                </span>
                                                <span className="scm-data-card-meta-item">
                                                    {icons.calendar}
                                                    {new Date(so.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="scm-data-card-meta-item">
                                                    {icons.box}
                                                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Footer: Total Amount & Detail CTA */}
                                        <div className="scm-data-card-footer">
                                            <div>
                                                <div className="scm-data-card-amount-label">Total Nilai</div>
                                                <div className="scm-data-card-amount" style={{ color: 'var(--color-secondary)' }}>{fmt(so.total_amount)}</div>
                                            </div>
                                            <span className="scm-data-card-arrow">
                                                Detail
                                                {icons.chevronRight}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
