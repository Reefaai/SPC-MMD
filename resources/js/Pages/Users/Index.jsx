import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const ROLE_BADGE = {
    Admin:       'scm-badge scm-badge-purple',
    Procurement: 'scm-badge scm-badge-blue',
    Gudang:      'scm-badge scm-badge-green',
    Sales:       'scm-badge scm-badge-yellow',
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

    const createForm = useForm({ name: '', email: '', password: '', password_confirmation: '', role_id: '' });
    const editForm   = useForm({ name: '', email: '', role_id: '' });
    const passForm   = useForm({ password: '', password_confirmation: '' });
    const [showPassFor, setShowPassFor] = useState(null);

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

    const submitPassword = (e) => {
        e.preventDefault();
        passForm.put(route('users.update', showPassFor), {
            onSuccess: () => { passForm.reset(); setShowPassFor(null); },
        });
    };

    const deleteUser = (id) => {
        if (confirm('Hapus user ini?')) useForm().delete(route('users.destroy', id));
    };

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Manajemen User</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>{users.length} user terdaftar</p>
                    </div>
                    <button onClick={() => setCreateOpen(true)} className="scm-btn scm-btn-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Tambah User
                    </button>
                </div>

                <div className="scm-card">
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
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div className="scm-avatar" style={{ width: 28, height: 28, fontSize: 11, flexShrink: 0 }}>
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{u.name}</div>
                                                    {u.id === currentUserId && <div style={{ fontSize: 10.5, color: 'var(--color-text-faint)' }}>Anda</div>}
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
                                                    <button onClick={() => { useForm({ email: u.email }).delete(route('users.destroy', u.id), { onBefore: () => confirm('Hapus user ini?') }); }} className="scm-btn scm-btn-danger scm-btn-sm">Hapus</button>
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
        </AuthenticatedLayout>
    );
}
