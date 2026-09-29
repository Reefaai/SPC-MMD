import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Masuk — SCM System" />
            <style>{`
                body { background: #0F172A; margin: 0; font-family: 'Work Sans', sans-serif; }
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Work+Sans:wght@400;500;600&display=swap');
            `}</style>

            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                background: 'linear-gradient(135deg, #1A1C19 0%, #2C322C 50%, #1A1C19 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(147,215,140,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(147,215,140,0.07) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    pointerEvents: 'none',
                }} />
                {/* Glow */}
                <div style={{
                    position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: 500, height: 300,
                    background: 'radial-gradient(circle, rgba(147,215,140,0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                {/* Card */}
                <div style={{
                    width: '100%', maxWidth: 400,
                    background: '#111827',
                    border: '1px solid #1E293B',
                    borderRadius: 16,
                    padding: 36,
                    boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(147,215,140,0.1)',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
                        <div style={{
                            width: 48, height: 48, background: '#93D78C', borderRadius: 12,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 14, boxShadow: '0 4px 20px rgba(147,215,140,0.4)',
                        }}>
                            <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
                                <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 8.5v7L12 19.5 4 15.5v-7l8-4.32z" opacity=".7"/>
                                <path d="M12 7l-5 2.5V15l5 2.5 5-2.5V9.5L12 7z"/>
                            </svg>
                        </div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 700, color: '#F8FAFC', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                            SCM System
                        </h1>
                        <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Supply Chain Management</p>
                    </div>

                    {/* Status */}
                    {status && (
                        <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, fontSize: 13, color: '#34D399' }}>
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94A3B8', marginBottom: 5 }}>Email</label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={e => setData('email', e.target.value)}
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    background: '#1E293B', border: `1px solid ${errors.email ? '#EF4444' : '#334155'}`,
                                    borderRadius: 8, color: '#F8FAFC', fontSize: 14, padding: '9px 12px',
                                    outline: 'none', fontFamily: 'Work Sans, sans-serif',
                                    transition: 'border-color 150ms',
                                }}
                                onFocus={e => { if (!errors.email) e.target.style.borderColor = '#93D78C'; e.target.style.boxShadow = '0 0 0 3px rgba(147,215,140,0.2)'; }}
                                onBlur={e => { e.target.style.borderColor = errors.email ? '#EF4444' : '#334155'; e.target.style.boxShadow = 'none'; }}
                                placeholder="admin@example.com"
                            />
                            {errors.email && <p style={{ fontSize: 11.5, color: '#F87171', marginTop: 4 }}>{errors.email}</p>}
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                <label style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8' }}>Password</label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} style={{ fontSize: 12, color: '#B8F2B0', textDecoration: 'none' }}>Lupa password?</Link>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={e => setData('password', e.target.value)}
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    background: '#1E293B', border: `1px solid ${errors.password ? '#EF4444' : '#334155'}`,
                                    borderRadius: 8, color: '#F8FAFC', fontSize: 14, padding: '9px 12px',
                                    outline: 'none', fontFamily: 'Work Sans, sans-serif',
                                    transition: 'border-color 150ms',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#93D78C'; e.target.style.boxShadow = '0 0 0 3px rgba(147,215,140,0.2)'; }}
                                onBlur={e => { e.target.style.borderColor = errors.password ? '#EF4444' : '#334155'; e.target.style.boxShadow = 'none'; }}
                                placeholder="••••••••"
                            />
                            {errors.password && <p style={{ fontSize: 11.5, color: '#F87171', marginTop: 4 }}>{errors.password}</p>}
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                                style={{ accentColor: '#93D78C', width: 14, height: 14 }}
                            />
                            <span style={{ fontSize: 13, color: '#94A3B8' }}>Ingat saya</span>
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%', padding: '10px', borderRadius: 8,
                                background: processing ? '#45B85Aaa' : '#93D78C',
                                color: '#fff', fontWeight: 600, fontSize: 14,
                                border: 'none', cursor: processing ? 'not-allowed' : 'pointer',
                                fontFamily: 'Work Sans, sans-serif',
                                boxShadow: '0 4px 16px rgba(147,215,140,0.35)',
                                transition: 'all 150ms',
                            }}
                            onMouseEnter={e => { if (!processing) e.target.style.background = '#45B85A'; }}
                            onMouseLeave={e => { if (!processing) e.target.style.background = '#93D78C'; }}
                        >
                            {processing ? 'Masuk...' : 'Masuk'}
                        </button>
                    </form>

                    <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: '#475569' }}>
                        Hubungi Admin untuk akses ke sistem ini
                    </div>
                </div>
            </div>
        </>
    );
}
