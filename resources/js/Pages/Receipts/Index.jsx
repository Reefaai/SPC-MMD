import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ receipts, pendingPOs, warehouses }) {
    const [showPanel, setShowPanel]     = useState(false);
    const [selectedPO, setSelectedPO]   = useState(null);

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
                                        <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="scm-input" required />
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
                                                    border: '1px solid var(--color-border-2)',
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
                            <button type="submit" form="receipt-form" disabled={processing || data.items.length === 0} className="scm-btn scm-btn-primary" style={{ background: 'var(--color-accent)' }}>
                                {processing ? 'Menyimpan...' : 'Konfirmasi Penerimaan'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Penerimaan Barang</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>{receipts.length} total penerimaan</p>
                    </div>
                    <button onClick={() => setShowPanel(true)} disabled={pendingPOs.length === 0} className="scm-btn scm-btn-primary" style={{ background: 'var(--color-accent)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Buat Penerimaan
                    </button>
                </div>

                <div className="scm-card">
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
                                {receipts.length === 0 ? (
                                    <tr><td colSpan="6">
                                        <div className="scm-empty">
                                            <div className="scm-empty-title">{hasFilter ? 'Tidak ada penerimaan sesuai filter' : 'Belum ada penerimaan barang'}</div>
                                            <div className="scm-empty-desc">Konfirmasi penerimaan barang dari PO yang sudah disetujui</div>
                                        </div>
                                    </td></tr>
                                ) : receipts.map((r) => (
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
        </AuthenticatedLayout>
    );
}
