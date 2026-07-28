'use client';

import { useState, useMemo } from 'react';
import { Bell, Search, TrendingUp, CheckCircle2, Circle, MessageSquare, ClipboardList, DollarSign, Users, AlertCircle, Plus, MessageCircle, ShoppingCart, UserPlus, FileText as FileIcon, Calendar, Share2, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, MoreVertical, Edit3, Eye } from 'lucide-react';

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

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

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
  <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="rounded-xl p-6 flex items-start gap-3">
    <div style={{ backgroundColor: bgColor }} className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
      <div style={{ color: iconColor }} className="w-6 h-6">
        {icon}
      </div>
    </div>
    <div className="flex-1">
      <p style={{ color: '#ffffff' }} className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p style={{ color: '#ffffff' }} className="text-2xl font-black mt-1">{value}</p>
      <div className="mt-1.5 flex items-center gap-1">
        <TrendingUp style={{ color: '#10B981' }} className="w-3 h-3" />
        <p style={{ color: '#10B981' }} className="text-xs font-semibold">{change}</p>
      </div>
    </div>
  </div>
);

const RevenueChart = ({ month }: { month: number }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = 2026;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const generateData = () => {
    const data = [];
    const step = Math.max(1, Math.floor(daysInMonth / 6));
    for (let i = 0; i < daysInMonth; i += step) {
      data.push({
        date: `${months[month]} ${i + 1}`,
        value: Math.floor(Math.random() * 4000) + 1500
      });
    }
    return data;
  };

  const data = generateData();
  const maxValue = 5000;
  const width = 340;
  const height = 160;
  const padding = { top: 12, right: 15, bottom: 25, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - (d.value / maxValue) * chartHeight,
    value: d.value,
    date: d.date,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const highlightPoint = points[Math.floor(points.length * 0.6)];

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
            x={padding.left - 8}
            y={padding.top + (chartHeight / 5) * (5 - i) + 3}
            fontSize="10"
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
          y={height - 6}
          fontSize="9"
          fill="#ffffff"
          textAnchor="middle"
          fontWeight="500"
        >
          {p.date.split(' ')[1]}
        </text>
      ))}

      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#d7a859" strokeWidth="1.5" />
      <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#d7a859" strokeWidth="1.5" />

      <path d={pathD} stroke="#d7a859" strokeWidth="2" fill="none" />

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
        <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="2.5" fill="#d7a859" stroke="#0a1911" strokeWidth="1.5" />
      ))}

      {highlightPoint && <circle cx={highlightPoint.x} cy={highlightPoint.y} r="4" fill="none" stroke="#d7a859" strokeWidth="1.5" />}
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

  const radius = 55;
  const cx = 70;
  const cy = 60;

  let currentAngle = -90;
  const arcs = items.map((item) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + (item.pct / 100) * 360;
    const start = {
      x: cx + radius * Math.cos((startAngle * Math.PI) / 180),
      y: cy + radius * Math.sin((startAngle * Math.PI) / 180),
    };
    const end = {
      x: cx + radius * Math.cos((endAngle * Math.PI) / 180),
      y: cy + radius * Math.sin((endAngle * Math.PI) / 180),
    };
    const largeArc = item.pct > 50 ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    currentAngle = endAngle;
    return { pathData, color: item.color };
  });

  return (
    <svg width="120" height="120" viewBox="0 0 140 140">
      {arcs.map((arc, i) => (
        <path key={i} d={arc.pathData} fill={arc.color} />
      ))}
      <circle cx={cx} cy={cy} r="30" fill="#0a1911" />
    </svg>
  );
};

