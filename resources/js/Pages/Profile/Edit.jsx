import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const roleName = user.role?.name || 'Administrator';

    return (
        <AuthenticatedLayout>
            <Head title="Profil Saya" />

            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Hero Profile Header */}
                <div className="scm-card" style={{
                    padding: '32px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(147, 215, 140, 0.05) 100%)',
                    border: '1px solid rgba(147, 215, 140, 0.15)'
                }}>
                    <div className="scm-avatar" style={{
                        width: 80, height: 80, fontSize: 32,
                        boxShadow: '0 8px 24px rgba(147, 215, 140, 0.2)',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dim))'
                    }}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6, letterSpacing: '-0.02em' }}>
                            {user.name}
                        </h1>
                        <p style={{ fontSize: 14, color: 'var(--color-text-faint)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span className="scm-badge scm-badge-green">{roleName}</span>
                            <span>{user.email}</span>
                        </p>
                    </div>
                </div>

                {/* 2-Column Grid Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                    gap: 24,
                    alignItems: 'start'
                }}>

                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="scm-card scm-card-body">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="scm-card scm-card-body">
                            <UpdatePasswordForm />
                        </div>

                        <div className="scm-card scm-card-body" style={{
                            borderColor: 'rgba(239, 68, 68, 0.2)',
                            background: 'linear-gradient(180deg, var(--color-surface) 0%, rgba(239, 68, 68, 0.03) 100%)'
                        }}>
                            <DeleteUserForm />
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
