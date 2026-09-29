import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const icons = {
    box: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
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
    warehouse: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M2 22V12L12 2l10 10v10" /><path d="M2 22h20" /><path d="M9 22V12h6v10" />
        </svg>
    ),
};

export default function Index({ warehouses, stockMatrix }) {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const filtered = stockMatrix.filter(p => {
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku ?? '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || (filterStatus === 'low' ? p.is_low_stock : !p.is_low_stock);
        return matchSearch && matchStatus;
    });

    const lowCount = stockMatrix.filter(p => p.is_low_stock).length;

    const resetFilters = () => {
        setSearch('');
        setFilterStatus('');
        setMobileFilterOpen(false);
    };

    const hasFilter = Boolean(search || filterStatus);
    const drawerFilterCount = [filterStatus].filter(Boolean).length;

    return (
        <AuthenticatedLayout header="Inventori">
            <Head title="Inventori" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Stok per Gudang</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                            <span className="scm-stat-chip scm-stat-chip-green">
                                <strong>{stockMatrix.length}</strong> Total Produk
                            </span>
                            <span className="scm-stat-chip scm-stat-chip-blue">
                                <strong>{warehouses.length}</strong> Gudang Aktif
                            </span>
                            {lowCount > 0 ? (
                                <span className="scm-stat-chip scm-stat-chip-red">
                                    <span className="scm-pulse-dot" />
                                    <strong>{lowCount}</strong> Produk Menipis
                                </span>
                            ) : (
                                <span className="scm-stat-chip scm-stat-chip-green">
                                    ✓ Semua Stok Aman
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* 1. DESKTOP VIEW (Matrix Table)                           */}
                {/* ═════════════════════════════════════════════════════════ */}
                <div className="scm-desktop-view">
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
                            {hasFilter && (
                                <div style={{ alignSelf: 'flex-end' }}>
                                    <button onClick={resetFilters} className="scm-btn scm-btn-ghost scm-btn-sm" style={{ color: '#F87171' }}>✕ Reset</button>
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
                                        <tr key={product.id} className={product.is_low_stock ? 'scm-row-warning' : ''}>
                                            <td>
                                                <span className="scm-sku-chip">{product.sku}</span>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{product.name}</div>
                                                {product.category && <span className="scm-category-badge">{product.category}</span>}
                                            </td>
                                            {warehouses.map(w => {
                                                const qty = product.warehouses?.[w.id] ?? 0;
                                                return (
                                                    <td key={w.id} style={{ textAlign: 'center' }}>
                                                        {qty > 0 ? (
                                                            <span className="scm-qty-pill">
                                                                {qty} <span className="scm-qty-unit">{product.unit}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="scm-qty-zero">
                                                                0 <span className="scm-qty-unit">{product.unit}</span>
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td style={{ textAlign: 'center' }}>
                                                {product.is_low_stock ? (
                                                    <span className="scm-total-low">{product.total_stock}</span>
                                                ) : (
                                                    <span className="scm-total-ok">{product.total_stock}</span>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'center', color: 'var(--color-text-faint)', fontWeight: 500 }}>
                                                {product.min_stock}
                                            </td>
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

                {/* ═════════════════════════════════════════════════════════ */}
                {/* 2. MOBILE VIEW (Smart Filter + Stock Cards)               */}
                {/* ═════════════════════════════════════════════════════════ */}
                <div className="scm-mobile-view">
                    {/* Smart Mobile Filter Bar */}
                    <div className="scm-mobile-filter-container">
                        <div className="scm-mobile-filter-search-row">
                            <div className="scm-mobile-filter-input-wrap">
                                {icons.search}
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari nama atau SKU..."
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
                                    <label className="scm-label">Status Stok</label>
                                    <select
                                        value={filterStatus}
                                        onChange={e => setFilterStatus(e.target.value)}
                                        className="scm-select"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="low">⚠ Stok Menipis</option>
                                        <option value="ok">✓ Stok Aman</option>
                                    </select>
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

                        {/* Active Filter Chips */}
                        {drawerFilterCount > 0 && !mobileFilterOpen && (
                            <div className="scm-filter-pills-row">
                                {filterStatus && (
                                    <span className="scm-filter-pill">
                                        Status: {filterStatus === 'low' ? '⚠ Menipis' : '✓ Aman'}
                                        <button onClick={() => setFilterStatus('')} className="scm-filter-pill-remove">✕</button>
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

                    {/* Mobile Stock Cards List */}
                    {filtered.length === 0 ? (
                        <div className="scm-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
                            <div className="scm-empty-title" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                                {hasFilter ? 'Tidak ada produk sesuai filter' : 'Belum ada data stok'}
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--color-text-faint)', marginTop: 4 }}>
                                Coba ubah kata kunci pencarian atau status stok.
                            </p>
                            {hasFilter && (
                                <button onClick={resetFilters} className="scm-btn scm-btn-secondary scm-btn-sm" style={{ marginTop: 14 }}>
                                    Reset Semua Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="scm-data-card-list">
                            {filtered.map((product) => (
                                <div
                                    key={product.id}
                                    className="scm-data-card"
                                    style={product.is_low_stock ? { borderColor: 'rgba(239, 68, 68, 0.4)', background: 'linear-gradient(180deg, rgba(239,68,68,0.04) 0%, var(--color-surface) 100%)' } : {}}
                                >
                                    {/* Card Header: SKU & Status */}
                                    <div className="scm-data-card-header">
                                        <span className="scm-data-card-code" style={{ fontFamily: 'monospace', fontSize: 13 }}>
                                            {icons.box}
                                            {product.sku}
                                        </span>
                                        {product.is_low_stock
                                            ? <span className="scm-badge scm-badge-red">⚠ Menipis</span>
                                            : <span className="scm-badge scm-badge-green">✓ Aman</span>
                                        }
                                    </div>

                                    {/* Card Body: Product Name & Category */}
                                    <div className="scm-data-card-body">
                                        <div className="scm-data-card-title">
                                            {product.name}
                                        </div>
                                        {product.category && (
                                            <div style={{ fontSize: 12, color: 'var(--color-text-faint)' }}>
                                                {product.category}
                                            </div>
                                        )}

                                        {/* Per-Warehouse Stock Breakdown (Full Name & Clear Stock Indicator) */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                                            {warehouses.map(w => {
                                                const qty = product.warehouses?.[w.id] ?? 0;
                                                const hasStock = qty > 0;
                                                return (
                                                    <div
                                                        key={w.id}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            padding: '8px 12px',
                                                            borderRadius: 'var(--radius)',
                                                            background: hasStock ? 'rgba(147, 215, 140, 0.08)' : 'var(--color-surface-2)',
                                                            border: `1px solid ${hasStock ? 'rgba(147, 215, 140, 0.35)' : 'var(--color-border)'}`,
                                                            transition: 'all var(--transition)',
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                                            <span style={{ color: hasStock ? 'var(--color-secondary)' : 'var(--color-text-faint)', display: 'flex', flexShrink: 0 }}>
                                                                {icons.warehouse}
                                                            </span>
                                                            <span style={{
                                                                fontSize: 13,
                                                                fontWeight: hasStock ? 600 : 400,
                                                                color: hasStock ? 'var(--color-text)' : 'var(--color-text-muted)',
                                                            }}>
                                                                {w.name}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            {hasStock ? (
                                                                <span style={{
                                                                    fontFamily: 'var(--font-heading)',
                                                                    fontWeight: 700,
                                                                    fontSize: 13,
                                                                    color: 'var(--color-secondary)',
                                                                    background: 'rgba(147, 215, 140, 0.18)',
                                                                    padding: '3px 10px',
                                                                    borderRadius: 'var(--radius-sm)',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                }}>
                                                                    {qty} {product.unit}
                                                                </span>
                                                            ) : (
                                                                <span style={{
                                                                    fontSize: 12,
                                                                    color: 'var(--color-text-faint)',
                                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                                    padding: '3px 8px',
                                                                    borderRadius: 'var(--radius-sm)',
                                                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                                                }}>
                                                                    0 {product.unit}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Card Footer: Min Stock & Total Stock */}
                                    <div className="scm-data-card-footer">
                                        <div>
                                            <div className="scm-data-card-amount-label">Min. Stok</div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                                                {product.min_stock} {product.unit}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="scm-data-card-amount-label">Total Stok</div>
                                            <div
                                                className="scm-data-card-amount"
                                                style={{
                                                    fontSize: 18,
                                                    color: product.is_low_stock ? 'var(--color-danger)' : 'var(--color-primary)',
                                                }}
                                            >
                                                {product.total_stock} <span style={{ fontSize: 12, fontWeight: 500 }}>{product.unit}</span>
                                            </div>
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
