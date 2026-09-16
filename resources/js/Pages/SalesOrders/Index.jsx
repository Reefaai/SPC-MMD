import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ salesOrders, products, warehouses }) {
    const [showForm, setShowForm] = useState(false);
    const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        date: new Date().toISOString().split('T')[0],
        warehouse_id: '',
    });

    const addItem = () => setItems([...items, { product_id: '', quantity: 1 }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('sales-orders.store'), {
            data: { ...data, items },
            onSuccess: () => {
                reset();
                setItems([{ product_id: '', quantity: 1 }]);
                setShowForm(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Sales Orders</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        {showForm ? 'Batal' : '+ Sales Order Baru'}
                    </button>
                </div>
            }
        >
            <Head title="Sales Orders" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {showForm && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Buat Sales Order</h3>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nama Pelanggan</label>
                                            <input
                                                type="text"
                                                value={data.customer_name}
                                                onChange={e => setData('customer_name', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                                required
                                            />
                                            {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Gudang</label>
                                            <select
                                                value={data.warehouse_id}
                                                onChange={e => setData('warehouse_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                                required
                                            >
                                                <option value="">-- Pilih Gudang --</option>
                                                {warehouses.map(w => (
                                                    <option key={w.id} value={w.id}>{w.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                                            <input
                                                type="date"
                                                value={data.date}
                                                onChange={e => setData('date', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700">Item Produk</label>
                                            <button type="button" onClick={addItem} className="text-sm text-indigo-600 hover:text-indigo-900">+ Tambah Item</button>
                                        </div>
                                        {items.map((item, index) => (
                                            <div key={index} className="flex gap-3 mb-2 items-center">
                                                <select
                                                    value={item.product_id}
                                                    onChange={e => updateItem(index, 'product_id', e.target.value)}
                                                    className="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm"
                                                    required
                                                >
                                                    <option value="">-- Pilih Produk --</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} (Rp {Number(p.price).toLocaleString('id-ID')})</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                    className="w-24 rounded-md border-gray-300 shadow-sm sm:text-sm"
                                                    placeholder="Qty"
                                                    required
                                                />
                                                {items.length > 1 && (
                                                    <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">✕</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Sales Order'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. SO</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {salesOrders.map((so) => (
                                        <tr key={so.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">SO-{String(so.id).padStart(4, '0')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{so.customer_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{so.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {Number(so.total_amount).toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{so.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {salesOrders.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-400">Belum ada Sales Order.</td>
                                        </tr>
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
