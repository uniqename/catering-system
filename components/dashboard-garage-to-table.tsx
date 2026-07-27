'use client';

import { useState } from 'react';
import { Bell, Search, MessageSquare, FileText, DollarSign, Users } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
}

export default function DashboardGarageToTable({ orders = [], onNavigate = () => {} }: { orders?: Order[]; onNavigate?: (tab: string) => void }) {
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

  return (
    <div style={{ backgroundColor: '#0B3D36' }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: '#0B3D36', borderBottomColor: '#D4A64A' }} className="border-b-2 sticky top-0 z-10">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 style={{ color: '#D4A64A' }} className="text-4xl font-bold">Good morning, Enam! 👋</h1>
            <p style={{ color: '#D4A64A' }} className="text-sm mt-1">Here's what's happening with your catering business today.</p>
          </div>

          <div className="flex items-center gap-4">
            <button title="Search" className="p-2 rounded-lg transition" style={{ color: '#D4A64A' }}>
              <Search className="w-5 h-5" />
            </button>
            <button title="Notifications" className="relative p-2 rounded-lg transition" style={{ color: '#D4A64A' }}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => onNavigate('inquiries')}
              style={{ backgroundColor: '#D4A64A', color: '#0B3D36' }}
              className="px-4 py-2 font-semibold rounded-lg transition hover:opacity-90"
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
            { label: 'NEW INQUIRIES', value: newInquiries, icon: '💬', change: '+2 from yesterday' },
            { label: 'CONFIRMED ORDERS', value: confirmedOrders, icon: '📋', change: '+3 this week' },
            { label: 'REVENUE (THIS MONTH)', value: `$${monthlyRevenue.toLocaleString()}`, icon: '$', change: '+18% from last month' },
            { label: 'TOTAL CLIENTS', value: totalClients, icon: '👥', change: '+5 new this month' },
          ].map((card, idx) => (
            <div key={idx} style={{ backgroundColor: '#1a5f54', borderColor: '#D4A64A' }} className="rounded-2xl p-6 border-2 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p style={{ color: '#D4A64A' }} className="text-xs font-bold uppercase tracking-wider">{card.label}</p>
                  <p style={{ color: '#D4A64A' }} className="text-4xl font-black mt-3">{card.value}</p>
                </div>
                <div style={{ backgroundColor: '#2a8f7f' }} className="w-12 h-12 rounded-full flex items-center justify-center text-xl">
                  {card.icon}
                </div>
              </div>
              <p style={{ color: '#D4A64A' }} className="text-xs font-medium">
                <span>↗</span> {card.change}
              </p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div style={{ backgroundColor: '#1a5f54', borderColor: '#D4A64A' }} className="col-span-2 rounded-2xl p-6 border-2 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: '#D4A64A' }} className="text-lg font-bold">Revenue Overview</h2>
              <select style={{ borderColor: '#D4A64A', color: '#D4A64A', backgroundColor: '#0B3D36' }} className="text-sm border-2 rounded-lg px-3 py-1.5">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Year to Date</option>
              </select>
            </div>

            <div className="h-64 flex items-end justify-between gap-2 mb-4">
              {[40, 52, 48, 65, 72, 58, 75].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div style={{ backgroundColor: '#D4A64A', height: `${(height / 100) * 200}px` }} className="w-full rounded-t-lg"></div>
                  <p style={{ color: '#D4A64A' }} className="text-xs mt-2">May {i === 0 ? '1' : (i * 4 + 1)}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTopColor: '#D4A64A' }} className="border-t-2 pt-4 text-center">
              <p style={{ color: '#D4A64A' }} className="text-sm">May 21</p>
              <p style={{ color: '#D4A64A' }} className="text-2xl font-bold">$3,450</p>
            </div>
          </div>

          {/* Top Menu Items */}
          <div style={{ backgroundColor: '#1a5f54', borderColor: '#D4A64A' }} className="rounded-2xl p-6 border-2 shadow-sm">
            <h2 style={{ color: '#D4A64A' }} className="text-lg font-bold mb-6">Top Menu Items</h2>
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
                    <p style={{ color: '#D4A64A' }} className="text-sm font-medium">● {item.name}</p>
                    <p style={{ color: '#D4A64A' }} className="text-sm font-bold">{item.percentage}%</p>
                  </div>
                  <div style={{ backgroundColor: '#2a8f7f' }} className="h-3 rounded-full overflow-hidden">
                    <div style={{ backgroundColor: '#D4A64A', width: `${item.percentage}%` }} className="h-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Recent Inquiries */}
          <div style={{ backgroundColor: '#1a5f54', borderColor: '#D4A64A' }} className="rounded-2xl overflow-hidden border-2 shadow-sm">
            <div style={{ borderBottomColor: '#D4A64A' }} className="p-6 border-b-2 flex items-center justify-between">
              <h2 style={{ color: '#D4A64A' }} className="text-lg font-bold">Recent Inquiries</h2>
              <button onClick={() => onNavigate('inquiries')} style={{ color: '#D4A64A' }} className="text-sm font-semibold hover:opacity-80">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#0B3D36', borderBottomColor: '#D4A64A' }} className="border-b-2">
                    <th style={{ color: '#D4A64A' }} className="px-6 py-3 text-left font-bold">Client</th>
                    <th style={{ color: '#D4A64A' }} className="px-6 py-3 text-left font-bold">Event Type</th>
                    <th style={{ color: '#D4A64A' }} className="px-6 py-3 text-left font-bold">Date</th>
                    <th style={{ color: '#D4A64A' }} className="px-6 py-3 text-left font-bold">Guests</th>
                    <th style={{ color: '#D4A64A' }} className="px-6 py-3 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} style={{ borderBottomColor: '#2a8f7f' }} className="border-b hover:bg-[#2a8f7f] transition">
                      <td style={{ color: '#D4A64A' }} className="px-6 py-4 font-medium">{order.clientName}</td>
                      <td style={{ color: '#D4A64A' }} className="px-6 py-4 capitalize">{order.eventType}</td>
                      <td style={{ color: '#D4A64A' }} className="px-6 py-4">{order.eventDate}</td>
                      <td style={{ color: '#D4A64A' }} className="px-6 py-4">{order.guestCount}</td>
                      <td className="px-6 py-4">
                        <span style={{ backgroundColor: '#10B981', color: 'white' }} className="inline-block px-3 py-1 rounded-full text-xs font-bold">
                          {order.status === 'inquiry' ? 'New' : order.status === 'quoted' ? 'Contacted' : order.status === 'confirmed' ? 'Confirmed' : 'Completed'}
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
            <div style={{ backgroundColor: '#1a5f54', borderColor: '#D4A64A' }} className="rounded-2xl p-6 border-2 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ color: '#D4A64A' }} className="text-lg font-bold">Today's Tasks</h2>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    style={{ backgroundColor: task.completed ? '#0B3D36' : '#2a8f7f', borderColor: '#D4A64A' }}
                    className="w-full p-3 rounded-lg border-2 transition text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div style={{ borderColor: task.completed ? '#D4A64A' : '#D4A64A', backgroundColor: task.completed ? '#D4A64A' : 'transparent' }} className="w-5 h-5 rounded border-2 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        {task.completed && <span style={{ color: '#0B3D36' }} className="text-sm font-bold">✓</span>}
                      </div>
                      <div className="flex-1">
                        <p style={{ color: task.completed ? '#D4A64A' : '#D4A64A' }} className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
                          {task.text}
                        </p>
                        <p style={{ color: '#a8d5ca' }} className="text-xs">{task.subtitle}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div style={{ backgroundColor: '#1a5f54', borderColor: '#D4A64A' }} className="rounded-2xl p-6 border-2 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ color: '#D4A64A' }} className="text-lg font-bold">Upcoming Events</h2>
                <button onClick={() => onNavigate('calendar')} style={{ color: '#D4A64A' }} className="text-sm font-semibold hover:opacity-80">
                  View Calendar
                </button>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((event, idx) => (
                  <div key={idx} style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A' }} className="flex gap-3 p-3 rounded-lg hover:opacity-80 transition border-2">
                    <div className="text-center min-w-fit">
                      <p style={{ color: '#D4A64A' }} className="text-xs font-bold">
                        {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                      </p>
                      <p style={{ color: '#D4A64A' }} className="text-xl font-bold">
                        {new Date(event.eventDate).getDate()}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ color: '#D4A64A' }} className="font-semibold capitalize">{event.eventType}</p>
                      <p style={{ color: '#a8d5ca' }} className="text-xs truncate">{event.clientName} • {event.guestCount} guests</p>
                    </div>
                    <span style={{ backgroundColor: '#0B3D36', color: '#D4A64A', borderColor: '#D4A64A' }} className="text-xs font-bold border-2 px-2 py-1 rounded-full self-start flex-shrink-0">
                      Upcoming
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ backgroundColor: '#1a5f54', borderColor: '#D4A64A' }} className="rounded-2xl p-6 border-2 shadow-sm">
          <h2 style={{ color: '#D4A64A' }} className="text-lg font-bold mb-6">Quick Actions</h2>
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
                style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A' }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 hover:shadow-md transition"
              >
                <span className="text-3xl">{action.icon}</span>
                <p style={{ color: '#D4A64A' }} className="text-xs font-semibold text-center">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
