import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ warehouses }) {
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        code: '',
        name: '',
        location: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingWarehouse) {
            put(route('warehouses.update', editingWarehouse.id), {
                onSuccess: () => { reset(); setEditingWarehouse(null); },
            });
        } else {
            post(route('warehouses.store'), { onSuccess: () => reset() });
        }
    };

    const edit = (warehouse) => {
        setEditingWarehouse(warehouse);
        setData({ code: warehouse.code, name: warehouse.name, location: warehouse.location ?? '' });
    };

    const deleteWarehouse = (id) => {
        if (confirm('Hapus gudang ini?')) destroy(route('warehouses.destroy', id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Gudang</h2>}>
            <Head title="Warehouses" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingWarehouse ? 'Edit Gudang' : 'Tambah Gudang Baru'}</h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Kode Gudang</label>
                                        <input type="text" value={data.code} onChange={e => setData('code', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="GDG-001" required />
                                        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama Gudang</label>
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="Gudang Utama" required />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                                        <input type="text" value={data.location} onChange={e => setData('location', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="Jl. Industri No. 5" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" disabled={processing}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                                        {editingWarehouse ? 'Perbarui' : 'Simpan'}
                                    </button>
                                    {editingWarehouse && (
                                        <button type="button" onClick={() => { setEditingWarehouse(null); reset(); }}
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {warehouses.map(w => (
                                        <tr key={w.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-indigo-600">{w.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{w.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{w.location ?? '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                                                <button onClick={() => edit(w)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                <button onClick={() => deleteWarehouse(w.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {warehouses.length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-400">Belum ada gudang.</td></tr>
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
