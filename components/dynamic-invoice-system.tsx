'use client';

import { useState, useEffect } from 'react';
import { Download, Mail, Eye, Trash2, Plus } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  email?: string;
  phone?: string;
  eventDate: string;
  guestCount: number;
  eventType: string;
  notes?: string;
  status: string;
}

interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  invoiceDate: string;
  dueDate: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  tax: number;
  total: number;
  downPayment: number;
  balance: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes: string;
}

export default function DynamicInvoiceSystem({ orders = [] }: { orders?: Order[] }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [view, setView] = useState<'list' | 'create' | 'preview'>('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('catering_invoices_v2');
    if (saved) setInvoices(JSON.parse(saved));
  }, []);

  const saveInvoices = (updated: Invoice[]) => {
    setInvoices(updated);
    localStorage.setItem('catering_invoices_v2', JSON.stringify(updated));
  };

  const createInvoiceFromOrder = (order: Order) => {
    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      orderId: order.id,
      invoiceNumber: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(4, '0')}`,
      clientName: order.clientName,
      clientEmail: order.email || '',
      clientPhone: order.phone || '',
      eventDate: order.eventDate,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          description: `${order.eventType.charAt(0).toUpperCase() + order.eventType.slice(1)} Catering Service - ${order.guestCount} guests`,
          quantity: order.guestCount,
          unitPrice: 35,
        },
      ],
      subtotal: order.guestCount * 35,
      tax: (order.guestCount * 35) * 0.15,
      total: (order.guestCount * 35) * 1.15,
      downPayment: (order.guestCount * 35) * 1.15 * 0.5,
      balance: (order.guestCount * 35) * 1.15 * 0.5,
      status: 'draft',
      notes: order.notes || '',
    };

    saveInvoices([newInvoice, ...invoices]);
    setSelectedInvoice(newInvoice);
    setView('preview');
  };

  const deleteInvoice = (id: string) => {
    saveInvoices(invoices.filter(inv => inv.id !== id));
    setSelectedInvoice(null);
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    const updated = invoices.map(inv => inv.id === id ? { ...inv, status } : inv);
    saveInvoices(updated);
  };

  if (view === 'create') {
    return (
      <div style={{ backgroundColor: '#0B3D36' }} className="p-8 min-h-screen">
        <div className="max-w-2xl">
          <button
            onClick={() => setView('list')}
            style={{ color: '#D4A64A' }}
            className="mb-6 font-semibold hover:opacity-80"
          >
            ← Back to Invoices
          </button>

          <h1 style={{ color: '#D4A64A' }} className="text-3xl font-bold mb-8">Create Invoice from Order</h1>

          <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6">
            <label style={{ color: '#D4A64A' }} className="block font-semibold mb-4">Select Order</label>
            <select
              onChange={(e) => {
                const order = orders.find(o => o.id === e.target.value);
                setSelectedOrder(order || null);
              }}
              style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: '#D4A64A' }}
              className="w-full p-3 border-2 rounded-lg mb-6"
            >
              <option value="">Choose an order...</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  {order.clientName} - {order.eventType} ({new Date(order.eventDate).toLocaleDateString()})
                </option>
              ))}
            </select>

            {selectedOrder && (
              <div className="space-y-4">
                <div style={{ backgroundColor: '#0B3D36', borderLeftColor: '#D4A64A' }} className="p-4 rounded border-l-4">
                  <p style={{ color: '#D4A64A' }} className="font-semibold">{selectedOrder.clientName}</p>
                  <p style={{ color: '#a8d5ca' }} className="text-sm">{selectedOrder.guestCount} guests • {selectedOrder.eventType}</p>
                  <p style={{ color: '#a8d5ca' }} className="text-sm">{new Date(selectedOrder.eventDate).toLocaleDateString()}</p>
                </div>

                <button
                  onClick={() => createInvoiceFromOrder(selectedOrder)}
                  style={{ backgroundColor: '#D4A64A', color: '#0B3D36' }}
                  className="w-full font-bold py-3 rounded-lg hover:opacity-90"
                >
                  Create Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'preview' && selectedInvoice) {
    return (
      <div style={{ backgroundColor: '#0B3D36' }} className="p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setView('list')}
              style={{ color: '#D4A64A' }}
              className="font-semibold hover:opacity-80"
            >
              ← Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                style={{ backgroundColor: '#D4A64A', color: '#0B3D36' }}
                className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button
                onClick={() => setView('list')}
                style={{ backgroundColor: '#374151' }}
                className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2 hover:opacity-90"
              >
                <Eye className="w-4 h-4" /> Close
              </button>
            </div>
          </div>

          {/* Invoice Preview */}
          <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-12 shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 pb-8 border-b-2" style={{ borderBottomColor: '#D4A64A' }}>
              <div>
                <h1 style={{ color: '#D4A64A' }} className="text-4xl font-bold">Garage to Table</h1>
                <p style={{ color: '#a8d5ca' }} className="text-sm">Professional Catering Services</p>
              </div>
              <div className="text-right">
                <p style={{ color: '#D4A64A' }} className="font-bold text-2xl">{selectedInvoice.invoiceNumber}</p>
                <p style={{ color: '#a8d5ca' }} className="text-sm">Status: <span style={{ color: '#D4A64A' }}>{selectedInvoice.status.toUpperCase()}</span></p>
              </div>
            </div>

            {/* Client & Dates */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p style={{ color: '#a8d5ca' }} className="text-xs uppercase font-semibold mb-2">Bill To</p>
                <p style={{ color: '#D4A64A' }} className="font-bold">{selectedInvoice.clientName}</p>
                <p style={{ color: '#a8d5ca' }} className="text-sm">{selectedInvoice.clientEmail}</p>
                <p style={{ color: '#a8d5ca' }} className="text-sm">{selectedInvoice.clientPhone}</p>
              </div>
              <div className="text-right">
                <div className="mb-4">
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase font-semibold mb-1">Invoice Date</p>
                  <p style={{ color: '#D4A64A' }} className="font-semibold">{new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                </div>
                <div className="mb-4">
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase font-semibold mb-1">Event Date</p>
                  <p style={{ color: '#D4A64A' }} className="font-semibold">{new Date(selectedInvoice.eventDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase font-semibold mb-1">Due Date</p>
                  <p style={{ color: '#D4A64A' }} className="font-semibold">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full mb-8">
              <thead>
                <tr style={{ borderBottomColor: '#D4A64A' }} className="border-b-2">
                  <th style={{ color: '#D4A64A' }} className="text-left py-3 font-bold">Description</th>
                  <th style={{ color: '#D4A64A' }} className="text-center py-3 font-bold">Qty</th>
                  <th style={{ color: '#D4A64A' }} className="text-right py-3 font-bold">Unit Price</th>
                  <th style={{ color: '#D4A64A' }} className="text-right py-3 font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottomColor: '#0B3D36' }} className="border-b">
                    <td style={{ color: '#a8d5ca' }} className="py-4">{item.description}</td>
                    <td style={{ color: '#a8d5ca' }} className="text-center py-4">{item.quantity}</td>
                    <td style={{ color: '#a8d5ca' }} className="text-right py-4">${item.unitPrice.toFixed(2)}</td>
                    <td style={{ color: '#D4A64A' }} className="text-right py-4 font-bold">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div style={{ width: '300px' }}>
                <div className="flex justify-between mb-3 py-2">
                  <span style={{ color: '#a8d5ca' }}>Subtotal:</span>
                  <span style={{ color: '#a8d5ca' }}>${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ borderBottomColor: '#D4A64A' }} className="flex justify-between mb-3 py-2 border-b-2">
                  <span style={{ color: '#a8d5ca' }}>Tax (15%):</span>
                  <span style={{ color: '#a8d5ca' }}>${selectedInvoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span style={{ color: '#D4A64A' }} className="font-bold">Total Due:</span>
                  <span style={{ color: '#D4A64A' }} className="font-bold text-2xl">${selectedInvoice.total.toFixed(2)}</span>
                </div>
                <div style={{ borderTopColor: '#D4A64A' }} className="flex justify-between py-2 mt-4 border-t-2">
                  <span style={{ color: '#10B981' }} className="font-semibold">Down Payment:</span>
                  <span style={{ color: '#10B981' }} className="font-semibold">${selectedInvoice.downPayment.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span style={{ color: '#F59E0B' }} className="font-semibold">Balance Due:</span>
                  <span style={{ color: '#F59E0B' }} className="font-semibold">${selectedInvoice.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedInvoice.notes && (
              <div style={{ backgroundColor: '#0B3D36', borderLeftColor: '#D4A64A' }} className="p-4 border-l-4 rounded">
                <p style={{ color: '#a8d5ca' }} className="text-sm"><strong>Notes:</strong> {selectedInvoice.notes}</p>
              </div>
            )}

            {/* Status Buttons */}
            <div className="flex gap-2 mt-8 pt-8 border-t-2" style={{ borderTopColor: '#D4A64A' }}>
              {(['draft', 'sent', 'paid'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => {
                    updateInvoiceStatus(selectedInvoice.id, status);
                    setSelectedInvoice({ ...selectedInvoice, status });
                  }}
                  style={{
                    backgroundColor: selectedInvoice.status === status ? '#D4A64A' : '#374151',
                    color: selectedInvoice.status === status ? '#0B3D36' : '#a8d5ca'
                  }}
                  className="px-4 py-2 rounded font-semibold capitalize hover:opacity-90"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div style={{ backgroundColor: '#0B3D36' }} className="p-8 min-h-screen">
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 style={{ color: '#D4A64A' }} className="text-3xl font-bold">Invoices</h1>
          <button
            onClick={() => setView('create')}
            style={{ backgroundColor: '#D4A64A', color: '#0B3D36' }}
            className="px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90"
          >
            <Plus className="w-5 h-5" /> New Invoice
          </button>
        </div>

        {invoices.length === 0 ? (
          <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-12 text-center">
            <p style={{ color: '#a8d5ca' }} className="text-lg mb-4">No invoices yet</p>
            <button
              onClick={() => setView('create')}
              style={{ backgroundColor: '#D4A64A', color: '#0B3D36' }}
              className="px-6 py-2 rounded-lg font-bold hover:opacity-90"
            >
              Create First Invoice
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map(invoice => (
              <div key={invoice.id} style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition">
                <div>
                  <p style={{ color: '#D4A64A' }} className="font-bold">{invoice.invoiceNumber}</p>
                  <p style={{ color: '#a8d5ca' }} className="text-sm">{invoice.clientName} • {new Date(invoice.eventDate).toLocaleDateString()}</p>
                  <p style={{ color: '#a8d5ca' }} className="text-sm">Total: <span style={{ color: '#D4A64A' }} className="font-bold">${invoice.total.toFixed(2)}</span></p>
                </div>
                <div className="flex items-center gap-4">
                  <span style={{
                    backgroundColor: invoice.status === 'paid' ? '#10B981' : invoice.status === 'sent' ? '#3B82F6' : '#6B7280',
                    color: 'white'
                  }} className="px-3 py-1 rounded-full text-sm font-semibold">
                    {invoice.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setView('preview');
                    }}
                    style={{ color: '#D4A64A' }}
                    className="hover:opacity-80"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteInvoice(invoice.id)}
                    style={{ color: '#EF4444' }}
                    className="hover:opacity-80"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
