'use client';

import { useState, useMemo } from 'react';
import { Plus, Check, DollarSign } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  total: number;
  downPayment: number;
  balance: number;
  status: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'bank_transfer' | 'check';
  notes: string;
}

export default function PaymentsTracker({ orders = [] }: { orders?: any[] }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [newPayment, setNewPayment] = useState({ invoiceId: '', amount: 0, method: 'bank_transfer' as const, notes: '' });

  const savePayments = (updated: Payment[]) => {
    setPayments(updated);
    localStorage.setItem('catering_payments', JSON.stringify(updated));
  };

  const metrics = useMemo(() => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const outstandingBalance = invoices.reduce((sum, inv) => sum + inv.balance, 0);

    return { totalRevenue, paidAmount, outstandingBalance };
  }, [invoices, payments]);

  const recordPayment = () => {
    if (!newPayment.invoiceId || !newPayment.amount) {
      alert('Please select an invoice and enter amount');
      return;
    }

    const payment: Payment = {
      id: `pay_${Date.now()}`,
      invoiceId: newPayment.invoiceId,
      amount: newPayment.amount,
      date: new Date().toISOString().split('T')[0],
      method: newPayment.method,
      notes: newPayment.notes,
    };

    savePayments([payment, ...payments]);
    setNewPayment({ invoiceId: '', amount: 0, method: 'bank_transfer', notes: '' });
  };

  // Mock invoices from localStorage
  const mockInvoices: Invoice[] = [
    { id: '1', invoiceNumber: 'INV-2026-0001', clientName: 'Sarah Johnson', total: 4200, downPayment: 2100, balance: 2100, status: 'sent' },
    { id: '2', invoiceNumber: 'INV-2026-0002', clientName: 'Michael Brown', total: 2625, downPayment: 1312.50, balance: 1312.50, status: 'sent' },
  ];

  return (
    <div style={{ backgroundColor: '#0B3D36' }} className="p-8 min-h-screen">
      <div className="max-w-6xl">
        <h1 style={{ color: '#D4A64A' }} className="text-3xl font-bold mb-8">Payments & Revenue</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6">
            <p style={{ color: '#a8d5ca' }} className="text-sm uppercase font-semibold mb-2">Total Revenue</p>
            <p style={{ color: '#D4A64A' }} className="text-3xl font-bold">${metrics.totalRevenue.toFixed(2)}</p>
          </div>
          <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6">
            <p style={{ color: '#a8d5ca' }} className="text-sm uppercase font-semibold mb-2">Collected</p>
            <p style={{ color: '#10B981' }} className="text-3xl font-bold">${metrics.paidAmount.toFixed(2)}</p>
          </div>
          <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6">
            <p style={{ color: '#a8d5ca' }} className="text-sm uppercase font-semibold mb-2">Outstanding</p>
            <p style={{ color: '#F59E0B' }} className="text-3xl font-bold">${metrics.outstandingBalance.toFixed(2)}</p>
          </div>
        </div>

        {/* Record Payment */}
        <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6 mb-8">
          <h2 style={{ color: '#D4A64A' }} className="font-bold text-lg mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Record Payment
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <select
              value={newPayment.invoiceId}
              onChange={(e) => setNewPayment({ ...newPayment, invoiceId: e.target.value })}
              style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
              className="px-4 py-2 border-2 rounded-lg"
            >
              <option value="">Select Invoice</option>
              {mockInvoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} - {inv.clientName}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })}
              style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
              className="px-4 py-2 border-2 rounded-lg"
            />
            <select
              value={newPayment.method}
              onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value as any })}
              style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
              className="px-4 py-2 border-2 rounded-lg"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
            </select>
            <button
              onClick={recordPayment}
              style={{ backgroundColor: '#D4A64A', color: '#0B3D36' }}
              className="font-bold rounded-lg hover:opacity-90"
            >
              Record
            </button>
          </div>
          <input
            type="text"
            placeholder="Notes (optional)"
            value={newPayment.notes}
            onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
            style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
            className="w-full px-4 py-2 border-2 rounded-lg mt-4"
          />
        </div>

        {/* Payment History */}
        <div>
          <h2 style={{ color: '#D4A64A' }} className="font-bold text-lg mb-4">Payment History</h2>
          {payments.length === 0 ? (
            <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-12 text-center">
              <DollarSign style={{ color: '#D4A64A' }} className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p style={{ color: '#a8d5ca' }}>No payments recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map(payment => {
                const invoice = mockInvoices.find(i => i.id === payment.invoiceId);
                return (
                  <div key={payment.id} style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6 flex items-center justify-between">
                    <div className="flex-1">
                      <p style={{ color: '#D4A64A' }} className="font-bold">{invoice?.invoiceNumber}</p>
                      <p style={{ color: '#a8d5ca' }} className="text-sm">{invoice?.clientName} • {new Date(payment.date).toLocaleDateString()}</p>
                      <p style={{ color: '#a8d5ca' }} className="text-sm">Method: <span style={{ color: '#D4A64A' }} className="font-semibold capitalize">{payment.method.replace('_', ' ')}</span></p>
                    </div>
                    <div className="text-right">
                      <p style={{ color: '#10B981' }} className="text-2xl font-bold">${payment.amount.toFixed(2)}</p>
                      <p style={{ color: '#a8d5ca' }} className="text-xs">{payment.notes || 'No notes'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Invoice Status Summary */}
        <div className="mt-8">
          <h2 style={{ color: '#D4A64A' }} className="font-bold text-lg mb-4">Invoice Status</h2>
          <div className="space-y-4">
            {mockInvoices.map(invoice => {
              const invoicePayments = payments.filter(p => p.invoiceId === invoice.id);
              const totalPaid = invoicePayments.reduce((sum, p) => sum + p.amount, 0);
              const remaining = invoice.total - totalPaid;
              const isPaid = remaining <= 0;

              return (
                <div key={invoice.id} style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p style={{ color: '#D4A64A' }} className="font-bold">{invoice.invoiceNumber}</p>
                      <p style={{ color: '#a8d5ca' }} className="text-sm">{invoice.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ color: '#D4A64A' }} className="font-bold">${invoice.total.toFixed(2)}</p>
                      <span style={{ backgroundColor: isPaid ? '#10B981' : '#F59E0B', color: 'white' }} className="inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2">
                        {isPaid ? 'PAID' : `${remaining > 0 ? 'PENDING' : 'OVERPAID'}`}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ backgroundColor: '#0B3D36' }} className="h-2 rounded-full overflow-hidden">
                    <div
                      style={{
                        backgroundColor: isPaid ? '#10B981' : '#F59E0B',
                        width: `${Math.min(100, (totalPaid / invoice.total) * 100)}%`,
                      }}
                      className="h-full transition-all"
                    />
                  </div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">Paid: ${totalPaid.toFixed(2)} of ${invoice.total.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
