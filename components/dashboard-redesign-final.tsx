'use client';

import { useState } from 'react';
import { Bell, Search, TrendingUp, CheckCircle2, Circle, MessageSquare, ClipboardList, DollarSign, Users, Home, MessageCircle, Calendar, MapPin, Utensils, CreditCard, BarChart3, Settings } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
}

interface Task {
  id: number;
  text: string;
  subtitle: string;
  completed: boolean;
}

interface UpcomingEvent {
  date: string;
  month: string;
  day: number;
  eventType: string;
  time: string;
  guestCount: number;
}

const StatCard = ({
  label,
  value,
  icon,
  change,
  bgColor,
  iconColor
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
  bgColor: string;
  iconColor: string;
}) => (
  <div style={{ backgroundColor: '#1a5f54' }} className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
    <div className="flex items-start justify-between">
      <div>
        <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold uppercase tracking-wide">{label}</p>
        <p style={{ color: '#D4A64A' }} className="text-3xl font-black mt-2">{value}</p>
      </div>
      <div style={{ backgroundColor: bgColor }} className="w-14 h-14 rounded-full flex items-center justify-center shadow-md">
        <div style={{ color: iconColor }}>
          {icon}
        </div>
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1">
      <TrendingUp style={{ color: '#10B981' }} className="w-4 h-4" />
      <p style={{ color: '#10B981' }} className="text-xs font-semibold">{change}</p>
    </div>
  </div>
);

