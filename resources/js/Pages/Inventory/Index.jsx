import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ warehouses, stockMatrix }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Stok per Gudang</h2>}>
            <Head title="Inventori" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 overflow-x-auto">
                            {stockMatrix.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-10">Belum ada data produk.</p>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">SKU</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">Produk</th>
                                            {warehouses.map(w => (
                                                <th key={w.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">{w.name}</th>
                                            ))}
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Min</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {stockMatrix.map(product => (
                                            <tr key={product.id} className={product.is_low_stock ? 'bg-red-50' : ''}>
                                                <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-gray-400">{product.sku}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                                {warehouses.map(w => (
                                                    <td key={w.id} className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-700">
                                                        {product.warehouses[w.id] ?? 0}
                                                        <span className="text-xs text-gray-400 ml-1">{product.unit}</span>
                                                    </td>
                                                ))}
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-gray-900">
                                                    {product.total_stock}
                                                    <span className="text-xs font-normal text-gray-400 ml-1">{product.unit}</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{product.min_stock}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                    {product.is_low_stock
                                                        ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">⚠️ Menipis</span>
                                                        : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">✓ Aman</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
