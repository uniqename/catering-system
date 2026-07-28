'use client';

// v2 - Cache buster
import { useState, useEffect } from 'react';
import { Bell, Search, Home, MessageSquare, ClipboardList, Calendar, Users, UtensilsCrossed, FileText, DollarSign, BarChart3, Settings, Leaf } from 'lucide-react';
import OrderManagement from '@/components/order-management';
import InquiriesForm from '@/components/inquiries-form';
import EnhancedClientManager from '@/components/enhanced-client-manager';
import ProfitDashboard from '@/components/profit-dashboard';
import DashboardRedesignFinal from '@/components/dashboard-redesign-final';
import CalendarView from '@/components/calendar-view';
import MenuPackages from '@/components/menu-packages';
import DynamicInvoiceSystem from '@/components/dynamic-invoice-system';
import PaymentsTracker from '@/components/payments-tracker';
import BusinessSettings from '@/components/business-settings';
import InquiryDetail from '@/components/inquiry-detail';
import InvoiceBuilder from '@/components/invoice-builder';
import ClientProfile from '@/components/client-profile';
import InvoiceList from '@/components/invoice-list';
import InvoiceDetail from '@/components/invoice-detail';
import OrderList from '@/components/order-list';

type Tab = 'dashboard' | 'inquiries' | 'orders' | 'calendar' | 'clients' | 'menu' | 'invoices' | 'payments' | 'reports' | 'settings';

