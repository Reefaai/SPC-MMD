import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const icons = {
    building: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
    ),
    phone: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
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

export default function Index({ suppliers }) {
    const [showPanel, setShowPanel] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [search, setSearch] = useState('');

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        code: '', name: '', contact: '', address: '',
    });

    const openCreate = () => {
        setEditingSupplier(null);
        reset();
        setShowPanel(true);
    };

    const openEdit = (s) => {
        setEditingSupplier(s);
        setData({
            code: s.code ?? '',
            name: s.name ?? '',
            contact: s.contact ?? '',
            address: s.address ?? '',
        });
        setShowPanel(true);
    };

    const closePanel = () => {
        setShowPanel(false);
        setEditingSupplier(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingSupplier) {
            put(route('suppliers.update', editingSupplier.id), {
                onSuccess: () => closePanel(),
            });
        } else {
            post(route('suppliers.store'), {
                onSuccess: () => closePanel(),
            });
        }
    };

    const deleteSupplier = (id) => {
        if (confirm('Hapus supplier ini?')) {
            destroy(route('suppliers.destroy', id));
        }
    };

    const filteredSuppliers = suppliers.filter(s => {
        if (!search) return true;
        const q = search.toLowerCase();
        const code = (s.code ?? '').toLowerCase();
        const name = (s.name ?? '').toLowerCase();
        const contact = (s.contact ?? '').toLowerCase();
        const address = (s.address ?? '').toLowerCase();
        return code.includes(q) || name.includes(q) || contact.includes(q) || address.includes(q);
    });

    const hasFilter = Boolean(search);

    return (
        <AuthenticatedLayout header="Manajemen Supplier">
            <Head title="Suppliers" />

            {/* Standardized Slide-Over Panel for Add / Edit */}
            {showPanel && (
                <>
                    <div className="scm-panel-overlay" onClick={closePanel} />
                    <div className="scm-panel">
                        <div className="scm-panel-header">
                            <span className="scm-panel-title">
                                {editingSupplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}
                            </span>
                            <button onClick={closePanel} className="scm-btn scm-btn-ghost scm-btn-sm">✕</button>
                        </div>
                        <div className="scm-panel-body">
                            <form id="supplier-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label className="scm-label">Kode Supplier</label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                        className="scm-input"
                                        placeholder="Contoh: SUP-001"
                                        required
                                    />
                                    {errors.code && <p className="scm-form-error">{errors.code}</p>}
                                </div>

                                <div>
                                    <label className="scm-label">Nama Supplier</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="scm-input"
                                        placeholder="Nama supplier / perusahaan..."
                                        required
                                    />
                                    {errors.name && <p className="scm-form-error">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="scm-label">Nomor Kontak / Telepon</label>
                                    <input
                                        type="text"
                                        value={data.contact}
                                        onChange={e => setData('contact', e.target.value)}
                                        className="scm-input"
                                        placeholder="08123456789 atau telepon kantor"
                                    />
                                    {errors.contact && <p className="scm-form-error">{errors.contact}</p>}
                                </div>

                                <div>
                                    <label className="scm-label">Alamat Lengkap</label>
                                    <textarea
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="scm-textarea"
                                        rows="3"
                                        placeholder="Alamat kantor atau gudang supplier..."
                                    />
                                    {errors.address && <p className="scm-form-error">{errors.address}</p>}
                                </div>
                            </form>
                        </div>
                        <div className="scm-panel-footer">
                            <button type="button" onClick={closePanel} className="scm-btn scm-btn-secondary">Batal</button>
                            <button type="submit" form="supplier-form" disabled={processing} className="scm-btn scm-btn-primary">
                                {processing ? 'Menyimpan...' : editingSupplier ? 'Perbarui Supplier' : 'Simpan Supplier'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Supplier</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>
                            {filteredSuppliers.length} dari {suppliers.length} supplier terdaftar
                        </p>
                    </div>
                    <button onClick={openCreate} className="scm-btn scm-btn-primary">
                        {icons.plus}
                        <span>Tambah Supplier</span>
                    </button>
                </div>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* 1. DESKTOP VIEW (Table Grid)                             */}
                {/* ═════════════════════════════════════════════════════════ */}
                <div className="scm-desktop-view">
                    <div className="scm-card">
                        <div className="scm-filter-bar">
                            <div>
                                <label className="scm-label">Cari Supplier</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Nama, kode, atau kontak..."
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
                                {filteredSuppliers.length} supplier ditampilkan
                            </span>
                        </div>

                        <div className="scm-table-responsive">
                            <table className="scm-table">
                                <thead>
                                    <tr>
                                        <th>Kode</th>
                                        <th>Nama Supplier</th>
                                        <th>Kontak</th>
                                        <th>Alamat</th>
                                        <th style={{ textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSuppliers.length === 0 ? (
                                        <tr><td colSpan="5"><div className="scm-empty"><div className="scm-empty-title">Tidak ada supplier sesuai filter</div></div></td></tr>
                                    ) : filteredSuppliers.map(s => (
                                        <tr key={s.id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-secondary)', fontWeight: 600 }}>{s.code}</td>
                                            <td style={{ fontWeight: 500 }}>{s.name}</td>
                                            <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{s.contact ?? '—'}</td>
                                            <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{s.address ?? '—'}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                    <button onClick={() => openEdit(s)} className="scm-btn scm-btn-secondary scm-btn-sm">Edit</button>
                                                    <button onClick={() => deleteSupplier(s.id)} className="scm-btn scm-btn-danger scm-btn-sm">Hapus</button>
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
                {/* 2. MOBILE VIEW (Smart Filter + Supplier Cards)            */}
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
                                    placeholder="Cari nama, kode, atau kontak..."
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

                    {/* Mobile Supplier Cards List */}
                    {filteredSuppliers.length === 0 ? (
                        <div className="scm-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
                            <div className="scm-empty-title" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                                {hasFilter ? 'Tidak ada supplier sesuai filter' : 'Belum ada supplier'}
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--color-text-faint)', marginTop: 4 }}>
                                {hasFilter ? 'Coba ubah kata kunci pencarian.' : 'Mulai tambahkan supplier pertama Anda.'}
                            </p>
                            {hasFilter ? (
                                <button onClick={() => setSearch('')} className="scm-btn scm-btn-secondary scm-btn-sm" style={{ marginTop: 14 }}>
                                    Reset Pencarian
                                </button>
                            ) : (
                                <button onClick={openCreate} className="scm-btn scm-btn-primary scm-btn-sm" style={{ marginTop: 14 }}>
                                    + Tambah Supplier Baru
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="scm-data-card-list">
                            {filteredSuppliers.map((s) => (
                                <div key={s.id} className="scm-data-card">
                                    {/* Card Header: Code */}
                                    <div className="scm-data-card-header">
                                        <span className="scm-data-card-code" style={{ fontFamily: 'monospace', fontSize: 13 }}>
                                            {icons.building}
                                            {s.code}
                                        </span>
                                    </div>

                                    {/* Card Body: Supplier Name & Contact */}
                                    <div className="scm-data-card-body">
                                        <div className="scm-data-card-title">
                                            {s.name}
                                        </div>
                                        <div className="scm-data-card-meta" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                                            {s.contact && (
                                                <span className="scm-data-card-meta-item">
                                                    {icons.phone}
                                                    <a
                                                        href={`tel:${s.contact}`}
                                                        style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 500 }}
                                                    >
                                                        {s.contact}
                                                    </a>
                                                </span>
                                            )}
                                            {s.address && (
                                                <span className="scm-data-card-meta-item" style={{ alignItems: 'flex-start' }}>
                                                    <span style={{ marginTop: 2 }}>{icons.mapPin}</span>
                                                    <span style={{ color: 'var(--color-text-muted)' }}>{s.address}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Footer: Actions */}
                                    <div className="scm-data-card-footer" style={{ justifyContent: 'flex-end', gap: 8 }}>
                                        <button
                                            type="button"
                                            onClick={() => openEdit(s)}
                                            className="scm-btn scm-btn-secondary scm-btn-sm"
                                            style={{ padding: '6px 12px', fontSize: 12 }}
                                        >
                                            {icons.edit}
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteSupplier(s.id)}
                                            className="scm-btn scm-btn-danger scm-btn-sm"
                                            style={{ padding: '6px 10px', fontSize: 12 }}
                                            title="Hapus Supplier"
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
