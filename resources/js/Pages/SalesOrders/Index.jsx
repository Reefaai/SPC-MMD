import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ salesOrders, products, warehouses }) {
    const [showForm, setShowForm] = useState(false);

    // Filter state
    const [filterCustomer, setFilterCustomer] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    const filteredSOs = salesOrders.filter((so) => {
        if (filterCustomer && !so.customer_name.toLowerCase().includes(filterCustomer.toLowerCase())) return false;
        if (filterDateFrom && so.date < filterDateFrom) return false;
        if (filterDateTo && so.date > filterDateTo) return false;
        return true;
    });

    const resetFilters = () => {
        setFilterCustomer('');
        setFilterDateFrom('');
        setFilterDateTo('');
    };

    const hasFilter = filterCustomer || filterDateFrom || filterDateTo;

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        date: new Date().toISOString().split('T')[0],
        warehouse_id: '',
        items: [{ product_id: '', quantity: 1 }],
    });

    const addItem = () => setData('items', [...data.items, { product_id: '', quantity: 1 }]);
    const removeItem = (index) => setData('items', data.items.filter((_, i) => i !== index));
    const updateItem = (index, field, value) => {
        const updated = [...data.items];
        updated[index][field] = value;
        setData('items', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('sales-orders.store'), {
            onSuccess: () => {
                reset();
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
                                        {data.items.map((item, index) => (
                                            <div key={index} className="mb-2">
                                                <div className="flex gap-3 items-center">
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
                                                        className={`w-24 rounded-md shadow-sm sm:text-sm ${errors[`items.${index}.quantity`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                                                        placeholder="Qty"
                                                        required
                                                    />
                                                    {data.items.length > 1 && (
                                                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">✕</button>
                                                    )}
                                                </div>
                                                {errors[`items.${index}.quantity`] && (
                                                    <div className="text-red-500 text-xs mt-1 text-right pr-8">{errors[`items.${index}.quantity`]}</div>
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
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex flex-wrap gap-3 items-end">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Cari Pelanggan</label>
                                    <input
                                        type="text"
                                        value={filterCustomer}
                                        onChange={e => setFilterCustomer(e.target.value)}
                                        placeholder="Nama pelanggan..."
                                        className="rounded-md border-gray-300 shadow-sm text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Dari Tanggal</label>
                                    <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
                                        className="rounded-md border-gray-300 shadow-sm text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Sampai Tanggal</label>
                                    <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
                                        className="rounded-md border-gray-300 shadow-sm text-sm" />
                                </div>
                                {hasFilter && (
                                    <button onClick={resetFilters} className="text-sm text-red-500 hover:text-red-700 underline pb-1">
                                        Reset Filter
                                    </button>
                                )}
                                <span className="text-xs text-gray-400 pb-1 ml-auto">
                                    {filteredSOs.length} dari {salesOrders.length} SO
                                </span>
                            </div>
                        </div>
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
                                    {filteredSOs.map((so) => (
                                        <tr key={so.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:underline">
                                                <Link href={route('sales-orders.show', so.id)}>SO-{String(so.id).padStart(4, '0')}</Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{so.customer_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{so.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {Number(so.total_amount).toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{so.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredSOs.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-400">
                                                {hasFilter ? 'Tidak ada SO yang sesuai filter.' : 'Belum ada Sales Order.'}
                                            </td>
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
