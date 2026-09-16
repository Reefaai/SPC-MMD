import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ suppliers }) {
    const [editingSupplier, setEditingSupplier] = useState(null);
    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        code: '',
        name: '',
        contact: '',
        address: '',
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

    const edit = (supplier) => {
        setEditingSupplier(supplier);
        setData({ code: supplier.code, name: supplier.name, contact: supplier.contact ?? '', address: supplier.address ?? '' });
    };

    const deleteSupplier = (id) => {
        if (confirm('Hapus supplier ini?')) destroy(route('suppliers.destroy', id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Supplier</h2>}>
            <Head title="Suppliers" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingSupplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}</h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Kode Supplier</label>
                                        <input type="text" value={data.code} onChange={e => setData('code', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="SUP-001" required />
                                        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama Supplier</label>
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="PT. Maju Jaya" required />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Kontak</label>
                                        <input type="text" value={data.contact} onChange={e => setData('contact', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="08123456789" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Alamat</label>
                                        <input type="text" value={data.address} onChange={e => setData('address', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="Jl. Contoh No. 1" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" disabled={processing}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                                        {editingSupplier ? 'Perbarui' : 'Simpan'}
                                    </button>
                                    {editingSupplier && (
                                        <button type="button" onClick={() => { setEditingSupplier(null); reset(); }}
                                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            Batal
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontak</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {suppliers.map(s => (
                                        <tr key={s.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-indigo-600">{s.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.contact ?? '-'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{s.address ?? '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                                                <button onClick={() => edit(s)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                <button onClick={() => deleteSupplier(s.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {suppliers.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-400">Belum ada supplier.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
