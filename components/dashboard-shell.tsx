'use client';

import { Bell, Search } from 'lucide-react';

type Tab = 'dashboard' | 'orders' | 'inquiries' | 'clients' | 'invoices' | 'costs' | 'rentals' | 'shipping' | 'reports' | 'menu' | 'calendar';

interface DashboardShellProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  children: React.ReactNode;
}

export default function DashboardShell({ activeTab, onTabChange, children }: DashboardShellProps) {
  const navItems: Array<{ id: Tab; icon: string; label: string }> = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'inquiries', icon: '💬', label: 'New Inquiries' },
    { id: 'orders', icon: '📋', label: 'Orders' },
    { id: 'calendar', icon: '📅', label: 'Calendar' },
    { id: 'clients', icon: '👥', label: 'Clients' },
    { id: 'menu', icon: '🍽️', label: 'Menu & Packages' },
    { id: 'invoices', icon: '📄', label: 'Invoices' },
    { id: 'costs', icon: '💸', label: 'Costs & Margins' },
    { id: 'rentals', icon: '🪑', label: 'Rental Pricing' },
    { id: 'shipping', icon: '📦', label: 'Shipping Log' },
    { id: 'reports', icon: '📊', label: 'Reports' },
  ];

  const isDashboard = activeTab === 'dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-56 h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white shadow-2xl flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-teal-700">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center text-teal-900 font-bold text-lg">
              🔥
            </div>
            <div>
              <p className="font-serif text-lg font-bold">Garage to Table</p>
              <p className="text-xs text-teal-200">CATERING</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? 'bg-amber-500 text-teal-900 font-semibold'
                  : 'text-teal-100 hover:bg-teal-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Grow Business CTA */}
        <div className="p-4 border-t border-teal-700">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 text-teal-900">
            <p className="font-semibold text-sm mb-2">Grow your business</p>
            <p className="text-xs text-teal-800 mb-3">Set up your online inquiry form</p>
            <button className="w-full bg-teal-900 text-amber-300 text-xs font-bold py-2 rounded-lg hover:bg-teal-950 transition">
              Get Started →
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-teal-700">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center text-teal-900 font-bold">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Business Owner</p>
              <p className="text-xs text-teal-200 truncate">Garage to Table</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-56 min-h-screen">
        {isDashboard ? (
          children
        ) : (
          <>
            {/* Header for non-dashboard pages */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
              <div className="px-8 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">
                  {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>

                <div className="flex items-center gap-4">
                  <button title="Search" className="p-2 hover:bg-slate-100 rounded-lg transition">
                    <Search className="w-5 h-5 text-slate-600" />
                  </button>
                  <button title="Notifications" className="relative p-2 hover:bg-slate-100 rounded-lg transition">
                    <Bell className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                {children}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