export default function DashboardRedesignFinal({
  orders = [],
  onNavigate = () => {}
}: {
  orders?: Order[];
  onNavigate?: (tab: string) => void
}) {
  const [tasks, setTasks] = useState<Task[]>([
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

  const upcomingEvents: UpcomingEvent[] = orders
    .filter(o => o.status !== 'delivered')
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3)
    .map(o => ({
      date: o.eventDate,
      month: new Date(o.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: new Date(o.eventDate).getDate(),
      eventType: o.eventType,
      time: '12:00 PM',
      guestCount: o.guestCount,
    }));

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inquiry': return { bg: '#1e40af', text: 'white' };
      case 'quoted': return { bg: '#92400e', text: '#fbbf24' };
      case 'confirmed': return { bg: '#064e3b', text: '#6ee7b7' };
      default: return { bg: '#374151', text: '#d1d5db' };
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'inquiry': return 'New';
      case 'quoted': return 'Contacted';
      case 'confirmed': return 'Confirmed';
      default: return status;
    }
  };

  return (
    <div style={{ backgroundColor: '#0B3D36' }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: '#0B3D36' }} className="sticky top-0 z-10">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 style={{ color: '#D4A64A' }} className="text-4xl font-bold">Good morning, Alexandra! 👋</h1>
            <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">Here's what's happening with your catering business today.</p>
          </div>

          <div className="flex items-center gap-4">
            <button title="Search" style={{ color: '#D4A64A' }} className="p-2 hover:bg-[#1a5f54] rounded-lg transition">
              <Search className="w-5 h-5" />
            </button>
            <button title="Notifications" style={{ color: '#D4A64A' }} className="relative p-2 hover:bg-[#1a5f54] rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => onNavigate('inquiries')}
              style={{ backgroundColor: '#D4A64A', color: '#0B3D36' }}
              className="px-4 py-2 font-bold rounded-lg transition hover:opacity-90 shadow-md"
            >
              + New Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 space-y-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard
            label="NEW INQUIRIES"
            value={newInquiries}
            icon={<MessageSquare className="w-6 h-6" />}
            change="+2 from yesterday"
            bgColor="#0B3D36"
            iconColor="white"
          />
          <StatCard
            label="CONFIRMED ORDERS"
            value={confirmedOrders}
            icon={<ClipboardList className="w-6 h-6" />}
            change="+3 this week"
            bgColor="#374151"
            iconColor="white"
          />
          <StatCard
            label="REVENUE (THIS MONTH)"
            value={`$${monthlyRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6" />}
            change="+18% from last month"
            bgColor="#D4A64A"
            iconColor="#0B3D36"
          />
          <StatCard
            label="TOTAL CLIENTS"
            value={totalClients}
            icon={<Users className="w-6 h-6" />}
            change="+5 new this month"
            bgColor="#374151"
            iconColor="white"
          />
        </div>

        {/* Charts & Menu */}
        <div className="grid grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div style={{ backgroundColor: '#1a5f54' }} className="col-span-2 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ color: '#D4A64A' }} className="text-lg font-bold">Revenue Overview</h3>
              <select style={{ backgroundColor: '#0B3D36', color: '#D4A64A', borderColor: '#D4A64A' }} className="text-sm border rounded-lg px-3 py-2">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Year to Date</option>
              </select>
            </div>

            {/* Gold gradient line chart */}
            <div className="h-56 flex items-end justify-between gap-1 mb-6 relative">
              <svg className="absolute inset-0 w-full h-full opacity-30" style={{ pointerEvents: 'none' }} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#D4A64A', stopOpacity: 0.5 }} />
                    <stop offset="100%" style={{ stopColor: '#D4A64A', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <polyline points="0,160 40,135 80,150 120,75 160,55 200,85 240,20" fill="url(#gradientFill)" stroke="none" />
              </svg>

              {[2, 3, 2.5, 4, 4.5, 3.5, 4.8].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  <div
                    style={{
                      height: `${val * 50}px`,
                      borderTop: '3px solid #D4A64A'
                    }}
                    className="w-full rounded-t-md shadow-md hover:shadow-lg transition relative group"
                  >
                    {/* Tooltip */}
                    <div style={{ backgroundColor: '#0B3D36' }} className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      <p style={{ color: '#D4A64A' }} className="font-bold">May {i === 0 ? '1' : i * 4 + 1}</p>
                      <p style={{ color: '#D4A64A' }}>$3,450</p>
                    </div>
                  </div>
                  <p style={{ color: '#D4A64A' }} className="text-xs mt-2 font-semibold">May {i === 0 ? '1' : i * 4 + 1}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTopColor: '#2a8f7f' }} className="border-t pt-4 text-center">
              <p style={{ color: '#a8d5ca' }} className="text-xs">May 21</p>
              <p style={{ color: '#D4A64A' }} className="text-2xl font-black">$3,450</p>
            </div>
          </div>

          {/* Top Menu Items - Donut Chart */}
          <div style={{ backgroundColor: '#1a5f54' }} className="rounded-2xl p-6 shadow-lg">
            <h3 style={{ color: '#D4A64A' }} className="text-lg font-bold mb-6">Top Menu Items</h3>

            {/* Multi-color donut chart */}
            <div className="flex items-center gap-6 mb-4">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#D4A64A" strokeWidth="8" strokeDasharray="87.96 251.33" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#0B3D36" strokeWidth="8" strokeDasharray="62.83 251.33" strokeDashoffset="-87.96" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#7a9e7e" strokeWidth="8" strokeDasharray="50.27 251.33" strokeDashoffset="-150.79" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#b8945e" strokeWidth="8" strokeDasharray="37.7 251.33" strokeDashoffset="-201.06" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#a89968" strokeWidth="8" strokeDasharray="12.57 251.33" strokeDashoffset="-238.76" />
                  <circle cx="50" cy="50" r="25" fill="#0B3D36" />
                </svg>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Jollof Rice', pct: 35, color: '#D4A64A' },
                  { name: 'Grilled Chicken', pct: 25, color: '#0B3D36' },
                  { name: 'Beef Stew', pct: 20, color: '#7a9e7e' },
                  { name: 'Fried Rice', pct: 10, color: '#b8945e' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div style={{ backgroundColor: item.color }} className="w-2 h-2 rounded-full"></div>
                    <p style={{ color: '#D4A64A' }} className="text-xs">● {item.name}</p>
                    <p style={{ color: '#a8d5ca' }} className="text-xs ml-auto font-semibold">{item.pct}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tables & Widgets */}
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Inquiries Table */}
          <div style={{ backgroundColor: '#1a5f54' }} className="rounded-2xl shadow-lg overflow-hidden">
            <div style={{ borderBottomColor: '#2a8f7f' }} className="p-6 border-b flex items-center justify-between">
              <h3 style={{ color: '#D4A64A' }} className="text-lg font-bold">Recent Inquiries</h3>
              <button onClick={() => onNavigate('inquiries')} style={{ color: '#D4A64A' }} className="text-sm font-semibold hover:opacity-80">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#0B3D36' }}>
                  <tr>
                    <th style={{ color: '#D4A64A' }} className="px-6 py-3 text-left font-semibold">Client</th>
                    <th style={{ color: '#D4A64A' }} className="px-6 py-3 text-left font-semibold">Event Type</th>
                    <th style={{ color: '#D4A64A' }} className="px-6 py-3 text-left font-semibold">Date</th>
                    <th style={{ color: '#D4A64A' }} className="px-6 py-3 text-left font-semibold">Guests</th>
                    <th style={{ color: '#D4A64A' }} className="px-6 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => {
                    const colors = getStatusColor(order.status);
                    return (
                      <tr key={order.id} style={{ borderBottomColor: '#2a8f7f' }} className="border-b hover:bg-[#0B3D36] transition">
                        <td style={{ color: '#D4A64A' }} className="px-6 py-4 font-medium">{order.clientName}</td>
                        <td style={{ color: '#a8d5ca' }} className="px-6 py-4 capitalize">{order.eventType}</td>
                        <td style={{ color: '#a8d5ca' }} className="px-6 py-4">{order.eventDate}</td>
                        <td style={{ color: '#a8d5ca' }} className="px-6 py-4">{order.guestCount}</td>
                        <td className="px-6 py-4">
                          <span style={{ backgroundColor: colors.bg, color: colors.text }} className="px-3 py-1 rounded-full text-xs font-bold inline-block">
                            {statusLabel(order.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Tasks & Events */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <div style={{ backgroundColor: '#1a5f54' }} className="rounded-2xl p-6 shadow-lg">
              <h3 style={{ color: '#D4A64A' }} className="text-lg font-bold mb-4">Today's Tasks</h3>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="w-full text-left flex items-start gap-3 p-3 rounded-lg hover:bg-[#0B3D36] transition"
                  >
                    {task.completed ? (
                      <CheckCircle2 style={{ color: '#10B981' }} className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle style={{ color: '#D4A64A' }} className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p style={{ color: task.completed ? '#a8d5ca' : '#D4A64A' }} className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                        {task.text}
                      </p>
                      <p style={{ color: '#a8d5ca' }} className="text-xs">{task.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div style={{ backgroundColor: '#1a5f54' }} className="rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ color: '#D4A64A' }} className="text-lg font-bold">Upcoming Events</h3>
                <button onClick={() => onNavigate('calendar')} style={{ color: '#D4A64A' }} className="text-sm font-semibold hover:opacity-80">
                  View Calendar
                </button>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((event, idx) => (
                  <div key={idx} style={{ backgroundColor: '#0B3D36' }} className="flex gap-4 p-4 rounded-lg">
                    <div className="text-center min-w-fit">
                      <p style={{ color: '#D4A64A' }} className="text-xs font-bold">{event.month}</p>
                      <p style={{ color: '#D4A64A' }} className="text-2xl font-black">{event.day}</p>
                    </div>
                    <div className="flex-1">
                      <p style={{ color: '#D4A64A' }} className="font-semibold capitalize">{event.eventType}</p>
                      <p style={{ color: '#a8d5ca' }} className="text-xs">{event.time} • {event.guestCount} Guests</p>
                    </div>
                    <span style={{ backgroundColor: '#1a5f54', color: '#D4A64A', borderColor: '#D4A64A' }} className="text-xs font-bold border px-2 py-1 rounded-full self-start flex-shrink-0">
                      Upcoming
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ backgroundColor: '#1a5f54' }} className="rounded-2xl p-6 shadow-lg">
          <h3 style={{ color: '#D4A64A' }} className="text-lg font-bold mb-6">Quick Actions</h3>
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
                style={{ backgroundColor: '#0B3D36' }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:shadow-lg transition"
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
