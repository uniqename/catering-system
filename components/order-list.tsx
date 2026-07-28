'use client';

import { useState, useMemo } from 'react';
import { Search, Eye, Edit3, Trash2, Plus, Filter } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
  phone?: string;
  email?: string;
  venue?: string;
  budget?: string;
  notes?: string;
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

const STATUS_FLOW = {
  inquiry: { label: 'Inquiry', color: '#10B981', order: 1 },
  quoted: { label: 'Proposal Sent', color: '#f59e0b', order: 2 },
  confirmed: { label: 'Confirmed', color: '#10B981', order: 3 },
  delivered: { label: 'Completed', color: '#a8d5ca', order: 4 }
};

export default function OrderList({
  orders,
  onViewOrder,
  onCreateNew
}: {
  orders: Order[];
  onViewOrder: (id: string) => void;
  onCreateNew: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [sortBy, setSortBy] = useState<'upcoming' | 'recent' | 'value'>('upcoming');

  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          order.clientName.toLowerCase().includes(term) ||
          order.eventType.toLowerCase().includes(term)
        );
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'upcoming') {
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      } else if (sortBy === 'recent') {
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
      } else {
        const budgetA = parseInt(a.budget?.replace(/\D/g, '') || '0');
        const budgetB = parseInt(b.budget?.replace(/\D/g, '') || '0');
        return budgetB - budgetA;
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy]);

  const upcomingCount = orders.filter(
    o => o.status !== 'delivered' && new Date(o.eventDate) > new Date()
  ).length;

  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;

  const thisMonthCount = orders.filter(o => {
    const now = new Date();
    const eventDate = new Date(o.eventDate);
    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">
              Events
            </h1>
            <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">
              Manage all your upcoming and past events
            </p>
          </div>

          <button
            onClick={onCreateNew}
            style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
            className="px-6 py-3 font-bold rounded-lg transition hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Inquiry
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
              Upcoming This Month
            </p>
            <p style={{ color: '#d7a859' }} className="text-3xl font-black">
              {thisMonthCount}
            </p>
            <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">
              events scheduled
            </p>
          </div>

          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
              Confirmed
            </p>
            <p style={{ color: '#10B981' }} className="text-3xl font-black">
              {confirmedCount}
            </p>
            <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">
              ready to go
            </p>
          </div>

          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
              Total Events
            </p>
            <p style={{ color: '#d7a859' }} className="text-3xl font-black">
              {orders.length}
            </p>
            <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">
              in system
            </p>
          </div>
        </div>

        {/* Status Tabs */}
        <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-4 border mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              backgroundColor: statusFilter === 'all' ? '#d7a859' : 'rgba(215, 168, 89, 0.1)',
              color: statusFilter === 'all' ? '#0a1911' : '#d7a859'
            }}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition hover:opacity-90"
          >
            All Events
          </button>
          {Object.entries(STATUS_FLOW).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key as Order['status'])}
              style={{
                backgroundColor: statusFilter === key ? '#d7a859' : 'rgba(215, 168, 89, 0.1)',
                color: statusFilter === key ? '#0a1911' : '#d7a859'
              }}
              className="px-4 py-2 rounded-lg font-semibold text-sm transition hover:opacity-90"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                Search
              </p>
              <div className="relative">
                <Search style={{ color: '#d7a859' }} className="absolute left-3 top-3 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by client or event type..."
                  style={{
                    backgroundColor: '#0a1911',
                    borderColor: 'rgba(215, 168, 89, 0.2)',
                    color: '#ffffff'
                  }}
                  className="w-full px-4 py-2 pl-10 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                Sort By
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  backgroundColor: '#0a1911',
                  borderColor: 'rgba(215, 168, 89, 0.2)',
                  color: '#ffffff'
                }}
                className="w-full px-4 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
              >
                <option value="upcoming">Upcoming Events</option>
                <option value="recent">Recently Added</option>
                <option value="value">Highest Budget</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#0a1911', borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="border-b">
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Client
                  </th>
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Event Type
                  </th>
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Event Date
                  </th>
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Guests
                  </th>
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Budget
                  </th>
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Status
                  </th>
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <p style={{ color: '#a8d5ca' }}>No events found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      style={{ borderBottomColor: 'rgba(215, 168, 89, 0.05)' }}
                      className="border-b hover:bg-[#102418] transition cursor-pointer"
                      onClick={() => onViewOrder(order.id)}
                    >
                      <td style={{ color: '#ffffff' }} className="py-4 px-6 font-semibold text-sm">
                        {order.clientName}
                      </td>
                      <td style={{ color: '#ffffff' }} className="py-4 px-6 text-sm capitalize">
                        {order.eventType}
                      </td>
                      <td style={{ color: '#d7a859' }} className="py-4 px-6 font-bold text-sm">
                        {new Date(order.eventDate).toLocaleDateString()}
                      </td>
                      <td style={{ color: '#ffffff' }} className="py-4 px-6 text-sm">
                        {order.guestCount}
                      </td>
                      <td style={{ color: '#a8d5ca' }} className="py-4 px-6 text-sm">
                        {order.budget || '—'}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span
                          style={{
                            backgroundColor: STATUS_FLOW[order.status].color,
                            color: '#0a1911'
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-bold inline-block"
                        >
                          {STATUS_FLOW[order.status].label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewOrder(order.id)}
                            className="p-1.5 hover:bg-[#102418] rounded transition"
                            title="View event"
                          >
                            <Eye style={{ color: '#d7a859' }} className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-[#102418] rounded transition"
                            title="Edit event"
                          >
                            <Edit3 style={{ color: '#d7a859' }} className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-[#102418] rounded transition"
                            title="Delete event"
                          >
                            <Trash2 style={{ color: '#ef4444' }} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl border p-12 text-center mt-6">
            <p style={{ color: '#a8d5ca' }} className="mb-6">
              No events yet. Create your first inquiry to get started.
            </p>
            <button
              onClick={onCreateNew}
              style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
              className="px-6 py-3 font-bold rounded-lg transition hover:opacity-90 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Create First Inquiry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
