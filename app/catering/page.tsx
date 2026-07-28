'use client';

// v2 - Cache buster
import { useState, useEffect } from 'react';
import { Bell, Search, Home, MessageSquare, ClipboardList, Calendar, Users, UtensilsCrossed, FileText, DollarSign, BarChart3, Settings, Leaf } from 'lucide-react';
import OrderManagement from '@/components/order-management';
import InquiriesForm from '@/components/inquiries-form';
import ClientsList from '@/components/clients-list-redesigned';
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
import EventDetail from '@/components/event-detail';
import RevenueAnalytics from '@/components/revenue-analytics';
import InquiriesList from '@/components/inquiries-list';
import InvoiceListRedesigned from '@/components/invoice-list-redesigned';

type Tab = 'dashboard' | 'inquiries' | 'orders' | 'calendar' | 'clients' | 'menu' | 'invoices' | 'payments' | 'reports' | 'settings';

export default function CateringPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [detailView, setDetailView] = useState<'inquiry' | 'invoice' | 'invoiceDetail' | 'client' | 'eventDetail' | 'revenueAnalytics' | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showNewInquiryForm, setShowNewInquiryForm] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const version = localStorage.getItem('catering_orders_version');
    const saved = localStorage.getItem('catering_orders');
    if (saved && version === 'v2') {
      setOrders(JSON.parse(saved));
    } else {
      // Clear old version
      const demoOrders = [
        { id: '1', clientName: 'Amelia Johnson', eventDate: '2026-06-15', guestCount: 120, eventType: 'wedding', budget: '$5,840.00', status: 'confirmed', createdAt: '2026-05-01', phone: '(614) 555-0196', email: 'amelia.johnson@email.com', venue: 'The Grand Pavilion' },
        { id: '2', clientName: 'Michael Smith', eventDate: '2026-06-13', guestCount: 75, eventType: 'lunch', budget: '$2,760.00', status: 'quoted', createdAt: '2026-05-28' },
        { id: '3', clientName: 'Sarah Williams', eventDate: '2026-06-07', guestCount: 40, eventType: 'birthday', budget: '$910.00', status: 'deposit_paid', createdAt: '2026-05-15' },
        { id: '4', clientName: 'David Brown', eventDate: '2026-06-21', guestCount: 60, eventType: 'graduation', budget: '$980.00', status: 'confirmed', createdAt: '2026-05-10' },
        { id: '5', clientName: 'Lisa Davis', eventDate: '2026-06-08', guestCount: 30, eventType: 'shower', budget: '$450.00', status: 'inquiry', createdAt: '2026-05-20' },
        { id: '6', clientName: 'Robert Johnson', eventDate: '2026-06-30', guestCount: 100, eventType: 'lunch', budget: '$3,250.00', status: 'quoted', createdAt: '2026-05-12' },
        { id: '7', clientName: 'Kevin Parker', eventDate: '2026-07-05', guestCount: 150, eventType: 'wedding', budget: '$6,250.00', status: 'quoted', createdAt: '2026-04-28' },
        { id: '8', clientName: 'Mark Thompson', eventDate: '2026-07-12', guestCount: 20, eventType: 'anniversary', budget: '$620.00', status: 'confirmed', createdAt: '2026-05-05' },
        { id: '9', clientName: 'Jennifer Lee', eventDate: '2026-07-10', guestCount: 25, eventType: 'lunch', budget: '$375.00', status: 'inquiry', createdAt: '2026-06-01' },
        { id: '10', clientName: 'Chris Dana', eventDate: '2026-07-18', guestCount: 15, eventType: 'dinner', budget: '$300.00', status: 'inquiry', createdAt: '2026-06-15' },
        { id: '11', clientName: 'Daniel Mensah', eventDate: '2026-07-26', guestCount: 200, eventType: 'wedding', budget: '$8,750.00', status: 'confirmed', createdAt: '2026-06-10' },
        { id: '12', clientName: 'Innovate LLC', eventDate: '2026-08-02', guestCount: 80, eventType: 'launch', budget: '$4,120.00', status: 'deposit_paid', createdAt: '2026-06-20' },
      ];
      setOrders(demoOrders);
      localStorage.setItem('catering_orders', JSON.stringify(demoOrders));
      localStorage.setItem('catering_orders_version', 'v3');
    }

    // Initialize clients
    const demoClients = [
      { id: 'cli_1', name: 'Amelia Johnson', company: 'Amelia & James Wedding', phone: '(614) 555-0196', email: 'amelia.johnson@email.com', address: '123 Celebration Way', city: 'Columbus', state: 'OH', zipCode: '43215', status: 'active', clientType: 'VIP', tags: ['Wedding', 'VIP'], eventCount: 3, totalSpent: 8540, lastEventDate: '2026-06-15', createdAt: '2026-04-01' },
      { id: 'cli_2', name: 'Michael Smith', company: 'Tech Solutions LLC', phone: '(614) 555-0132', email: 'michael.smith@techsol.com', address: '456 Corporate Ave', city: 'Columbus', state: 'OH', zipCode: '43216', status: 'active', clientType: 'Regular', tags: ['Corporate'], eventCount: 2, totalSpent: 4620, lastEventDate: '2026-06-13', createdAt: '2026-05-28' },
      { id: 'cli_3', name: 'Sarah Williams', company: 'Sarah Williams Events', phone: '(614) 555-0178', email: 'sarah.williams@gmail.com', address: '789 Party Lane', city: 'Columbus', state: 'OH', zipCode: '43217', status: 'active', clientType: 'VIP', tags: ['Birthday', 'VIP', 'Referral'], eventCount: 4, totalSpent: 6780, lastEventDate: '2026-06-07', createdAt: '2026-03-15' },
      { id: 'cli_4', name: 'David Brown', company: 'Brown & Associates', phone: '(614) 555-0111', email: 'david.b@brownassoc.com', address: '321 Business Blvd', city: 'Columbus', state: 'OH', zipCode: '43218', status: 'active', clientType: 'Regular', tags: ['Corporate', 'Repeat'], eventCount: 3, totalSpent: 5200, lastEventDate: '2026-06-21', createdAt: '2026-02-01' },
      { id: 'cli_5', name: 'Lisa Davis', company: 'Lisa Davis Photography', phone: '(614) 555-0166', email: 'lisa.davis@photo.com', address: '654 Creative Way', city: 'Columbus', state: 'OH', zipCode: '43219', status: 'active', clientType: 'Regular', tags: ['Baby Shower'], eventCount: 2, totalSpent: 2450, lastEventDate: '2026-06-08', createdAt: '2026-05-20' },
      { id: 'cli_6', name: 'Robert Johnson', company: 'Johnson Family', phone: '(614) 555-0199', email: 'robert.j@johnfam.com', address: '147 Family Court', city: 'Columbus', state: 'OH', zipCode: '43220', status: 'active', clientType: 'VIP', tags: ['Family Event', 'High Value'], eventCount: 5, totalSpent: 9350, lastEventDate: '2026-06-30', createdAt: '2026-01-10' },
      { id: 'cli_7', name: 'Kevin Parker', company: 'Parker Group', phone: '(614) 555-0144', email: 'kevin.p@parkergrp.com', address: '258 Executive Plaza', city: 'Columbus', state: 'OH', zipCode: '43221', status: 'active', clientType: 'Regular', tags: ['Corporate'], eventCount: 2, totalSpent: 6250, lastEventDate: '2026-07-05', createdAt: '2026-04-28' },
      { id: 'cli_8', name: 'Mark Thompson', company: 'Thompson Holdings', phone: '(614) 555-0123', email: 'mark.t@thompson.com', address: '369 Market Street', city: 'Columbus', state: 'OH', zipCode: '43222', status: 'lead', clientType: 'Regular', tags: ['Corporate'], eventCount: 1, totalSpent: 3980, lastEventDate: '2026-07-12', createdAt: '2026-05-05' },
    ];
    setClients(demoClients);

    // Initialize invoices
    const demoInvoices = [
      { id: 'INV-1001', invoiceNumber: 'INV-1001', clientName: 'Amelia Johnson', clientEmail: 'amelia.johnson@email.com', clientPhone: '(614) 555-0196', eventName: 'Amelia & James Wedding', eventDate: '2026-06-15', issueDate: '2026-05-01', dueDate: '2026-06-01', amount: 5840, paidAmount: 5840, status: 'paid', address: 'The Grand Pavilion, Columbus, OH' },
      { id: 'INV-1002', invoiceNumber: 'INV-1002', clientName: 'Michael Smith', clientEmail: 'michael.smith@techsol.com', clientPhone: '(614) 555-0132', eventName: 'Tech Solutions Corporate Event', eventDate: '2026-06-13', issueDate: '2026-05-28', dueDate: '2026-06-28', amount: 2760, paidAmount: 1380, status: 'partially_paid', address: 'Tech Solutions LLC, Columbus, OH' },
      { id: 'INV-1003', invoiceNumber: 'INV-1003', clientName: 'Sarah Williams', clientEmail: 'sarah.williams@gmail.com', clientPhone: '(614) 555-0178', eventName: 'Sarah Williams Birthday', eventDate: '2026-06-07', issueDate: '2026-05-15', dueDate: '2026-06-15', amount: 910, paidAmount: 500, status: 'overdue', address: 'Sarah\'s Home, Columbus, OH' },
      { id: 'INV-1004', invoiceNumber: 'INV-1004', clientName: 'David Brown', clientEmail: 'david.b@brownassoc.com', clientPhone: '(614) 555-0111', eventName: 'Graduation Celebration', eventDate: '2026-06-21', issueDate: '2026-05-10', dueDate: '2026-06-10', amount: 980, paidAmount: 980, status: 'paid', address: 'Brown & Associates, Columbus, OH' },
      { id: 'INV-1005', invoiceNumber: 'INV-1005', clientName: 'Lisa Davis', clientEmail: 'lisa.davis@photo.com', clientPhone: '(614) 555-0166', eventName: 'Baby Shower', eventDate: '2026-06-08', issueDate: '2026-05-20', dueDate: '2026-06-20', amount: 450, paidAmount: 0, status: 'sent', address: 'Creative Venue, Columbus, OH' },
      { id: 'INV-1006', invoiceNumber: 'INV-1006', clientName: 'Robert Johnson', clientEmail: 'robert.j@johnfam.com', clientPhone: '(614) 555-0199', eventName: 'Family Gathering', eventDate: '2026-06-30', issueDate: '2026-05-12', dueDate: '2026-06-12', amount: 3250, paidAmount: 3250, status: 'paid', address: 'Johnson Family Estate, Columbus, OH' },
      { id: 'INV-1007', invoiceNumber: 'INV-1007', clientName: 'Kevin Parker', clientEmail: 'kevin.p@parkergrp.com', clientPhone: '(614) 555-0144', eventName: 'Kevin & Lauren Wedding', eventDate: '2026-07-05', issueDate: '2026-04-28', dueDate: '2026-05-28', amount: 6250, paidAmount: 6250, status: 'paid', address: 'The Grand Pavilion, Columbus, OH' },
      { id: 'INV-1008', invoiceNumber: 'INV-1008', clientName: 'Mark Thompson', clientEmail: 'mark.t@thompson.com', clientPhone: '(614) 555-0123', eventName: 'Anniversary Celebration', eventDate: '2026-07-12', issueDate: '2026-05-05', dueDate: '2026-06-05', amount: 620, paidAmount: 310, status: 'partially_paid', address: 'Riverside Restaurant, Columbus, OH' },
    ];
    setInvoices(demoInvoices);
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
      setSelectedEvent(inquiry);
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

  const openAnalytics = () => {
    setDetailView('revenueAnalytics');
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
          onOpenAnalytics={openAnalytics}
        />;
      case 'inquiries':
        return showNewInquiryForm ? (
          <InquiriesForm onAdd={(order) => {
            addOrder(order);
            setShowNewInquiryForm(false);
          }} />
        ) : (
          <InquiriesList
            orders={orders.filter(o => o.status === 'inquiry')}
            onViewOrder={openInquiryDetail}
            onCreateNew={() => setShowNewInquiryForm(true)}
          />
        );
      case 'orders':
        return <OrderList
          orders={orders}
          onViewOrder={openInquiryDetail}
          onCreateNew={openInquiryBuilder}
        />;
      case 'calendar':
        return <CalendarView
          orders={orders}
          onViewEvent={(event) => {
            setSelectedEvent(event);
            setDetailView('eventDetail');
          }}
        />;
      case 'clients':
        return <ClientsList
          clients={clients}
          onAddClient={() => alert('Add client modal coming soon')}
        />;
      case 'menu':
        return <MenuPackages />;
      case 'invoices':
        return <InvoiceListRedesigned
          invoices={invoices}
          onCreateNew={openInvoiceBuilder}
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
          onOpenAnalytics={openAnalytics}
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

        {detailView === 'eventDetail' && selectedEvent && (
          <EventDetail
            event={selectedEvent}
            onBack={closeDetailView}
            onCreateInvoice={openInvoiceBuilder}
          />
        )}

        {detailView === 'revenueAnalytics' && (
          <RevenueAnalytics
            orders={orders}
            onBack={closeDetailView}
          />
        )}

        {/* Main Tab Views */}
        {detailView === null && (
          <>
            {activeTab === 'dashboard' || activeTab === 'orders' || activeTab === 'invoices' ? (
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
