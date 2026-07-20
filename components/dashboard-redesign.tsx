'use client';

import { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';

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

interface DashboardRedesignProps {
  orders?: Order[];
  onNavigate?: (tab: string) => void;
}

export default function DashboardRedesign({ orders = [], onNavigate = () => {} }: DashboardRedesignProps) {
  const [selectedMonth, setSelectedMonth] = useState('current');
  const [revenueMonth, setRevenueMonth] = useState('current');

  // Calculate real metrics from orders
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
    const monthlyRevenue = confirmed * 500; // Estimated at $500 per event for demo

    return {
      newInquiries,
      confirmed,
      monthlyRevenue,
      totalClients: new Set(orders.map(o => o.clientName)).size,
    };
  };

  const metrics = calculateMetrics();
  const recentInquiries = orders.slice(0, 5);
  const upcomingEvents = orders
    .filter(o => o.status !== 'delivered')
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3);

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
        <div className="grid grid-cols-4 gap-6 mb-8">
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
              label: 'Revenue (This Month)',
              value: `$${metrics.monthlyRevenue.toLocaleString()}`,
              icon: '💵',
              bgColor: 'from-amber-50 to-yellow-100',
              borderColor: 'border-yellow-200',
            },
            {
              label: 'Total Clients',
              value: metrics.totalClients,
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
                <span className="text-emerald-600 font-semibold">↗</span> Updated now
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

            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <div className="text-center">
                <p className="text-slate-500 text-sm">Revenue trend chart</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">${metrics.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Current month total</p>
              </div>
            </div>
          </div>

          {/* Top Menu Items */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Top Menu Items</h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                title="Time period"
                className="text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5"
              >
                <option value="current">This Month</option>
                <option value="last">Last Month</option>
              </select>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Jollof Rice', percentage: 35 },
                { name: 'Grilled Chicken', percentage: 25 },
                { name: 'Beef Stew', percentage: 20 },
                { name: 'Fried Rice', percentage: 15 },
                { name: 'Other', percentage: 5 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-700">• {item.name}</p>
                    <p className="text-sm font-bold text-slate-900">{item.percentage}%</p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
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

          {/* Upcoming Events & CTA */}
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
                    <div key={idx} className="flex gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
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

            {/* Get More Inquiries CTA */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200">
              <p className="font-semibold text-slate-900 mb-2">Get more inquiries</p>
              <p className="text-sm text-slate-700 mb-4">Share your inquiry form or QR code to get more bookings</p>
              <button
                onClick={() => onNavigate('inquiries')}
                className="w-full bg-teal-900 text-white font-semibold py-2 rounded-lg hover:bg-teal-950 transition"
              >
                Create New Inquiry
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
