'use client';

import { useState, useEffect } from 'react';
import OrdersList from '@/components/orders-list';
import InvoiceGenerator from '@/components/invoice-generator';
import VoiceNotes from '@/components/voice-notes';
import QuickOrderForm from '@/components/quick-order-form';

type Tab = 'orders' | 'invoice' | 'voice' | 'new-order';

export default function CateringDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Load orders from localStorage
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">🍽️ Catering Orders</h1>
          <p className="text-gray-600 mt-1">Manage inquiries, invoices & orders</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📋 All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('new-order')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'new-order'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ➕ New Inquiry
          </button>
          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'invoice'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🧾 Invoice
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'voice'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🎤 Voice Notes
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {activeTab === 'orders' && <OrdersList orders={orders} onUpdate={saveOrders} />}
          {activeTab === 'new-order' && <QuickOrderForm onAdd={addOrder} />}
          {activeTab === 'invoice' && <InvoiceGenerator orders={orders} />}
          {activeTab === 'voice' && <VoiceNotes />}
        </div>
      </div>
    </div>
  );
}
