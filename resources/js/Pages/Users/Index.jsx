import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const ROLE_COLORS = {
    Admin: 'bg-purple-100 text-purple-700',
    Procurement: 'bg-blue-100 text-blue-700',
    Gudang: 'bg-green-100 text-green-700',
    Sales: 'bg-yellow-100 text-yellow-700',
};

function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
                </div>
                <div className="px-6 py-4">{children}</div>
            </div>
        </div>
    );
}

function UserForm({ form, roles, onSubmit, isEdit = false }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                {form.errors.name && <p className="text-xs text-red-500 mt-1">{form.errors.name}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                {form.errors.email && <p className="text-xs text-red-500 mt-1">{form.errors.email}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {isEdit && <span className="text-gray-400 font-normal">(kosongkan jika tidak diubah)</span>}
                </label>
                <input type="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    placeholder={isEdit ? '••••••••' : ''} />
                {form.errors.password && <p className="text-xs text-red-500 mt-1">{form.errors.password}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={form.data.role_id} onChange={(e) => form.setData('role_id', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                    <option value="">— Pilih Role —</option>
                    {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                {form.errors.role_id && <p className="text-xs text-red-500 mt-1">{form.errors.role_id}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <button type="submit" disabled={form.processing}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                    {form.processing ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Tambah User'}
                </button>
            </div>
        </form>
    );
}

export default function Index({ users, roles }) {
    const { auth } = usePage().props;
    const [showCreate, setShowCreate] = useState(false);
    const [editUser, setEditUser] = useState(null);

    const createForm = useForm({ name: '', email: '', password: '', role_id: '' });
    const editForm = useForm({ name: '', email: '', password: '', role_id: '' });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('users.store'), {
            onSuccess: () => { setShowCreate(false); createForm.reset(); },
        });
    };

    const openEdit = (user) => {
        setEditUser(user);
        editForm.setData({ name: user.name, email: user.email, password: '', role_id: String(user.role_id ?? '') });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editForm.put(route('users.update', editUser.id), {
            onSuccess: () => { setEditUser(null); editForm.reset(); },
        });
    };

    const handleDelete = (user) => {
        if (confirm(`Hapus user "${user.name}"? Aksi ini tidak dapat dibatalkan.`)) {
            editForm.delete(route('users.destroy', user.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen User</h2>}>
            <Head title="Manajemen User" />
            <div className="py-8">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <p className="text-sm text-gray-500">{users.length} user terdaftar</p>
                            <button onClick={() => setShowCreate(true)}
                                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                                + Tambah User
                            </button>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bergabung</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                    {user.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                    {user.id === auth.user.id && <p className="text-xs text-gray-400">Anda</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role?.name] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {user.role?.name ?? 'Tanpa Role'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(user)}
                                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-900">Edit</button>
                                                {user.id !== auth.user.id && (
                                                    <button onClick={() => handleDelete(user)}
                                                        className="text-xs font-medium text-red-600 hover:text-red-900">Hapus</button>
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

            {showCreate && (
                <Modal title="Tambah User Baru" onClose={() => setShowCreate(false)}>
                    <UserForm form={createForm} roles={roles} onSubmit={handleCreate} />
                </Modal>
            )}

            {editUser && (
                <Modal title={`Edit User: ${editUser.name}`} onClose={() => setEditUser(null)}>
                    <UserForm form={editForm} roles={roles} onSubmit={handleEdit} isEdit />
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
