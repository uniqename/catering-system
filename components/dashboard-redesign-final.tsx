'use client';

import { useState } from 'react';
import { Bell, Search, TrendingUp, CheckCircle2, Circle, MessageSquare, ClipboardList, DollarSign, Users, AlertCircle, Plus, MessageCircle, ShoppingCart, UserPlus, FileText as FileIcon, Calendar, Share2 } from 'lucide-react';

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

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.04)' };

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
  <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="rounded-2xl p-6 hover:shadow-xl transition flex items-start gap-4">
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

const RevenueChart = () => {
  const data = [
    { date: 'May 1', value: 2400 },
    { date: 'May 7', value: 3200 },
    { date: 'May 14', value: 2800 },
    { date: 'May 21', value: 3450 },
    { date: 'May 28', value: 4100 },
    { date: 'May 31', value: 3800 },
  ];

  const maxValue = 5000;
  const width = 450;
  const height = 250;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - (d.value / maxValue) * chartHeight,
    value: d.value,
    date: d.date,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={`gridline-${i}`}>
          <line
            x1={padding.left}
            y1={padding.top + (chartHeight / 5) * (5 - i)}
            x2={width - padding.right}
            y2={padding.top + (chartHeight / 5) * (5 - i)}
            stroke="rgba(215, 168, 89, 0.08)"
            strokeWidth="1"
          />
          <text
            x={padding.left - 10}
            y={padding.top + (chartHeight / 5) * (5 - i) + 4}
            fontSize="12"
            fill="#ffffff"
            textAnchor="end"
            fontWeight="500"
          >
            ${i}k
          </text>
        </g>
      ))}

      {points.map((p, i) => (
        <text
          key={`label-${i}`}
          x={p.x}
          y={height - 10}
          fontSize="11"
          fill="#ffffff"
          textAnchor="middle"
          fontWeight="500"
        >
          {p.date}
        </text>
      ))}

      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#d7a859" strokeWidth="1.5" />
      <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#d7a859" strokeWidth="1.5" />

      <path d={pathD} stroke="#d7a859" strokeWidth="2.5" fill="none" />

      <defs>
        <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d7a859" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#d7a859" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        d={`${pathD} L ${width - padding.right} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`}
        fill="url(#revenueGradient)"
      />

      {points.map((p, i) => (
        <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="4" fill="#d7a859" stroke="#0a1911" strokeWidth="2" />
      ))}

      <circle cx={points[3].x} cy={points[3].y} r="6" fill="none" stroke="#d7a859" strokeWidth="2" />
    </svg>
  );
};

const DonutChart = () => {
  const items = [
    { name: 'Jollof Rice', pct: 35, color: '#d7a859' },
    { name: 'Grilled Chicken', pct: 25, color: '#8fc9a0' },
    { name: 'Beef Stew', pct: 20, color: '#b8945e' },
    { name: 'Fried Rice', pct: 10, color: '#a89968' },
    { name: 'Other', pct: 10, color: '#9a8873' },
  ];

  const size = 180;
  const center = size / 2;
  const radius = 65;
  const innerRadius = 40;

  let currentAngle = -Math.PI / 2;

  const paths = items.map((item) => {
    const sliceAngle = (item.pct / 100) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const ix1 = center + innerRadius * Math.cos(startAngle);
    const iy1 = center + innerRadius * Math.sin(startAngle);
    const ix2 = center + innerRadius * Math.cos(endAngle);
    const iy2 = center + innerRadius * Math.sin(endAngle);

    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

    const pathData = `
      M ${ix1} ${iy1}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${ix2} ${iy2}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}
      Z
    `;

    currentAngle = endAngle;
    return { item, pathData };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.pathData} fill={p.item.color} />
      ))}
    </svg>
  );
};

