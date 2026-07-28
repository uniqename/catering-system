'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

export default function CalendarView({ orders = [] }: { orders?: Order[] }) {
  const [currentDate, setCurrentDate] = useState(new Date('2026-07-27'));
  const [selectedEvent, setSelectedEvent] = useState<Order | null>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentMonth, currentYear, daysInMonth, firstDayOfMonth]);

  const eventsByDate = useMemo(() => {
    const map: { [key: string]: Order[] } = {};
    orders.forEach(order => {
      const date = new Date(order.eventDate);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        const dateKey = date.getDate().toString();
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(order);
      }
    });
    return map;
  }, [orders, currentMonth, currentYear]);

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 style={{ color: '#d7a859' }} className="text-3xl font-bold mb-2">Event Calendar</h2>
          <p style={{ color: '#a8d5ca' }} className="text-sm">View all upcoming events and manage your schedule</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 lg:col-span-2">
            {/* Month Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ color: '#d7a859' }} className="text-2xl font-bold">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <div className="flex gap-2">
                <button onClick={previousMonth} className="p-2 hover:bg-[#102418] rounded-lg transition">
                  <ChevronLeft style={{ color: '#d7a859' }} className="w-5 h-5" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-[#102418] rounded-lg transition">
                  <ChevronRight style={{ color: '#d7a859' }} className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} style={{ color: '#d7a859' }} className="text-center text-sm font-bold py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                const dayEvents = day ? eventsByDate[day.toString()] || [] : [];
                const isToday = day === 27 && currentMonth === 6 && currentYear === 2026;

                return (
                  <button
                    key={idx}
                    onClick={() => day && dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
                    style={{
                      backgroundColor: isToday ? 'rgba(215, 168, 89, 0.2)' : (dayEvents.length > 0 ? '#102418' : '#0a1911'),
                      borderColor: isToday ? '#d7a859' : (dayEvents.length > 0 ? '#d7a859' : 'rgba(215, 168, 89, 0.05)')
                    }}
                    className="aspect-square border rounded-lg p-2 text-left flex flex-col justify-between hover:bg-[#102418] transition"
                  >
                    {day ? (
                      <>
                        <span style={{ color: '#ffffff' }} className="text-sm font-bold">
                          {day}
                        </span>
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5">
                            {dayEvents.slice(0, 2).map((e, i) => (
                              <div
                                key={i}
                                style={{ backgroundColor: getStatusColor(e.status) }}
                                className="w-1.5 h-1.5 rounded-full"
                              ></div>
                            ))}
                            {dayEvents.length > 2 && (
                              <span style={{ color: '#d7a859' }} className="text-xs">
                                +{dayEvents.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Events List */}
            <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="mt-8 pt-6 border-t">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-4">Upcoming Events</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders
                  .filter(o => {
                    const date = new Date(o.eventDate);
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                  })
                  .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                  .map(event => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      style={{ backgroundColor: '#0a1911' }}
                      className="w-full p-3 rounded-lg hover:bg-[#102418] transition text-left border border-transparent hover:border-[#d7a859]"
                    >
                      <p style={{ color: '#d7a859' }} className="text-sm font-bold">
                        {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p style={{ color: '#ffffff' }} className="text-sm font-semibold capitalize">
                        {event.eventType}
                      </p>
                      <p style={{ color: '#a8d5ca' }} className="text-xs">
                        {event.clientName}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div>
            {selectedEvent ? (
              <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 sticky top-8">
                <h3 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">Event Details</h3>

                <div className="space-y-4">
                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-1">Client</p>
                    <p style={{ color: '#ffffff' }} className="text-sm font-semibold">
                      {selectedEvent.clientName}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-1">Event Type</p>
                    <p style={{ color: '#ffffff' }} className="text-sm font-semibold capitalize">
                      {selectedEvent.eventType}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-1">Date</p>
                    <p style={{ color: '#d7a859' }} className="text-sm font-bold">
                      {new Date(selectedEvent.eventDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Guests
                    </p>
                    <p style={{ color: '#ffffff' }} className="text-sm font-semibold">
                      {selectedEvent.guestCount} guests
                    </p>
                  </div>

                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">Status</p>
                    <span
                      style={{ backgroundColor: getStatusColor(selectedEvent.status), color: '#0a1911' }}
                      className="text-xs font-bold px-3 py-1 rounded inline-block"
                    >
                      {getStatusLabel(selectedEvent.status)}
                    </span>
                  </div>

                  <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="border-t pt-4">
                    <p style={{ color: '#a8d5ca' }} className="text-xs text-center mb-3">Event ID: {selectedEvent.id}</p>
                    <button
                      style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                      className="w-full py-2 font-bold rounded-lg transition hover:opacity-90 text-sm"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 text-center sticky top-8">
                <p style={{ color: '#a8d5ca' }} className="text-sm">
                  Select an event from the calendar to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
