'use client';

import { useState } from 'react';

export default function InvoiceGenerator({ orders }: { orders: any[] }) {
  const [invoice, setInvoice] = useState({
    items: [{ name: '', qty: 1, price: 0 }],
    laborHours: 4,
    laborRate: 25,
    shippingCost: 0,
  });

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { name: '', qty: 1, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setInvoice({
      ...invoice,
      items: invoice.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...invoice.items];
    updated[index] = { ...updated[index], [field]: value };
    setInvoice({ ...invoice, items: updated });
  };

  const foodCost = invoice.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const laborCost = invoice.laborHours * invoice.laborRate;
  const subtotal = foodCost + laborCost;
  const total = subtotal + invoice.shippingCost;

  const generatePDF = () => {
    const content = `
CATERING INVOICE
════════════════════════════════════════
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

MENU ITEMS:
${invoice.items.map((item) => `  • ${item.name}: ${item.qty} x $${item.price.toFixed(2)} = $${(item.qty * item.price).toFixed(2)}`).join('\n')}

COST BREAKDOWN:
────────────────────────────────────────
Food Cost:                 $${foodCost.toFixed(2)}
Labor (${invoice.laborHours}h @ $${invoice.laborRate}/h):        $${laborCost.toFixed(2)}
Shipping & Delivery:       $${invoice.shippingCost.toFixed(2)}
────────────────────────────────────────
TOTAL:                     $${total.toFixed(2)}
════════════════════════════════════════

Thank you for your business!
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `invoice-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">🧾 Invoice Builder</h2>
        <p className="text-gray-600">Create professional invoices with all costs included</p>
      </div>

      {/* Menu Items Section */}
      <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">📋 Menu Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg font-bold transition"
          >
            + Add Item
          </button>
        </div>

        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div key={index} className="flex gap-3 items-end bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-amber-400 transition">
              <input
                type="text"
                placeholder="Item name (e.g., Jollof Rice)"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <div className="text-center">
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.qty}
                  onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value))}
                  className="w-16 px-3 py-2 border border-gray-300 rounded font-bold focus:outline-none focus:ring-2 focus:ring-amber-300 text-center"
                />
                <p className="text-xs text-gray-500 mt-1">Qty</p>
              </div>
              <div className="text-center">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded font-bold focus:outline-none focus:ring-2 focus:ring-amber-300 text-center"
                />
                <p className="text-xs text-gray-500 mt-1">Each</p>
              </div>
              <div className="text-right min-w-fit">
                <p className="font-black text-lg text-gray-900">${(item.qty * item.price).toFixed(2)}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              {invoice.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 font-bold transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Labor & Shipping Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
          <label className="block text-sm font-bold text-blue-900 mb-3 uppercase tracking-wide">
            ⏰ Labor Hours
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            title="Labor hours"
            value={invoice.laborHours}
            onChange={(e) => setInvoice({ ...invoice, laborHours: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg font-bold text-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
          <label className="block text-sm font-bold text-purple-900 mb-3 uppercase tracking-wide">
            💰 Hourly Rate
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-xl font-bold text-purple-600">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="25"
              title="Hourly rate"
              value={invoice.laborRate}
              onChange={(e) => setInvoice({ ...invoice, laborRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 pl-8 border-2 border-purple-300 rounded-lg font-bold text-xl text-center focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
          <label className="block text-sm font-bold text-green-900 mb-3 uppercase tracking-wide">
            📦 Shipping Cost
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-xl font-bold text-green-600">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              title="Shipping cost"
              value={invoice.shippingCost}
              onChange={(e) => setInvoice({ ...invoice, shippingCost: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 pl-8 border-2 border-green-300 rounded-lg font-bold text-xl text-center focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </div>

      {/* Invoice Total */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-8 border-3 border-amber-400 shadow-xl">
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center pb-3 border-b-2 border-amber-200">
            <span className="text-gray-700 font-semibold">Food Items:</span>
            <span className="text-2xl font-bold text-gray-900">${foodCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b-2 border-amber-200">
            <span className="text-gray-700 font-semibold">Labor ({invoice.laborHours}h @ ${invoice.laborRate}/h):</span>
            <span className="text-2xl font-bold text-gray-900">${laborCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b-2 border-amber-200">
            <span className="text-gray-700 font-semibold">Shipping & Delivery:</span>
            <span className="text-2xl font-bold text-gray-900">${invoice.shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-3">
            <span className="text-2xl font-black text-gray-900">TOTAL DUE:</span>
            <span className="text-5xl font-black text-amber-600">${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={generatePDF}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-4 rounded-xl transition shadow-lg hover:shadow-2xl text-lg uppercase tracking-wide"
        >
          📥 Download Invoice
        </button>
      </div>
    </div>
  );
}
