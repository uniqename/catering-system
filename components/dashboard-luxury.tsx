'use client';

import { useState } from 'react';
import { Bell, Search } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
}

export default function DashboardLuxury({ orders = [], onNavigate = () => {} }: { orders?: Order[]; onNavigate?: (tab: string) => void }) {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Follow-up with Amelia Johnson', subtitle: 'Wedding inquiry', completed: true },
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
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'quoted':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statusLabels: { [key: string]: string } = {
    inquiry: 'New',
    quoted: 'Contacted',
    confirmed: 'Confirmed',
    delivered: 'Completed',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-50">
      {/* Header */}
      <div className="border-b border-amber-200 sticky top-0 z-10 bg-white/95 backdrop-blur">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-amber-900">Good morning, Enam! 👋</h1>
            <p className="text-amber-700 text-sm mt-1">Here's what's happening with your catering business today.</p>
          </div>

          <div className="flex items-center gap-4">
            <button title="Search" className="p-2 hover:bg-amber-50 rounded-lg transition">
              <Search className="w-5 h-5 text-amber-900" />
            </button>
            <button title="Notifications" className="relative p-2 hover:bg-amber-50 rounded-lg transition">
              <Bell className="w-5 h-5 text-amber-900" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => onNavigate('inquiries')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition"
            >
              + New Inquiry
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
            },
            {
              label: 'CONFIRMED ORDERS',
              value: confirmedOrders,
              icon: '📋',
              change: '+3 this week',
            },
            {
              label: 'REVENUE (THIS MONTH)',
              value: `$${monthlyRevenue.toLocaleString()}`,
              icon: '$',
              change: '+18% from last month',
            },
            {
              label: 'TOTAL CLIENTS',
              value: totalClients,
              icon: '👥',
              change: '+5 new this month',
            },
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-amber-900 text-xs font-bold uppercase tracking-wider">{card.label}</p>
                  <p className="text-4xl font-black text-amber-950 mt-3">{card.value}</p>
                </div>
                <span className="text-3xl">{card.icon}</span>
              </div>
              <p className="text-xs text-amber-700 font-medium">
                <span className="text-amber-600">↗</span> {card.change}
              </p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="col-span-2 bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-amber-950">Revenue Overview</h2>
              <select className="text-sm text-amber-900 bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-1.5">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Year to Date</option>
              </select>
            </div>

            <div className="h-64 flex items-end justify-between gap-2 mb-4">
              {[40, 52, 48, 65, 72, 58, 75].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-lg"
                    style={{ height: `${(height / 100) * 200}px` }}
                  ></div>
                  <p className="text-xs text-amber-700 mt-2">May {i === 0 ? '1' : (i * 4 + 1)}</p>
                </div>
              ))}
            </div>
            <div className="text-center border-t-2 border-amber-200 pt-4">
              <p className="text-sm text-amber-700">May 21</p>
              <p className="text-2xl font-bold text-amber-600">$3,450</p>
            </div>
          </div>

          {/* Top Menu Items */}
          <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-sm">
            <h2 className="text-lg font-bold text-amber-950 mb-6">Top Menu Items</h2>
            <div className="space-y-4">
              {[
                { name: 'Jollof Rice', percentage: 35, color: 'bg-amber-600' },
                { name: 'Grilled Chicken', percentage: 25, color: 'bg-amber-500' },
                { name: 'Beef Stew', percentage: 20, color: 'bg-amber-400' },
                { name: 'Fried Rice', percentage: 10, color: 'bg-amber-300' },
                { name: 'Other', percentage: 10, color: 'bg-gray-300' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-amber-900">● {item.name}</p>
                    <p className="text-sm font-bold text-amber-950">{item.percentage}%</p>
                  </div>
                  <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
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
          <div className="bg-white rounded-2xl overflow-hidden border-2 border-amber-200 shadow-sm">
            <div className="p-6 border-b-2 border-amber-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-amber-950">Recent Inquiries</h2>
              <button
                onClick={() => onNavigate('inquiries')}
                className="text-sm text-amber-600 hover:text-amber-700 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-amber-200 bg-amber-50">
                    <th className="px-6 py-3 text-left font-bold text-amber-900">Client</th>
                    <th className="px-6 py-3 text-left font-bold text-amber-900">Event Type</th>
                    <th className="px-6 py-3 text-left font-bold text-amber-900">Date</th>
                    <th className="px-6 py-3 text-left font-bold text-amber-900">Guests</th>
                    <th className="px-6 py-3 text-left font-bold text-amber-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-amber-100 hover:bg-amber-50 transition">
                      <td className="px-6 py-4 font-medium text-amber-950">{order.clientName}</td>
                      <td className="px-6 py-4 text-amber-800 capitalize">{order.eventType}</td>
                      <td className="px-6 py-4 text-amber-800">{order.eventDate}</td>
                      <td className="px-6 py-4 text-amber-800">{order.guestCount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(order.status)}`}>
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
            <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-amber-950">Today's Tasks</h2>
                <button className="text-sm text-amber-600 hover:text-amber-700 font-semibold">View All</button>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`w-full p-3 rounded-lg border-2 transition text-left ${
                      task.completed
                        ? 'bg-green-50 border-green-300'
                        : 'bg-amber-50 border-amber-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                        task.completed ? 'bg-green-600 border-green-600' : 'border-amber-900'
                      }`}>
                        {task.completed && <span className="text-white text-sm">✓</span>}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${task.completed ? 'text-green-700 line-through' : 'text-amber-950'}`}>
                          {task.text}
                        </p>
                        <p className="text-xs text-amber-700">{task.subtitle}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-amber-950">Upcoming Events</h2>
                <button
                  onClick={() => onNavigate('calendar')}
                  className="text-sm text-amber-600 hover:text-amber-700 font-semibold"
                >
                  View Calendar
                </button>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((event, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition border-2 border-amber-200">
                    <div className="text-center min-w-fit">
                      <p className="text-xs font-bold text-amber-700">
                        {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                      </p>
                      <p className="text-xl font-bold text-amber-600">
                        {new Date(event.eventDate).getDate()}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-amber-950 capitalize">{event.eventType}</p>
                      <p className="text-xs text-amber-700 truncate">{event.clientName} • {event.guestCount} guests</p>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-200 px-2 py-1 rounded-full self-start flex-shrink-0">
                      Upcoming
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-sm">
          <h2 className="text-lg font-bold text-amber-950 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-6 gap-4">
            {[
              { id: 'inquiries', icon: '💬', label: 'New Inquiry' },
              { id: 'orders', icon: '📋', label: 'Create Order' },
              { id: 'clients', icon: '👥', label: 'Add Client' },
              { id: 'invoices', icon: '💳', label: 'Create Invoice' },
              { id: 'calendar', icon: '📅', label: 'View Calendar' },
              { id: 'reports', icon: '📊', label: 'Share QR Code' },
            ].map((action) => (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition border-2 border-amber-200"
              >
                <span className="text-3xl">{action.icon}</span>
                <p className="text-xs font-semibold text-amber-900 text-center">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
