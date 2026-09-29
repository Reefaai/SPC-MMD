import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

// ── SVG Icons ────────────────────────────────────────────────────
const icons = {
    dashboard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="8" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="15" width="7" height="6" rx="1" />
        </svg>
    ),
    shoppingCart: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
        </svg>
    ),
    clipboardList: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
        </svg>
    ),
    packageDown: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22l-8-4V6l8-4 8 4v12z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" /><polyline points="9 16 12 19 15 16" />
        </svg>
    ),
    package: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22l-8-4V6l8-4 8 4v12z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    ),
    building: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    ),
    tag: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    ),
    truck: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
    ),
    barChart: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
        </svg>
    ),
    users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
    ),
    bell: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
    ),
    settings: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
    ),
    logOut: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    ),
    chevronDown: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    ),
    scm: (
        <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 8.5v7L12 19.5 4 15.5v-7l8-4.32z" opacity=".8" />
            <path d="M12 7l-5 2.5V15l5 2.5 5-2.5V9.5L12 7z" />
        </svg>
    ),
    warehouse: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 22V12L12 2l10 10v10" /><path d="M2 22h20" /><path d="M9 22V12h6v10" />
        </svg>
    ),
    menu: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    ),
    close: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    grid: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
    ),
};

// ── NavItem ───────────────────────────────────────────────────────
function NavItem({ href, icon, label, active, badge, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`scm-nav-link${active ? ' active' : ''}`}
        >
            {icons[icon]}
            <span className="scm-nav-link-text">{label}</span>
            {badge && <span className="scm-nav-link-text scm-badge scm-badge-red" style={{ marginLeft: 'auto', padding: '1px 5px', fontSize: 9 }}>{badge}</span>}
        </Link>
    );
}

// ── Shared Nav Content ───────────────────────────────────────────
function NavContent({ roleName, isActive, onNavigate }) {
    const isAdmin = roleName === 'Admin';
    const isProcurement = roleName === 'Procurement' || isAdmin;
    const isGudang = roleName === 'Gudang' || isAdmin;
    const isSales = roleName === 'Sales' || isAdmin;

    return (
        <nav className="scm-nav">
            <NavItem href={route('dashboard')} icon="dashboard" label="Dashboard" active={isActive('dashboard')} onClick={onNavigate} />

            {isProcurement && (
                <>
                    <div className="scm-nav-section-label">Pengadaan</div>
                    <NavItem href={route('purchase-orders.index')} icon="shoppingCart" label="Purchase Orders" active={isActive('purchase-orders.*')} onClick={onNavigate} />
                    <NavItem href={route('suppliers.index')} icon="truck" label="Supplier" active={isActive('suppliers.*')} onClick={onNavigate} />
                </>
            )}

            {isGudang && (
                <>
                    <div className="scm-nav-section-label">Gudang</div>
                    <NavItem href={route('receipts.index')} icon="packageDown" label="Penerimaan Barang" active={isActive('receipts')} onClick={onNavigate} />
                    <NavItem href={route('inventory.index')} icon="package" label="Inventori" active={isActive('inventory')} onClick={onNavigate} />
                    <NavItem href={route('warehouses.index')} icon="warehouse" label="Gudang" active={isActive('warehouses')} onClick={onNavigate} />
                </>
            )}

            {isSales && (
                <>
                    <div className="scm-nav-section-label">Penjualan</div>
                    <NavItem href={route('sales-orders.index')} icon="clipboardList" label="Sales Orders" active={isActive('sales-orders')} onClick={onNavigate} />
                </>
            )}

            {isProcurement && (
                <>
                    <div className="scm-nav-section-label">Master Data</div>
                    <NavItem href={route('products.index')} icon="tag" label="Produk" active={isActive('products')} onClick={onNavigate} />
                    <NavItem href={route('categories.index')} icon="building" label="Kategori" active={isActive('categories')} onClick={onNavigate} />
                </>
            )}

            {isAdmin && (
                <>
                    <div className="scm-nav-section-label">Laporan & Admin</div>
                    <NavItem href={route('reports.index')} icon="barChart" label="Laporan" active={isActive('reports')} onClick={onNavigate} />
                    <NavItem href={route('users.index')} icon="users" label="Manajemen User" active={isActive('users')} onClick={onNavigate} />
                </>
            )}
        </nav>
    );
}

