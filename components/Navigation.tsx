'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardIcon, CalendarIcon, TableIcon, RestaurantIcon } from './Icons';

const SettingsIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: DashboardIcon },
    { href: '/reservations', label: 'Reservas', icon: CalendarIcon },
    { href: '/tables', label: 'Mesas', icon: TableIcon },
    { href: '/settings', label: 'Ajustes', icon: SettingsIcon },
  ];

  return (
    <nav className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <RestaurantIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[var(--text-primary)] leading-none">REBOTLUTION</h1>
                <p className="text-xs text-[var(--text-secondary)] leading-none mt-0.5">Restaurant CRM</p>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-[var(--text-primary)]">Admin</p>
              <p className="text-xs text-[var(--text-secondary)]">Administrador</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-[var(--border)] px-2 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
