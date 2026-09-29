import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const icons = {
    box: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <path d="M12 22l-8-4V6l8-4 8 4v12z" />
        </svg>
    ),
    tag: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
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
    plus: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
    ),
    edit: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
    trash: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    ),
};

const fmt = (v) => `Rp ${Number(v ?? 0).toLocaleString('id-ID')}`;

export default function Index({ products, categories }) {
    const [showPanel, setShowPanel] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        category_id: '', sku: '', name: '', unit: '', min_stock: 0, price: 0,
    });

    const openCreate = () => {
        setEditingProduct(null);
        reset();
        setShowPanel(true);
    };

    const openEdit = (p) => {
        setEditingProduct(p);
        setData({
            category_id: p.category_id ?? '',
            sku: p.sku ?? '',
            name: p.name ?? '',
            unit: p.unit ?? '',
            min_stock: p.min_stock ?? 0,
            price: p.price ?? 0,
        });
        setShowPanel(true);
    };

    const closePanel = () => {
        setShowPanel(false);
        setEditingProduct(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            put(route('products.update', editingProduct.id), {
                onSuccess: () => closePanel(),
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => closePanel(),
            });
        }
    };

    const deleteProduct = (id) => {
        if (confirm('Hapus produk ini?')) {
            destroy(route('products.destroy', id));
        }
    };

    const filtered = products.filter(p => {
        if (filterCategory && String(p.category_id) !== String(filterCategory)) return false;
        if (search) {
            const q = search.toLowerCase();
            const matchName = (p.name ?? '').toLowerCase().includes(q);
            const matchSku = (p.sku ?? '').toLowerCase().includes(q);
            if (!matchName && !matchSku) return false;
        }
        return true;
    });

    const resetFilters = () => {
        setSearch('');
        setFilterCategory('');
        setMobileFilterOpen(false);
    };

    const hasFilter = Boolean(search || filterCategory);
    const drawerFilterCount = [filterCategory].filter(Boolean).length;

    return (
        <AuthenticatedLayout header="Manajemen Produk">
            <Head title="Products" />

            {/* Standardized Slide-Over Panel for Add / Edit */}
            {showPanel && (
                <>
                    <div className="scm-panel-overlay" onClick={closePanel} />
                    <div className="scm-panel">
                        <div className="scm-panel-header">
                            <span className="scm-panel-title">
                                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                            </span>
                            <button onClick={closePanel} className="scm-btn scm-btn-ghost scm-btn-sm">✕</button>
                        </div>
                        <div className="scm-panel-body">
                            <form id="product-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label className="scm-label">Kategori Produk</label>
                                    <select
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="scm-select"
                                    >
                                        <option value="">-- Tanpa Kategori --</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    {errors.category_id && <p className="scm-form-error">{errors.category_id}</p>}
                                </div>

                                <div>
                                    <label className="scm-label">Kode SKU</label>
                                    <input
                                        type="text"
                                        value={data.sku}
                                        onChange={e => setData('sku', e.target.value)}
                                        className="scm-input"
                                        placeholder="Contoh: SKU-001"
                                        required
                                    />
                                    {errors.sku && <p className="scm-form-error">{errors.sku}</p>}
                                </div>

                                <div>
                                    <label className="scm-label">Nama Produk</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="scm-input"
                                        placeholder="Nama produk lengkap..."
                                        required
                                    />
                                    {errors.name && <p className="scm-form-error">{errors.name}</p>}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div>
                                        <label className="scm-label">Satuan</label>
                                        <input
                                            type="text"
                                            value={data.unit}
                                            onChange={e => setData('unit', e.target.value)}
                                            className="scm-input"
                                            placeholder="pcs / kg / box"
                                            required
                                        />
                                        {errors.unit && <p className="scm-form-error">{errors.unit}</p>}
                                    </div>
                                    <div>
                                        <label className="scm-label">Stok Minimum</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.min_stock}
                                            onChange={e => setData('min_stock', e.target.value)}
                                            className="scm-input"
                                        />
                                        {errors.min_stock && <p className="scm-form-error">{errors.min_stock}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="scm-label">Harga Satuan (Rp)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        className="scm-input"
                                        placeholder="0"
                                    />
                                    {errors.price && <p className="scm-form-error">{errors.price}</p>}
                                </div>
                            </form>
                        </div>
                        <div className="scm-panel-footer">
                            <button type="button" onClick={closePanel} className="scm-btn scm-btn-secondary">Batal</button>
                            <button type="submit" form="product-form" disabled={processing} className="scm-btn scm-btn-primary">
                                {processing ? 'Menyimpan...' : editingProduct ? 'Perbarui Produk' : 'Simpan Produk'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Produk</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>
                            {filtered.length} dari {products.length} produk terdaftar
                        </p>
                    </div>
                    <button onClick={openCreate} className="scm-btn scm-btn-primary">
                        {icons.plus}
                        <span>Tambah Produk</span>
                    </button>
                </div>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* 1. DESKTOP VIEW (Table Grid)                             */}
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
                                <label className="scm-label">Kategori</label>
                                <select
                                    value={filterCategory}
                                    onChange={e => setFilterCategory(e.target.value)}
                                    className="scm-select"
                                    style={{ width: 180 }}
                                >
                                    <option value="">Semua Kategori</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
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
                                        <th>SKU</th>
                                        <th>Nama Produk</th>
                                        <th>Kategori</th>
                                        <th>Satuan</th>
                                        <th style={{ textAlign: 'right' }}>Harga</th>
                                        <th style={{ textAlign: 'center' }}>Min. Stok</th>
                                        <th style={{ textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan="7"><div className="scm-empty"><div className="scm-empty-title">Tidak ada produk sesuai filter</div></div></td></tr>
                                    ) : filtered.map(p => (
                                        <tr key={p.id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-secondary)', fontWeight: 600 }}>{p.sku}</td>
                                            <td style={{ fontWeight: 500 }}>{p.name}</td>
                                            <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{p.category?.name ?? '—'}</td>
                                            <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{p.unit}</td>
                                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{fmt(p.price)}</td>
                                            <td style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>{p.min_stock}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                    <button onClick={() => openEdit(p)} className="scm-btn scm-btn-secondary scm-btn-sm">Edit</button>
                                                    <button onClick={() => deleteProduct(p.id)} className="scm-btn scm-btn-danger scm-btn-sm">Hapus</button>
                                                </div>
                                            </td>
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
                                    <label className="scm-label">Kategori</label>
                                    <select
                                        value={filterCategory}
                                        onChange={e => setFilterCategory(e.target.value)}
                                        className="scm-select"
                                    >
                                        <option value="">Semua Kategori</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                                {filterCategory && (
                                    <span className="scm-filter-pill">
                                        Kategori: {categories.find(c => String(c.id) === String(filterCategory))?.name ?? '—'}
                                        <button onClick={() => setFilterCategory('')} className="scm-filter-pill-remove">✕</button>
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

                    {/* Mobile Product Cards List */}
                    {filtered.length === 0 ? (
                        <div className="scm-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
                            <div className="scm-empty-title" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                                {hasFilter ? 'Tidak ada produk sesuai filter' : 'Belum ada produk'}
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--color-text-faint)', marginTop: 4 }}>
                                {hasFilter ? 'Coba ubah kata kunci pencarian atau kategori.' : 'Mulai tambahkan produk baru.'}
                            </p>
                            {hasFilter ? (
                                <button onClick={resetFilters} className="scm-btn scm-btn-secondary scm-btn-sm" style={{ marginTop: 14 }}>
                                    Reset Semua Filter
                                </button>
                            ) : (
                                <button onClick={openCreate} className="scm-btn scm-btn-primary scm-btn-sm" style={{ marginTop: 14 }}>
                                    + Tambah Produk Baru
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="scm-data-card-list">
                            {filtered.map((p) => (
                                <div key={p.id} className="scm-data-card">
                                    {/* Card Header: SKU & Category */}
                                    <div className="scm-data-card-header">
                                        <span className="scm-data-card-code" style={{ fontFamily: 'monospace', fontSize: 13 }}>
                                            {icons.box}
                                            {p.sku}
                                        </span>
                                        <span className="scm-badge scm-badge-gray" style={{ fontSize: 11 }}>
                                            {p.category?.name ?? 'Tanpa Kategori'}
                                        </span>
                                    </div>

                                    {/* Card Body: Product Name & Meta */}
                                    <div className="scm-data-card-body">
                                        <div className="scm-data-card-title">
                                            {p.name}
                                        </div>
                                        <div className="scm-data-card-meta">
                                            <span className="scm-data-card-meta-item">
                                                Satuan: <strong style={{ color: 'var(--color-text)' }}>{p.unit}</strong>
                                            </span>
                                            <span className="scm-data-card-meta-item">
                                                Min. Stok: <strong style={{ color: 'var(--color-text)' }}>{p.min_stock}</strong>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Footer: Price & Actions */}
                                    <div className="scm-data-card-footer">
                                        <div>
                                            <div className="scm-data-card-amount-label">Harga Satuan</div>
                                            <div className="scm-data-card-amount" style={{ fontSize: 16 }}>{fmt(p.price)}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button
                                                type="button"
                                                onClick={() => openEdit(p)}
                                                className="scm-btn scm-btn-secondary scm-btn-sm"
                                                style={{ padding: '6px 10px', fontSize: 12 }}
                                                title="Edit Produk"
                                            >
                                                {icons.edit}
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteProduct(p.id)}
                                                className="scm-btn scm-btn-danger scm-btn-sm"
                                                style={{ padding: '6px 10px', fontSize: 12 }}
                                                title="Hapus Produk"
                                            >
                                                {icons.trash}
                                            </button>
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
