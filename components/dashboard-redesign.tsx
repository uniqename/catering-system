'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, LogOut, Settings, BarChart3, Calendar, Users, UtensilsCrossed, FileText, CreditCard } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
}

interface DashboardMetrics {
  newInquiries: number;
  confirmedOrders: number;
  monthlyRevenue: number;
  totalClients: number;
  inquiriesChange: number;
  ordersChange: number;
  revenueChange: number;
  clientsChange: number;
}

interface DashboardRedesignProps {
  orders?: Order[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  renderContent?: (tab: string) => React.ReactNode;
}

export default function DashboardRedesign({
  orders = [],
  activeTab = 'dashboard',
  onTabChange = () => {},
  renderContent
}: DashboardRedesignProps) {
  const [localTab, setLocalTab] = useState(activeTab);

  const handleTabChange = (tab: string) => {
    setLocalTab(tab);
    onTabChange(tab);
  };

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    newInquiries: 3,
    confirmedOrders: 7,
    monthlyRevenue: 4250,
    totalClients: 42,
    inquiriesChange: 2,
    ordersChange: 3,
    revenueChange: 18,
    clientsChange: 5,
  });

  const [recentInquiries, setRecentInquiries] = useState<Order[]>([
    {
      id: '1',
      clientName: 'Amelia Johnson',
      eventType: 'Wedding',
      eventDate: 'Jun 15, 2025',
      guestCount: 120,
      status: 'inquiry',
    },
    {
      id: '2',
      clientName: 'Michael Smith',
      eventType: 'Corporate Event',
      eventDate: 'May 30, 2025',
      guestCount: 75,
      status: 'quoted',
    },
    {
      id: '3',
      clientName: 'Sarah Williams',
      eventType: 'Birthday Party',
      eventDate: 'Jun 7, 2025',
      guestCount: 40,
      status: 'confirmed',
    },
  ]);

  const upcomingEvents = [
    { date: 'MAY 30', name: 'Corporate Lunch', time: '12:00 PM', guests: 75, status: 'Upcoming' },
    { date: 'JUN 07', name: 'Birthday Party', time: '3:00 PM', guests: 40, status: 'Upcoming' },
    { date: 'JUN 15', name: 'Wedding', time: '5:00 PM', guests: 120, status: 'Upcoming' },
  ];

  const topMenuItems = [
    { name: 'Jollof Rice', percentage: 35 },
    { name: 'Grilled Chicken', percentage: 25 },
    { name: 'Beef Stew', percentage: 20 },
    { name: 'Fried Rice', percentage: 10 },
    { name: 'Other', percentage: 10 },
  ];

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

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const colors = [
    'bg-emerald-400',
    'bg-amber-400',
    'bg-rose-400',
    'bg-teal-400',
    'bg-slate-300',
  ];

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
          {[
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'inquiries', icon: '💬', label: 'Inquiries', badge: 3 },
            { id: 'orders', icon: '📋', label: 'Orders' },
            { id: 'calendar', icon: '📅', label: 'Calendar' },
            { id: 'clients', icon: '👥', label: 'Clients' },
            { id: 'menu', icon: '🍽️', label: 'Menu & Packages' },
            { id: 'invoices', icon: '📄', label: 'Invoices' },
            { id: 'costs', icon: '💸', label: 'Costs & Margins' },
            { id: 'rentals', icon: '🪑', label: 'Rental Pricing' },
            { id: 'shipping', icon: '📦', label: 'Shipping Log' },
            { id: 'reports', icon: '📊', label: 'Reports' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                localTab === item.id
                  ? 'bg-amber-500 text-teal-900 font-semibold'
                  : 'text-teal-100 hover:bg-teal-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Grow Business CTA */}
        <div className="p-4 border-t border-teal-700">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 text-teal-900">
            <p className="font-semibold text-sm mb-2">Grow your business</p>
            <p className="text-xs text-teal-800 mb-3">Set up your online inquiry form in 2 mins</p>
            <button className="w-full bg-teal-900 text-amber-300 text-xs font-bold py-2 rounded-lg hover:bg-teal-950 transition">
              Get Started →
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-teal-700">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 flex items-center justify-center text-teal-900 font-bold">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Business Owner</p>
              <p className="text-xs text-teal-200 truncate">Garage to Table</p>
            </div>
            <button title="User menu" className="text-teal-200 hover:text-white">⋮</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-56 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Good morning! 👋</h1>
              <p className="text-slate-600 text-sm mt-1">Here's what's happening with Garage to Table today.</p>
            </div>

            <div className="flex items-center gap-4">
              <button title="Search" className="p-2 hover:bg-slate-100 rounded-lg transition">
                <Search className="w-5 h-5 text-slate-600" />
              </button>
              <button title="Notifications" className="relative p-2 hover:bg-slate-100 rounded-lg transition">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="px-4 py-2 bg-teal-900 text-white font-semibold rounded-lg hover:bg-teal-950 transition flex items-center gap-2">
                <span>+</span> New Inquiry
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'New Inquiries',
                value: metrics.newInquiries,
                change: metrics.inquiriesChange,
                icon: '💬',
                bgColor: 'from-teal-50 to-teal-100',
                borderColor: 'border-teal-200',
              },
              {
                label: 'Confirmed Orders',
                value: metrics.confirmedOrders,
                change: metrics.ordersChange,
                icon: '📋',
                bgColor: 'from-amber-50 to-amber-100',
                borderColor: 'border-amber-200',
              },
              {
                label: 'Revenue (This Month)',
                value: `$${metrics.monthlyRevenue.toLocaleString()}`,
                change: metrics.revenueChange,
                icon: '💵',
                bgColor: 'from-amber-50 to-yellow-100',
                borderColor: 'border-yellow-200',
              },
              {
                label: 'Total Clients',
                value: metrics.totalClients,
                change: metrics.clientsChange,
                icon: '👥',
                bgColor: 'from-blue-50 to-blue-100',
                borderColor: 'border-blue-200',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${card.bgColor} border ${card.borderColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{card.label}</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{card.value}</p>
                  </div>
                  <span className="text-3xl">{card.icon}</span>
                </div>
                <p className="text-xs text-slate-600">
                  <span className="text-emerald-600 font-semibold">+{card.change}</span> from last month ↗
                </p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Revenue Overview</h2>
                <select title="Time period" className="text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5">
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>

              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div className="text-center">
                  <p className="text-slate-500 text-sm">Revenue chart placeholder</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">$4,250</p>
                  <p className="text-xs text-slate-500 mt-1">May 21</p>
                </div>
              </div>
            </div>

            {/* Top Menu Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Top Menu Items</h2>
                <select title="Time period" className="text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5">
                  <option>This Month</option>
                </select>
              </div>

              <div className="space-y-4">
                {topMenuItems.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-slate-700">• {item.name}</p>
                      <p className="text-sm font-bold text-slate-900">{item.percentage}%</p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[idx]}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
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
                <a href="#" className="text-sm text-teal-900 font-semibold hover:underline">
                  View All
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Client</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Event Type</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Guests</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-medium text-slate-900">{inquiry.clientName}</td>
                        <td className="px-6 py-4 text-slate-600">{inquiry.eventType}</td>
                        <td className="px-6 py-4 text-slate-600">{inquiry.eventDate}</td>
                        <td className="px-6 py-4 text-slate-600">{inquiry.guestCount}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(inquiry.status)}`}>
                            {getStatusLabel(inquiry.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming Events & Today's Tasks */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Upcoming Events</h2>
                  <a href="#" className="text-sm text-teal-900 font-semibold hover:underline">
                    View Calendar
                  </a>
                </div>

                <div className="space-y-4">
                  {upcomingEvents.map((event, idx) => (
                    <div key={idx} className="flex gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                      <div className="text-center min-w-fit">
                        <p className="text-xs font-bold text-slate-500">{event.date.split(' ')[0]}</p>
                        <p className="text-xl font-bold text-teal-900">{event.date.split(' ')[1]}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{event.name}</p>
                        <p className="text-xs text-slate-600">
                          {event.time} • {event.guests} Guests
                        </p>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded self-start">
                        {event.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Get More Inquiries CTA */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200">
                <p className="font-semibold text-slate-900 mb-2">Get more inquiries</p>
                <p className="text-sm text-slate-700 mb-4">
                  Share your inquiry form or QR code to get more bookings
                </p>
                <div className="bg-white rounded-lg p-3 mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded flex items-center justify-center text-2xl">
                    📱
                  </div>
                </div>
                <button className="w-full bg-teal-900 text-white font-semibold py-2 rounded-lg hover:bg-teal-950 transition">
                  Share Now
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-6 gap-4">
              {[
                { icon: '💬', label: 'New Inquiry' },
                { icon: '📋', label: 'Create Order' },
                { icon: '👥', label: 'Add Client' },
                { icon: '📄', label: 'Create Invoice' },
                { icon: '📅', label: 'View Calendar' },
                { icon: '📱', label: 'Share QR Code' },
              ].map((action, idx) => (
                <button
                  key={idx}
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
    </div>
  );
}
