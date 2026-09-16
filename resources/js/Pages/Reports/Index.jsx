import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index() {
    const { data, setData, get, processing } = useForm({
        type: 'purchase_orders',
        date_from: '',
        date_to: '',
    });

    const handleExport = (e) => {
        e.preventDefault();
        // Build query string and trigger download
        const params = new URLSearchParams({
            type: data.type,
            date_from: data.date_from,
            date_to: data.date_to,
        });
        window.location.href = `/reports/export?${params.toString()}`;
    };

    const reportTypes = [
        { value: 'purchase_orders', label: '🛒 Laporan Purchase Orders' },
        { value: 'sales_orders', label: '📋 Laporan Sales Orders' },
        { value: 'inventory', label: '📦 Laporan Transaksi Inventori' },
    ];

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Export Laporan</h2>}>
            <Head title="Laporan" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            <p className="text-sm text-gray-500 mb-6">Pilih jenis laporan dan rentang tanggal untuk mengunduh laporan dalam format CSV.</p>
                            <form onSubmit={handleExport} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Laporan</label>
                                    <div className="space-y-2">
                                        {reportTypes.map(rt => (
                                            <label key={rt.value} className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${data.type === rt.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value={rt.value}
                                                    checked={data.type === rt.value}
                                                    onChange={() => setData('type', rt.value)}
                                                    className="mr-3 text-indigo-600"
                                                />
                                                <span className="text-sm font-medium text-gray-700">{rt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                                        <input
                                            type="date"
                                            value={data.date_from}
                                            onChange={e => setData('date_from', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tanggal Akhir</label>
                                        <input
                                            type="date"
                                            value={data.date_to}
                                            onChange={e => setData('date_to', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <p className="text-xs text-gray-400">* Kosongkan tanggal untuk mengunduh seluruh data.</p>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    <span>⬇</span> Unduh Laporan CSV
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
