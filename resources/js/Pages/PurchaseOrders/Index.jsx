import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ purchaseOrders, suppliers, products }) {
    const [showForm, setShowForm] = useState(false);
    const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);

    const { data, setData, post, processing, errors, reset } = useForm({
        supplier_id: '',
        date: new Date().toISOString().split('T')[0],
        items: [],
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
        post(route('purchase-orders.store'), {
            data: { ...data, items },
            onSuccess: () => {
                reset();
                setItems([{ product_id: '', quantity: 1 }]);
                setShowForm(false);
            },
        });
    };

    const getStatusBadge = (status) => {
        const colors = {
            Pending: 'bg-yellow-100 text-yellow-800',
            Approved: 'bg-blue-100 text-blue-800',
            Completed: 'bg-green-100 text-green-800',
            Cancelled: 'bg-red-100 text-red-800',
            Draft: 'bg-gray-100 text-gray-800',
        };
        return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Purchase Orders
                    </h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        {showForm ? 'Cancel' : '+ New Purchase Order'}
                    </button>
                </div>
            }
        >
            <Head title="Purchase Orders" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* Create Form */}
                    {showForm && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Purchase Order</h3>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Supplier</label>
                                            <select
                                                value={data.supplier_id}
                                                onChange={e => setData('supplier_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                required
                                            >
                                                <option value="">-- Pilih Supplier --</option>
                                                {suppliers.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                            {errors.supplier_id && <p className="text-red-500 text-xs mt-1">{errors.supplier_id}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                                            <input
                                                type="date"
                                                value={data.date}
                                                onChange={e => setData('date', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Items */}
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
                                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                                                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                                        {processing ? 'Menyimpan...' : 'Simpan Purchase Order'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. PO</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {purchaseOrders.map((po) => (
                                        <tr key={po.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:underline">
                                                <Link href={route('purchase-orders.show', po.id)}>PO-{String(po.id).padStart(4, '0')}</Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{po.supplier?.name ?? '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{po.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {Number(po.total_amount).toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={getStatusBadge(po.status)}>{po.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {purchaseOrders.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-400">Belum ada Purchase Order.</td>
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
