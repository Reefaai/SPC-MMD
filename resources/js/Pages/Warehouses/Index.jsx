import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const icons = {
    warehouse: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <path d="M2 22V12L12 2l10 10v10" /><path d="M2 22h20" /><path d="M9 22V12h6v10" />
        </svg>
    ),
    mapPin: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
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

export default function Index({ warehouses }) {
    const [showPanel, setShowPanel] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [search, setSearch] = useState('');

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        code: '', name: '', location: '',
    });

    const openCreate = () => {
        setEditingWarehouse(null);
        reset();
        setShowPanel(true);
    };

    const openEdit = (w) => {
        setEditingWarehouse(w);
        setData({
            code: w.code ?? '',
            name: w.name ?? '',
            location: w.location ?? '',
        });
        setShowPanel(true);
    };

    const closePanel = () => {
        setShowPanel(false);
        setEditingWarehouse(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingWarehouse) {
            put(route('warehouses.update', editingWarehouse.id), {
                onSuccess: () => closePanel(),
            });
        } else {
            post(route('warehouses.store'), {
                onSuccess: () => closePanel(),
            });
        }
    };

    const deleteWarehouse = (id) => {
        if (confirm('Hapus gudang ini?')) {
            destroy(route('warehouses.destroy', id));
        }
    };

    const filteredWarehouses = warehouses.filter(w => {
        if (!search) return true;
        const q = search.toLowerCase();
        const code = (w.code ?? '').toLowerCase();
        const name = (w.name ?? '').toLowerCase();
        const loc = (w.location ?? '').toLowerCase();
        return code.includes(q) || name.includes(q) || loc.includes(q);
    });

    const hasFilter = Boolean(search);

    return (
        <AuthenticatedLayout header="Manajemen Gudang">
            <Head title="Warehouses" />

            {/* Standardized Slide-Over Panel for Add / Edit */}
            {showPanel && (
                <>
                    <div className="scm-panel-overlay" onClick={closePanel} />
                    <div className="scm-panel">
                        <div className="scm-panel-header">
                            <span className="scm-panel-title">
                                {editingWarehouse ? 'Edit Gudang' : 'Tambah Gudang Baru'}
                            </span>
                            <button onClick={closePanel} className="scm-btn scm-btn-ghost scm-btn-sm">✕</button>
                        </div>
                        <div className="scm-panel-body">
                            <form id="warehouse-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label className="scm-label">Kode Gudang</label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                        className="scm-input"
                                        placeholder="Contoh: GDG-001"
                                        required
                                    />
                                    {errors.code && <p className="scm-form-error">{errors.code}</p>}
                                </div>

                                <div>
                                    <label className="scm-label">Nama Gudang</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="scm-input"
                                        placeholder="Nama gudang (misal: Gudang Utama)"
                                        required
                                    />
                                    {errors.name && <p className="scm-form-error">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="scm-label">Lokasi / Wilayah</label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className="scm-input"
                                        placeholder="Kota atau alamat gudang..."
                                    />
                                    {errors.location && <p className="scm-form-error">{errors.location}</p>}
                                </div>
                            </form>
                        </div>
                        <div className="scm-panel-footer">
                            <button type="button" onClick={closePanel} className="scm-btn scm-btn-secondary">Batal</button>
                            <button type="submit" form="warehouse-form" disabled={processing} className="scm-btn scm-btn-primary">
                                {processing ? 'Menyimpan...' : editingWarehouse ? 'Perbarui Gudang' : 'Simpan Gudang'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Gudang</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>
                            {filteredWarehouses.length} dari {warehouses.length} gudang terdaftar
                        </p>
                    </div>
                    <button onClick={openCreate} className="scm-btn scm-btn-primary">
                        {icons.plus}
                        <span>Tambah Gudang</span>
                    </button>
                </div>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* 1. DESKTOP VIEW (Table Grid)                             */}
                {/* ═════════════════════════════════════════════════════════ */}
                <div className="scm-desktop-view">
                    <div className="scm-card">
                        <div className="scm-filter-bar">
                            <div>
                                <label className="scm-label">Cari Gudang</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Nama, kode, atau lokasi..."
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
                                {filteredWarehouses.length} gudang ditampilkan
                            </span>
                        </div>

                        <div className="scm-table-responsive">
                            <table className="scm-table">
                                <thead>
                                    <tr>
                                        <th>Kode</th>
                                        <th>Nama Gudang</th>
                                        <th>Lokasi</th>
                                        <th style={{ textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredWarehouses.length === 0 ? (
                                        <tr><td colSpan="4"><div className="scm-empty"><div className="scm-empty-title">Tidak ada gudang sesuai filter</div></div></td></tr>
                                    ) : filteredWarehouses.map(w => (
                                        <tr key={w.id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-secondary)', fontWeight: 600 }}>{w.code}</td>
                                            <td style={{ fontWeight: 500 }}>{w.name}</td>
                                            <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{w.location ?? '—'}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                    <button onClick={() => openEdit(w)} className="scm-btn scm-btn-secondary scm-btn-sm">Edit</button>
                                                    <button onClick={() => deleteWarehouse(w.id)} className="scm-btn scm-btn-danger scm-btn-sm">Hapus</button>
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
                {/* 2. MOBILE VIEW (Smart Filter + Warehouse Cards)           */}
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
                                    placeholder="Cari nama, kode, atau lokasi..."
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

                    {/* Mobile Warehouse Cards List */}
                    {filteredWarehouses.length === 0 ? (
                        <div className="scm-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
                            <div className="scm-empty-title" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                                {hasFilter ? 'Tidak ada gudang sesuai filter' : 'Belum ada gudang'}
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--color-text-faint)', marginTop: 4 }}>
                                {hasFilter ? 'Coba ubah kata kunci pencarian.' : 'Mulai tambahkan gudang pertama Anda.'}
                            </p>
                            {hasFilter ? (
                                <button onClick={() => setSearch('')} className="scm-btn scm-btn-secondary scm-btn-sm" style={{ marginTop: 14 }}>
                                    Reset Pencarian
                                </button>
                            ) : (
                                <button onClick={openCreate} className="scm-btn scm-btn-primary scm-btn-sm" style={{ marginTop: 14 }}>
                                    + Tambah Gudang Baru
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="scm-data-card-list">
                            {filteredWarehouses.map((w) => (
                                <div key={w.id} className="scm-data-card">
                                    {/* Card Header: Code */}
                                    <div className="scm-data-card-header">
                                        <span className="scm-data-card-code" style={{ fontFamily: 'monospace', fontSize: 13 }}>
                                            {icons.warehouse}
                                            {w.code}
                                        </span>
                                    </div>

                                    {/* Card Body: Name & Location */}
                                    <div className="scm-data-card-body">
                                        <div className="scm-data-card-title">
                                            {w.name}
                                        </div>
                                        {w.location && (
                                            <div className="scm-data-card-meta">
                                                <span className="scm-data-card-meta-item">
                                                    {icons.mapPin}
                                                    {w.location}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Footer: Actions */}
                                    <div className="scm-data-card-footer" style={{ justifyContent: 'flex-end', gap: 8 }}>
                                        <button
                                            type="button"
                                            onClick={() => openEdit(w)}
                                            className="scm-btn scm-btn-secondary scm-btn-sm"
                                            style={{ padding: '6px 12px', fontSize: 12 }}
                                        >
                                            {icons.edit}
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteWarehouse(w.id)}
                                            className="scm-btn scm-btn-danger scm-btn-sm"
                                            style={{ padding: '6px 10px', fontSize: 12 }}
                                            title="Hapus Gudang"
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
