'use client';

import { useState } from 'react';

export default function InvoiceGenerator({ orders }: { orders: any[] }) {
  const [invoice, setInvoice] = useState({
    items: [{ name: '', qty: 1, price: 0 }],
    laborHours: 4,
    laborRate: 25,
    shippingCost: 0,
    deliveryLocation: 'Local',
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
INVOICE
========================================
Date: ${new Date().toLocaleDateString()}

ITEMS:
${invoice.items.map((item) => `${item.name}: ${item.qty} x $${item.price.toFixed(2)} = $${(item.qty * item.price).toFixed(2)}`).join('\n')}

BREAKDOWN:
Food Cost: $${foodCost.toFixed(2)}
Labor (${invoice.laborHours}h @ $${invoice.laborRate}/h): $${laborCost.toFixed(2)}
Shipping (${invoice.deliveryLocation}): $${invoice.shippingCost.toFixed(2)}
----------------------------------------
TOTAL: $${total.toFixed(2)}
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
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🧾 Invoice Builder</h2>

        <div className="space-y-4 mb-6">
          <h3 className="font-bold text-lg">Menu Items</h3>
          {invoice.items.map((item, index) => (
            <div key={index} className="flex gap-3 items-end">
              <input
                type="text"
                placeholder="Item name (e.g., Jollof Rice)"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value))}
                className="w-16 px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Price"
                step="0.01"
                value={item.price}
                onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                className="w-24 px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
              <span className="font-bold text-gray-900">
                ${(item.qty * item.price).toFixed(2)}
              </span>
              {invoice.items.length > 1 && (
                <button
                  onClick={() => removeItem(index)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addItem}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
          >
            + Add Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Labor Hours
            </label>
            <input
              type="number"
              value={invoice.laborHours}
              onChange={(e) => setInvoice({ ...invoice, laborHours: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={invoice.laborRate}
              onChange={(e) => setInvoice({ ...invoice, laborRate: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Shipping Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={invoice.shippingCost}
              onChange={(e) => setInvoice({ ...invoice, shippingCost: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border-2 border-indigo-200">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-gray-700">
              <span>Food Cost:</span>
              <span className="font-bold">${foodCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Labor ({invoice.laborHours}h @ ${invoice.laborRate}/h):</span>
              <span className="font-bold">${laborCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping:</span>
              <span className="font-bold">${invoice.shippingCost.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-indigo-200 pt-3 flex justify-between">
              <span className="text-lg font-bold text-gray-900">TOTAL:</span>
              <span className="text-3xl font-black text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={generatePDF}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
          >
            📥 Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
