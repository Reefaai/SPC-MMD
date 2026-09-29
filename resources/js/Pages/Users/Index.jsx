import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const ROLE_BADGE = {
    Admin:       'scm-badge scm-badge-purple',
    Procurement: 'scm-badge scm-badge-blue',
    Gudang:      'scm-badge scm-badge-green',
    Sales:       'scm-badge scm-badge-yellow',
};

const icons = {
    search: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    filter: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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
    mail: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    ),
    calendar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
};

function UserPanel({ title, onClose, children }) {
    return (
        <>
            <div className="scm-panel-overlay" onClick={onClose} />
            <div className="scm-panel">
                <div className="scm-panel-header">
                    <span className="scm-panel-title">{title}</span>
                    <button onClick={onClose} className="scm-btn scm-btn-ghost scm-btn-sm">✕</button>
                </div>
                {children}
            </div>
        </>
    );
}

export default function Index({ users, roles }) {
    const { auth } = usePage().props;
    const currentUserId = auth.user.id;

    const [createOpen, setCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const createForm = useForm({ name: '', email: '', password: '', password_confirmation: '', role_id: '' });
    const editForm   = useForm({ name: '', email: '', role_id: '' });

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('users.store'), {
            onSuccess: () => { createForm.reset(); setCreateOpen(false); },
        });
    };

    const openEdit = (user) => {
        setEditingUser(user);
        editForm.setData({ name: user.name, email: user.email, role_id: user.role?.id ?? '' });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route('users.update', editingUser.id), {
            onSuccess: () => { editForm.reset(); setEditingUser(null); },
        });
    };

    const deleteUser = (u) => {
        if (confirm(`Hapus pengguna ${u.name}?`)) {
            useForm().delete(route('users.destroy', u.id));
        }
    };

    const filteredUsers = users.filter(u => {
        if (filterRole && String(u.role_id) !== String(filterRole) && u.role?.name !== filterRole) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        const name = (u.name ?? '').toLowerCase();
        const email = (u.email ?? '').toLowerCase();
        return name.includes(q) || email.includes(q);
    });

    const resetFilters = () => {
        setSearch('');
        setFilterRole('');
        setMobileFilterOpen(false);
    };

    const hasFilter = Boolean(search || filterRole);
    const drawerFilterCount = [filterRole].filter(Boolean).length;

    return (
        <AuthenticatedLayout header="Manajemen User">
            <Head title="Users" />

            {/* Create Panel */}
            {createOpen && (
                <UserPanel title="Tambah User Baru" onClose={() => setCreateOpen(false)}>
                    <div className="scm-panel-body">
                        <form id="create-user-form" onSubmit={submitCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label className="scm-label">Nama Lengkap</label>
                                <input type="text" value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} className="scm-input" required />
                                {createForm.errors.name && <p className="scm-form-error">{createForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="scm-label">Email</label>
                                <input type="email" value={createForm.data.email} onChange={e => createForm.setData('email', e.target.value)} className="scm-input" required />
                                {createForm.errors.email && <p className="scm-form-error">{createForm.errors.email}</p>}
                            </div>
                            <div>
                                <label className="scm-label">Role</label>
                                <select value={createForm.data.role_id} onChange={e => createForm.setData('role_id', e.target.value)} className="scm-select" required>
                                    <option value="">-- Pilih Role --</option>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                                {createForm.errors.role_id && <p className="scm-form-error">{createForm.errors.role_id}</p>}
                            </div>
                            <div>
                                <label className="scm-label">Password</label>
                                <input type="password" value={createForm.data.password} onChange={e => createForm.setData('password', e.target.value)} className="scm-input" required />
                            </div>
                            <div>
                                <label className="scm-label">Konfirmasi Password</label>
                                <input type="password" value={createForm.data.password_confirmation} onChange={e => createForm.setData('password_confirmation', e.target.value)} className="scm-input" required />
                                {createForm.errors.password && <p className="scm-form-error">{createForm.errors.password}</p>}
                            </div>
                        </form>
                    </div>
                    <div className="scm-panel-footer">
                        <button onClick={() => setCreateOpen(false)} className="scm-btn scm-btn-secondary">Batal</button>
                        <button form="create-user-form" type="submit" disabled={createForm.processing} className="scm-btn scm-btn-primary">
                            {createForm.processing ? 'Menyimpan...' : 'Buat User'}
                        </button>
                    </div>
                </UserPanel>
            )}

            {/* Edit Panel */}
            {editingUser && (
                <UserPanel title={`Edit: ${editingUser.name}`} onClose={() => setEditingUser(null)}>
                    <div className="scm-panel-body">
                        <form id="edit-user-form" onSubmit={submitEdit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label className="scm-label">Nama Lengkap</label>
                                <input type="text" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} className="scm-input" required />
                            </div>
                            <div>
                                <label className="scm-label">Email</label>
                                <input type="email" value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} className="scm-input" required />
                            </div>
                            <div>
                                <label className="scm-label">Role</label>
                                <select value={editForm.data.role_id} onChange={e => editForm.setData('role_id', e.target.value)} className="scm-select" required>
                                    <option value="">-- Pilih Role --</option>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="scm-panel-footer">
                        <button onClick={() => setEditingUser(null)} className="scm-btn scm-btn-secondary">Batal</button>
                        <button form="edit-user-form" type="submit" disabled={editForm.processing} className="scm-btn scm-btn-primary">
                            {editForm.processing ? 'Menyimpan...' : 'Perbarui'}
                        </button>
                    </div>
                </UserPanel>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header */}
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Manajemen User</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>
                            {filteredUsers.length} dari {users.length} user terdaftar
                        </p>
                    </div>
                    <button onClick={() => setCreateOpen(true)} className="scm-btn scm-btn-primary">
                        {icons.plus}
                        <span>Tambah User</span>
                    </button>
                </div>

                {/* ═════════════════════════════════════════════════════════ */}
                {/* 1. DESKTOP VIEW (Table Grid)                             */}
                {/* ═════════════════════════════════════════════════════════ */}
                <div className="scm-desktop-view">
                    <div className="scm-card">
                        <div className="scm-filter-bar">
                            <div>
                                <label className="scm-label">Cari User</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Nama atau email..."
                                    className="scm-input"
                                    style={{ width: 220 }}
                                />
                            </div>
                            <div>
                                <label className="scm-label">Role</label>
                                <select
                                    value={filterRole}
                                    onChange={e => setFilterRole(e.target.value)}
                                    className="scm-select"
                                    style={{ width: 160 }}
                                >
                                    <option value="">Semua Role</option>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            {hasFilter && (
                                <div style={{ alignSelf: 'flex-end' }}>
                                    <button onClick={resetFilters} className="scm-btn scm-btn-ghost scm-btn-sm" style={{ color: '#F87171' }}>✕ Reset</button>
                                </div>
                            )}
                            <span style={{ marginLeft: 'auto', alignSelf: 'flex-end', fontSize: 12, color: 'var(--color-text-faint)', paddingBottom: 2 }}>
                                {filteredUsers.length} user ditampilkan
                            </span>
                        </div>

                        <div className="scm-table-responsive">
                            <table className="scm-table">
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Bergabung</th>
                                        <th style={{ textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr><td colSpan="5"><div className="scm-empty"><div className="scm-empty-title">Tidak ada user sesuai filter</div></div></td></tr>
                                    ) : filteredUsers.map(u => (
                                        <tr key={u.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div className="scm-avatar" style={{ width: 28, height: 28, fontSize: 11, flexShrink: 0 }}>
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 500 }}>{u.name}</div>
                                                        {u.id === currentUserId && <div style={{ fontSize: 10.5, color: 'var(--color-primary)', fontWeight: 600 }}>Anda</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{u.email}</td>
                                            <td><span className={ROLE_BADGE[u.role?.name] ?? 'scm-badge scm-badge-gray'}>{u.role?.name ?? '—'}</span></td>
                                            <td style={{ color: 'var(--color-text-faint)', fontSize: 12 }}>
                                                {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                    <button onClick={() => openEdit(u)} className="scm-btn scm-btn-secondary scm-btn-sm">Edit</button>
                                                    {u.id !== currentUserId && (
                                                        <button onClick={() => deleteUser(u)} className="scm-btn scm-btn-danger scm-btn-sm">Hapus</button>
                                                    )}
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
                {/* 2. MOBILE VIEW (Smart Filter + User Cards)                */}
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
                                    placeholder="Cari nama atau email..."
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
                                    <label className="scm-label">Role Pengguna</label>
                                    <select
                                        value={filterRole}
                                        onChange={e => setFilterRole(e.target.value)}
                                        className="scm-select"
                                    >
                                        <option value="">Semua Role</option>
                                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
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
                                {filterRole && (
                                    <span className="scm-filter-pill">
                                        Role: {roles.find(r => String(r.id) === String(filterRole))?.name ?? '—'}
                                        <button onClick={() => setFilterRole('')} className="scm-filter-pill-remove">✕</button>
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

                    {/* Mobile User Cards List */}
                    {filteredUsers.length === 0 ? (
                        <div className="scm-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
                            <div className="scm-empty-title" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                                {hasFilter ? 'Tidak ada user sesuai filter' : 'Belum ada pengguna'}
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--color-text-faint)', marginTop: 4 }}>
                                {hasFilter ? 'Coba ubah kata kunci pencarian atau role.' : 'Mulai tambahkan pengguna baru.'}
                            </p>
                            {hasFilter ? (
                                <button onClick={resetFilters} className="scm-btn scm-btn-secondary scm-btn-sm" style={{ marginTop: 14 }}>
                                    Reset Semua Filter
                                </button>
                            ) : (
                                <button onClick={() => setCreateOpen(true)} className="scm-btn scm-btn-primary scm-btn-sm" style={{ marginTop: 14 }}>
                                    + Tambah User Baru
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="scm-data-card-list">
                            {filteredUsers.map((u) => (
                                <div key={u.id} className="scm-data-card">
                                    {/* Card Header: User Avatar & Role */}
                                    <div className="scm-data-card-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="scm-avatar" style={{ width: 34, height: 34, fontSize: 13, flexShrink: 0 }}>
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--color-text)' }}>
                                                    {u.name}
                                                </div>
                                                {u.id === currentUserId && (
                                                    <span style={{ fontSize: 10.5, color: 'var(--color-primary)', fontWeight: 600 }}>
                                                        (Akun Anda)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className={ROLE_BADGE[u.role?.name] ?? 'scm-badge scm-badge-gray'} style={{ fontSize: 11 }}>
                                            {u.role?.name ?? '—'}
                                        </span>
                                    </div>

                                    {/* Card Body: Email & Join Date */}
                                    <div className="scm-data-card-body">
                                        <div className="scm-data-card-meta" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 5 }}>
                                            <span className="scm-data-card-meta-item">
                                                {icons.mail}
                                                <span style={{ color: 'var(--color-text-muted)' }}>{u.email}</span>
                                            </span>
                                            <span className="scm-data-card-meta-item">
                                                {icons.calendar}
                                                <span>Bergabung {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Footer: Actions */}
                                    <div className="scm-data-card-footer" style={{ justifyContent: 'flex-end', gap: 8 }}>
                                        <button
                                            type="button"
                                            onClick={() => openEdit(u)}
                                            className="scm-btn scm-btn-secondary scm-btn-sm"
                                            style={{ padding: '6px 12px', fontSize: 12 }}
                                        >
                                            {icons.edit}
                                            <span>Edit Role</span>
                                        </button>
                                        {u.id !== currentUserId && (
                                            <button
                                                type="button"
                                                onClick={() => deleteUser(u)}
                                                className="scm-btn scm-btn-danger scm-btn-sm"
                                                style={{ padding: '6px 10px', fontSize: 12 }}
                                                title="Hapus Pengguna"
                                            >
                                                {icons.trash}
                                            </button>
                                        )}
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
