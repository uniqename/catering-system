'use client';

import { useState, useMemo } from 'react';
import { Search, Eye, Edit3, Trash2, Plus, Filter, Download, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import EventDetailPanel from './event-detail-panel';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'deposit_paid' | 'confirmed' | 'delivered';
  phone?: string;
  email?: string;
  venue?: string;
  budget?: string;
  notes?: string;
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

const STATUS_FLOW = {
  inquiry: { label: 'Inquiry', color: '#a8d5ca', order: 1 },
  quoted: { label: 'Proposal Sent', color: '#fcd34d', order: 2 },
  deposit_paid: { label: 'Deposit Paid', color: '#fcd34d', order: 3 },
  confirmed: { label: 'Confirmed', color: '#86efac', order: 4 },
  delivered: { label: 'Completed', color: '#d1fae5', order: 5 }
};

const STATUS_LABELS = {
  inquiry: 'Inquiry',
  quoted: 'Proposal Sent',
  deposit_paid: 'Deposit Paid',
  confirmed: 'Confirmed',
  delivered: 'Completed'
};

const getEventName = (eventType: string, clientName: string): string => {
  const typeMap: Record<string, string> = {
    wedding: `${clientName} Wedding`,
    birthday: `${clientName} Birthday`,
    graduation: `${clientName} Graduation`,
    corporate: 'Corporate Event',
    lunch: `${clientName} Lunch`,
    dinner: 'Private Dinner Party',
    anniversary: `${clientName} Anniversary`,
    shower: `${clientName} Baby Shower`,
    launch: 'Product Launch Event',
    meeting: 'Global Finance Meeting'
  };

  return typeMap[eventType] || `${clientName} ${eventType}`;
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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [dateStart, setDateStart] = useState(monthStart.toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState(monthEnd.toISOString().split('T')[0]);

  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;

      const eventDate = new Date(order.eventDate);
      const start = new Date(dateStart);
      const end = new Date(dateEnd);
      if (eventDate < start || eventDate > end) return false;

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
  }, [orders, searchTerm, statusFilter, sortBy, dateStart, dateEnd]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredOrders.length);

  const selectedOrder = selectedOrderId ? orders.find(o => o.id === selectedOrderId) : null;

  const upcomingCount = orders.filter(
    o => o.status !== 'delivered' && new Date(o.eventDate) > new Date()
  ).length;

  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;

  const thisMonthCount = orders.filter(o => {
    const now = new Date();
    const eventDate = new Date(o.eventDate);
    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
  }).length;

  const eventDate = selectedOrder ? new Date(selectedOrder.eventDate) : null;
  const timeString = eventDate ? eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="flex">
      {/* Left Side - List */}
      <div className="flex-1 p-8 border-r" style={{ borderColor: 'rgba(215, 168, 89, 0.1)' }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">
                Orders / Events
              </h1>
              <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">
                Manage all your catering orders and events in one place.
              </p>
            </div>

            <button
              onClick={onCreateNew}
              style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
              className="px-6 py-3 font-bold rounded-lg transition hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> New Order
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
              All ({orders.length})
            </button>
            {Object.entries(STATUS_FLOW).map(([key, { label }]) => {
              const count = orders.filter(o => o.status === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key as Order['status'])}
                  style={{
                    backgroundColor: statusFilter === key ? '#d7a859' : 'rgba(215, 168, 89, 0.1)',
                    color: statusFilter === key ? '#0a1911' : '#d7a859'
                  }}
                  className="px-4 py-2 rounded-lg font-semibold text-sm transition hover:opacity-90"
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>

          {/* Filters & Date Range */}
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border mb-6">
            <div className="flex items-end gap-4 mb-4">
              <div className="flex-1">
                <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                  Filters
                </p>
                <div className="flex items-center gap-2">
                  <Filter style={{ color: '#d7a859' }} className="w-4 h-4" />
                  <span style={{ color: '#a8d5ca' }} className="text-xs">Filters</span>
                </div>
              </div>

              <div className="flex-1">
                <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                  Date Range
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    style={{
                      backgroundColor: '#0a1911',
                      borderColor: 'rgba(215, 168, 89, 0.2)',
                      color: '#ffffff'
                    }}
                    className="px-3 py-2 border rounded-lg text-xs focus:border-[#d7a859] focus:outline-none"
                  />
                  <span style={{ color: '#a8d5ca' }}>—</span>
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    style={{
                      backgroundColor: '#0a1911',
                      borderColor: 'rgba(215, 168, 89, 0.2)',
                      color: '#ffffff'
                    }}
                    className="px-3 py-2 border rounded-lg text-xs focus:border-[#d7a859] focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => { const csv = 'Client,Event Type,Date,Guests,Budget,Status\n' + paginatedOrders.map(o => `${o.clientName},${o.eventType},${o.eventDate},${o.guestCount},"${o.budget}",${o.status}`).join('\n'); const blob = new Blob([csv], {type: 'text/csv'}); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'events.csv'; a.click(); }}
                style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }}
                className="px-4 py-2 rounded-lg font-semibold text-xs hover:bg-[#102418] transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
            </div>

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
                      Event
                    </th>
                    <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                      Client
                    </th>
                    <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                      Date
                    </th>
                    <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                      Guests
                    </th>
                    <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                      Status
                    </th>
                    <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                      Total
                    </th>
                    <th style={{ color: '#d7a859' }} className="text-center py-4 px-6 font-bold text-sm">

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
                    paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        style={{
                          backgroundColor: selectedOrderId === order.id ? 'rgba(215, 168, 89, 0.1)' : 'transparent',
                          borderBottomColor: 'rgba(215, 168, 89, 0.05)'
                        }}
                        className="border-b hover:bg-[#102418] transition cursor-pointer"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <td className="py-4 px-6">
                          <div>
                            <p style={{ color: 'rgba(215, 168, 89, 0.6)' }} className="text-xs uppercase tracking-wide mb-1">
                              {order.eventType === 'wedding' ? 'Wedding' :
                               order.eventType === 'birthday' ? 'Birthday Party' :
                               order.eventType === 'graduation' ? 'Graduation Party' :
                               order.eventType === 'lunch' ? 'Lunch' :
                               order.eventType === 'dinner' ? 'Dinner Party' :
                               order.eventType === 'anniversary' ? 'Anniversary' :
                               order.eventType === 'shower' ? 'Baby Shower' :
                               order.eventType === 'launch' ? 'Product Launch' :
                               order.eventType === 'meeting' ? 'Meeting' : order.eventType}
                            </p>
                            <p style={{ color: '#ffffff' }} className="font-bold text-sm">
                              {getEventName(order.eventType, order.clientName)}
                            </p>
                          </div>
                        </td>
                        <td style={{ color: '#ffffff' }} className="py-4 px-6 text-sm">
                          {order.clientName}
                        </td>
                        <td style={{ color: '#ffffff' }} className="py-4 px-6 text-sm">
                          {new Date(order.eventDate).toLocaleDateString()}
                        </td>
                        <td style={{ color: '#ffffff' }} className="py-4 px-6 text-sm">
                          {order.guestCount}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <span
                            style={{
                              backgroundColor: STATUS_FLOW[order.status].color,
                              color: '#0a1911'
                            }}
                            className="px-3 py-1 rounded-lg text-xs font-bold inline-block"
                          >
                            {STATUS_LABELS[order.status]}
                          </span>
                        </td>
                        <td style={{ color: '#ffffff' }} className="py-4 px-6 font-bold text-sm">
                          {order.budget || '—'}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-1 hover:bg-[#102418] rounded transition"
                          >
                            <MoreVertical style={{ color: '#d7a859' }} className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredOrders.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4" style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }}>
                <p style={{ color: '#a8d5ca' }} className="text-sm">
                  Showing {startIndex} to {endIndex} of {filteredOrders.length} results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-[#102418] rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft style={{ color: '#d7a859' }} className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        backgroundColor: currentPage === page ? '#d7a859' : '#102418',
                        color: currentPage === page ? '#0a1911' : '#d7a859'
                      }}
                      className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition hover:bg-[#d7a859]"
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-[#102418] rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight style={{ color: '#d7a859' }} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl border p-12 text-center mt-6">
              <p style={{ color: '#a8d5ca' }} className="mb-6">
                No events yet. Create your first order to get started.
              </p>
              <button
                onClick={onCreateNew}
                style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                className="px-6 py-3 font-bold rounded-lg transition hover:opacity-90 inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Create First Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Detail Panel */}
      {selectedOrder && (
        <EventDetailPanel
          event={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
