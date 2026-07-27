'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, Calendar, Users, FileText, DollarSign, MessageSquare, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
}

export default function DashboardProfessional({ orders = [], onNavigate = () => {} }: { orders?: Order[]; onNavigate?: (tab: string) => void }) {
  const [selectedMonth, setSelectedMonth] = useState('current');
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Follow-up with Amelia Johnson', subtitle: 'Wedding inquiry', completed: false },
    { id: 2, text: 'Send proposal to Michael Smith', subtitle: 'Corporate event', completed: false },
    { id: 3, text: 'Review menu for June events', subtitle: 'This week', completed: false },
    { id: 4, text: 'Check inventory', subtitle: 'Before weekend', completed: false },
  ]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthOrders = orders.filter(o => {
    const date = new Date(o.eventDate);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const newInquiries = thisMonthOrders.filter(o => o.status === 'inquiry').length;
  const confirmedOrders = thisMonthOrders.filter(o => o.status === 'confirmed').length;
  const monthlyRevenue = confirmedOrders * 1250;
  const totalClients = new Set(orders.map(o => o.clientName)).size;

  const upcomingEvents = orders
    .filter(o => o.status !== 'delivered')
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inquiry':
        return 'bg-emerald-900/30 text-emerald-400 border-emerald-700';
      case 'quoted':
        return 'bg-amber-900/30 text-amber-400 border-amber-700';
      case 'confirmed':
        return 'bg-cyan-900/30 text-cyan-400 border-cyan-700';
      case 'delivered':
        return 'bg-purple-900/30 text-purple-400 border-purple-700';
      default:
        return 'bg-slate-900/30 text-slate-400 border-slate-700';
    }
  };

  const statusLabels: { [key: string]: string } = {
    inquiry: 'New',
    quoted: 'Contacted',
    confirmed: 'Confirmed',
    delivered: 'Completed',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      {/* Header */}
      <div className="border-b border-emerald-900/30 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Good morning, Enam! 👋</h1>
            <p className="text-emerald-200 text-sm mt-1">Here's what's happening with your catering business today.</p>
          </div>

          <div className="flex items-center gap-4">
            <button title="Search" className="p-2 hover:bg-emerald-900/20 rounded-lg transition">
              <Search className="w-5 h-5 text-emerald-300" />
            </button>
            <button title="Notifications" className="relative p-2 hover:bg-emerald-900/20 rounded-lg transition">
              <Bell className="w-5 h-5 text-emerald-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>
            <button
              onClick={() => onNavigate('inquiries')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
            >
              <span>+</span> New Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'NEW INQUIRIES',
              value: newInquiries,
              icon: '💬',
              change: '+2 from yesterday',
              bgGradient: 'from-emerald-900/20 to-emerald-800/10',
              borderColor: 'border-emerald-700/30',
            },
            {
              label: 'CONFIRMED ORDERS',
              value: confirmedOrders,
              icon: '📋',
              change: '+3 this week',
              bgGradient: 'from-amber-900/20 to-amber-800/10',
              borderColor: 'border-amber-700/30',
            },
            {
              label: 'REVENUE (THIS MONTH)',
              value: `$${monthlyRevenue.toLocaleString()}`,
              icon: '$',
              change: '+18% from last month',
              bgGradient: 'from-yellow-900/20 to-yellow-800/10',
              borderColor: 'border-yellow-700/30',
            },
            {
              label: 'TOTAL CLIENTS',
              value: totalClients,
              icon: '👥',
              change: '+5 new this month',
              bgGradient: 'from-cyan-900/20 to-cyan-800/10',
              borderColor: 'border-cyan-700/30',
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} rounded-2xl p-6 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
                  <p className="text-4xl font-black text-white mt-3">{card.value}</p>
                </div>
                <span className="text-3xl">{card.icon}</span>
              </div>
              <p className="text-xs text-emerald-400 font-medium">
                <span className="text-amber-400">↗</span> {card.change}
              </p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="col-span-2 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-emerald-900/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Revenue Overview</h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-sm text-emerald-300 bg-slate-900/50 border border-emerald-700/30 rounded-lg px-3 py-1.5"
              >
                <option value="current">This Month</option>
                <option value="last">Last Month</option>
                <option value="ytd">Year to Date</option>
              </select>
            </div>

            <div className="h-64 flex items-end justify-between gap-2 mb-4">
              {[40, 52, 48, 65, 72, 58, 75].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-lg"
                    style={{ height: `${(height / 100) * 200}px` }}
                  ></div>
                  <p className="text-xs text-emerald-400 mt-2">May {i === 0 ? '1' : (i * 4 + 1)}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-emerald-300">May 21</p>
              <p className="text-2xl font-bold text-amber-400">$3,450</p>
            </div>
          </div>

          {/* Top Menu Items */}
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-emerald-900/30 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-6">Top Menu Items</h2>
            <div className="space-y-4">
              {[
                { name: 'Jollof Rice', percentage: 35 },
                { name: 'Grilled Chicken', percentage: 25 },
                { name: 'Beef Stew', percentage: 20 },
                { name: 'Fried Rice', percentage: 10 },
                { name: 'Other', percentage: 10 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-emerald-300">● {item.name}</p>
                    <p className="text-sm font-bold text-white">{item.percentage}%</p>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Recent Inquiries */}
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-emerald-900/30 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-emerald-900/30 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Recent Inquiries</h2>
              <button
                onClick={() => onNavigate('inquiries')}
                className="text-sm text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-emerald-900/30 bg-slate-800/50">
                    <th className="px-6 py-3 text-left font-semibold text-emerald-300">Client</th>
                    <th className="px-6 py-3 text-left font-semibold text-emerald-300">Event Type</th>
                    <th className="px-6 py-3 text-left font-semibold text-emerald-300">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-emerald-300">Guests</th>
                    <th className="px-6 py-3 text-left font-semibold text-emerald-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-emerald-900/20 hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4 font-medium text-white">{order.clientName}</td>
                      <td className="px-6 py-4 text-emerald-300 capitalize">{order.eventType}</td>
                      <td className="px-6 py-4 text-emerald-300">{order.eventDate}</td>
                      <td className="px-6 py-4 text-emerald-300">{order.guestCount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-emerald-900/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Today's Tasks</h2>
                <button className="text-sm text-amber-400 hover:text-amber-300 font-semibold">View All</button>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`w-full p-3 rounded-lg border transition text-left ${
                      task.completed
                        ? 'bg-emerald-900/20 border-emerald-700/30'
                        : 'bg-slate-800/50 border-emerald-900/30 hover:border-emerald-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                        task.completed ? 'bg-emerald-600 border-emerald-500' : 'border-emerald-700'
                      }`}>
                        {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${task.completed ? 'text-emerald-300 line-through' : 'text-white'}`}>
                          {task.text}
                        </p>
                        <p className="text-xs text-emerald-400">{task.subtitle}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-emerald-900/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Upcoming Events</h2>
                <button
                  onClick={() => onNavigate('calendar')}
                  className="text-sm text-amber-400 hover:text-amber-300 font-semibold"
                >
                  View Calendar
                </button>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((event, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition border border-emerald-900/20">
                    <div className="text-center min-w-fit">
                      <p className="text-xs font-bold text-emerald-400">
                        {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                      </p>
                      <p className="text-xl font-bold text-amber-400">
                        {new Date(event.eventDate).getDate()}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white capitalize">{event.eventType}</p>
                      <p className="text-xs text-emerald-300 truncate">{event.clientName} • {event.guestCount} guests</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-900/30 border border-amber-700/30 px-2 py-1 rounded self-start flex-shrink-0">
                      Upcoming
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-emerald-900/30 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-6 gap-4">
            {[
              { id: 'inquiries', icon: '💬', label: 'New Inquiry' },
              { id: 'orders', icon: '📋', label: 'Create Order' },
              { id: 'clients', icon: '👥', label: 'Add Client' },
              { id: 'invoices', icon: '📄', label: 'Create Invoice' },
              { id: 'calendar', icon: '📅', label: 'View Calendar' },
              { id: 'reports', icon: '📊', label: 'Share QR Code' },
            ].map((action) => (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition border border-emerald-900/30 hover:border-amber-700/50"
              >
                <span className="text-3xl">{action.icon}</span>
                <p className="text-xs font-semibold text-emerald-300 text-center">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
