import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ categories }) {
    const [editingCategory, setEditingCategory] = useState(null);
    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({ name: '' });

    const submit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('categories.update', editingCategory.id), { onSuccess: () => { reset(); setEditingCategory(null); } });
        } else {
            post(route('categories.store'), { onSuccess: () => reset() });
        }
    };

    const edit = (c) => { setEditingCategory(c); setData({ name: c.name }); };
    const deleteCategory = (id) => { if (confirm('Hapus kategori ini?')) destroy(route('categories.destroy', id)); };

    return (
        <AuthenticatedLayout header="Kategori Produk">
            <Head title="Categories" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="scm-section-header">
                    <h1 className="scm-section-title">Kategori</h1>
                </div>

                {/* Form */}
                <div className="scm-card">
                    <div className="scm-card-header">
                        <span className="scm-card-title">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</span>
                        {editingCategory && <button onClick={() => { setEditingCategory(null); reset(); }} className="scm-btn scm-btn-ghost scm-btn-sm">✕ Batal</button>}
                    </div>
                    <div className="scm-card-body">
                        <form onSubmit={submit} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <label className="scm-label">Nama Kategori</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="scm-input" placeholder="Elektronik, Furniture, ..." required />
                                {errors.name && <p className="scm-form-error">{errors.name}</p>}
                            </div>
                            <button type="submit" disabled={processing} className="scm-btn scm-btn-primary" style={{ flexShrink: 0 }}>
                                {processing ? '...' : editingCategory ? 'Perbarui' : 'Simpan'}
                            </button>
                            {editingCategory && <button type="button" onClick={() => { setEditingCategory(null); reset(); }} className="scm-btn scm-btn-secondary">Batal</button>}
                        </form>
                    </div>
                </div>

                {/* Table */}
                <div className="scm-card">
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
                                {categories.length === 0 ? (
                                    <tr><td colSpan="4"><div className="scm-empty"><div className="scm-empty-title">Belum ada kategori</div></div></td></tr>
                                ) : categories.map((c, i) => (
                                    <tr key={c.id}>
                                        <td style={{ color: 'var(--color-text-faint)', fontSize: 12 }}>{i + 1}</td>
                                        <td style={{ fontWeight: 500 }}>{c.name}</td>
                                        <td style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            <span className="scm-badge scm-badge-indigo">{c.products_count ?? 0} produk</span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                <button onClick={() => edit(c)} className="scm-btn scm-btn-secondary scm-btn-sm">Edit</button>
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
        </AuthenticatedLayout>
    );
}
