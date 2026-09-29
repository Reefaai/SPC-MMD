import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

function InlineForm({ editingSupplier, data, setData, errors, processing, onSubmit, onCancel }) {
    return (
        <div className="scm-card" style={{ marginBottom: 20 }}>
            <div className="scm-card-header">
                <span className="scm-card-title">{editingSupplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}</span>
                {editingSupplier && <button onClick={onCancel} className="scm-btn scm-btn-ghost scm-btn-sm">✕ Batal</button>}
            </div>
            <div className="scm-card-body">
                <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                        <label className="scm-label">Kode Supplier</label>
                        <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} className="scm-input" placeholder="SUP-001" required />
                        {errors.code && <p className="scm-form-error">{errors.code}</p>}
                    </div>
                    <div>
                        <label className="scm-label">Nama Supplier</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="scm-input" placeholder="PT. Maju Jaya" required />
                        {errors.name && <p className="scm-form-error">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="scm-label">Kontak</label>
                        <input type="text" value={data.contact} onChange={e => setData('contact', e.target.value)} className="scm-input" placeholder="08123456789" />
                    </div>
                    <div>
                        <label className="scm-label">Alamat</label>
                        <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className="scm-input" placeholder="Jl. Contoh No. 1" />
                    </div>
                    <div style={{ gridColumn: '1/-1', display: 'flex', gap: 8 }}>
                        <button type="submit" disabled={processing} className="scm-btn scm-btn-primary">
                            {processing ? 'Menyimpan...' : editingSupplier ? 'Perbarui' : 'Simpan'}
                        </button>
                        {editingSupplier && <button type="button" onClick={onCancel} className="scm-btn scm-btn-secondary">Batal</button>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Index({ suppliers }) {
    const [editingSupplier, setEditingSupplier] = useState(null);
    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        code: '', name: '', contact: '', address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingSupplier) {
            put(route('suppliers.update', editingSupplier.id), {
                onSuccess: () => { reset(); setEditingSupplier(null); },
            });
        } else {
            post(route('suppliers.store'), { onSuccess: () => reset() });
        }
    };

    const edit = (s) => {
        setEditingSupplier(s);
        setData({ code: s.code, name: s.name, contact: s.contact ?? '', address: s.address ?? '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteSupplier = (id) => {
        if (confirm('Hapus supplier ini?')) destroy(route('suppliers.destroy', id));
    };

    return (
        <AuthenticatedLayout header="Manajemen Supplier">
            <Head title="Suppliers" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div className="scm-section-header" style={{ marginBottom: 20 }}>
                    <div>
                        <h1 className="scm-section-title">Supplier</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>{suppliers.length} supplier terdaftar</p>
                    </div>
                </div>

                <InlineForm
                    editingSupplier={editingSupplier}
                    data={data} setData={setData} errors={errors} processing={processing}
                    onSubmit={submit}
                    onCancel={() => { setEditingSupplier(null); reset(); }}
                />

                <div className="scm-card">
                    <div className="scm-table-responsive">
                        <table className="scm-table">
                            <thead>
                                <tr>
                                    <th>Kode</th>
                                    <th>Nama</th>
                                    <th>Kontak</th>
                                    <th>Alamat</th>
                                    <th style={{ textAlign: 'right' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.length === 0 ? (
                                    <tr><td colSpan="5">
                                        <div className="scm-empty"><div className="scm-empty-title">Belum ada supplier</div></div>
                                    </td></tr>
                                ) : suppliers.map(s => (
                                    <tr key={s.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-secondary)', fontWeight: 600 }}>{s.code}</td>
                                        <td style={{ fontWeight: 500 }}>{s.name}</td>
                                        <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{s.contact ?? '—'}</td>
                                        <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{s.address ?? '—'}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                <button onClick={() => edit(s)} className="scm-btn scm-btn-secondary scm-btn-sm">Edit</button>
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
        </AuthenticatedLayout>
    );
}
