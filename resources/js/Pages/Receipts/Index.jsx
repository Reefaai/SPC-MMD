import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ receipts, pendingPOs, warehouses }) {
    const [showForm, setShowForm] = useState(false);
    const [selectedPO, setSelectedPO] = useState(null);
    const [items, setItems] = useState([]);

    const { data, setData, post, processing, reset } = useForm({
        purchase_order_id: '',
        warehouse_id: '',
        date: new Date().toISOString().split('T')[0],
    });

    const handleSelectPO = (poId) => {
        setData('purchase_order_id', poId);
        const po = pendingPOs.find(p => p.id == poId);
        setSelectedPO(po);
        if (po) {
            setItems(po.items.map(item => ({
                product_id: item.product_id,
                product_name: item.product?.name,
                quantity_received: item.quantity,
            })));
        }
    };

    const updateQty = (index, value) => {
        const updated = [...items];
        updated[index].quantity_received = value;
        setItems(updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('receipts.store'), {
            data: { ...data, items },
            onSuccess: () => {
                reset();
                setSelectedPO(null);
                setItems([]);
                setShowForm(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Penerimaan Barang (Receipts)</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        {showForm ? 'Batal' : '+ Buat Penerimaan'}
                    </button>
                </div>
            }
        >
            <Head title="Receipts" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {showForm && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Buat Penerimaan Barang</h3>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Purchase Order</label>
                                            <select
                                                value={data.purchase_order_id}
                                                onChange={e => handleSelectPO(e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                                required
                                            >
                                                <option value="">-- Pilih PO --</option>
                                                {pendingPOs.map(po => (
                                                    <option key={po.id} value={po.id}>PO-{String(po.id).padStart(4, '0')} — {po.supplier?.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Gudang Tujuan</label>
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
                                            <label className="block text-sm font-medium text-gray-700">Tanggal Terima</label>
                                            <input
                                                type="date"
                                                value={data.date}
                                                onChange={e => setData('date', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {items.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Jumlah Diterima</label>
                                            {items.map((item, index) => (
                                                <div key={index} className="flex gap-3 mb-2 items-center">
                                                    <span className="flex-1 text-sm text-gray-700">{item.product_name}</span>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity_received}
                                                        onChange={e => updateQty(index, e.target.value)}
                                                        className="w-24 rounded-md border-gray-300 shadow-sm sm:text-sm"
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing || items.length === 0}
                                        className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Konfirmasi Penerimaan'}
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Receipt</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gudang</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {receipts.map((r) => (
                                        <tr key={r.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">RCP-{String(r.id).padStart(4, '0')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PO-{String(r.purchase_order_id).padStart(4, '0')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.warehouse?.name ?? '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{r.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {receipts.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-400">Belum ada penerimaan barang.</td>
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
