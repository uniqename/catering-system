'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, X } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
  createdAt?: string;
  notes?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastOrder?: string;
  totalOrders: number;
}

interface CostEntry {
  id: string;
  period: string;
  date: string;
  ingredients: number;
  gas: number;
  packaging: number;
  overhead: number;
}

interface DashboardCompleteProps {
  orders?: Order[];
  onNavigate?: (tab: string) => void;
}

export default function DashboardComplete({ orders = [], onNavigate = () => {} }: DashboardCompleteProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('current');
  const [revenueMonth, setRevenueMonth] = useState('current');
  const [costs, setCosts] = useState<CostEntry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    // Load costs from localStorage
    const savedCosts = localStorage.getItem('catering_costs');
    if (savedCosts) {
      setCosts(JSON.parse(savedCosts));
    }

    // Extract unique clients from orders
    const clientMap = new Map<string, Client>();
    orders.forEach(order => {
      if (!clientMap.has(order.clientName)) {
        clientMap.set(order.clientName, {
          id: order.clientName,
          name: order.clientName,
          email: '',
          phone: '',
          lastOrder: order.eventDate,
          totalOrders: 0,
        });
      }
      const client = clientMap.get(order.clientName)!;
      client.totalOrders += 1;
    });
    setClients(Array.from(clientMap.values()));
  }, [orders]);

  // Calculate real metrics
  const calculateMetrics = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthOrders = orders.filter(o => {
      if (!o.eventDate) return false;
      const date = new Date(o.eventDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const newInquiries = thisMonthOrders.filter(o => o.status === 'inquiry').length;
    const confirmed = thisMonthOrders.filter(o => o.status === 'confirmed').length;
    const monthlyRevenue = confirmed * 500;

    // Calculate real costs
    const thisMonthCosts = costs.filter(c => {
      const date = new Date(c.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const totalCosts = thisMonthCosts.reduce((sum, c) => sum + c.ingredients + c.gas + c.packaging + c.overhead, 0);
    const profit = monthlyRevenue - totalCosts;
    const margin = monthlyRevenue > 0 ? ((profit / monthlyRevenue) * 100).toFixed(1) : '0';

    return {
      newInquiries,
      confirmed,
      monthlyRevenue,
      totalClients: clients.length,
      totalCosts,
      profit,
      margin,
    };
  };

  const metrics = calculateMetrics();
  const recentInquiries = orders.slice(0, 5);
  const upcomingEvents = orders
    .filter(o => o.status !== 'delivered')
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3);

  const searchResults = searchQuery
    ? orders.filter(o =>
        o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.eventType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const notifications = [
    { id: 1, title: 'New Inquiry', message: 'Sarah Johnson requested a quote', time: '2 hours ago', read: false },
    { id: 2, title: 'Order Confirmed', message: 'Michael Brown confirmed the corporate event', time: '1 day ago', read: false },
    { id: 3, title: 'Invoice Sent', message: 'Invoice #001 sent to Emma Davis', time: '3 days ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inquiry':
        return 'bg-blue-100 text-blue-700';
      case 'quoted':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'delivered':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Good morning, Alexandra! 👋</h1>
            <p className="text-slate-600 text-sm mt-1">Here's what's happening with Garage to Table today.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <button
                title="Search"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <Search className="w-5 h-5 text-slate-600" />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border-2 border-slate-200 rounded-lg shadow-lg z-50">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search orders, clients, events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border-b-2 border-slate-200 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  {searchQuery && (
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.map(result => (
                          <button
                            key={result.id}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery('');
                              onNavigate('orders');
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 transition"
                          >
                            <p className="font-semibold text-slate-900">{result.clientName}</p>
                            <p className="text-sm text-slate-600">{result.eventType} • {result.eventDate}</p>
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-8 text-center text-slate-500">No results found</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                title="Notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-96 bg-white border-2 border-slate-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b-2 border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="p-1 hover:bg-slate-100 rounded transition"
                    >
                      <X className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <button
                        key={notif.id}
                        onClick={() => {
                          setNotificationsOpen(false);
                          onNavigate('orders');
                        }}
                        className={`w-full text-left px-4 py-4 border-b border-slate-100 hover:bg-slate-50 transition ${
                          !notif.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{notif.title}</p>
                            <p className="text-sm text-slate-600">{notif.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('inquiries')}
              className="px-4 py-2 bg-teal-900 text-white font-semibold rounded-lg hover:bg-teal-950 transition flex items-center gap-2"
            >
              <span>+</span> New Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-5 gap-6 mb-8">
          {[
            {
              label: 'New Inquiries',
              value: metrics.newInquiries,
              icon: '💬',
              bgColor: 'from-teal-50 to-teal-100',
              borderColor: 'border-teal-200',
            },
            {
              label: 'Confirmed Orders',
              value: metrics.confirmed,
              icon: '📋',
              bgColor: 'from-amber-50 to-amber-100',
              borderColor: 'border-amber-200',
            },
            {
              label: 'Revenue',
              value: `$${metrics.monthlyRevenue.toLocaleString()}`,
              icon: '💵',
              bgColor: 'from-amber-50 to-yellow-100',
              borderColor: 'border-yellow-200',
            },
            {
              label: 'Costs',
              value: `$${Math.round(metrics.totalCosts).toLocaleString()}`,
              icon: '💸',
              bgColor: 'from-orange-50 to-orange-100',
              borderColor: 'border-orange-200',
            },
            {
              label: 'Profit Margin',
              value: `${metrics.margin}%`,
              icon: '📈',
              bgColor: 'from-green-50 to-emerald-100',
              borderColor: 'border-green-200',
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${card.bgColor} border ${card.borderColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer`}
              onClick={() => card.label === 'Costs' && onNavigate('costs')}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
                </div>
                <span className="text-3xl">{card.icon}</span>
              </div>
              {card.label === 'Costs' && <p className="text-xs text-slate-600">Click to edit costs</p>}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Revenue vs Costs</h2>
              <select
                value={revenueMonth}
                onChange={(e) => setRevenueMonth(e.target.value)}
                title="Time period"
                className="text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5"
              >
                <option value="current">This Month</option>
                <option value="last">Last Month</option>
                <option value="ytd">Year to Date</option>
              </select>
            </div>

            <div className="h-64 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <div className="grid grid-cols-3 gap-8 text-center w-full">
                <div>
                  <p className="text-slate-500 text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600">${metrics.monthlyRevenue}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Costs</p>
                  <p className="text-2xl font-bold text-orange-600">${Math.round(metrics.totalCosts)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Profit</p>
                  <p className="text-2xl font-bold text-teal-600">${Math.round(metrics.profit)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Menu Items */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Top Clients</h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                title="Time period"
                className="text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5"
              >
                <option value="current">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div className="space-y-3">
              {clients
                .sort((a, b) => b.totalOrders - a.totalOrders)
                .slice(0, 5)
                .map((client, idx) => (
                  <div
                    key={client.id}
                    className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer transition"
                    onClick={() => onNavigate('clients')}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center text-sm font-bold text-teal-900">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{client.name}</p>
                      <p className="text-xs text-slate-600">{client.totalOrders} order{client.totalOrders !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Inquiries & Upcoming Events */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Recent Inquiries */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent Inquiries</h2>
              <button
                onClick={() => onNavigate('orders')}
                className="text-sm text-teal-900 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Client</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Event</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.length > 0 ? (
                    recentInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-medium text-slate-900">{inquiry.clientName}</td>
                        <td className="px-6 py-4 text-slate-600">{inquiry.eventType}</td>
                        <td className="px-6 py-4 text-slate-600">{inquiry.eventDate}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-slate-500">
                        No inquiries yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Upcoming Events</h2>
                <button
                  onClick={() => onNavigate('orders')}
                  className="text-sm text-teal-900 font-semibold hover:underline"
                >
                  View Calendar
                </button>
              </div>

              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, idx) => (
                    <div key={idx} className="flex gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition cursor-pointer">
                      <div className="text-center min-w-fit">
                        <p className="text-xs font-bold text-slate-500">
                          {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                        </p>
                        <p className="text-xl font-bold text-teal-900">
                          {new Date(event.eventDate).getDate()}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{event.eventType}</p>
                        <p className="text-xs text-slate-600">{event.clientName} • {event.guestCount} guests</p>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded self-start">
                        Upcoming
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No upcoming events</p>
                )}
              </div>
            </div>

            {/* Quick CTA */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200">
              <p className="font-semibold text-slate-900 mb-2">Manage Costs & Margins</p>
              <p className="text-sm text-slate-700 mb-4">Track expenses to see accurate profit margins</p>
              <button
                onClick={() => onNavigate('costs')}
                className="w-full bg-teal-900 text-white font-semibold py-2 rounded-lg hover:bg-teal-950 transition"
              >
                Update Costs
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-6 gap-4">
            {[
              { id: 'inquiries', icon: '💬', label: 'New Inquiry' },
              { id: 'orders', icon: '📋', label: 'View Orders' },
              { id: 'clients', icon: '👥', label: 'Clients' },
              { id: 'invoices', icon: '📄', label: 'Invoices' },
              { id: 'costs', icon: '💸', label: 'Costs' },
              { id: 'reports', icon: '📊', label: 'Reports' },
            ].map((action) => (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition border border-slate-200"
              >
                <span className="text-3xl">{action.icon}</span>
                <p className="text-xs font-semibold text-slate-700 text-center">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
