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

type Tab = 'orders' | 'invoice' | 'voice' | 'new-order' | 'clients' | 'profits' | 'pdf-invoice' | 'whatsapp';

export default function CateringDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('catering_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
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
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'pdf-invoice', label: 'Professional Invoice', icon: '📄' },
    { id: 'profits', label: 'Profit Analysis', icon: '📊' },
    { id: 'whatsapp', label: 'WhatsApp Msgs', icon: '💬' },
    { id: 'invoice', label: 'Quick Invoice', icon: '🧾' },
    { id: 'voice', label: 'Voice Notes', icon: '🎤' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white">🍽️ Catering Orders</h1>
              <p className="text-amber-100 mt-2 text-lg">Manage your catering business with ease</p>
            </div>
            <div className="text-white text-right">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-amber-100">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition">
            <p className="text-amber-200 text-sm font-semibold uppercase tracking-wide">New Inquiries</p>
            <p className="text-4xl font-black text-white mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition">
            <p className="text-green-300 text-sm font-semibold uppercase tracking-wide">Confirmed</p>
            <p className="text-4xl font-black text-white mt-2">{stats.confirmed}</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition">
            <p className="text-blue-300 text-sm font-semibold uppercase tracking-wide">This Month</p>
            <p className="text-4xl font-black text-white mt-2">{stats.total}</p>
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
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl scale-105'
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20 border border-white border-opacity-20'
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
          {activeTab === 'clients' && (
            <ClientProfiles
              orders={orders}
              onSelectClient={(clientName) => {
                // Prefill form with client name
                setActiveTab('new-order');
              }}
            />
          )}
          {activeTab === 'profits' && <ProfitDashboard orders={orders} />}
          {activeTab === 'pdf-invoice' && <PDFInvoiceGenerator orders={orders} />}
          {activeTab === 'whatsapp' && <WhatsAppIntegrator orders={orders} />}
          {activeTab === 'invoice' && <InvoiceGenerator orders={orders} />}
          {activeTab === 'voice' && <VoiceNotes />}
        </div>
      </div>
    </div>
  );
}