export default function DashboardRedesignFinal({ orders, onNavigate }: { orders: Order[]; onNavigate: (tab: string) => void }) {
  const [revenueMonth, setRevenueMonth] = useState(6); // July
  const [menuMonth, setMenuMonth] = useState(6);
  const [showNotifications, setShowNotifications] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Follow-up with Amelia Johnson', subtitle: 'Wedding inquiry', completed: true },
    { id: 2, text: 'Send proposal to Michael Smith', subtitle: 'Corporate event', completed: false },
    { id: 3, text: 'Review menu for June events', subtitle: 'This week', completed: false },
    { id: 4, text: 'Check inventory', subtitle: 'Before weekend', completed: false },
    { id: 5, text: 'Tax payment reminder', subtitle: 'Due July 31, 2026', completed: false },
  ]);

  const menuItems = [
    { name: 'Jollof Rice', pct: 35, color: '#d7a859' },
    { name: 'Grilled Chicken', pct: 25, color: '#8fc9a0' },
    { name: 'Beef Stew', pct: 20, color: '#b8945e' },
    { name: 'Fried Rice', pct: 10, color: '#a89968' },
    { name: 'Other', pct: 10, color: '#9a8873' },
  ];

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const recentInquiries = orders.slice(0, 5);

  const upcomingEvents = useMemo(() => {
    const now = new Date('2026-07-27');
    const events = orders
      .filter(o => new Date(o.eventDate) > now)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .slice(0, 5);

    return events.map(e => {
      const eventDate = new Date(e.eventDate);
      const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isRisk = daysUntil < 7;
      const isConfirmed = e.status === 'confirmed';

      return {
        ...e,
        daysUntil,
        isRisk,
        isConfirmed,
        dateStr: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
        timeStr: eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    });
  }, [orders]);

  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const newInquiries = orders.filter(o => o.status === 'inquiry').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const monthlyRevenue = orders
    .filter(o => o.status === 'confirmed')
    .reduce((sum, o) => sum + (Math.random() * 1000 + 500), 0);
  const totalClients = orders.length;

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      inquiry: '#10B981',
      quoted: '#f59e0b',
      confirmed: '#10B981',
      delivered: '#10B981'
    };
    return colors[status] || '#10B981';
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Garage to Table Catering',
          text: 'Book your event with us! Curated meals, flavored with love.',
          url: window.location.origin + '/catering/client-booking'
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      alert('Share your booking link: ' + window.location.origin + '/catering/client-booking');
    }
  };

  return (
    <div style={{ backgroundColor: '#0a1911' }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: '#0a1911', borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="sticky top-0 z-10 border-b">
        <div className="px-8 py-3 flex items-center justify-between">
          <div>
            <h1 style={{ color: '#d7a859' }} className="text-2xl font-bold">Good morning, Alexandra! 👋</h1>
            <p style={{ color: '#a8d5ca' }} className="text-xs mt-0.5">Here's what's happening with your catering business today.</p>
          </div>

          <div className="flex items-center gap-2 relative">
            <button onClick={() => onNavigate('inquiries')} title="Search inquiries" style={{ color: '#d7a859' }} className="p-1.5 hover:bg-[#102418] rounded-lg transition">
              <Search className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
                style={{ color: '#d7a859' }}
                className="relative p-1.5 hover:bg-[#102418] rounded-lg transition"
              >
                <Bell className="w-5 h-5" />
                {orders.filter(o => o.status === 'inquiry').length > 0 && (
                  <span style={{ backgroundColor: '#ef4444' }} className="absolute top-0 right-0 w-2 h-2 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div style={{ backgroundColor: '#0f2416', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="absolute right-0 top-12 w-72 border rounded-xl shadow-lg z-50">
                  <div className="p-4 border-b" style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }}>
                    <p style={{ color: '#d7a859' }} className="font-bold text-sm">Notifications</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {orders.filter(o => o.status === 'inquiry').length === 0 ? (
                      <div className="p-4">
                        <p style={{ color: '#a8d5ca' }} className="text-xs text-center">No new inquiries</p>
                      </div>
                    ) : (
                      orders
                        .filter(o => o.status === 'inquiry')
                        .map(order => (
                          <button
                            key={order.id}
                            onClick={() => {
                              onNavigate('inquiries');
                              setShowNotifications(false);
                            }}
                            style={{ backgroundColor: '#0a1911', borderBottomColor: 'rgba(215, 168, 89, 0.05)' }}
                            className="w-full p-4 border-b hover:bg-[#102418] transition text-left"
                          >
                            <p style={{ color: '#d7a859' }} className="text-xs font-bold">{order.clientName}</p>
                            <p style={{ color: '#a8d5ca' }} className="text-xs mt-1">{order.eventType} for {order.guestCount} guests</p>
                            <p style={{ color: '#a8d5ca' }} className="text-xs opacity-70 mt-1">{new Date(order.eventDate).toLocaleDateString()}</p>
                          </button>
                        ))
                    )}
                  </div>
                  <div className="p-3 border-t" style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }}>
                    <button
                      onClick={() => {
                        onNavigate('inquiries');
                        setShowNotifications(false);
                      }}
                      style={{ color: '#d7a859' }}
                      className="text-xs font-semibold hover:opacity-80 w-full text-center"
                    >
                      View All Inquiries →
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => onNavigate('inquiries')}
              style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
              className="px-3 py-1 font-bold rounded-lg transition hover:opacity-90 flex items-center gap-1.5 text-xs"
            >
              <Plus className="w-4 h-4" /> New Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6 space-y-6">
        {/* Metrics Container */}
        <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6">
          <div className="grid grid-cols-4 gap-6">
            <StatCard label="NEW INQUIRIES" value={newInquiries} icon={<MessageSquare className="w-5 h-5" />} change="+2 from yesterday" bgColor="#a89968" iconColor="white" />
            <StatCard label="CONFIRMED ORDERS" value={confirmedOrders} icon={<ClipboardList className="w-5 h-5" />} change="+3 this week" bgColor="#a89968" iconColor="white" />
            <StatCard label="REVENUE (THIS MONTH)" value={`$${Math.floor(monthlyRevenue).toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} change="+18% from last month" bgColor="#d7a859" iconColor="#0a1911" />
            <StatCard label="TOTAL CLIENTS" value={totalClients} icon={<Users className="w-5 h-5" />} change="+5 new this month" bgColor="#c5bfaf" iconColor="#0a1911" />
          </div>
        </div>

        {/* Charts Row - Revenue (60%) + Menu+Tasks (20%+20%) ALL IN ONE ROW */}
        <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6">
          <div className="grid grid-cols-12 gap-4">
            {/* Revenue Overview - 60% on LEFT */}
            <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="col-span-7 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 style={{ color: '#ffffff' }} className="text-sm font-bold">Revenue Overview</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => setRevenueMonth(Math.max(0, revenueMonth - 1))} className="p-1 hover:bg-[#102418] rounded">
                    <ChevronLeft className="w-4 h-4" style={{ color: '#d7a859' }} />
                  </button>
                  <select
                    value={revenueMonth}
                    onChange={(e) => setRevenueMonth(parseInt(e.target.value))}
                    style={{ borderColor: 'rgba(215, 168, 89, 0.1)', color: '#ffffff', backgroundColor: '#102418' }}
                    className="text-xs border rounded px-2 py-1 focus:outline-none min-w-fit"
                  >
                    {monthsShort.map((m, i) => (
                      <option key={i} value={i}>{m} 2026</option>
                    ))}
                  </select>
                  <button onClick={() => setRevenueMonth(Math.min(11, revenueMonth + 1))} className="p-1 hover:bg-[#102418] rounded">
                    <ChevronRight className="w-4 h-4" style={{ color: '#d7a859' }} />
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <RevenueChart month={revenueMonth} />
              </div>
              <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="border-t pt-2 text-center">
                <p style={{ color: '#ffffff' }} className="text-xs">{monthsShort[revenueMonth]} 2026</p>
                <p style={{ color: '#d7a859' }} className="text-lg font-bold">$4,250</p>
              </div>
            </div>

            {/* Menu + Tasks Column - RIGHT SIDE, 20%+20% HORIZONTAL */}
            <div className="col-span-5 grid grid-cols-2 gap-4">
              {/* Top Menu Items */}
              <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 style={{ color: '#ffffff' }} className="text-sm font-bold">Top Menu Items</h2>
                  <select
                    value={menuMonth}
                    onChange={(e) => setMenuMonth(parseInt(e.target.value))}
                    style={{ borderColor: 'rgba(215, 168, 89, 0.1)', color: '#ffffff', backgroundColor: '#102418' }}
                    className="text-xs border rounded px-1.5 py-0.5 focus:outline-none"
                  >
                    {monthsShort.map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center mb-3">
                  <DonutChart />
                </div>
                <div className="space-y-1">
                  {menuItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div style={{ backgroundColor: item.color }} className="w-1.5 h-1.5 rounded-full"></div>
                      <p style={{ color: '#ffffff' }} className="text-xs flex-1">{item.name}</p>
                      <p style={{ color: '#ffffff' }} className="text-xs font-semibold">{item.pct}%</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Tasks */}
              <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 style={{ color: '#ffffff' }} className="text-sm font-bold">Today's Tasks</h2>
                  <button onClick={() => onNavigate('dashboard')} style={{ color: '#d7a859' }} className="text-xs font-semibold hover:opacity-80">
                    View All
                  </button>
                </div>
                <div className="space-y-0.5">
                  {tasks.slice(0, 4).map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      style={{ backgroundColor: task.completed ? '#102418' : '#0a1911' }}
                      className="w-full p-1.5 rounded transition text-left flex items-start gap-1.5 hover:bg-[#102418]"
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {task.completed ? (
                          <CheckCircle2 style={{ color: '#10B981' }} className="w-3 h-3" />
                        ) : (
                          <Circle style={{ color: '#d7a859' }} className="w-3 h-3" />
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
        </div>

        {/* Recent Inquiries + Upcoming Events Container */}
        <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6">
          <div className="grid grid-cols-12 gap-4">
            {/* Recent Inquiries */}
            <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="col-span-9 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 style={{ color: '#ffffff' }} className="text-sm font-bold">Recent Inquiries</h2>
                <button onClick={() => onNavigate('inquiries')} style={{ color: '#d7a859' }} className="text-xs font-semibold hover:opacity-80">
                  View All Inquiries
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="border-b">
                      <th style={{ color: '#ffffff' }} className="text-left py-1.5 px-1.5 font-semibold text-xs">Client</th>
                      <th style={{ color: '#ffffff' }} className="text-left py-1.5 px-1.5 font-semibold text-xs">Event Type</th>
                      <th style={{ color: '#ffffff' }} className="text-left py-1.5 px-1.5 font-semibold text-xs">Date</th>
                      <th style={{ color: '#ffffff' }} className="text-left py-1.5 px-1.5 font-semibold text-xs">Guests</th>
                      <th style={{ color: '#ffffff' }} className="text-left py-1.5 px-1.5 font-semibold text-xs">Status</th>
                      <th style={{ color: '#ffffff' }} className="text-center py-1.5 px-1.5 font-semibold text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map((order) => (
                      <tr key={order.id} style={{ borderBottomColor: 'rgba(215, 168, 89, 0.05)' }} className="border-b hover:bg-[#102418] transition">
                        <td style={{ color: '#ffffff' }} className="py-1.5 px-1.5 text-xs">{order.clientName}</td>
                        <td style={{ color: '#ffffff' }} className="py-1.5 px-1.5 text-xs capitalize">{order.eventType}</td>
                        <td style={{ color: '#ffffff' }} className="py-1.5 px-1.5 text-xs">{new Date(order.eventDate).toLocaleDateString()}</td>
                        <td style={{ color: '#ffffff' }} className="py-1.5 px-1.5 text-xs">{order.guestCount}</td>
                        <td className="py-1.5 px-1.5 text-xs">
                          <span style={{ backgroundColor: getStatusColor(order.status), color: '#0a1911' }} className="px-1.5 py-0.5 rounded text-xs font-semibold inline-block">
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="py-1.5 px-1.5 text-xs text-center">
                          <button className="p-1 hover:bg-[#102418] rounded transition" title="More options">
                            <MoreVertical style={{ color: '#d7a859' }} className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming Events - REDESIGNED */}
            <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="col-span-3 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 style={{ color: '#ffffff' }} className="text-sm font-bold">Upcoming Events</h2>
                <button onClick={() => onNavigate('calendar')} style={{ color: '#d7a859' }} className="text-xs font-semibold hover:opacity-80">
                  View Calendar
                </button>
              </div>

              <div className="space-y-2">
                {upcomingEvents.map((event, idx) => (
                  <button
                    key={idx}
                    onClick={() => onNavigate('calendar')}
                    style={{
                      backgroundColor: event.isRisk ? 'rgba(239, 68, 68, 0.1)' : (event.isConfirmed ? 'rgba(16, 185, 129, 0.1)' : '#102418'),
                      borderColor: event.isRisk ? '#ef4444' : (event.isConfirmed ? '#10B981' : 'transparent')
                    }}
                    className="w-full border rounded-lg p-2.5 text-left transition hover:opacity-80"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p style={{ color: '#d7a859' }} className="text-sm font-bold">{event.dateStr}</p>
                        <p style={{ color: '#ffffff' }} className="text-xs font-semibold mt-0.5">{event.eventType}</p>
                        <p style={{ color: '#ffffff' }} className="text-xs opacity-70">{event.clientName}</p>
                        <p style={{ color: '#a8d5ca' }} className="text-xs mt-1">{event.timeStr} • {event.guestCount} guests</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {event.isRisk && (
                          <AlertTriangle style={{ color: '#ef4444' }} className="w-4 h-4" />
                        )}
                        {event.isConfirmed && !event.isRisk && (
                          <CheckCircle style={{ color: '#10B981' }} className="w-4 h-4" />
                        )}
                        <span style={{
                          backgroundColor: event.isRisk ? '#ef4444' : (event.isConfirmed ? '#10B981' : '#d7a859'),
                          color: '#0a1911'
                        }} className="text-xs font-semibold px-2 py-0.5 rounded">
                          {event.isRisk ? 'At Risk' : 'Upcoming'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions + Get More Inquiries Container */}
        <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6">
          <div className="grid grid-cols-12 gap-4">
            {/* Quick Actions */}
            <div style={{ backgroundColor: '#0a1911', ...CardBorder }} className="col-span-9 rounded-xl p-4">
              <h2 style={{ color: '#ffffff' }} className="text-sm font-bold mb-3">Quick Actions</h2>
              <div className="grid grid-cols-6 gap-2">
                <button onClick={() => onNavigate('inquiries')} className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#102418] transition text-center">
                  <MessageCircle style={{ color: '#d7a859' }} className="w-6 h-6 mb-1" />
                  <p style={{ color: '#ffffff' }} className="text-xs font-semibold">New Inquiry</p>
                </button>
                <button onClick={() => onNavigate('orders')} className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#102418] transition text-center">
                  <ShoppingCart style={{ color: '#d7a859' }} className="w-6 h-6 mb-1" />
                  <p style={{ color: '#ffffff' }} className="text-xs font-semibold">Create Order</p>
                </button>
                <button onClick={() => onNavigate('clients')} className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#102418] transition text-center">
                  <UserPlus style={{ color: '#d7a859' }} className="w-6 h-6 mb-1" />
                  <p style={{ color: '#ffffff' }} className="text-xs font-semibold">Add Client</p>
                </button>
                <button onClick={() => onNavigate('invoices')} className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#102418] transition text-center">
                  <FileIcon style={{ color: '#d7a859' }} className="w-6 h-6 mb-1" />
                  <p style={{ color: '#ffffff' }} className="text-xs font-semibold">Create Invoice</p>
                </button>
                <button onClick={() => onNavigate('calendar')} className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#102418] transition text-center">
                  <Calendar style={{ color: '#d7a859' }} className="w-6 h-6 mb-1" />
                  <p style={{ color: '#ffffff' }} className="text-xs font-semibold">View Calendar</p>
                </button>
                <button onClick={handleShare} className="flex flex-col items-center justify-center p-2 rounded hover:bg-[#102418] transition text-center">
                  <Share2 style={{ color: '#d7a859' }} className="w-6 h-6 mb-1" />
                  <p style={{ color: '#ffffff' }} className="text-xs font-semibold">Share QR</p>
                </button>
              </div>
            </div>

            {/* Get More Inquiries */}
            <div style={{ backgroundColor: '#102418', ...CardBorder }} className="col-span-3 rounded-xl p-4">
              <h2 style={{ color: '#ffffff' }} className="text-sm font-bold mb-1">Get more inquiries</h2>
              <p style={{ color: '#ffffff' }} className="text-xs mb-2">Share your QR code to let clients order online.</p>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p style={{ color: '#d7a859' }} className="text-xs font-semibold">Share inquiry form</p>
                  <p style={{ color: '#ffffff' }} className="text-xs opacity-70 mt-0.5">Scan to order online</p>
                </div>
                <button
                  onClick={() => onNavigate('inquiries')}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-[#0a1911] transition"
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + '/catering/client-order' : 'https://catering-system.vercel.app/catering/client-order')}`}
                    alt="QR Code"
                    className="w-16 h-16 rounded"
                  />
                </button>
              </div>

              <button onClick={handleShare} style={{ backgroundColor: '#d7a859', color: '#0a1911' }} className="w-full py-2 font-bold rounded-lg text-xs transition hover:opacity-90 mt-3">
                Share Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
