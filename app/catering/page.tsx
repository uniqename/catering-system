'use client';

import { useState, useEffect } from 'react';
import OrdersList from '@/components/orders-list';
import InvoiceGenerator from '@/components/invoice-generator';
import VoiceNotes from '@/components/voice-notes';
import QuickOrderForm from '@/components/quick-order-form';
import ClientProfiles from '@/components/client-profiles';
import ProfitDashboard from '@/components/profit-dashboard';
import PDFInvoiceGenerator from '@/components/pdf-invoice-generator';
import WhatsAppIntegrator from '@/components/whatsapp-integrator';
import RealCostIntake from '@/components/real-cost-intake';
import RentalPricing from '@/components/rental-pricing';
import TaxReminders from '@/components/tax-reminders';
import ShippingLog from '@/components/shipping-log';
import VoiceToOrder from '@/components/voice-to-order';
import QRIntake from '@/components/qr-intake';
import ProfessionalInvoice from '@/components/professional-invoice';

type Tab = 'orders' | 'invoice' | 'voice' | 'new-order' | 'clients' | 'profits' | 'costs' | 'rentals' | 'tax' | 'shipping' | 'voice-intake' | 'qr-intake' | 'pro-invoice' | 'whatsapp';

export default function CateringDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('catering_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      // Load demo data on first visit
      const demoOrders = [
        {
          id: '1',
          clientName: 'Sarah Johnson',
          eventDate: '2026-07-25',
          guestCount: 120,
          eventType: 'wedding',
          notes: 'Vegetarian options needed, gluten-free for 2 guests',
          status: 'confirmed',
          createdAt: '2026-07-01',
        },
        {
          id: '2',
          clientName: 'Michael Brown',
          eventDate: '2026-08-10',
          guestCount: 75,
          eventType: 'corporate',
          notes: 'Business lunch, professional presentation needed',
          status: 'quoted',
          createdAt: '2026-06-28',
        },
        {
          id: '3',
          clientName: 'Emma Davis',
          eventDate: '2026-07-15',
          guestCount: 150,
          eventType: 'birthday',
          notes: 'Kids party, fun colorful presentation please',
          status: 'inquiry',
          createdAt: '2026-06-29',
        },
        {
          id: '4',
          clientName: 'James Wilson',
          eventDate: '2026-07-08',
          guestCount: 200,
          eventType: 'wedding',
          notes: 'Elegant affair, want jollof rice and fried rice combo',
          status: 'delivered',
          createdAt: '2026-06-15',
        },
        {
          id: '5',
          clientName: 'Lisa Martinez',
          eventDate: '2026-07-20',
          guestCount: 50,
          eventType: 'graduation',
          notes: 'Small intimate gathering, budget conscious',
          status: 'confirmed',
          createdAt: '2026-06-25',
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

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'inquiry').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
  };

  const navItems = [
    { id: 'orders', label: 'Orders', icon: '📋', badge: orders.length },
    { id: 'new-order', label: 'New Inquiry', icon: '➕' },
    { id: 'voice-intake', label: 'Voice Intake', icon: '🎤' },
    { id: 'qr-intake', label: 'QR Intake', icon: '📱' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'costs', label: 'Cost Tracking', icon: '💸' },
    { id: 'rentals', label: 'Rental Pricing', icon: '🪑' },
    { id: 'tax', label: 'Tax Reminders', icon: '📅' },
    { id: 'shipping', label: 'Shipping Log', icon: '📦' },
    { id: 'profits', label: 'Profit Analysis', icon: '📊' },
    { id: 'pro-invoice', label: 'Pro Invoicing', icon: '💼' },
    { id: 'whatsapp', label: 'WhatsApp Msgs', icon: '💬' },
    { id: 'voice', label: 'Voice Notes', icon: '📙' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-teal-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white">🍽️ Catering Orders</h1>
              <p className="text-emerald-100 mt-2 text-lg">Manage your catering business with ease</p>
            </div>
            <div className="text-white text-right bg-amber-500 bg-opacity-20 px-6 py-4 rounded-xl">
              <p className="text-3xl font-black text-amber-500">{stats.total}</p>
              <p className="text-emerald-100">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-teal-900 hover:border-amber-500 hover:shadow-lg transition">
            <p className="text-teal-900 text-sm font-semibold uppercase tracking-wide">New Inquiries</p>
            <p className="text-4xl font-black text-teal-900 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-teal-900 hover:border-amber-500 hover:shadow-lg transition">
            <p className="text-teal-900 text-sm font-semibold uppercase tracking-wide">Confirmed</p>
            <p className="text-4xl font-black text-teal-900 mt-2">{stats.confirmed}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-teal-900 hover:border-amber-500 hover:shadow-lg transition">
            <p className="text-teal-900 text-sm font-semibold uppercase tracking-wide">This Month</p>
            <p className="text-4xl font-black text-teal-900 mt-2">{stats.total}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as Tab)}
              className={`px-6 py-3 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-teal-900 shadow-xl scale-105'
                  : 'bg-white text-teal-900 hover:bg-emerald-50 border-2 border-teal-900 hover:border-amber-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-1">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {activeTab === 'orders' && <OrdersList orders={orders} onUpdate={saveOrders} />}
          {activeTab === 'new-order' && <QuickOrderForm onAdd={addOrder} />}
          {activeTab === 'voice-intake' && <VoiceToOrder onCreateOrder={addOrder} />}
          {activeTab === 'qr-intake' && <QRIntake onCreateOrder={addOrder} />}
          {activeTab === 'clients' && (
            <ClientProfiles
              orders={orders}
              onSelectClient={(clientName) => {
                // Prefill form with client name
                setActiveTab('new-order');
              }}
            />
          )}
          {activeTab === 'costs' && <RealCostIntake />}
          {activeTab === 'rentals' && <RentalPricing />}
          {activeTab === 'tax' && <TaxReminders />}
          {activeTab === 'shipping' && <ShippingLog />}
          {activeTab === 'profits' && <ProfitDashboard orders={orders} />}
          {activeTab === 'pro-invoice' && <ProfessionalInvoice />}
          {activeTab === 'whatsapp' && <WhatsAppIntegrator orders={orders} />}
          {activeTab === 'voice' && <VoiceNotes />}
        </div>
      </div>
    </div>
  );
}