export default function CateringPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [detailView, setDetailView] = useState<'inquiry' | 'invoice' | 'invoiceDetail' | 'client' | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

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

  const openInquiryDetail = (orderId: string) => {
    const inquiry = orders.find(o => o.id === orderId);
    if (inquiry) {
      setSelectedInquiry(inquiry);
      setDetailView('inquiry');
    }
  };

  const closeDetailView = () => {
    setDetailView(null);
    setSelectedInquiry(null);
    setSelectedClient(null);
  };

  const updateInquiry = (inquiry: any) => {
    saveOrders(orders.map(o => (o.id === inquiry.id ? inquiry : o)));
  };

  const deleteInquiry = (id: string) => {
    saveOrders(orders.filter(o => o.id !== id));
  };

  const openInvoiceBuilder = () => {
    setDetailView('invoice');
  };

  const saveInvoice = (invoice: any) => {
    localStorage.setItem(`invoice_${invoice.id}`, JSON.stringify(invoice));
    closeDetailView();
    setActiveTab('invoices');
  };

  const openClientProfile = (clientName: string) => {
    setSelectedClient(clientName);
    setDetailView('client');
  };

  const sendProposal = (inquiryId: string) => {
    alert(`Proposal sent for inquiry ${inquiryId}`);
  };

  const openInquiryBuilder = () => {
    setActiveTab('inquiries');
  };

  const navItems: Array<{ id: Tab; icon: any; label: string; badge?: number }> = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'inquiries', icon: MessageSquare, label: 'Inquiries', badge: orders.filter(o => o.status === 'inquiry').length },
    { id: 'orders', icon: ClipboardList, label: 'Orders' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'menu', icon: UtensilsCrossed, label: 'Menu & Packages' },
    { id: 'invoices', icon: FileText, label: 'Invoices' },
    { id: 'payments', icon: DollarSign, label: 'Payments' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardRedesignFinal
          orders={orders}
          onNavigate={(tab: string) => setActiveTab(tab as Tab)}
          onOpenInquiry={openInquiryDetail}
          onOpenClient={openClientProfile}
          onCreateInvoice={openInvoiceBuilder}
        />;
      case 'inquiries':
        return <InquiriesForm onAdd={addOrder} />;
      case 'orders':
        return <OrderList
          orders={orders}
          onViewOrder={openInquiryDetail}
          onCreateNew={openInquiryBuilder}
        />;
      case 'calendar':
        return <CalendarView orders={orders} />;
      case 'clients':
        return <EnhancedClientManager orders={orders} />;
      case 'menu':
        return <MenuPackages />;
      case 'invoices':
        return <InvoiceList
          onCreateNew={openInvoiceBuilder}
          onViewInvoice={(id) => {
            const invoiceData = localStorage.getItem(`invoice_${id}`);
            if (invoiceData) {
              setSelectedInvoice(JSON.parse(invoiceData));
              setDetailView('invoiceDetail');
            }
          }}
        />;
      case 'payments':
        return <PaymentsTracker orders={orders} />;
      case 'reports':
        return <ProfitDashboard orders={orders} />;
      case 'settings':
        return <BusinessSettings />;
      default:
        return <DashboardRedesignFinal
          orders={orders}
          onNavigate={(tab: string) => setActiveTab(tab as Tab)}
          onOpenInquiry={openInquiryDetail}
          onOpenClient={openClientProfile}
          onCreateInvoice={openInvoiceBuilder}
        />;
    }
  };

  if (!isMounted) return null;

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ backgroundColor: '#0a1911', borderRightColor: '#102418' }} className="fixed left-0 top-0 w-56 h-screen border-r text-white shadow-2xl flex flex-col z-40">
        {/* Logo Section - Large */}
        <div style={{ borderBottomColor: '#102418' }} className="p-4 border-b flex flex-col items-center justify-center">
          <img src="/garage-to-table-logo.png" alt="Garage to Table" className="w-40 h-40 object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                style={{
                  color: isActive ? '#d7a859' : '#ffffff',
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition relative text-sm ${isActive ? 'font-bold' : 'font-normal'}`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge ? (
                  <span style={{ backgroundColor: '#ef4444' }} className="text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* CTA Box */}
        <div style={{ borderTopColor: '#102418' }} className="p-3 border-t">
          <div style={{ backgroundColor: '#102418', borderColor: '#d7a859' }} className="rounded-xl p-4 border-2 relative overflow-hidden">
            <Leaf style={{ color: '#d7a859', opacity: 0.2 }} className="absolute right-2 bottom-1 w-16 h-16" />
            <p style={{ color: '#d7a859' }} className="font-bold text-sm mb-1">Grow your business</p>
            <p className="text-xs text-white mb-3">Set up inquiry form in 2 minutes and get more bookings.</p>
            <button style={{ backgroundColor: '#d7a859', color: '#0a1911' }} className="w-full text-xs font-bold py-2 rounded-lg transition hover:opacity-90">
              Get Started →
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div style={{ borderTopColor: '#102418' }} className="p-3 border-t">
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: '#d7a859' }} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <span style={{ color: '#0a1911' }} className="text-lg font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Alexandra</p>
              <p style={{ color: '#d7a859' }} className="text-xs truncate">Business Owner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-56">
        {/* Detail Views */}
        {detailView === 'inquiry' && selectedInquiry && (
          <InquiryDetail
            inquiry={selectedInquiry}
            onBack={closeDetailView}
            onUpdate={updateInquiry}
            onDelete={deleteInquiry}
            onSendProposal={sendProposal}
            onCreateInvoice={openInvoiceBuilder}
          />
        )}

        {detailView === 'invoice' && (
          <InvoiceBuilder
            orders={orders}
            onBack={closeDetailView}
            onSaveInvoice={saveInvoice}
          />
        )}

        {detailView === 'client' && selectedClient && (
          <ClientProfile
            clientName={selectedClient}
            orders={orders}
            onBack={closeDetailView}
            onViewInquiry={openInquiryDetail}
          />
        )}

        {detailView === 'invoiceDetail' && selectedInvoice && (
          <InvoiceDetail
            invoice={selectedInvoice}
            onBack={closeDetailView}
          />
        )}

        {/* Main Tab Views */}
        {detailView === null && (
          <>
            {activeTab === 'dashboard' ? (
              renderContent()
            ) : (
              <>
                {/* Header */}
                <div style={{ backgroundColor: '#0a1911', borderBottomColor: '#d7a859' }} className="border-b-2 sticky top-0 z-30">
                  <div className="px-8 py-4 flex items-center justify-between">
                    <h1 style={{ color: '#d7a859' }} className="text-2xl font-bold">
                      {navItems.find(item => item.id === activeTab)?.label}
                    </h1>
                  </div>
                </div>

                {/* Content */}
                <div style={{ backgroundColor: '#0a1911' }} className="px-8 py-8 min-h-[calc(100vh-73px)]">
                  <div style={{ backgroundColor: '#102418', borderColor: '#d7a859' }} className="rounded-2xl border p-8 shadow-sm min-h-96">
                    {renderContent()}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