// ── Desktop Sidebar ───────────────────────────────────────────────
function Sidebar({ user, roleName, notifCount, isCollapsed, setIsCollapsed, isActive }) {
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    function logout() {
        router.post(route('logout'));
    }

    return (
        <aside className={`scm-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Logo */}
            <div className="scm-sidebar-logo" style={{ padding: isCollapsed ? '16px 0' : '16px 20px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                <div className="scm-sidebar-logo-icon">
                    {icons.scm}
                </div>
                <div>
                    <div className="scm-sidebar-logo-text">SCM System</div>
                    <div className="scm-sidebar-logo-sub">Supply Chain</div>
                </div>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Toggle Sidebar"
                style={{
                    position: 'absolute', top: 20, right: -12,
                    width: 24, height: 24, borderRadius: '50%', background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)', color: 'var(--color-text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    zIndex: 100, transition: 'transform var(--transition-md)',
                    transform: isCollapsed ? 'rotate(180deg)' : 'none',
                }}
            >
                <div style={{ width: 14 }}>
                    {icons.chevronDown}
                </div>
            </button>

            {/* Nav */}
            <NavContent roleName={roleName} isActive={isActive} />

            {/* User footer with Dropdown */}
            <div className="scm-sidebar-footer" ref={dropRef} style={{ zIndex: dropOpen ? 100 : 1 }}>
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', cursor: 'pointer', borderRadius: 'var(--radius)', transition: 'background var(--transition)', background: dropOpen ? 'var(--color-surface-2)' : 'transparent', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    onClick={(e) => {
                        if (!e.target.closest('a')) setDropOpen(o => !o);
                    }}
                >
                    <div className="scm-avatar" style={{ width: 30, height: 30, fontSize: 11, position: 'relative' }}>
                        {user.name.charAt(0).toUpperCase()}
                        {isCollapsed && notifCount > 0 && (
                            <span style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: '#FFB4AB', borderRadius: '50%', border: '2px solid var(--color-surface)' }} />
                        )}
                    </div>

                    <div className="scm-sidebar-footer-text" style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                            <div style={{ fontSize: 10.5, color: 'var(--color-text-faint)' }}>{roleName}</div>
                        </div>

                        {/* Right side icons: Bell + Chevron */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Link href={route('notifications.index')} style={{ position: 'relative', display: 'flex', color: 'var(--color-text-muted)', transition: 'color var(--transition)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}>
                                <div style={{ width: 18, height: 18 }}>{icons.bell}</div>
                                {notifCount > 0 && (
                                    <span style={{ position: 'absolute', top: -6, right: -8, background: '#FFB4AB', color: '#1A1C19', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 10 }}>
                                        {notifCount > 9 ? '9+' : notifCount}
                                    </span>
                                )}
                            </Link>
                            <div style={{ width: 14, color: 'var(--color-text-faint)', transition: 'transform 150ms', transform: dropOpen ? 'rotate(180deg)' : 'none' }}>
                                {icons.chevronDown}
                            </div>
                        </div>
                    </div>
                </div>

                {dropOpen && (
                    <div className="scm-dropdown-menu" style={{
                        position: 'absolute',
                        top: 'auto',
                        bottom: isCollapsed ? 0 : 'calc(100% + 8px)',
                        left: isCollapsed ? '100%' : '10px',
                        right: isCollapsed ? 'auto' : '10px',
                        marginLeft: isCollapsed ? '10px' : 0,
                        minWidth: 200,
                        zIndex: 9999
                    }}>
                        <Link href={route('profile.edit')} className="scm-dropdown-item">
                            <div style={{ width: 14 }}>{icons.settings}</div>
                            Profil Saya
                        </Link>
                        <div className="scm-dropdown-divider" />
                        <button className="scm-dropdown-item" style={{ color: '#F87171' }} onClick={logout}>
                            <div style={{ width: 14 }}>{icons.logOut}</div>
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}

// ── Mobile Slide-Over Drawer ─────────────────────────────────────
function MobileDrawer({ isOpen, onClose, user, roleName, notifCount, isActive }) {
    function logout() {
        onClose();
        router.post(route('logout'));
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`scm-mobile-drawer-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            />

            {/* Off-canvas Sheet */}
            <aside className={`scm-mobile-drawer ${isOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
                {/* Header */}
                <div className="scm-mobile-drawer-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="scm-sidebar-logo-icon">
                            {icons.scm}
                        </div>
                        <div>
                            <div className="scm-sidebar-logo-text">SCM System</div>
                            <div className="scm-sidebar-logo-sub">Enterprise Mobile</div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="scm-mobile-drawer-close"
                        aria-label="Tutup Menu"
                    >
                        {icons.close}
                    </button>
                </div>

                {/* Profile Card in Drawer */}
                <div className="scm-mobile-drawer-profile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="scm-avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                <span className="scm-badge scm-badge-green" style={{ fontSize: 10, padding: '1px 6px' }}>
                                    {roleName}
                                </span>
                                {notifCount > 0 && (
                                    <span className="scm-badge scm-badge-red" style={{ fontSize: 10, padding: '1px 6px' }}>
                                        {notifCount} notif
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                        <Link
                            href={route('profile.edit')}
                            onClick={onClose}
                            className="scm-btn scm-btn-secondary scm-btn-sm"
                            style={{ justifyContent: 'center' }}
                        >
                            <span style={{ width: 14, display: 'inline-flex' }}>{icons.settings}</span>
                            Profil
                        </Link>
                        <button
                            onClick={logout}
                            className="scm-btn scm-btn-danger scm-btn-sm"
                            style={{ justifyContent: 'center' }}
                        >
                            <span style={{ width: 14, display: 'inline-flex' }}>{icons.logOut}</span>
                            Keluar
                        </button>
                    </div>
                </div>

                {/* Full Nav in Drawer */}
                <div className="scm-mobile-drawer-body">
                    <NavContent roleName={roleName} isActive={isActive} onNavigate={onClose} />
                </div>
            </aside>
        </>
    );
}

// ── Mobile Bottom Navigation Bar ─────────────────────────────────
function MobileBottomNav({ roleName, isActive, notifCount, onOpenDrawer }) {
    const isAdmin = roleName === 'Admin';
    const isProcurement = roleName === 'Procurement';
    const isGudang = roleName === 'Gudang';
    const isSales = roleName === 'Sales';

    return (
        <nav className="scm-mobile-bottom-nav" aria-label="Bottom Quick Navigation">
            {/* 1. Dashboard */}
            <Link
                href={route('dashboard')}
                className={`scm-bottom-nav-item${isActive('dashboard') ? ' active' : ''}`}
            >
                {icons.dashboard}
                <span>Home</span>
            </Link>

            {/* 2. Primary 1 based on role */}
            {isAdmin && (
                <Link
                    href={route('purchase-orders.index')}
                    className={`scm-bottom-nav-item${isActive('purchase-orders.*') ? ' active' : ''}`}
                >
                    {icons.shoppingCart}
                    <span>PO</span>
                </Link>
            )}
            {isProcurement && (
                <Link
                    href={route('purchase-orders.index')}
                    className={`scm-bottom-nav-item${isActive('purchase-orders.*') ? ' active' : ''}`}
                >
                    {icons.shoppingCart}
                    <span>PO</span>
                </Link>
            )}
            {isGudang && (
                <Link
                    href={route('receipts.index')}
                    className={`scm-bottom-nav-item${isActive('receipts') ? ' active' : ''}`}
                >
                    {icons.packageDown}
                    <span>Terima</span>
                </Link>
            )}
            {isSales && (
                <Link
                    href={route('sales-orders.index')}
                    className={`scm-bottom-nav-item${isActive('sales-orders') ? ' active' : ''}`}
                >
                    {icons.clipboardList}
                    <span>SO</span>
                </Link>
            )}

            {/* 3. Primary 2: Inventori / Stok */}
            <Link
                href={route('inventory.index')}
                className={`scm-bottom-nav-item${isActive('inventory') ? ' active' : ''}`}
            >
                {icons.package}
                <span>Stok</span>
            </Link>

            {/* 4. Primary 3: SO (Admin) / Supplier (Procurement) / Gudang (Gudang) / Notifikasi */}
            {isAdmin && (
                <Link
                    href={route('sales-orders.index')}
                    className={`scm-bottom-nav-item${isActive('sales-orders') ? ' active' : ''}`}
                >
                    {icons.clipboardList}
                    <span>SO</span>
                </Link>
            )}
            {isProcurement && (
                <Link
                    href={route('suppliers.index')}
                    className={`scm-bottom-nav-item${isActive('suppliers.*') ? ' active' : ''}`}
                >
                    {icons.truck}
                    <span>Supplier</span>
                </Link>
            )}
            {isGudang && (
                <Link
                    href={route('warehouses.index')}
                    className={`scm-bottom-nav-item${isActive('warehouses') ? ' active' : ''}`}
                >
                    {icons.warehouse}
                    <span>Gudang</span>
                </Link>
            )}
            {isSales && (
                <Link
                    href={route('products.index')}
                    className={`scm-bottom-nav-item${isActive('products') ? ' active' : ''}`}
                >
                    {icons.tag}
                    <span>Produk</span>
                </Link>
            )}
            {!isAdmin && !isProcurement && !isGudang && !isSales && (
                <Link
                    href={route('notifications.index')}
                    className={`scm-bottom-nav-item${isActive('notifications') ? ' active' : ''}`}
                >
                    <div style={{ position: 'relative' }}>
                        {icons.bell}
                        {notifCount > 0 && <span className="scm-bottom-nav-dot" />}
                    </div>
                    <span>Notif</span>
                </Link>
            )}

            {/* 5. Menu Drawer Trigger */}
            <button
                type="button"
                onClick={onOpenDrawer}
                className="scm-bottom-nav-item"
                aria-label="Buka Semua Menu"
            >
                <div style={{ position: 'relative' }}>
                    {icons.grid}
                    {notifCount > 0 && <span className="scm-bottom-nav-dot" />}
                </div>
                <span>Menu</span>
            </button>
        </nav>
    );
}

// ── Mobile Header ────────────────────────────────────────────────
function MobileHeader({ header, notifCount, onOpenDrawer }) {
    return (
        <header className="scm-mobile-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <button
                    onClick={onOpenDrawer}
                    className="scm-mobile-icon-btn"
                    aria-label="Buka Menu"
                >
                    {icons.menu}
                </button>
                <div className="scm-sidebar-logo-icon" style={{ width: 28, height: 28 }}>
                    {icons.scm}
                </div>
                <div style={{ minWidth: 0 }}>
                    <div className="scm-mobile-header-title">
                        {header || 'SCM System'}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link
                    href={route('notifications.index')}
                    className="scm-mobile-icon-btn"
                    style={{ position: 'relative' }}
                    aria-label="Notifikasi"
                >
                    {icons.bell}
                    {notifCount > 0 && (
                        <span className="scm-mobile-badge-dot">
                            {notifCount > 9 ? '9+' : notifCount}
                        </span>
                    )}
                </Link>
                <Link
                    href={route('profile.edit')}
                    className="scm-mobile-icon-btn"
                    aria-label="Profil Saya"
                >
                    {icons.settings}
                </Link>
            </div>
        </header>
    );
}

// ── Main Layout ───────────────────────────────────────────────────
export default function AuthenticatedLayout({ children, header }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const notifCount = auth.unread_notifications_count ?? 0;
    const roleName = user?.role?.name ?? 'User';

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Active path checker
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const isActive = (pattern) => {
        if (pattern === 'dashboard') return pathname === '/dashboard';
        const base = pattern.replace('.*', '').replace('*', '');
        return pathname.startsWith('/' + base);
    };

    // Close mobile drawer on route change or escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isDrawerOpen) {
                setIsDrawerOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDrawerOpen]);

    // Body scroll lock when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isDrawerOpen]);

    return (
        <div className={`scm-shell ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Desktop Sidebar */}
            <Sidebar
                user={user}
                roleName={roleName}
                notifCount={notifCount}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isActive={isActive}
            />

            {/* Mobile Header (sticky top) */}
            <MobileHeader
                header={header}
                notifCount={notifCount}
                onOpenDrawer={() => setIsDrawerOpen(true)}
            />

            {/* Mobile Slide-Over Drawer */}
            <MobileDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                user={user}
                roleName={roleName}
                notifCount={notifCount}
                isActive={isActive}
            />

            {/* Main Content Area */}
            <div className="scm-main">
                <main className="scm-content">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar (Dock) */}
            <MobileBottomNav
                roleName={roleName}
                isActive={isActive}
                notifCount={notifCount}
                onOpenDrawer={() => setIsDrawerOpen(true)}
            />
        </div>
    );
}
