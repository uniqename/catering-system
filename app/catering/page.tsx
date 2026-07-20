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
import DashboardRedesign from '@/components/dashboard-redesign';

type Tab = 'dashboard' | 'orders' | 'invoice' | 'voice' | 'new-order' | 'clients' | 'profits' | 'costs' | 'rentals' | 'tax' | 'shipping' | 'voice-intake' | 'qr-intake' | 'pro-invoice' | 'whatsapp';

export default function CateringDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('catering_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  return (
    <DashboardRedesign orders={orders} />
  );
}
