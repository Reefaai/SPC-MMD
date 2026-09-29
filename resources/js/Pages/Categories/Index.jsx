import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const icons = {
    tag: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    ),
    box: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M12 22l-8-4V6l8-4 8 4v12z" />
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

export default function Index({ categories }) {
    const [showPanel, setShowPanel] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [search, setSearch] = useState('');

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({ name: '' });

    const openCreate = () => {
        setEditingCategory(null);
        reset();
        setShowPanel(true);
    };

    const openEdit = (c) => {
        setEditingCategory(c);
        setData({ name: c.name });
        setShowPanel(true);
    };

    const closePanel = () => {
        setShowPanel(false);
        setEditingCategory(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('categories.update', editingCategory.id), {
                onSuccess: () => closePanel(),
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => closePanel(),
            });
        }
    };

    const deleteCategory = (id) => {
        if (confirm('Hapus kategori ini?')) {
            destroy(route('categories.destroy', id));
        }
    };

    const filteredCategories = categories.filter(c => {
        if (!search) return true;
        return c.name.toLowerCase().includes(search.toLowerCase());
    });

    const hasFilter = Boolean(search);

    return (
        <AuthenticatedLayout header="Kategori Produk">
            <Head title="Categories" />

            {/* Standardized Slide-Over Panel for Add / Edit */}
            {showPanel && (
                <>
                    <div className="scm-panel-overlay" onClick={closePanel} />
                    <div className="scm-panel">
                        <div className="scm-panel-header">
                            <span className="scm-panel-title">
                                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                            </span>
                            <button onClick={closePanel} className="scm-btn scm-btn-ghost scm-btn-sm">✕</button>
                        </div>
                        <div className="scm-panel-body">
                            <form id="category-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label className="scm-label">Nama Kategori</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="scm-input"
                                        placeholder="Elektronik, Furniture, Aksesoris, dll"
                                        required
                                    />
                                    {errors.name && <p className="scm-form-error">{errors.name}</p>}
                                </div>
                            </form>
                        </div>
                        <div className="scm-panel-footer">
                            <button type="button" onClick={closePanel} className="scm-btn scm-btn-secondary">Batal</button>
                            <button type="submit" form="category-form" disabled={processing} className="scm-btn scm-btn-primary">
                                {processing ? 'Menyimpan...' : editingCategory ? 'Perbarui Kategori' : 'Simpan Kategori'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Kategori Produk</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>
                            {filteredCategories.length} dari {categories.length} kategori terdaftar
                        </p>
                    </div>
                    <button onClick={openCreate} className="scm-btn scm-btn-primary">
                        {icons.plus}
                        <span>Tambah Kategori</span>
                    </button>
                </div>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* 1. DESKTOP VIEW (Table Grid)                             */}
                {/* ═════════════════════════════════════════════════════════ */}
                <div className="scm-desktop-view">
                    <div className="scm-card">
                        <div className="scm-filter-bar">
                            <div>
                                <label className="scm-label">Cari Kategori</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Nama kategori..."
                                    className="scm-input"
                                    style={{ width: 220 }}
                                />
                            </div>
                            {hasFilter && (
                                <div style={{ alignSelf: 'flex-end' }}>
                                    <button onClick={() => setSearch('')} className="scm-btn scm-btn-ghost scm-btn-sm" style={{ color: '#F87171' }}>✕ Reset</button>
                                </div>
                            )}
                            <span style={{ marginLeft: 'auto', alignSelf: 'flex-end', fontSize: 12, color: 'var(--color-text-faint)', paddingBottom: 2 }}>
                                {filteredCategories.length} kategori ditampilkan
                            </span>
                        </div>

                        <div className="scm-table-responsive">
                            <table className="scm-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nama Kategori</th>
                                        <th style={{ textAlign: 'center' }}>Jumlah Produk</th>
                                        <th style={{ textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.length === 0 ? (
                                        <tr><td colSpan="4"><div className="scm-empty"><div className="scm-empty-title">Tidak ada kategori sesuai filter</div></div></td></tr>
                                    ) : filteredCategories.map((c, i) => (
                                        <tr key={c.id}>
                                            <td style={{ color: 'var(--color-text-faint)', fontSize: 12 }}>{i + 1}</td>
                                            <td style={{ fontWeight: 500 }}>{c.name}</td>
                                            <td style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                <span className="scm-badge scm-badge-indigo">{c.products_count ?? 0} produk</span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                    <button onClick={() => openEdit(c)} className="scm-btn scm-btn-secondary scm-btn-sm">Edit</button>
                                                    <button onClick={() => deleteCategory(c.id)} className="scm-btn scm-btn-danger scm-btn-sm">Hapus</button>
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
                {/* 2. MOBILE VIEW (Smart Filter + Category Cards)            */}
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
                                    placeholder="Cari nama kategori..."
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

                    {/* Mobile Category Cards List */}
                    {filteredCategories.length === 0 ? (
                        <div className="scm-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
                            <div className="scm-empty-title" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                                {hasFilter ? 'Tidak ada kategori sesuai filter' : 'Belum ada kategori'}
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--color-text-faint)', marginTop: 4 }}>
                                {hasFilter ? 'Coba ubah kata kunci pencarian.' : 'Mulai tambahkan kategori pertama Anda.'}
                            </p>
                            {hasFilter ? (
                                <button onClick={() => setSearch('')} className="scm-btn scm-btn-secondary scm-btn-sm" style={{ marginTop: 14 }}>
                                    Reset Pencarian
                                </button>
                            ) : (
                                <button onClick={openCreate} className="scm-btn scm-btn-primary scm-btn-sm" style={{ marginTop: 14 }}>
                                    + Tambah Kategori Baru
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="scm-data-card-list">
                            {filteredCategories.map((c, i) => (
                                <div key={c.id} className="scm-data-card">
                                    {/* Card Header: Tag & Count */}
                                    <div className="scm-data-card-header">
                                        <span className="scm-data-card-code" style={{ fontSize: 13 }}>
                                            {icons.tag}
                                            #{i + 1}
                                        </span>
                                        <span className="scm-badge scm-badge-indigo" style={{ fontSize: 11 }}>
                                            {c.products_count ?? 0} produk
                                        </span>
                                    </div>

                                    {/* Card Body: Category Name */}
                                    <div className="scm-data-card-body">
                                        <div className="scm-data-card-title">
                                            {c.name}
                                        </div>
                                    </div>

                                    {/* Card Footer: Actions */}
                                    <div className="scm-data-card-footer" style={{ justifyContent: 'flex-end', gap: 8 }}>
                                        <button
                                            type="button"
                                            onClick={() => openEdit(c)}
                                            className="scm-btn scm-btn-secondary scm-btn-sm"
                                            style={{ padding: '6px 12px', fontSize: 12 }}
                                        >
                                            {icons.edit}
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteCategory(c.id)}
                                            className="scm-btn scm-btn-danger scm-btn-sm"
                                            style={{ padding: '6px 10px', fontSize: 12 }}
                                            title="Hapus Kategori"
                                        >
                                            {icons.trash}
                                        </button>
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
