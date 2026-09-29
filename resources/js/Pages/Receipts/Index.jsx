import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const icons = {
    packageDown: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <path d="M12 22l-8-4V6l8-4 8 4v12z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" /><polyline points="9 16 12 19 15 16" />
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
    user: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    ),
    receipt: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    ),
    search: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    plus: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
    ),
};

export default function Index({ receipts, pendingPOs, warehouses }) {
    const [showPanel, setShowPanel]     = useState(false);
    const [selectedPO, setSelectedPO]   = useState(null);
    const [search, setSearch]           = useState('');

    const { data, setData, post, processing, reset } = useForm({
        purchase_order_id: '',
        warehouse_id: '',
        date: new Date().toISOString().split('T')[0],
        items: [],
    });

    const handleSelectPO = (poId) => {
        setData('purchase_order_id', poId);
        const po = pendingPOs.find(p => p.id == poId);
        setSelectedPO(po);
        if (po) {
            setData('items', po.items.map(item => ({
                product_id: item.product_id,
                product_name: item.product?.name,
                quantity_received: item.quantity,
            })));
        } else {
            setData('items', []);
        }
    };

    const updateQty = (index, value) => {
        const updated = [...data.items];
        updated[index].quantity_received = value;
        setData('items', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('receipts.store'), {
            onSuccess: () => {
                reset();
                setSelectedPO(null);
                setShowPanel(false);
            },
        });
    };

    const filteredReceipts = receipts.filter(r => {
        if (!search) return true;
        const q = search.toLowerCase();
        const rcpCode = `rcp-${String(r.id).padStart(4, '0')}`.toLowerCase();
        const poCode = `po-${String(r.purchase_order_id).padStart(4, '0')}`.toLowerCase();
        const whName = (r.warehouse?.name ?? '').toLowerCase();
        const receiverName = (r.receiver?.name ?? '').toLowerCase();
        return rcpCode.includes(q) || poCode.includes(q) || whName.includes(q) || receiverName.includes(q);
    });

    const hasFilter = Boolean(search);

    return (
        <AuthenticatedLayout header="Penerimaan Barang">
            <Head title="Receipts" />

            {/* Slide-in Panel */}
            {showPanel && (
                <>
                    <div className="scm-panel-overlay" onClick={() => setShowPanel(false)} />
                    <div className="scm-panel">
                        <div className="scm-panel-header">
                            <span className="scm-panel-title">Buat Penerimaan Barang</span>
                            <button onClick={() => setShowPanel(false)} className="scm-btn scm-btn-ghost scm-btn-sm">✕</button>
                        </div>
                        <div className="scm-panel-body">
                            <form id="receipt-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label className="scm-label">Purchase Order</label>
                                    <select value={data.purchase_order_id} onChange={e => handleSelectPO(e.target.value)} className="scm-select" required>
                                        <option value="">-- Pilih PO --</option>
                                        {pendingPOs.map(po => (
                                            <option key={po.id} value={po.id}>PO-{String(po.id).padStart(4, '0')} — {po.supplier?.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div>
                                        <label className="scm-label">Gudang Tujuan</label>
                                        <select value={data.warehouse_id} onChange={e => setData('warehouse_id', e.target.value)} className="scm-select" required>
                                            <option value="">-- Pilih --</option>
                                            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="scm-label">Tanggal Terima</label>
                                        <input
                                            type="date"
                                            value={data.date}
                                            onChange={e => setData('date', e.target.value)}
                                            onClick={e => { try { e.currentTarget.showPicker(); } catch {} }}
                                            className="scm-input"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Items */}
                                {data.items.length > 0 && (
                                    <div>
                                        <label className="scm-label" style={{ marginBottom: 10 }}>Konfirmasi Jumlah Diterima</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {data.items.map((item, index) => (
                                                <div key={index} style={{
                                                    display: 'flex', alignItems: 'center', gap: 10,
                                                    background: 'var(--color-surface-2)',
                                                    border: '1px solid var(--color-border)',
                                                    borderRadius: 'var(--radius)',
                                                    padding: '10px 12px',
                                                }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{item.product_name}</div>
                                                    </div>
                                                    <input
                                                        type="number" min="1"
                                                        value={item.quantity_received}
                                                        onChange={e => updateQty(index, e.target.value)}
                                                        className="scm-input"
                                                        style={{ width: 80 }}
                                                        required
                                                    />
                                                    <span style={{ fontSize: 12, color: 'var(--color-text-faint)', whiteSpace: 'nowrap' }}>unit</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {pendingPOs.length === 0 && (
                                    <div className="scm-alert scm-alert-warning">
                                        Tidak ada PO yang menunggu penerimaan.
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className="scm-panel-footer">
                            <button type="button" onClick={() => setShowPanel(false)} className="scm-btn scm-btn-secondary">Batal</button>
                            <button type="submit" form="receipt-form" disabled={processing || data.items.length === 0} className="scm-btn scm-btn-primary">
                                {processing ? 'Menyimpan...' : 'Konfirmasi Penerimaan'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Penerimaan Barang</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>
                            {filteredReceipts.length} dari {receipts.length} total penerimaan
                        </p>
                    </div>
                    <button onClick={() => setShowPanel(true)} disabled={pendingPOs.length === 0} className="scm-btn scm-btn-primary">
                        {icons.plus}
                        <span>Buat Penerimaan</span>
                    </button>
                </div>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* 1. DESKTOP VIEW (Table Grid)                             */}
                {/* ═════════════════════════════════════════════════════════ */}
                <div className="scm-desktop-view">
                    <div className="scm-card">
                        <div className="scm-filter-bar">
                            <div>
                                <label className="scm-label">Cari Penerimaan</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari RCP, PO, atau gudang..."
                                    className="scm-input"
                                    style={{ width: 260 }}
                                />
                            </div>
                            {hasFilter && (
                                <div style={{ alignSelf: 'flex-end' }}>
                                    <button onClick={() => setSearch('')} className="scm-btn scm-btn-ghost scm-btn-sm" style={{ color: '#F87171' }}>✕ Reset</button>
                                </div>
                            )}
                            <span style={{ marginLeft: 'auto', alignSelf: 'flex-end', fontSize: 12, color: 'var(--color-text-faint)', paddingBottom: 2 }}>
                                {filteredReceipts.length} data ditampilkan
                            </span>
                        </div>

                        <div className="scm-table-responsive">
                            <table className="scm-table">
                                <thead>
                                    <tr>
                                        <th>No. Receipt</th>
                                        <th>Purchase Order</th>
                                        <th>Gudang</th>
                                        <th>Tanggal</th>
                                        <th>Diterima Oleh</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReceipts.length === 0 ? (
                                        <tr><td colSpan="6">
                                            <div className="scm-empty">
                                                <div className="scm-empty-title">{hasFilter ? 'Tidak ada penerimaan sesuai filter' : 'Belum ada penerimaan barang'}</div>
                                                <div className="scm-empty-desc">Konfirmasi penerimaan barang dari PO yang sudah disetujui</div>
                                            </div>
                                        </td></tr>
                                    ) : filteredReceipts.map((r) => (
                                        <tr key={r.id}>
                                            <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-secondary)' }}>
                                                RCP-{String(r.id).padStart(4, '0')}
                                            </td>
                                            <td style={{ color: 'var(--color-text-muted)' }}>PO-{String(r.purchase_order_id).padStart(4, '0')}</td>
                                            <td style={{ fontWeight: 500 }}>{r.warehouse?.name ?? '—'}</td>
                                            <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{r.date}</td>
                                            <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{r.receiver?.name ?? '—'}</td>
                                            <td><span className="scm-badge scm-badge-green">{r.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* 2. MOBILE VIEW (Smart Filter + Receipt Cards)             */}
                {/* ═════════════════════════════════════════════════════════ */}
                <div className="scm-mobile-view">
                    {/* Search Bar */}
                    <div className="scm-mobile-filter-container">
                        <div className="scm-mobile-filter-search-row">
                            <div className="scm-mobile-filter-input-wrap">
                                {icons.search}
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari RCP, PO, atau gudang..."
                                    className="scm-input scm-mobile-filter-input"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
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
                        </div>
                    </div>

                    {/* Mobile Receipt Cards List */}
                    {filteredReceipts.length === 0 ? (
                        <div className="scm-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
                            <div className="scm-empty-title" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                                {hasFilter ? 'Tidak ada penerimaan sesuai filter' : 'Belum ada penerimaan barang'}
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--color-text-faint)', marginTop: 4 }}>
                                {hasFilter ? 'Coba ubah kata kunci pencarian.' : 'Penerimaan barang dari PO yang disetujui akan muncul di sini.'}
                            </p>
                            {hasFilter ? (
                                <button onClick={() => setSearch('')} className="scm-btn scm-btn-secondary scm-btn-sm" style={{ marginTop: 14 }}>
                                    Reset Pencarian
                                </button>
                            ) : pendingPOs.length > 0 && (
                                <button onClick={() => setShowPanel(true)} className="scm-btn scm-btn-primary scm-btn-sm" style={{ marginTop: 14 }}>
                                    + Buat Penerimaan Sekarang
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="scm-data-card-list">
                            {filteredReceipts.map((r) => (
                                <div key={r.id} className="scm-data-card">
                                    {/* Card Header: RCP Code & Status */}
                                    <div className="scm-data-card-header">
                                        <span className="scm-data-card-code">
                                            {icons.packageDown}
                                            RCP-{String(r.id).padStart(4, '0')}
                                        </span>
                                        <span className="scm-badge scm-badge-green">{r.status}</span>
                                    </div>

                                    {/* Card Body: PO Ref & Warehouse */}
                                    <div className="scm-data-card-body">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: 'var(--color-secondary)',
                                                background: 'rgba(147, 215, 140, 0.1)',
                                                padding: '2px 8px',
                                                borderRadius: 'var(--radius-sm)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 4,
                                            }}>
                                                {icons.receipt}
                                                PO-{String(r.purchase_order_id).padStart(4, '0')}
                                            </span>
                                        </div>

                                        <div className="scm-data-card-meta" style={{ marginTop: 4 }}>
                                            <span className="scm-data-card-meta-item">
                                                {icons.warehouse}
                                                {r.warehouse?.name ?? '—'}
                                            </span>
                                            <span className="scm-data-card-meta-item">
                                                {icons.calendar}
                                                {new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="scm-data-card-meta-item">
                                                {icons.user}
                                                {r.receiver?.name ?? '—'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
