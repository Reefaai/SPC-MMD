import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const fmt = (v) => `Rp ${Number(v ?? 0).toLocaleString('id-ID')}`;

export default function Index({ products, categories }) {
    const [editingProduct, setEditingProduct] = useState(null);
    const [search, setSearch] = useState('');

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        category_id: '', sku: '', name: '', unit: '', min_stock: 0, price: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            put(route('products.update', editingProduct.id), { onSuccess: () => { reset(); setEditingProduct(null); } });
        } else {
            post(route('products.store'), { onSuccess: () => reset() });
        }
    };

    const edit = (p) => {
        setEditingProduct(p);
        setData({ category_id: p.category_id, sku: p.sku, name: p.name, unit: p.unit, min_stock: p.min_stock, price: p.price });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteProduct = (id) => { if (confirm('Hapus produk ini?')) destroy(route('products.destroy', id)); };

    const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku ?? '').toLowerCase().includes(search.toLowerCase()));

    return (
        <AuthenticatedLayout header="Manajemen Produk">
            <Head title="Products" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Produk</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>{products.length} produk terdaftar</p>
                    </div>
                </div>

                {/* Form */}
                <div className="scm-card">
                    <div className="scm-card-header">
                        <span className="scm-card-title">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</span>
                        {editingProduct && <button onClick={() => { setEditingProduct(null); reset(); }} className="scm-btn scm-btn-ghost scm-btn-sm">✕ Batal</button>}
                    </div>
                    <div className="scm-card-body">
                        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                            <div>
                                <label className="scm-label">Kategori</label>
                                <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="scm-select">
                                    <option value="">-- Tanpa Kategori --</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="scm-label">SKU</label>
                                <input type="text" value={data.sku} onChange={e => setData('sku', e.target.value)} className="scm-input" placeholder="SKU-001" required />
                                {errors.sku && <p className="scm-form-error">{errors.sku}</p>}
                            </div>
                            <div>
                                <label className="scm-label">Nama Produk</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="scm-input" placeholder="Nama produk..." required />
                                {errors.name && <p className="scm-form-error">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="scm-label">Satuan</label>
                                <input type="text" value={data.unit} onChange={e => setData('unit', e.target.value)} className="scm-input" placeholder="pcs / kg / box" required />
                            </div>
                            <div>
                                <label className="scm-label">Harga (Rp)</label>
                                <input type="number" min="0" value={data.price} onChange={e => setData('price', e.target.value)} className="scm-input" />
                            </div>
                            <div>
                                <label className="scm-label">Stok Minimum</label>
                                <input type="number" min="0" value={data.min_stock} onChange={e => setData('min_stock', e.target.value)} className="scm-input" />
                            </div>
                            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 8 }}>
                                <button type="submit" disabled={processing} className="scm-btn scm-btn-primary">
                                    {processing ? 'Menyimpan...' : editingProduct ? 'Perbarui' : 'Simpan Produk'}
                                </button>
                                {editingProduct && <button type="button" onClick={() => { setEditingProduct(null); reset(); }} className="scm-btn scm-btn-secondary">Batal</button>}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Table */}
                <div className="scm-card">
                    <div className="scm-filter-bar">
                        <div>
                            <label className="scm-label">Cari Produk</label>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Nama atau SKU..." className="scm-input" style={{ width: 220 }} />
                        </div>
                        <span style={{ marginLeft: 'auto', alignSelf: 'flex-end', fontSize: 12, color: 'var(--color-text-faint)', paddingBottom: 2 }}>{filtered.length} produk</span>
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
                                    <tr><td colSpan="7"><div className="scm-empty"><div className="scm-empty-title">Belum ada produk</div></div></td></tr>
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
                                                <button onClick={() => edit(p)} className="scm-btn scm-btn-secondary scm-btn-sm">Edit</button>
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
        </AuthenticatedLayout>
    );
}
