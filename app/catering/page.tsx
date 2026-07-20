'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/dashboard-shell';
import OrdersList from '@/components/orders-list';
import QuickOrderForm from '@/components/quick-order-form';
import ClientProfiles from '@/components/client-profiles';
import ProfitDashboard from '@/components/profit-dashboard';
import RealCostIntake from '@/components/real-cost-intake';
import RentalPricing from '@/components/rental-pricing';
import TaxReminders from '@/components/tax-reminders';
import ShippingLog from '@/components/shipping-log';
import VoiceToOrder from '@/components/voice-to-order';
import QRIntake from '@/components/qr-intake';
import ProfessionalInvoice from '@/components/professional-invoice';
import DashboardRedesign from '@/components/dashboard-redesign';
import VoiceNotes from '@/components/voice-notes';

type Tab = 'dashboard' | 'orders' | 'inquiries' | 'clients' | 'invoices' | 'costs' | 'rentals' | 'shipping' | 'reports' | 'menu' | 'calendar';

export default function CateringDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardRedesign orders={orders} />;
      case 'orders':
        return <OrdersList orders={orders} onUpdate={saveOrders} />;
      case 'inquiries':
        return <QuickOrderForm onAdd={addOrder} />;
      case 'clients':
        return <ClientProfiles orders={orders} onSelectClient={() => setActiveTab('inquiries')} />;
      case 'invoices':
        return <ProfessionalInvoice />;
      case 'costs':
        return <RealCostIntake />;
      case 'rentals':
        return <RentalPricing />;
      case 'shipping':
        return <ShippingLog />;
      case 'reports':
        return <ProfitDashboard orders={orders} />;
      default:
        return <DashboardRedesign orders={orders} />;
    }
  };

  return (
    <DashboardShell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardShell>
  );
}
