'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Download, Eye, Send, Trash2, Copy, Filter } from 'lucide-react';

interface Invoice {
  id: string;
  orderId: string;
  clientName: string;
  eventDate: string;
  dueDate: string;
  total: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue';
  createdAt: string;
  lineItems: any[];
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

export default function InvoiceList({
  onCreateNew,
  onViewInvoice
}: {
  onCreateNew: () => void;
  onViewInvoice: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Invoice['status']>('all');
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('invoices');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((inv: any) => ({
        ...inv,
        status: calculateStatus(inv)
      }));
    }
    return [];
  });

  const calculateStatus = (invoice: any): Invoice['status'] => {
    if (invoice.status === 'draft') return 'draft';
    if (invoice.paidAmount >= invoice.total) return 'paid';
    if (invoice.paidAmount > 0) return 'partially_paid';

    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    if (dueDate < today) return 'overdue';

    return 'sent';
  };

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(inv => {
        if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          return (
            inv.clientName.toLowerCase().includes(term) ||
            inv.id.toLowerCase().includes(term)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [invoices, searchTerm, statusFilter]);

  const getStatusColor = (status: Invoice['status']) => {
    const colors = {
      draft: '#a8d5ca',
      sent: '#d7a859',
      partially_paid: '#f59e0b',
      paid: '#10B981',
      overdue: '#ef4444'
    };
    return colors[status];
  };

  const getStatusLabel = (status: Invoice['status']) => {
    const labels = {
      draft: 'Draft',
      sent: 'Sent',
      partially_paid: 'Partially Paid',
      paid: 'Paid',
      overdue: 'Overdue'
    };
    return labels[status];
  };

  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'paid' && inv.status !== 'draft')
    .reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0);

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const overdueAmount = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0);

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">
              Invoices
            </h1>
            <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">
              Manage your invoices and track payments
            </p>
          </div>

          <button
            onClick={onCreateNew}
            style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
            className="px-6 py-3 font-bold rounded-lg transition hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Invoice
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
              Total Outstanding
            </p>
            <p style={{ color: '#d7a859' }} className="text-3xl font-black">
              ${totalOutstanding.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          </div>

          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
              Overdue Amount
            </p>
            <p style={{ color: '#ef4444' }} className="text-3xl font-black">
              ${overdueAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          </div>

          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
              Paid This Month
            </p>
            <p style={{ color: '#10B981' }} className="text-3xl font-black">
              ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          </div>

          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
              Total Invoices
            </p>
            <p style={{ color: '#d7a859' }} className="text-3xl font-black">
              {invoices.length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border mb-6">
          <div className="grid grid-cols-3 gap-4">
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
                  placeholder="Search by client or invoice #..."
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
                Status
              </p>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                style={{
                  backgroundColor: '#0a1911',
                  borderColor: 'rgba(215, 168, 89, 0.2)',
                  color: '#ffffff'
                }}
                className="w-full px-4 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
              >
                <option value="all">All Invoices</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }}
                className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#102418] transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#0a1911', borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="border-b">
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Invoice #
                  </th>
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Client
                  </th>
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Amount
                  </th>
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Paid
                  </th>
                  <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                    Due Date
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
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <p style={{ color: '#a8d5ca' }}>No invoices found</p>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      style={{ borderBottomColor: 'rgba(215, 168, 89, 0.05)' }}
                      className="border-b hover:bg-[#102418] transition"
                    >
                      <td style={{ color: '#d7a859' }} className="py-4 px-6 font-bold text-sm">
                        {invoice.id}
                      </td>
                      <td style={{ color: '#ffffff' }} className="py-4 px-6 text-sm">
                        {invoice.clientName}
                      </td>
                      <td style={{ color: '#ffffff' }} className="py-4 px-6 font-bold text-sm">
                        ${invoice.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ color: '#a8d5ca' }} className="py-4 px-6 text-sm">
                        ${invoice.paidAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ color: '#ffffff' }} className="py-4 px-6 text-sm">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span
                          style={{
                            backgroundColor: getStatusColor(invoice.status),
                            color: '#0a1911'
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-bold inline-block"
                        >
                          {getStatusLabel(invoice.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewInvoice(invoice.id)}
                            className="p-1.5 hover:bg-[#102418] rounded transition"
                            title="View invoice"
                          >
                            <Eye style={{ color: '#d7a859' }} className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-[#102418] rounded transition"
                            title="Send invoice"
                          >
                            <Send style={{ color: '#d7a859' }} className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-[#102418] rounded transition"
                            title="Delete invoice"
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

        {/* Empty State Message */}
        {filteredInvoices.length === 0 && invoices.length > 0 && (
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl border p-8 text-center mt-6">
            <p style={{ color: '#a8d5ca' }} className="mb-4">
              No invoices match your filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              style={{ color: '#d7a859' }}
              className="text-sm font-semibold hover:opacity-80 transition"
            >
              Clear filters
            </button>
          </div>
        )}

        {invoices.length === 0 && (
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl border p-12 text-center mt-6">
            <p style={{ color: '#a8d5ca' }} className="mb-6">
              No invoices yet. Create your first invoice to get started.
            </p>
            <button
              onClick={onCreateNew}
              style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
              className="px-6 py-3 font-bold rounded-lg transition hover:opacity-90 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Create First Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
