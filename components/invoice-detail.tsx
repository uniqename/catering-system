'use client';

import { ChevronLeft, Download, Send, Edit3, Check } from 'lucide-react';

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
  lineItems: Array<{ description: string; quantity: number; unitPrice: number }>;
  taxRate: number;
  notes: string;
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

export default function InvoiceDetail({
  invoice,
  onBack
}: {
  invoice: Invoice;
  onBack: () => void;
}) {
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;
  const remaining = total - invoice.paidAmount;

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-[#102418] rounded-lg transition"
            >
              <ChevronLeft style={{ color: '#d7a859' }} className="w-6 h-6" />
            </button>
            <div>
              <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">
                {invoice.id}
              </h1>
              <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">
                Invoice Preview
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {invoice.status !== 'paid' && (
              <button
                onClick={() => alert('Invoice #' + invoice.id + ' marked as paid')}
                style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition"
              >
                <Check className="w-4 h-4" /> Mark as Paid
              </button>
            )}
            <button
              onClick={() => alert('Downloading PDF for invoice #' + invoice.id)}
              style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }}
              className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-[#102418] transition"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button
              onClick={() => alert('Sending invoice #' + invoice.id)}
              style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }}
              className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-[#102418] transition"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>

        {/* Payment Status Alert */}
        {remaining > 0 && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: '#ef4444'
            }}
            className="border rounded-lg p-4 mb-6 flex items-start gap-3"
          >
            <div style={{ color: '#ef4444' }} className="mt-0.5">
              <div className="w-2 h-2 rounded-full bg-current"></div>
            </div>
            <div>
              <p style={{ color: '#fca5a5' }} className="font-bold">
                Outstanding Balance: ${remaining.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
              <p style={{ color: '#fca5a5' }} className="text-sm">
                Due on {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {invoice.status === 'paid' && (
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderColor: '#10B981'
            }}
            className="border rounded-lg p-4 mb-6 flex items-start gap-3"
          >
            <div style={{ color: '#10B981' }} className="mt-0.5">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p style={{ color: '#86efac' }} className="font-bold">
                Invoice Paid
              </p>
              <p style={{ color: '#86efac' }} className="text-sm">
                Paid in full on {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Invoice Preview (PDF-like) */}
        <div style={{ backgroundColor: '#ffffff', color: '#000000' }} className="rounded-xl p-12 shadow-lg mb-8">
          {/* Header */}
          <div className="border-b pb-8 mb-8">
            <h1 style={{ color: '#d7a859' }} className="text-4xl font-black">
              INVOICE
            </h1>
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <p className="font-bold text-lg">Garage to Table Catering</p>
                <p className="text-sm text-gray-600 mt-2">123 Culinary Lane</p>
                <p className="text-sm text-gray-600">Atlanta, GA 30301</p>
                <p className="text-sm text-gray-600">info@garageotable.com</p>
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">INVOICE #</p>
                    <p className="text-lg font-bold">{invoice.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">INVOICE DATE</p>
                    <p className="text-lg font-bold">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">DUE DATE</p>
                    <p className="text-lg font-bold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <p className="text-xs font-bold text-gray-600 mb-2">BILL TO</p>
            <p className="text-lg font-bold">{invoice.clientName}</p>
          </div>

          {/* Line Items */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-t border-b border-gray-300">
                <th className="text-left py-3 px-4 font-bold">Description</th>
                <th className="text-right py-3 px-4 font-bold">Qty</th>
                <th className="text-right py-3 px-4 font-bold">Unit Price</th>
                <th className="text-right py-3 px-4 font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="text-right py-3 px-4">{item.quantity}</td>
                  <td className="text-right py-3 px-4">
                    ${item.unitPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="text-right py-3 px-4 font-bold">
                    ${(item.quantity * item.unitPrice).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="flex justify-between py-2 border-b border-gray-300">
                <p className="font-semibold">Subtotal</p>
                <p className="font-semibold">
                  ${subtotal.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-300">
                <p className="font-semibold">Tax ({invoice.taxRate}%)</p>
                <p className="font-semibold">
                  ${tax.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex justify-between py-3 bg-gray-100 px-4 rounded font-bold text-lg">
                <p>Total Due</p>
                <p>${total.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {invoice.paidAmount > 0 && (
            <div className="border-t pt-6 mb-6">
              <p className="text-xs font-bold text-gray-600 mb-2">PAYMENT STATUS</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <span className="font-bold">
                    ${invoice.paidAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </span>
                </div>
                {remaining > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Outstanding Balance</span>
                    <span className="font-bold">
                      ${remaining.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t pt-6">
              <p className="text-xs font-bold text-gray-600 mb-2">NOTES</p>
              <p className="text-sm text-gray-700">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Print Button */}
        <div className="flex justify-center">
          <button
            onClick={() => window.print()}
            style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
            className="px-6 py-3 font-bold rounded-lg transition hover:opacity-90"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
