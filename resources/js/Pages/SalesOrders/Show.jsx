import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ salesOrder }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail SO-{String(salesOrder.id).padStart(4, '0')}
                    </h2>
                    <Link href={route('sales-orders.index')} className="text-sm text-indigo-600 hover:text-indigo-900">← Kembali</Link>
                </div>
            }
        >
            <Head title={`SO-${String(salesOrder.id).padStart(4, '0')}`} />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">

                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium">Pelanggan</p>
                                <p className="text-lg font-semibold text-gray-900 mt-1">{salesOrder.customer_name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium">Tanggal</p>
                                <p className="text-lg font-semibold text-gray-900 mt-1">{salesOrder.date}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium">Total Amount</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">Rp {Number(salesOrder.total_amount).toLocaleString('id-ID')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Status</p>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    {salesOrder.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">Item Produk</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga (Snapshot)</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {salesOrder.items?.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.product?.name ?? '-'}</td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-500">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-900">{item.quantity}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">Rp {Number(item.subtotal).toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50">
                                    <td colSpan="3" className="px-6 py-4 text-sm font-bold text-right text-gray-700">Total</td>
                                    <td className="px-6 py-4 text-sm font-bold text-right text-green-600">Rp {Number(salesOrder.total_amount).toLocaleString('id-ID')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
