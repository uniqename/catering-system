'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';

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
  inquiryStatus?: 'new' | 'contacted' | 'qualified' | 'declined' | 'won';
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

const INQUIRY_STATUS_FLOW = {
  new: { label: 'New', color: '#14b8a6', order: 1 },
  contacted: { label: 'Contacted', color: '#fbbf24', order: 2 },
  qualified: { label: 'Qualified', color: '#d7a859', order: 3 },
  declined: { label: 'Declined', color: '#ef4444', order: 4 },
  won: { label: 'Won', color: '#10b981', order: 5 }
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

export default function InquiriesList({
  orders,
  onViewOrder,
  onCreateNew
}: {
  orders: Order[];
  onViewOrder: (id: string) => void;
  onCreateNew: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | keyof typeof INQUIRY_STATUS_FLOW>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const inquiries = orders.filter(order => order.status === 'inquiry');

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inquiry => {
      const matchesSearch =
        inquiry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const inquiryStatus = inquiry.inquiryStatus || 'new';
      const matchesStatus = inquiryStatusFilter === 'all' || inquiryStatus === inquiryStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, inquiryStatusFilter, inquiries]);

  const paginatedInquiries = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredInquiries.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredInquiries, currentPage]);

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 style={{ color: '#d7a859' }} className="text-3xl font-bold mb-2">Inquiries</h2>
            <p style={{ color: '#a8d5ca' }} className="text-sm">Manage incoming inquiry requests</p>
          </div>
          <button
            onClick={onCreateNew}
            style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
            className="px-4 py-2 font-bold rounded-lg transition hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Inquiry
          </button>
        </div>

        {/* Status Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setInquiryStatusFilter('all')}
            style={{
              backgroundColor: inquiryStatusFilter === 'all' ? '#d7a859' : 'rgba(215, 168, 89, 0.1)',
              color: inquiryStatusFilter === 'all' ? '#0a1911' : '#d7a859',
            }}
            className="px-4 py-2 rounded-lg font-semibold transition text-sm"
          >
            All ({inquiries.length})
          </button>
          {Object.entries(INQUIRY_STATUS_FLOW).map(([key, { label }]) => {
            const count = inquiries.filter(i => (i.inquiryStatus || 'new') === key).length;
            const isActive = inquiryStatusFilter === key;
            return (
              <button
                key={key}
                onClick={() => setInquiryStatusFilter(key as keyof typeof INQUIRY_STATUS_FLOW)}
                style={{
                  backgroundColor: isActive ? '#d7a859' : 'rgba(215, 168, 89, 0.1)',
                  color: isActive ? '#0a1911' : '#d7a859',
                }}
                className="px-4 py-2 rounded-lg font-semibold transition text-sm"
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold mb-2">Total Inquiries</p>
            <p style={{ color: '#ffffff' }} className="text-3xl font-bold">{inquiries.length}</p>
          </div>
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold mb-2">This Month</p>
            <p style={{ color: '#ffffff' }} className="text-3xl font-bold">
              {inquiries.filter(i => {
                const date = new Date(i.eventDate);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold mb-2">Potential Revenue</p>
            <p style={{ color: '#d7a859' }} className="text-3xl font-bold">
              ${inquiries.reduce((sum, i) => {
                const budget = parseFloat(i.budget?.replace(/[$,]/g, '') || '0');
                return sum + budget;
              }, 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 mb-8 border">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5" style={{ color: '#d7a859' }} />
              <input
                type="text"
                placeholder="Search by client name, email, or event type..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a1911]"
              />
            </div>
            <button onClick={() => alert('Advanced filters: Coming soon')} style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-4 py-2 rounded-lg border flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button onClick={() => { const csv = 'Client,Event Type,Date,Budget,Status\n' + paginatedInquiries.map(i => `${i.clientName},${i.eventType},${i.eventDate},"${i.budget || 'TBD'}",${i.status}`).join('\n'); const blob = new Blob([csv], {type: 'text/csv'}); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'inquiries.csv'; a.click(); }} style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-4 py-2 rounded-lg border flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Inquiries Table */}
        <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="border-b">
                <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold text-sm">Client Name</th>
                <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold text-sm">Event Type</th>
                <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold text-sm">Event Date</th>
                <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold text-sm">Guests</th>
                <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold text-sm">Estimated Budget</th>
                <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold text-sm">Contact</th>
                <th style={{ color: '#d7a859' }} className="text-left py-3 px-4 font-bold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInquiries.length > 0 ? (
                paginatedInquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    style={{ borderBottomColor: 'rgba(215, 168, 89, 0.05)' }}
                    className="border-b hover:bg-[#102418] transition"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p style={{ color: 'rgba(215, 168, 89, 0.8)' }} className="text-xs font-semibold uppercase tracking-wide mb-1">
                          {inquiry.eventType}
                        </p>
                        <p style={{ color: '#ffffff' }} className="text-sm font-bold">
                          {getEventName(inquiry.eventType, inquiry.clientName)}
                        </p>
                      </div>
                    </td>
                    <td style={{ color: '#ffffff' }} className="py-4 px-4 text-sm capitalize">
                      {inquiry.eventType}
                    </td>
                    <td style={{ color: '#ffffff' }} className="py-4 px-4 text-sm font-semibold">
                      {new Date(inquiry.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ color: '#ffffff' }} className="py-4 px-4 text-sm">
                      {inquiry.guestCount} guests
                    </td>
                    <td style={{ color: '#d7a859' }} className="py-4 px-4 text-sm font-bold">
                      {inquiry.budget || '-'}
                    </td>
                    <td style={{ color: '#a8d5ca' }} className="py-4 px-4 text-sm">
                      <div className="text-xs">
                        {inquiry.email && <div>{inquiry.email}</div>}
                        {inquiry.phone && <div>{inquiry.phone}</div>}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => onViewOrder(inquiry.id)}
                        style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }}
                        className="px-3 py-1 rounded text-xs font-semibold border hover:opacity-80 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <p style={{ color: '#a8d5ca' }} className="text-sm">
                      {searchTerm ? 'No inquiries match your search' : 'No inquiries yet'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="mt-6 pt-6 border-t flex items-center justify-between">
              <p style={{ color: '#a8d5ca' }} className="text-xs">
                Showing {paginatedInquiries.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredInquiries.length)} of {filteredInquiries.length} results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: currentPage === 1 ? '#666' : '#d7a859' }}
                  className="px-3 py-1 rounded border text-sm font-semibold disabled:opacity-50 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      backgroundColor: currentPage === page ? '#d7a859' : '#0a1911',
                      borderColor: 'rgba(215, 168, 89, 0.3)',
                      color: currentPage === page ? '#0a1911' : '#d7a859'
                    }}
                    className="px-3 py-1 rounded border text-sm font-semibold hover:opacity-80 transition"
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: currentPage === totalPages ? '#666' : '#d7a859' }}
                  className="px-3 py-1 rounded border text-sm font-semibold disabled:opacity-50 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
