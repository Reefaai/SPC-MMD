import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ warehouses }) {
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        code: '', name: '', location: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingWarehouse) {
            put(route('warehouses.update', editingWarehouse.id), { onSuccess: () => { reset(); setEditingWarehouse(null); } });
        } else {
            post(route('warehouses.store'), { onSuccess: () => reset() });
        }
    };

    const edit = (w) => {
        setEditingWarehouse(w);
        setData({ code: w.code, name: w.name, location: w.location ?? '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteWarehouse = (id) => { if (confirm('Hapus gudang ini?')) destroy(route('warehouses.destroy', id)); };

    return (
        <AuthenticatedLayout header="Manajemen Gudang">
            <Head title="Warehouses" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Gudang</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>{warehouses.length} gudang terdaftar</p>
                    </div>
                </div>

                {/* Form */}
                <div className="scm-card">
                    <div className="scm-card-header">
                        <span className="scm-card-title">{editingWarehouse ? 'Edit Gudang' : 'Tambah Gudang Baru'}</span>
                        {editingWarehouse && <button onClick={() => { setEditingWarehouse(null); reset(); }} className="scm-btn scm-btn-ghost scm-btn-sm">✕ Batal</button>}
                    </div>
                    <div className="scm-card-body">
                        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                            <div>
                                <label className="scm-label">Kode Gudang</label>
                                <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} className="scm-input" placeholder="GDG-001" required />
                                {errors.code && <p className="scm-form-error">{errors.code}</p>}
                            </div>
                            <div>
                                <label className="scm-label">Nama Gudang</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="scm-input" placeholder="Gudang Utama Jakarta" required />
                                {errors.name && <p className="scm-form-error">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="scm-label">Lokasi</label>
                                <input type="text" value={data.location} onChange={e => setData('location', e.target.value)} className="scm-input" placeholder="Jakarta Pusat" />
                            </div>
                            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 8 }}>
                                <button type="submit" disabled={processing} className="scm-btn scm-btn-primary">
                                    {processing ? 'Menyimpan...' : editingWarehouse ? 'Perbarui' : 'Simpan Gudang'}
                                </button>
                                {editingWarehouse && <button type="button" onClick={() => { setEditingWarehouse(null); reset(); }} className="scm-btn scm-btn-secondary">Batal</button>}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Table */}
                <div className="scm-card">
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
                                {warehouses.length === 0 ? (
                                    <tr><td colSpan="4"><div className="scm-empty"><div className="scm-empty-title">Belum ada gudang</div></div></td></tr>
                                ) : warehouses.map(w => (
                                    <tr key={w.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-secondary)', fontWeight: 600 }}>{w.code}</td>
                                        <td style={{ fontWeight: 500 }}>{w.name}</td>
                                        <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{w.location ?? '—'}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                <button onClick={() => edit(w)} className="scm-btn scm-btn-secondary scm-btn-sm">Edit</button>
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
        </AuthenticatedLayout>
    );
}
