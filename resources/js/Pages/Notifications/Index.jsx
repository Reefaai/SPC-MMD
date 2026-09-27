import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ notifications }) {
    const markAsRead = (id) => {
        router.post(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Notifikasi</h2>
                    {notifications.some(n => n.read_at === null) && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            Tandai Semua Dibaca
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Notifikasi" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {notifications.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">Belum ada notifikasi.</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {notifications.map((notif) => (
                                        <li key={notif.id} className={`py-4 ${notif.read_at ? 'opacity-60' : 'bg-blue-50/50 -mx-6 px-6'}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {notif.data.message || 'Pemberitahuan'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(notif.created_at).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                {!notif.read_at && (
                                                    <button
                                                        onClick={() => markAsRead(notif.id)}
                                                        className="text-xs text-indigo-600 hover:text-indigo-900 bg-white border border-indigo-200 rounded px-2 py-1"
                                                    >
                                                        Tandai Dibaca
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
