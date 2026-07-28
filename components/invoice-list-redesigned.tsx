'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Filter, Download, ChevronLeft, ChevronRight, Send, FileDown, Share2, Edit, CheckCircle, AlertCircle, Clock, X, DollarSign, FileText, Calendar, Mail } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  eventName: string;
  eventDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'sent' | 'overdue' | 'partially_paid' | 'cancelled';
  issueDate: string;
  address?: string;
  items?: Array<{ description: string; qty: number; price: number }>;
  notes?: string;
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

const STATUS_COLORS = {
  paid: '#10b981',
  sent: '#fbbf24',
  overdue: '#ef4444',
  partially_paid: '#f59e0b',
  cancelled: '#6b7280'
};

export default function InvoiceListRedesigned({
  invoices = [],
  onCreateNew = () => {}
}: {
  invoices?: Invoice[];
  onCreateNew?: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Invoice['status']>('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const selectedInvoice = invoices.find(i => i.id === selectedInvoiceId);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      if (statusFilter !== 'all' && invoice.status !== statusFilter) return false;
      return (
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, statusFilter, invoices]);

  const paginatedInvoices = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredInvoices, currentPage]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const stats = {
    total: invoices.length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    outstanding: invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, i) => sum + (i.amount - i.paidAmount), 0),
  };

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 style={{ color: '#d7a859' }} className="text-4xl font-bold mb-1">Invoices</h1>
            <p style={{ color: '#a8d5ca' }} className="text-sm">Create, send and track all your invoices.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onCreateNew} style={{ backgroundColor: '#d7a859', color: '#0a1911' }} className="px-3 py-1.5 font-bold rounded-lg text-sm hover:opacity-90 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> New Invoice
            </button>
            <button style={{ backgroundColor: '#0f2416', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }} className="px-3 py-1.5 font-semibold rounded-lg text-sm border hover:opacity-90">
              Import
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: FileText, label: 'Total Invoices', value: stats.total.toString(), desc: '+4 this month ↑', color: '#d7a859' },
            { icon: DollarSign, label: 'Total Amount', value: '$' + stats.totalAmount.toLocaleString(), desc: '+18% vs last month ↑', color: '#d7a859' },
            { icon: CheckCircle, label: 'Paid Amount', value: '$' + stats.paidAmount.toLocaleString(), desc: '67% of total', color: '#10b981' },
            { icon: AlertCircle, label: 'Outstanding', value: '$' + stats.outstanding.toLocaleString(), desc: '33% of total', color: '#ef4444' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: card.color }} strokeWidth={2} />
                  <p style={{ color: '#a8d5ca' }} className="text-xs font-semibold">{card.label}</p>
                </div>
                <p style={{ color: card.label === 'Outstanding' ? '#ef4444' : '#ffffff' }} className="text-3xl font-bold mb-1">{card.value}</p>
                <p style={{ color: card.label === 'Outstanding' ? '#ef4444' : '#10b981' }} className="text-xs">{card.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Invoice List */}
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="lg:col-span-3 rounded-lg p-6 border">
            {/* Search & Filters */}
            <div className="mb-4 flex items-center gap-3 pb-4 border-b" style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2 w-4 h-4" style={{ color: '#d7a859' }} />
                <input
                  type="text"
                  placeholder="Search invoices by number, client or event..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full pl-9 pr-3 py-1.5 rounded text-xs border focus:outline-none"
                />
              </div>
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }} style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }} className="px-2 py-1 rounded text-xs border focus:outline-none">
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="sent">Sent</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }} className="px-2 py-1 rounded text-xs border focus:outline-none">
                <option>All Events</option>
              </select>
              <button onClick={() => alert('Advanced filters: Coming soon')} style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1 rounded border text-xs font-semibold hover:opacity-80 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filters
              </button>
              <button onClick={() => { const csv = 'Invoice #,Client,Event,Date,Amount,Status\n' + paginatedInvoices.map(i => `${i.invoiceNumber},${i.clientName},${i.eventName},${i.issueDate},"$${i.amount}",${i.status}`).join('\n'); const blob = new Blob([csv], {type: 'text/csv'}); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'invoices.csv'; a.click(); }} style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1 rounded border text-xs font-semibold hover:opacity-80 flex items-center gap-1">
                <Download className="w-3 h-3" /> Export
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="border-b">
                    <th className="text-left py-2 px-2"><input type="checkbox" className="w-3 h-3" /></th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Invoice #</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Client</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Event</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Date</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Due Date</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Amount</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Status</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold">Balance</th>
                    <th style={{ color: '#d7a859' }} className="text-left py-2 px-2 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.map((invoice) => (
                    <tr key={invoice.id} onClick={() => setSelectedInvoiceId(invoice.id)} style={{ borderBottomColor: 'rgba(215, 168, 89, 0.05)', backgroundColor: selectedInvoiceId === invoice.id ? 'rgba(215, 168, 89, 0.08)' : 'transparent' }} className="border-b hover:bg-[#102418] transition cursor-pointer">
                      <td className="py-3 px-2"><input type="checkbox" className="w-3 h-3" /></td>
                      <td style={{ color: '#d7a859' }} className="py-3 px-2 font-bold">{invoice.invoiceNumber}</td>
                      <td style={{ color: '#ffffff' }} className="py-3 px-2">{invoice.clientName}</td>
                      <td style={{ color: '#ffffff' }} className="py-3 px-2">{invoice.eventName}</td>
                      <td style={{ color: '#ffffff' }} className="py-3 px-2">{new Date(invoice.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td style={{ color: '#ffffff' }} className="py-3 px-2">{new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td style={{ color: '#d7a859' }} className="py-3 px-2 font-bold">${invoice.amount.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <span style={{ backgroundColor: STATUS_COLORS[invoice.status], color: '#0a1911' }} className="px-2 py-0.5 rounded text-xs font-bold">
                          {invoice.status === 'partially_paid' ? 'Partially Paid' : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ color: '#ffffff' }} className="py-3 px-2">${(invoice.amount - invoice.paidAmount).toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <button onClick={(e) => { e.stopPropagation(); alert('More options'); }} style={{ color: '#d7a859' }} className="hover:opacity-80">⋮</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="mt-4 pt-4 border-t flex items-center justify-between">
                <p style={{ color: '#a8d5ca' }} className="text-xs">
                  Showing {paginatedInvoices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} results
                </p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: currentPage === 1 ? '#666' : '#d7a859' }} className="px-2 py-1 rounded border text-xs disabled:opacity-50">
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)} style={{ backgroundColor: currentPage === page ? '#d7a859' : '#0a1911', borderColor: 'rgba(215, 168, 89, 0.3)', color: currentPage === page ? '#0a1911' : '#d7a859' }} className="px-2 py-1 rounded border text-xs font-semibold">
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ borderColor: 'rgba(215, 168, 89, 0.3)', color: currentPage === totalPages ? '#666' : '#d7a859' }} className="px-2 py-1 rounded border text-xs disabled:opacity-50">
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Invoice Detail */}
          {selectedInvoice && (
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="lg:col-span-2 rounded-lg border overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Header */}
              <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="p-5 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 style={{ color: '#ffffff' }} className="font-bold text-sm">Invoice #{selectedInvoice.invoiceNumber}</h3>
                  </div>
                  <span style={{ backgroundColor: STATUS_COLORS[selectedInvoice.status], color: '#0a1911' }} className="px-2 py-0.5 rounded text-xs font-bold">
                    {selectedInvoice.status === 'partially_paid' ? 'Partially Paid' : selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                  </span>
                </div>
                <button onClick={() => setSelectedInvoiceId(null)} style={{ color: '#d7a859' }} className="hover:opacity-80">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="p-4 border-b grid grid-cols-5 gap-2">
                <button onClick={() => alert('Send Invoice: Coming soon')} style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1.5 rounded border text-xs hover:opacity-80 flex items-center justify-center gap-1">
                  <Send className="w-3 h-3" /> Send
                </button>
                <button onClick={() => alert('Download PDF: Coming soon')} style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1.5 rounded border text-xs hover:opacity-80 flex items-center justify-center gap-1">
                  <FileDown className="w-3 h-3" /> PDF
                </button>
                <button onClick={() => alert('Share Link: Coming soon')} style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1.5 rounded border text-xs hover:opacity-80 flex items-center justify-center gap-1">
                  <Share2 className="w-3 h-3" /> Share
                </button>
                <button onClick={() => alert('Edit Invoice: Coming soon')} style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1.5 rounded border text-xs hover:opacity-80 flex items-center justify-center gap-1">
                  <Edit className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => alert('Record Payment: Coming soon')} style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.3)', color: '#d7a859' }} className="px-2 py-1.5 rounded border text-xs hover:opacity-80 text-xs">⋮</button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4 text-xs">
                {/* Client Info */}
                <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="pb-4 border-b">
                  <h4 style={{ color: '#d7a859' }} className="font-bold mb-2">Client</h4>
                  <p style={{ color: '#ffffff' }} className="font-semibold">{selectedInvoice.clientName}</p>
                  {selectedInvoice.clientPhone && <p style={{ color: '#a8d5ca' }}>{selectedInvoice.clientPhone}</p>}
                  {selectedInvoice.clientEmail && <p style={{ color: '#a8d5ca' }}>{selectedInvoice.clientEmail}</p>}
                </div>

                {/* Event Info */}
                <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="pb-4 border-b">
                  <h4 style={{ color: '#d7a859' }} className="font-bold mb-2">Event</h4>
                  <p style={{ color: '#ffffff' }} className="font-semibold">{selectedInvoice.eventName}</p>
                  <p style={{ color: '#a8d5ca' }}>{new Date(selectedInvoice.eventDate).toLocaleDateString()}</p>
                  {selectedInvoice.address && <p style={{ color: '#a8d5ca' }}>{selectedInvoice.address}</p>}
                </div>

                {/* Invoice Details */}
                <div style={{ borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="pb-4 border-b space-y-2">
                  <h4 style={{ color: '#d7a859' }} className="font-bold">Invoice Details</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p style={{ color: '#a8d5ca' }} className="text-xs mb-1">Invoice Number</p>
                      <p style={{ color: '#ffffff' }} className="font-semibold">{selectedInvoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <p style={{ color: '#a8d5ca' }} className="text-xs mb-1">Issue Date</p>
                      <p style={{ color: '#ffffff' }} className="font-semibold">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p style={{ color: '#a8d5ca' }} className="text-xs mb-1">Due Date</p>
                      <p style={{ color: '#ffffff' }} className="font-semibold">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p style={{ color: '#a8d5ca' }} className="text-xs mb-1">Status</p>
                      <span style={{ backgroundColor: STATUS_COLORS[selectedInvoice.status], color: '#0a1911' }} className="px-2 py-0.5 rounded text-xs font-bold inline-block">
                        {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="pt-4 border-t space-y-2">
                  <h4 style={{ color: '#d7a859' }} className="font-bold mb-3">Summary</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span style={{ color: '#a8d5ca' }}>Subtotal</span>
                      <span style={{ color: '#ffffff' }} className="font-semibold">${selectedInvoice.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#a8d5ca' }}>Tax (7%)</span>
                      <span style={{ color: '#ffffff' }} className="font-semibold">${(selectedInvoice.amount * 0.07).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t" style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }}>
                      <span style={{ color: '#ffffff' }} className="font-bold">Total</span>
                      <span style={{ color: '#d7a859' }} className="text-lg font-bold">${(selectedInvoice.amount * 1.07).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#a8d5ca' }}>Paid</span>
                      <span style={{ color: '#10b981' }} className="font-semibold">${selectedInvoice.paidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#a8d5ca' }}>Balance</span>
                      <span style={{ color: selectedInvoice.paidAmount >= selectedInvoice.amount ? '#10b981' : '#ef4444' }} className="font-semibold">${(selectedInvoice.amount * 1.07 - selectedInvoice.paidAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
