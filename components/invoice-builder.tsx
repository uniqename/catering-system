'use client';

import { useState } from 'react';
import { ChevronLeft, Plus, Trash2, Download, Send } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: string;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

export default function InvoiceBuilder({
  orders,
  onBack,
  onSaveInvoice
}: {
  orders: Order[];
  onBack: () => void;
  onSaveInvoice: (invoice: any) => void;
}) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(15);
  const [notes, setNotes] = useState('');

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0
      }
    ]);
  };

  const updateLineItem = (id: string, field: string, value: any) => {
    setLineItems(
      lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handleSave = () => {
    if (!selectedOrder || lineItems.length === 0) {
      alert('Please select an order and add line items');
      return;
    }

    const invoice = {
      id: `INV-${Date.now()}`,
      orderId: selectedOrder.id,
      clientName: selectedOrder.clientName,
      eventDate: selectedOrder.eventDate,
      dueDate,
      lineItems,
      subtotal,
      tax,
      taxRate,
      total,
      notes,
      createdAt: new Date().toLocaleDateString(),
      status: 'draft'
    };

    onSaveInvoice(invoice);
  };

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#102418] rounded-lg transition"
          >
            <ChevronLeft style={{ color: '#d7a859' }} className="w-6 h-6" />
          </button>
          <div>
            <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">
              Create Invoice
            </h1>
            <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">
              New invoice
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Step 1: Select Order */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">
                1. Select Order
              </h2>

              <select
                value={selectedOrder?.id || ''}
                onChange={(e) => {
                  const order = orders.find(o => o.id === e.target.value);
                  if (order) setSelectedOrder(order);
                }}
                style={{
                  backgroundColor: '#0a1911',
                  borderColor: 'rgba(215, 168, 89, 0.2)',
                  color: '#ffffff'
                }}
                className="w-full px-4 py-3 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
              >
                <option value="">Select an order...</option>
                {orders.map(order => (
                  <option key={order.id} value={order.id}>
                    {order.clientName} - {order.eventType} ({new Date(order.eventDate).toLocaleDateString()})
                  </option>
                ))}
              </select>

              {selectedOrder && (
                <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#0a1911' }}>
                  <p style={{ color: '#d7a859' }} className="font-bold">
                    {selectedOrder.clientName}
                  </p>
                  <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">
                    {selectedOrder.eventType} for {selectedOrder.guestCount} guests
                  </p>
                  <p style={{ color: '#a8d5ca' }} className="text-sm">
                    {new Date(selectedOrder.eventDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {selectedOrder && (
              <>
                {/* Step 2: Line Items */}
                <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
                  <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">
                    2. Add Line Items
                  </h2>

                  <div className="space-y-3">
                    {lineItems.map((item, idx) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateLineItem(item.id, 'description', e.target.value)
                          }
                          placeholder="e.g., Jollof Rice Package"
                          style={{
                            backgroundColor: '#0a1911',
                            borderColor: 'rgba(215, 168, 89, 0.2)',
                            color: '#ffffff'
                          }}
                          className="col-span-5 px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition text-sm"
                        />
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(item.id, 'quantity', parseInt(e.target.value))
                          }
                          style={{
                            backgroundColor: '#0a1911',
                            borderColor: 'rgba(215, 168, 89, 0.2)',
                            color: '#ffffff'
                          }}
                          className="col-span-2 px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition text-sm"
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              'unitPrice',
                              parseFloat(e.target.value)
                            )
                          }
                          placeholder="Price"
                          style={{
                            backgroundColor: '#0a1911',
                            borderColor: 'rgba(215, 168, 89, 0.2)',
                            color: '#ffffff'
                          }}
                          className="col-span-3 px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition text-sm"
                        />
                        <div className="col-span-2 flex items-center justify-between">
                          <p style={{ color: '#d7a859' }} className="font-bold text-sm">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </p>
                          {lineItems.length > 1 && (
                            <button
                              onClick={() => removeLineItem(item.id)}
                              className="p-1 hover:bg-[#102418] rounded transition"
                            >
                              <Trash2 style={{ color: '#ef4444' }} className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addLineItem}
                    style={{ color: '#d7a859' }}
                    className="mt-4 flex items-center gap-2 hover:opacity-80 transition text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>

                {/* Step 3: Invoice Details */}
                <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
                  <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">
                    3. Invoice Details
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                        Due Date
                      </p>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        style={{
                          backgroundColor: '#0a1911',
                          borderColor: 'rgba(215, 168, 89, 0.2)',
                          color: '#ffffff'
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                        Tax Rate (%)
                      </p>
                      <input
                        type="number"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                        style={{
                          backgroundColor: '#0a1911',
                          borderColor: 'rgba(215, 168, 89, 0.2)',
                          color: '#ffffff'
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                      Notes
                    </p>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add payment terms, thank you message, etc."
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition resize-none h-20"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                    className="flex-1 py-3 font-bold rounded-lg transition hover:opacity-90 flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" /> Save Invoice
                  </button>
                  <button
                    onClick={handleSave}
                    style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }}
                    className="flex-1 py-3 font-bold rounded-lg transition hover:bg-[#102418] flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" /> Send to Client
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Preview Sidebar */}
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border h-fit sticky top-8">
            <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">
              Invoice Preview
            </h2>

            {selectedOrder ? (
              <div style={{ backgroundColor: '#0a1911' }} className="p-4 rounded-lg space-y-3">
                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs">Invoice #</p>
                  <p style={{ color: '#ffffff' }} className="font-bold">
                    INV-{Date.now().toString().slice(-6)}
                  </p>
                </div>

                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs">Bill To</p>
                  <p style={{ color: '#ffffff' }} className="font-bold">
                    {selectedOrder.clientName}
                  </p>
                </div>

                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs">Event Date</p>
                  <p style={{ color: '#ffffff' }} className="font-bold">
                    {new Date(selectedOrder.eventDate).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="border-t pt-3">
                  <div className="flex justify-between mb-2">
                    <p style={{ color: '#a8d5ca' }} className="text-xs">Subtotal</p>
                    <p style={{ color: '#ffffff' }} className="font-bold">
                      ${subtotal.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-between mb-2">
                    <p style={{ color: '#a8d5ca' }} className="text-xs">
                      Tax ({taxRate}%)
                    </p>
                    <p style={{ color: '#ffffff' }} className="font-bold">
                      ${tax.toFixed(2)}
                    </p>
                  </div>

                  <div
                    style={{ backgroundColor: '#d7a859' }}
                    className="flex justify-between p-3 rounded-lg mt-3"
                  >
                    <p style={{ color: '#0a1911' }} className="text-sm font-bold">
                      Total Due
                    </p>
                    <p style={{ color: '#0a1911' }} className="text-lg font-black">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="border-t pt-3">
                  <p style={{ color: '#a8d5ca' }} className="text-xs">Due Date</p>
                  <p style={{ color: '#ffffff' }} className="font-bold">
                    {new Date(dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ color: '#a8d5ca' }} className="text-sm text-center py-8">
                Select an order to see preview
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
