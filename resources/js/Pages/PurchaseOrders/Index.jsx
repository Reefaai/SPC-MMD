import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

// ── SVG Icons ────────────────────────────────────────────────────
const icons = {
    receipt: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    ),
    building: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
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

export default function Index({ purchaseOrders, suppliers, products }) {
    const [showPanel, setShowPanel] = useState(false);
    const [filterStatus, setFilterStatus]     = useState('');
    const [filterSupplier, setFilterSupplier] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo]     = useState('');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Search matches either supplier name or PO code (e.g. "PO-0001" or "1")
    const filteredPOs = purchaseOrders.filter((po) => {
        if (filterStatus && po.status !== filterStatus) return false;
        if (filterSupplier) {
            const query = filterSupplier.toLowerCase();
            const suppName = (po.supplier?.name ?? '').toLowerCase();
            const poCode = `po-${String(po.id).padStart(4, '0')}`.toLowerCase();
            const rawId = String(po.id);
            if (!suppName.includes(query) && !poCode.includes(query) && !rawId.includes(query)) {
                return false;
            }
        }
        if (filterDateFrom && po.date < filterDateFrom) return false;
        if (filterDateTo   && po.date > filterDateTo)   return false;
        return true;
    });

    const resetFilters = () => {
        setFilterStatus('');
        setFilterSupplier('');
        setFilterDateFrom('');
        setFilterDateTo('');
        setMobileFilterOpen(false);
    };

    const hasFilter = Boolean(filterStatus || filterSupplier || filterDateFrom || filterDateTo);
    const drawerFilterCount = [filterStatus, filterDateFrom, filterDateTo].filter(Boolean).length;

    // Form
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

    const totalValue = (po) => Number(po.total_amount ?? 0) || (po.items ?? []).reduce((s, it) => s + (Number(it.price ?? 0) * Number(it.quantity ?? 0)), 0);
    const fmt = (v) => `Rp ${Number(v).toLocaleString('id-ID')}`;

    return (
        <AuthenticatedLayout header="Purchase Orders">
            <Head title="Purchase Orders" />

            {/* Slide-in Creation Panel */}
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
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                        onClick={e => { try { e.currentTarget.showPicker(); } catch {} }}
                                        className="scm-input"
                                        required
                                    />
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header Section */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Purchase Orders</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>
                            {filteredPOs.length} dari {purchaseOrders.length} PO
                        </p>
                    </div>
                    <button onClick={() => setShowPanel(true)} className="scm-btn scm-btn-primary">
                        {icons.plus}
                        <span>Buat PO Baru</span>
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
                                <label className="scm-label">Supplier / No. PO</label>
                                <input type="text" value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)} placeholder="Cari PO atau supplier..." className="scm-input" style={{ width: 200 }} />
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

                        {/* Desktop Responsive Table */}
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
                                    value={filterSupplier}
                                    onChange={e => setFilterSupplier(e.target.value)}
                                    placeholder="Cari PO atau supplier..."
                                    className="scm-input scm-mobile-filter-input"
                                />
                                {filterSupplier && (
                                    <button
                                        type="button"
                                        onClick={() => setFilterSupplier('')}
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
                                    Hapus Semua
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Data Cards List */}
                    {filteredPOs.length === 0 ? (
                        <div className="scm-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
                            <div className="scm-empty-title" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                                {hasFilter ? 'Tidak ada PO sesuai filter' : 'Belum ada Purchase Order'}
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--color-text-faint)', marginTop: 4 }}>
                                {hasFilter ? 'Coba ubah kata kunci pencarian atau tanggal filter.' : 'Mulai buat PO baru untuk pengadaan barang.'}
                            </p>
                            {hasFilter && (
                                <button onClick={resetFilters} className="scm-btn scm-btn-secondary scm-btn-sm" style={{ marginTop: 14 }}>
                                    Reset Semua Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="scm-data-card-list">
                            {filteredPOs.map((po) => {
                                const itemCount = po.items?.length ?? 0;
                                const val = totalValue(po);
                                return (
                                    <Link
                                        key={po.id}
                                        href={route('purchase-orders.show', po.id)}
                                        className="scm-data-card"
                                    >
                                        {/* Card Header: Code & Status */}
                                        <div className="scm-data-card-header">
                                            <span className="scm-data-card-code">
                                                {icons.receipt}
                                                PO-{String(po.id).padStart(4, '0')}
                                            </span>
                                            <StatusBadge status={po.status} />
                                        </div>

                                        {/* Card Body: Supplier & Meta */}
                                        <div className="scm-data-card-body">
                                            <div className="scm-data-card-title">
                                                {po.supplier?.name ?? '—'}
                                            </div>
                                            <div className="scm-data-card-meta">
                                                <span className="scm-data-card-meta-item">
                                                    {icons.calendar}
                                                    {new Date(po.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                                                <div className="scm-data-card-amount">{fmt(val)}</div>
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
