'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, TrendingUp, CheckCircle2, Circle, MessageSquare, ClipboardList, DollarSign, Users, AlertCircle, Eye, Plus } from 'lucide-react';

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
  <div style={{ backgroundColor: '#0a1911', borderColor: '#d7a859' }} className="rounded-2xl p-6 border shadow-lg hover:shadow-xl transition flex items-start gap-4">
    <div style={{ backgroundColor: bgColor }} className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
      <div style={{ color: iconColor }} className="w-8 h-8">
        {icon}
      </div>
    </div>
    <div className="flex-1">
      <p style={{ color: '#ffffff' }} className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p style={{ color: '#ffffff' }} className="text-4xl font-black mt-2">{value}</p>
      <div className="mt-3 flex items-center gap-1">
        <TrendingUp style={{ color: '#10B981' }} className="w-4 h-4" />
        <p style={{ color: '#10B981' }} className="text-xs font-semibold">{change}</p>
      </div>
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
    { id: 4, text: 'Pay quarterly tax to city', subtitle: 'Due by end of month', completed: false },
  ]);

  const [selectedMonth, setSelectedMonth] = useState('May');
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, type: 'tax', message: 'Quarterly tax payment due', dueDate: '2026-08-31', priority: 'high' }
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

  const menuItems = [
    { name: 'Jollof Rice', pct: 35, color: '#d7a859' },
    { name: 'Grilled Chicken', pct: 25, color: '#7a9e7e' },
    { name: 'Beef Stew', pct: 20, color: '#b8945e' },
    { name: 'Fried Rice', pct: 10, color: '#a89968' },
  ];

  return (
    <div style={{ backgroundColor: '#0a1911' }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: '#0a1911' }} className="sticky top-0 z-10">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 style={{ color: '#d7a859' }} className="text-4xl font-bold">Good morning, Alexandra! 👋</h1>
            <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">Here's what's happening with your catering business today.</p>
          </div>

          <div className="flex items-center gap-4">
            <button title="Search" style={{ color: '#d7a859' }} className="p-2 hover:bg-[#102418] rounded-lg transition">
              <Search className="w-5 h-5" />
            </button>
            <button title="Notifications" style={{ color: '#d7a859' }} className="relative p-2 hover:bg-[#102418] rounded-lg transition">
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => onNavigate('inquiries')}
              style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
              className="px-4 py-2 font-bold rounded-lg transition hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Inquiry
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
            bgColor="#a89968"
            iconColor="white"
          />
          <StatCard
            label="CONFIRMED ORDERS"
            value={confirmedOrders}
            icon={<ClipboardList className="w-6 h-6" />}
            change="+3 this week"
            bgColor="#a89968"
            iconColor="white"
          />
          <StatCard
            label="REVENUE (THIS MONTH)"
            value={`$${monthlyRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6" />}
            change="+18% from last month"
            bgColor="#d7a859"
            iconColor="#0a1911"
          />
          <StatCard
            label="TOTAL CLIENTS"
            value={totalClients}
            icon={<Users className="w-6 h-6" />}
            change="+5 new this month"
            bgColor="#c5bfaf"
            iconColor="#0a1911"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div style={{ backgroundColor: '#0a1911', borderColor: '#d7a859' }} className="col-span-2 rounded-2xl p-6 border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: '#d7a859' }} className="text-lg font-bold">Revenue Overview</h2>
              <select style={{ borderColor: '#d7a859', color: '#d7a859', backgroundColor: '#102418' }} className="text-sm border rounded-lg px-3 py-1.5">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Year to Date</option>
              </select>
            </div>

            {/* Line Chart with Gold Dots */}
            <div className="h-64 flex items-end justify-between gap-2 mb-4 relative px-4">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d7a859" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#d7a859" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline points="0,180 30,140 60,160 90,110 120,80 150,130 180,60" fill="url(#revenueGradient)" stroke="none" />
                <polyline points="0,180 30,140 60,160 90,110 120,80 150,130 180,60" fill="none" stroke="#d7a859" strokeWidth="2" />
              </svg>
              {[{ val: 40, label: 'May 1' }, { val: 52, label: 'May 7' }, { val: 48, label: 'May 14' }, { val: 65, label: 'May 21' }, { val: 72, label: 'May 28' }, { val: 58, label: 'May 31' }, { val: 75, label: 'Today' }].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center relative z-10">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#d7a859' }}></div>
                </div>
              ))}
            </div>

            {/* Today's Amount */}
            <div style={{ borderTopColor: '#d7a859' }} className="border-t pt-4 text-center">
              <p style={{ color: '#a8d5ca' }} className="text-sm">May 21</p>
              <p style={{ color: '#d7a859' }} className="text-2xl font-bold">$3,450</p>
            </div>
          </div>

          {/* Top Menu Items */}
          <div style={{ backgroundColor: '#0a1911', borderColor: '#d7a859' }} className="rounded-2xl p-6 border shadow-lg">
            <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-6">Top Menu Items</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {menuItems.map((item, idx) => {
                    const start = menuItems.slice(0, idx).reduce((sum, m) => sum + m.pct, 0);
                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="8"
                        strokeDasharray={`${(item.pct / 100) * 251.33} 251.33`}
                        strokeDashoffset={`${-(start / 100) * 251.33}`}
                      />
                    );
                  })}
                  <circle cx="50" cy="50" r="25" fill="#0a1911" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              {menuItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div style={{ backgroundColor: item.color }} className="w-2 h-2 rounded-full"></div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs flex-1">{item.name}</p>
                  <p style={{ color: '#d7a859' }} className="text-xs font-semibold">{item.pct}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks and Upcoming */}
        <div className="grid grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <div style={{ backgroundColor: '#0a1911', borderColor: '#d7a859' }} className="rounded-2xl p-6 border shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: '#d7a859' }} className="text-lg font-bold">Today's Tasks</h2>
              <button onClick={() => onNavigate('orders')} style={{ color: '#d7a859' }} className="text-sm font-semibold hover:opacity-80">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  style={{ backgroundColor: task.completed ? '#102418' : '#0a1911', borderColor: '#d7a859' }}
                  className="w-full p-3 rounded-lg border transition text-left flex items-start gap-3"
                >
                  <div className="mt-1 flex-shrink-0">
                    {task.completed ? (
                      <CheckCircle2 style={{ color: '#10B981' }} className="w-5 h-5" />
                    ) : (
                      <Circle style={{ color: '#d7a859' }} className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: task.completed ? '#d7a859' : '#d7a859' }} className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.text}
                    </p>
                    <p style={{ color: '#a8d5ca' }} className="text-xs">{task.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{ backgroundColor: '#0a1911', borderColor: '#d7a859' }} className="rounded-2xl p-6 border shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: '#d7a859' }} className="text-lg font-bold">Upcoming Events</h2>
              <button onClick={() => onNavigate('calendar')} style={{ color: '#d7a859' }} className="text-sm font-semibold hover:opacity-80">
                View Calendar
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((event, idx) => (
                <div key={idx} style={{ backgroundColor: '#102418', borderColor: '#d7a859' }} className="flex gap-3 p-3 rounded-lg hover:opacity-80 transition border">
                  <div className="text-center min-w-fit">
                    <p style={{ color: '#d7a859' }} className="text-xs font-bold">
                      {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </p>
                    <p style={{ color: '#d7a859' }} className="text-xl font-bold">
                      {new Date(event.eventDate).getDate()}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: '#d7a859' }} className="font-semibold capitalize text-sm">{event.eventType}</p>
                    <p style={{ color: '#a8d5ca' }} className="text-xs truncate">{event.clientName} • {event.guestCount} guests</p>
                  </div>
                  <span style={{ backgroundColor: '#0a1911', color: '#d7a859', borderColor: '#d7a859' }} className="text-xs font-bold border px-2 py-1 rounded-full self-start flex-shrink-0">
                    Upcoming
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tax Notifications Alert */}
        {notifications.some(n => n.priority === 'high') && (
          <div style={{ backgroundColor: '#102418', borderColor: '#d7a859' }} className="rounded-2xl p-6 border shadow-lg flex items-start gap-4">
            <AlertCircle style={{ color: '#ef4444' }} className="w-6 h-6 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 style={{ color: '#ef4444' }} className="font-bold mb-2">Important: Tax Payment Reminder</h3>
              <p style={{ color: '#a8d5ca' }} className="text-sm mb-3">Quarterly tax payment to the city is due by August 31, 2026</p>
              <button style={{ backgroundColor: '#d7a859', color: '#0a1911' }} className="px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90">
                Mark as Paid
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
