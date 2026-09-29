import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ notifications }) {
    const markAsRead = (id) => {
        router.post(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
    };

    const unreadCount = notifications.filter(n => !n.read_at).length;

    return (
        <AuthenticatedLayout header="Notifikasi">
            <Head title="Notifikasi" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="scm-section-header">
                    <div>
                        <h1 className="scm-section-title">Notifikasi</h1>
                        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', marginTop: 2 }}>
                            {unreadCount} belum dibaca dari {notifications.length} total
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="scm-btn scm-btn-secondary">
                            ✓ Tandai Semua Dibaca
                        </button>
                    )}
                </div>

                <div className="scm-card">
                    {notifications.length === 0 ? (
                        <div className="scm-empty" style={{ padding: 60 }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, opacity: 0.25 }}>
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                <path d="M13.73 21a2 2 0 01-3.46 0"/>
                            </svg>
                            <div className="scm-empty-title">Tidak ada notifikasi</div>
                            <div className="scm-empty-desc">Anda akan menerima pemberitahuan di sini saat ada stok yang menipis</div>
                        </div>
                    ) : (
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                            {notifications.map((notif, idx) => (
                                <li key={notif.id} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: 16,
                                    padding: '14px 20px',
                                    borderBottom: idx < notifications.length - 1 ? '1px solid var(--color-border)' : 'none',
                                    background: !notif.read_at ? 'rgba(147,215,140,0.04)' : 'transparent',
                                    transition: 'background 150ms',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                        {/* Icon */}
                                        <div style={{
                                            width: 36, height: 36, flexShrink: 0,
                                            borderRadius: 'var(--radius)',
                                            background: !notif.read_at ? 'rgba(245,158,11,0.15)' : 'rgba(100,116,139,0.1)',
                                            border: `1px solid ${!notif.read_at ? 'rgba(245,158,11,0.3)' : 'var(--color-border)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke={!notif.read_at ? '#FCD34D' : 'var(--color-text-faint)'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                                                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                                                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p style={{
                                                fontSize: 13.5,
                                                fontWeight: !notif.read_at ? 600 : 400,
                                                color: !notif.read_at ? 'var(--color-text)' : 'var(--color-text-muted)',
                                                margin: 0, lineHeight: 1.5,
                                            }}>
                                                {notif.data?.message ?? 'Pemberitahuan sistem'}
                                            </p>
                                            <p style={{ fontSize: 11.5, color: 'var(--color-text-faint)', margin: '3px 0 0' }}>
                                                {new Date(notif.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                        {!notif.read_at && <span className="scm-badge scm-badge-indigo">Baru</span>}
                                        {!notif.read_at && (
                                            <button onClick={() => markAsRead(notif.id)} className="scm-btn scm-btn-ghost scm-btn-sm">
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
        </AuthenticatedLayout>
    );
}
