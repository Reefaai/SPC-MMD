import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import FlashMessage from '@/Components/FlashMessage';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { user, unread_notifications_count: notifCount } = usePage().props.auth;
    const roleName = user.role?.name || '';
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Permission checks
    const canAccessProcurement = ['Admin', 'Procurement'].includes(roleName);
    const canAccessWarehouse = ['Admin', 'Gudang'].includes(roleName);
    const canAccessSales = ['Admin', 'Sales'].includes(roleName);
    const canAccessReports = ['Admin'].includes(roleName);
    const hasMasterData = canAccessProcurement || canAccessWarehouse;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-6 sm:-my-px sm:ms-8 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</NavLink>
                                
                                {canAccessProcurement && (
                                    <NavLink href={route('purchase-orders.index')} active={route().current('purchase-orders.*')}>Purchase Orders</NavLink>
                                )}
                                
                                {canAccessWarehouse && (
                                    <>
                                        <NavLink href={route('receipts.index')} active={route().current('receipts.*')}>Penerimaan</NavLink>
                                        <NavLink href={route('inventory.index')} active={route().current('inventory.*')}>Stok</NavLink>
                                    </>
                                )}

                                {canAccessSales && (
                                    <NavLink href={route('sales-orders.index')} active={route().current('sales-orders.*')}>Sales Orders</NavLink>
                                )}

                                {/* Master Data Dropdown */}
                                {hasMasterData && (
                                    <div className="hidden sm:flex sm:items-center">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button type="button"
                                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                                                            route().current('products.*') || route().current('categories.*') || route().current('suppliers.*') || route().current('warehouses.*')
                                                                ? 'border-indigo-400 text-gray-900'
                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                        }`}>
                                                        Master Data
                                                        <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content>
                                                {canAccessProcurement && (
                                                    <>
                                                        <Dropdown.Link href={route('products.index')}>Produk</Dropdown.Link>
                                                        <Dropdown.Link href={route('categories.index')}>Kategori</Dropdown.Link>
                                                        <Dropdown.Link href={route('suppliers.index')}>Supplier</Dropdown.Link>
                                                    </>
                                                )}
                                                {canAccessWarehouse && (
                                                    <Dropdown.Link href={route('warehouses.index')}>Gudang</Dropdown.Link>
                                                )}
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                )}

                                {canAccessReports && (
                                    <NavLink href={route('reports.index')} active={route().current('reports.*')}>Laporan</NavLink>
                                )}

                                {canAccessReports && (
                                    <NavLink href={route('users.index')} active={route().current('users.*')}>👤 Users</NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center gap-3">
                            {/* Notification Bell */}
                            <div className="relative">
                                <Link href={route('notifications.index')} className="relative inline-flex items-center p-2 rounded-full hover:bg-gray-100 transition">
                                    <span className="text-lg">🔔</span>
                                    {notifCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold">
                                            {notifCount > 9 ? '9+' : notifCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            <div className="relative ms-1">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none">
                                                {user.name} ({roleName})
                                                <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                        
                        {canAccessProcurement && (
                            <>
                                <ResponsiveNavLink href={route('purchase-orders.index')} active={route().current('purchase-orders.*')}>Purchase Orders</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('products.index')} active={route().current('products.*')}>Produk</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('categories.index')} active={route().current('categories.*')}>Kategori</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('suppliers.index')} active={route().current('suppliers.*')}>Supplier</ResponsiveNavLink>
                            </>
                        )}

                        {canAccessWarehouse && (
                            <>
                                <ResponsiveNavLink href={route('receipts.index')} active={route().current('receipts.*')}>Penerimaan</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('inventory.index')} active={route().current('inventory.*')}>Stok</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('warehouses.index')} active={route().current('warehouses.*')}>Gudang</ResponsiveNavLink>
                            </>
                        )}

                        {canAccessSales && (
                            <ResponsiveNavLink href={route('sales-orders.index')} active={route().current('sales-orders.*')}>Sales Orders</ResponsiveNavLink>
                        )}

                        {canAccessReports && (
                            <ResponsiveNavLink href={route('reports.index')} active={route().current('reports.*')}>Laporan</ResponsiveNavLink>
                        )}
                    </div>
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>

            {/* Flash notifications */}
            <FlashMessage />
        </div>
    );
}
