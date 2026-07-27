'use client';

import { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import OrdersList from '@/components/orders-list';
import InquiriesForm from '@/components/inquiries-form';
import ClientProfiles from '@/components/client-profiles';
import ProfitDashboard from '@/components/profit-dashboard';
import RealCostIntake from '@/components/real-cost-intake';
import RentalPricing from '@/components/rental-pricing';
import TaxReminders from '@/components/tax-reminders';
import ShippingLog from '@/components/shipping-log';
import VoiceToOrder from '@/components/voice-to-order';
import QRIntake from '@/components/qr-intake';
import ProfessionalInvoice from '@/components/professional-invoice';
import DashboardComplete from '@/components/dashboard-complete';
import ClientManager from '@/components/client-manager';
import VoiceNotes from '@/components/voice-notes';
import DashboardLuxury from '@/components/dashboard-luxury';

type Tab = 'dashboard' | 'inquiries' | 'orders' | 'calendar' | 'clients' | 'menu' | 'invoices' | 'payments' | 'reports' | 'settings';

export default function CateringPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('catering_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      const demoOrders = [
        {
          id: '1',
          clientName: 'Sarah Johnson',
          eventDate: '2026-07-25',
          guestCount: 120,
          eventType: 'wedding',
          notes: 'Vegetarian options needed',
          status: 'confirmed',
          createdAt: '2026-07-01',
        },
        {
          id: '2',
          clientName: 'Michael Brown',
          eventDate: '2026-08-10',
          guestCount: 75,
          eventType: 'corporate',
          notes: 'Business lunch',
          status: 'quoted',
          createdAt: '2026-06-28',
        },
      ];
      setOrders(demoOrders);
      localStorage.setItem('catering_orders', JSON.stringify(demoOrders));
    }
  }, []);

  const saveOrders = (updatedOrders: any[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('catering_orders', JSON.stringify(updatedOrders));
  };

  const addOrder = (order: any) => {
    const newOrder = {
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString(),
      status: 'inquiry',
      ...order,
    };
    saveOrders([newOrder, ...orders]);
    setActiveTab('orders');
  };

  const navItems: Array<{ id: Tab; icon: string; label: string; badge?: number }> = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'inquiries', icon: '💬', label: 'Inquiries', badge: orders.filter(o => o.status === 'inquiry').length },
    { id: 'orders', icon: '📋', label: 'Orders' },
    { id: 'calendar', icon: '📅', label: 'Calendar' },
    { id: 'clients', icon: '👥', label: 'Clients' },
    { id: 'menu', icon: '🍽️', label: 'Menu & Packages' },
    { id: 'invoices', icon: '📄', label: 'Invoices' },
    { id: 'payments', icon: '💳', label: 'Payments' },
    { id: 'reports', icon: '📊', label: 'Reports' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardLuxury orders={orders} onNavigate={(tab: string) => setActiveTab(tab as Tab)} />;
      case 'inquiries':
        return <InquiriesForm onAdd={addOrder} />;
      case 'orders':
        return <OrdersList orders={orders} onUpdate={saveOrders} />;
      case 'calendar':
        return <div className="p-8 text-white">Calendar view coming soon</div>;
      case 'clients':
        return <ClientManager orders={orders} />;
      case 'menu':
        return <div className="p-8 text-white">Menu & Packages coming soon</div>;
      case 'invoices':
        return <ProfessionalInvoice />;
      case 'payments':
        return <div className="p-8 text-white">Payments coming soon</div>;
      case 'reports':
        return <ProfitDashboard orders={orders} />;
      case 'settings':
        return <div className="p-8 text-amber-950">Settings coming soon</div>;
      default:
        return <DashboardLuxury orders={orders} onNavigate={(tab: string) => setActiveTab(tab as Tab)} />;
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-amber-950 to-amber-900 border-r border-amber-800 text-white shadow-2xl flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-amber-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center text-amber-950 font-bold text-xl font-serif">
              G
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-white">Garage to Table</p>
              <p className="text-xs text-amber-300">Catering</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition relative ${
                activeTab === item.id
                  ? 'bg-amber-800 text-amber-200 font-semibold border-2 border-amber-600'
                  : 'text-amber-100 hover:bg-amber-800/50 hover:text-amber-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              {item.badge ? (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="p-4 border-t border-amber-800">
          <div className="bg-gradient-to-br from-amber-800 to-amber-700 rounded-lg p-4 border-2 border-amber-600">
            <p className="font-semibold text-sm text-white mb-2">Grow your business</p>
            <p className="text-xs text-amber-200 mb-3">Setup inquiry form</p>
            <button className="w-full bg-amber-300 hover:bg-amber-200 text-amber-950 text-xs font-bold py-2 rounded-lg transition font-semibold">
              Get Started →
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 border-t border-amber-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center text-amber-950 font-bold text-sm">
              E
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Enam Egyir</p>
              <p className="text-xs text-amber-300 truncate">Business Owner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {activeTab === 'dashboard' ? (
          renderContent()
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-amber-200 sticky top-0 z-30 bg-white/95 backdrop-blur">
              <div className="px-8 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-amber-950">
                  {navItems.find(item => item.id === activeTab)?.label}
                </h1>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-8 min-h-[calc(100vh-73px)] bg-gradient-to-br from-amber-50 to-amber-50">
              <div className="bg-white rounded-2xl border-2 border-amber-200 p-8 shadow-sm min-h-96">
                {renderContent()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
