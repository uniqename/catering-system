'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventDate: string;
  guestCount: number;
  eventType: string;
  status: string;
}

export default function CalendarView({ orders = [] }: { orders?: Order[] }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 27)); // July 2026
  const [view, setView] = useState<'month' | 'week'>('month');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Order[]>();
    orders.forEach(order => {
      const dateKey = order.eventDate;
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)?.push(order);
    });
    return map;
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inquiry': return '#3B82F6'; // blue
      case 'quoted': return '#F59E0B'; // amber
      case 'confirmed': return '#10B981'; // green
      case 'delivered': return '#8B5CF6'; // purple
      default: return '#6B7280'; // gray
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = orders
    .filter(o => o.eventDate >= today)
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 7);

  if (view === 'week') {
    return (
      <div style={{ backgroundColor: '#0B3D36' }} className="p-8 min-h-screen">
        <div className="max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 style={{ color: '#D4A64A' }} className="text-3xl font-bold">Upcoming Events</h1>
            <button
              onClick={() => setView('month')}
              style={{ color: '#D4A64A' }}
              className="font-semibold hover:opacity-80"
            >
              ← Month View
            </button>
          </div>

          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-12 text-center">
                <p style={{ color: '#a8d5ca' }}>No upcoming events</p>
              </div>
            ) : (
              upcomingEvents.map(event => (
                <div key={event.id} style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div style={{ backgroundColor: '#0B3D36' }} className="text-center px-4 py-3 rounded-lg">
                          <p style={{ color: '#D4A64A' }} className="text-2xl font-bold">{new Date(event.eventDate).getDate()}</p>
                          <p style={{ color: '#a8d5ca' }} className="text-xs uppercase">{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' })}</p>
                        </div>
                        <div>
                          <h3 style={{ color: '#D4A64A' }} className="text-xl font-bold capitalize">{event.eventType}</h3>
                          <p style={{ color: '#a8d5ca' }} className="text-sm">{event.clientName}</p>
                          <p style={{ color: '#a8d5ca' }} className="text-sm">{event.guestCount} guests</p>
                        </div>
                      </div>
                    </div>
                    <span style={{ backgroundColor: getStatusColor(event.status), color: 'white' }} className="px-4 py-2 rounded-full text-sm font-semibold capitalize">
                      {event.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Month View
  const calendarDays: (number | null)[] = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div style={{ backgroundColor: '#0B3D36' }} className="p-8 min-h-screen">
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 style={{ color: '#D4A64A' }} className="text-3xl font-bold">{monthName}</h1>
          <button
            onClick={() => setView('week')}
            style={{ color: '#D4A64A' }}
            className="font-semibold hover:opacity-80"
          >
            Week View →
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={prevMonth} style={{ color: '#D4A64A' }} className="p-2 hover:bg-[#1a5f54] rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 style={{ color: '#D4A64A' }} className="text-2xl font-bold">{monthName}</h2>
          <button onClick={nextMonth} style={{ color: '#D4A64A' }} className="p-2 hover:bg-[#1a5f54] rounded-lg">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg overflow-hidden">
          {/* Weekday Headers */}
          <div style={{ borderBottomColor: '#D4A64A' }} className="grid grid-cols-7 gap-0 border-b-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ backgroundColor: '#0B3D36', color: '#D4A64A' }} className="p-4 text-center font-bold">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-0">
              {week.map((day, dayIdx) => {
                const dateStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                const dayEvents = dateStr ? eventsByDate.get(dateStr) || [] : [];
                const isToday = dateStr === today;

                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    style={{
                      backgroundColor: isToday ? '#0B3D36' : 'transparent',
                      borderColor: '#0B3D36',
                    }}
                    className="min-h-24 p-3 border aspect-square flex flex-col"
                  >
                    {day && (
                      <>
                        <p
                          style={{ color: isToday ? '#D4A64A' : '#a8d5ca' }}
                          className={`text-sm font-bold mb-2 ${isToday ? 'bg-[#D4A64A] text-[#0B3D36] px-2 py-1 rounded w-fit' : ''}`}
                        >
                          {day}
                        </p>
                        <div className="space-y-1 flex-1 overflow-y-auto">
                          {dayEvents.slice(0, 2).map(event => (
                            <div key={event.id} style={{ backgroundColor: getStatusColor(event.status) }} className="text-xs rounded px-2 py-1 text-white font-semibold truncate">
                              {event.clientName}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <p style={{ color: '#D4A64A' }} className="text-xs font-semibold">+{dayEvents.length - 2} more</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="mt-8">
          <h2 style={{ color: '#D4A64A' }} className="text-xl font-bold mb-4">Next 7 Days</h2>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 5).map(event => (
              <div key={event.id} style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p style={{ color: '#D4A64A' }} className="font-bold">{event.clientName}</p>
                  <p style={{ color: '#a8d5ca' }} className="text-sm">{new Date(event.eventDate).toLocaleDateString()} • {event.guestCount} guests</p>
                </div>
                <span style={{ backgroundColor: getStatusColor(event.status), color: 'white' }} className="px-3 py-1 rounded-full text-xs font-semibold capitalize">
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