// Updated: 2026-07-28 03:34
export default function DashboardRedesignFinal({
  orders = [],
  onNavigate = () => {}
}: {
  orders?: Order[];
  onNavigate?: (tab: string) => void;
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

  const upcomingEvents = orders
    .filter(o => o.status !== 'delivered')
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const menuItems = [
    { name: 'Jollof Rice', pct: 35, color: '#d7a859' },
    { name: 'Grilled Chicken', pct: 25, color: '#8fc9a0' },
    { name: 'Beef Stew', pct: 20, color: '#b8945e' },
    { name: 'Fried Rice', pct: 10, color: '#a89968' },
    { name: 'Other', pct: 10, color: '#9a8873' },
  ];

  const recentInquiries = orders.slice(0, 5);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      inquiry: '#10B981',
      quoted: '#f59e0b',
      confirmed: '#6366f1',
      delivered: '#8b5cf6'
    };
    return colors[status] || '#10B981';
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

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
          <StatCard label="NEW INQUIRIES" value={newInquiries} icon={<MessageSquare className="w-6 h-6" />} change="+2 from yesterday" bgColor="#a89968" iconColor="white" />
          <StatCard label="CONFIRMED ORDERS" value={confirmedOrders} icon={<ClipboardList className="w-6 h-6" />} change="+3 this week" bgColor="#a89968" iconColor="white" />
          <StatCard label="REVENUE (THIS MONTH)" value={`$${monthlyRevenue.toLocaleString()}`} icon={<DollarSign className="w-6 h-6" />} change="+18% from last month" bgColor="#d7a859" iconColor="#0a1911" />
          <StatCard label="TOTAL CLIENTS" value={totalClients} icon={<Users className="w-6 h-6" />} change="+5 new this month" bgColor="#c5bfaf" iconColor="#0a1911" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Revenue Overview */}
          <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="col-span-7 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: '#ffffff' }} className="text-lg font-bold">Revenue Overview</h2>
              <select style={{ borderColor: 'rgba(215, 168, 89, 0.1)', color: '#ffffff', backgroundColor: '#102418' }} className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Year to Date</option>
              </select>
            </div>
            <div className="flex justify-center mb-4">
              <RevenueChart />
            </div>
            <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="border-t pt-4 text-center">
              <p style={{ color: '#ffffff' }} className="text-sm">May 21</p>
              <p style={{ color: '#d7a859' }} className="text-3xl font-bold">$3,450</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-5 space-y-6">
            {/* Top Menu Items */}
            <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="rounded-2xl p-8">
              <h2 style={{ color: '#ffffff' }} className="text-lg font-bold mb-6">Top Menu Items</h2>
              <div className="flex justify-center mb-8">
                <DonutChart />
              </div>
              <div className="space-y-3">
                {menuItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div style={{ backgroundColor: item.color }} className="w-2 h-2 rounded-full"></div>
                    <p style={{ color: '#ffffff' }} className="text-xs flex-1">{item.name}</p>
                    <p style={{ color: '#ffffff' }} className="text-xs font-semibold">{item.pct}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Tasks */}
            <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ color: '#ffffff' }} className="text-lg font-bold">Today's Tasks</h2>
                <button onClick={() => onNavigate('orders')} style={{ color: '#d7a859' }} className="text-sm font-semibold hover:opacity-80">
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {tasks.slice(0, 4).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    style={{ backgroundColor: task.completed ? '#102418' : '#0a1911' }}
                    className="w-full p-2 rounded-lg transition text-left flex items-start gap-2 hover:bg-[#102418]"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {task.completed ? (
                        <CheckCircle2 style={{ color: '#10B981' }} className="w-4 h-4" />
                      ) : (
                        <Circle style={{ color: '#d7a859' }} className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ color: '#ffffff' }} className={`text-xs font-medium ${task.completed ? 'line-through' : ''}`}>
                        {task.text}
                      </p>
                      <p style={{ color: '#ffffff' }} className="text-xs opacity-70">{task.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ color: '#ffffff' }} className="text-lg font-bold">Recent Inquiries</h2>
            <button onClick={() => onNavigate('inquiries')} style={{ color: '#d7a859' }} className="text-sm font-semibold hover:opacity-80">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="border-b">
                  <th style={{ color: '#ffffff' }} className="text-left py-3 px-4 font-semibold text-sm">Client</th>
                  <th style={{ color: '#ffffff' }} className="text-left py-3 px-4 font-semibold text-sm">Event Type</th>
                  <th style={{ color: '#ffffff' }} className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                  <th style={{ color: '#ffffff' }} className="text-left py-3 px-4 font-semibold text-sm">Guests</th>
                  <th style={{ color: '#ffffff' }} className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((order) => (
                  <tr key={order.id} style={{ borderBottomColor: 'rgba(215, 168, 89, 0.05)' }} className="border-b hover:bg-[#102418] transition">
                    <td style={{ color: '#ffffff' }} className="py-3 px-4 text-sm">{order.clientName}</td>
                    <td style={{ color: '#ffffff' }} className="py-3 px-4 text-sm capitalize">{order.eventType}</td>
                    <td style={{ color: '#ffffff' }} className="py-3 px-4 text-sm">{new Date(order.eventDate).toLocaleDateString()}</td>
                    <td style={{ color: '#ffffff' }} className="py-3 px-4 text-sm">{order.guestCount}</td>
                    <td className="py-3 px-4 text-sm">
                      <span style={{ backgroundColor: getStatusColor(order.status), color: '#0a1911' }} className="px-3 py-1 rounded-full text-xs font-semibold">
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="rounded-2xl p-8">
          <h2 style={{ color: '#ffffff' }} className="text-lg font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-6 gap-4">
            <button onClick={() => onNavigate('inquiries')} className="flex flex-col items-center justify-center p-6 rounded-lg hover:bg-[#102418] transition text-center">
              <MessageCircle style={{ color: '#d7a859' }} className="w-8 h-8 mb-3" />
              <p style={{ color: '#ffffff' }} className="text-xs font-semibold">New Inquiry</p>
            </button>
            <button onClick={() => onNavigate('orders')} className="flex flex-col items-center justify-center p-6 rounded-lg hover:bg-[#102418] transition text-center">
              <ShoppingCart style={{ color: '#d7a859' }} className="w-8 h-8 mb-3" />
              <p style={{ color: '#ffffff' }} className="text-xs font-semibold">Create Order</p>
            </button>
            <button onClick={() => onNavigate('clients')} className="flex flex-col items-center justify-center p-6 rounded-lg hover:bg-[#102418] transition text-center">
              <UserPlus style={{ color: '#d7a859' }} className="w-8 h-8 mb-3" />
              <p style={{ color: '#ffffff' }} className="text-xs font-semibold">Add Client</p>
            </button>
            <button onClick={() => onNavigate('invoices')} className="flex flex-col items-center justify-center p-6 rounded-lg hover:bg-[#102418] transition text-center">
              <FileIcon style={{ color: '#d7a859' }} className="w-8 h-8 mb-3" />
              <p style={{ color: '#ffffff' }} className="text-xs font-semibold">Create Invoice</p>
            </button>
            <button onClick={() => onNavigate('calendar')} className="flex flex-col items-center justify-center p-6 rounded-lg hover:bg-[#102418] transition text-center">
              <Calendar style={{ color: '#d7a859' }} className="w-8 h-8 mb-3" />
              <p style={{ color: '#ffffff' }} className="text-xs font-semibold">View Calendar</p>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-lg hover:bg-[#102418] transition text-center">
              <Share2 style={{ color: '#d7a859' }} className="w-8 h-8 mb-3" />
              <p style={{ color: '#ffffff' }} className="text-xs font-semibold">Share QR Code</p>
            </button>
          </div>
        </div>

        {/* Get More Inquiries */}
        <div style={{ backgroundColor: '#102418', ...CardBorder }} className="rounded-2xl p-8">
          <h2 style={{ color: '#ffffff' }} className="text-lg font-bold mb-3">Get more inquiries</h2>
          <p style={{ color: '#ffffff' }} className="text-sm mb-6">Share your inquiry form or QR code to get more bookings.</p>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#d7a859' }} className="text-sm font-semibold">Share your inquiry form</p>
              <p style={{ color: '#ffffff' }} className="text-xs opacity-70 mt-1">Scan to get to your booking form</p>
            </div>
            <div style={{ backgroundColor: '#ffffff' }} className="w-24 h-24 rounded-lg flex items-center justify-center p-2">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full h-full rounded flex items-center justify-center">
                <p style={{ color: '#ffffff' }} className="text-xs">QR Code</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ color: '#ffffff' }} className="text-lg font-bold">Upcoming Events</h2>
            <button onClick={() => onNavigate('calendar')} style={{ color: '#d7a859' }} className="text-sm font-semibold hover:opacity-80">
              View Calendar
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} style={{ backgroundColor: '#102418', ...CardBorder }} className="flex gap-3 p-4 rounded-lg hover:opacity-80 transition">
                <div className="text-center min-w-fit">
                  <p style={{ color: '#d7a859' }} className="text-xs font-bold">
                    {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </p>
                  <p style={{ color: '#d7a859' }} className="text-lg font-bold">
                    {new Date(event.eventDate).getDate()}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: '#ffffff' }} className="font-semibold capitalize text-sm">{event.eventType}</p>
                  <p style={{ color: '#ffffff' }} className="text-xs opacity-70 truncate">{event.clientName} • {event.guestCount} guests</p>
                  <span style={{ backgroundColor: '#d7a859', color: '#0a1911' }} className="inline-block text-xs font-semibold px-2 py-1 rounded mt-2">
                    Upcoming
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
