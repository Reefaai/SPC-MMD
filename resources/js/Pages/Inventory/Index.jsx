import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ warehouses, stockMatrix }) {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const filtered = stockMatrix.filter(p => {
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku ?? '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || (filterStatus === 'low' ? p.is_low_stock : !p.is_low_stock);
        return matchSearch && matchStatus;
    });

    const lowCount = stockMatrix.filter(p => p.is_low_stock).length;

    return (
        <AuthenticatedLayout header="Inventori">
            <Head title="Inventori" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Header */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Stok per Gudang</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>
                            {stockMatrix.length} produk · {warehouses.length} gudang
                            {lowCount > 0 && <span style={{ color: '#F87171', marginLeft: 8 }}>· {lowCount} produk menipis</span>}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="scm-card">
                    <div className="scm-filter-bar">
                        <div>
                            <label className="scm-label">Cari Produk</label>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Nama atau SKU..."
                                className="scm-input"
                                style={{ width: 220 }}
                            />
                        </div>
                        <div>
                            <label className="scm-label">Status Stok</label>
                            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="scm-select" style={{ width: 150 }}>
                                <option value="">Semua</option>
                                <option value="low">⚠ Menipis</option>
                                <option value="ok">✓ Aman</option>
                            </select>
                        </div>
                        {(search || filterStatus) && (
                            <div style={{ alignSelf: 'flex-end' }}>
                                <button onClick={() => { setSearch(''); setFilterStatus(''); }} className="scm-btn scm-btn-ghost scm-btn-sm" style={{ color: '#F87171' }}>✕ Reset</button>
                            </div>
                        )}
                        <span style={{ marginLeft: 'auto', alignSelf: 'flex-end', fontSize: 12, color: 'var(--color-text-faint)', paddingBottom: 2 }}>
                            {filtered.length} produk ditampilkan
                        </span>
                    </div>

                    <div className="scm-table-responsive">
                        <table className="scm-table">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Produk</th>
                                    {warehouses.map(w => (
                                        <th key={w.id} style={{ textAlign: 'center' }}>{w.name}</th>
                                    ))}
                                    <th style={{ textAlign: 'center' }}>Total</th>
                                    <th style={{ textAlign: 'center' }}>Min.</th>
                                    <th style={{ textAlign: 'center' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={5 + warehouses.length}>
                                        <div className="scm-empty"><div className="scm-empty-title">Tidak ada produk sesuai filter</div></div>
                                    </td></tr>
                                ) : filtered.map(product => (
                                    <tr key={product.id} style={product.is_low_stock ? { background: 'rgba(239,68,68,0.05)' } : {}}>
                                        <td style={{ fontFamily: 'monospace', fontSize: 11.5, color: 'var(--color-text-faint)' }}>{product.sku}</td>
                                        <td style={{ fontWeight: 500 }}>
                                            {product.name}
                                            {product.category && <span style={{ fontSize: 11, color: 'var(--color-text-faint)', display: 'block' }}>{product.category}</span>}
                                        </td>
                                        {warehouses.map(w => {
                                            const qty = product.warehouses?.[w.id] ?? 0;
                                            return (
                                                <td key={w.id} style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 500, color: qty === 0 ? 'var(--color-text-faint)' : 'var(--color-text)' }}>
                                                    {qty}
                                                    <span style={{ fontSize: 10.5, fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--color-text-faint)', marginLeft: 3 }}>{product.unit}</span>
                                                </td>
                                            );
                                        })}
                                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: product.is_low_stock ? '#F87171' : 'var(--color-text)' }}>
                                            {product.total_stock}
                                        </td>
                                        <td style={{ textAlign: 'center', color: 'var(--color-text-faint)' }}>{product.min_stock}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            {product.is_low_stock
                                                ? <span className="scm-badge scm-badge-red">⚠ Menipis</span>
                                                : <span className="scm-badge scm-badge-green">✓ Aman</span>
                                            }
                                        </td>
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
