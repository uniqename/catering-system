'use client';

import { useState } from 'react';

export default function PDFInvoiceGenerator({ orders }: { orders: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<
    { name: string; qty: number; price: number }[]
  >([{ name: '', qty: 1, price: 0 }]);
  const [laborHours, setLaborHours] = useState(4);
  const [laborRate, setLaborRate] = useState(25);
  const [shippingCost, setShippingCost] = useState(0);

  const currentOrder = orders.find((o) => o.id === selectedOrder);

  const generatePDF = async () => {
    const foodCost = invoiceItems.reduce((sum, item) => sum + item.qty * item.price, 0);
    const laborCost = laborHours * laborRate;
    const subtotal = foodCost + laborCost;
    const total = subtotal + shippingCost;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; padding: 40px; background: white; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 32px; font-weight: bold; color: #1f2937; }
          .subtitle { color: #6b7280; font-size: 14px; margin-top: 5px; }
          .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .detail-box { }
          .label { color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
          .value { font-size: 16px; font-weight: bold; color: #1f2937; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; border: 1px solid #e5e7eb; }
          td { padding: 12px; border: 1px solid #e5e7eb; }
          .total-section { background: #fef3c7; padding: 20px; border-radius: 8px; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
          .total-amount { font-size: 24px; font-weight: bold; color: #d97706; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">🍽️ CATERING INVOICE</div>
            <div class="subtitle">Professional Catering Services</div>
          </div>

          <div class="invoice-details">
            <div>
              <div class="label">Invoice Date</div>
              <div class="value">${new Date().toLocaleDateString()}</div>
            </div>
            <div>
              <div class="label">Client</div>
              <div class="value">${currentOrder?.clientName || 'Guest'}</div>
            </div>
            <div>
              <div class="label">Event Date</div>
              <div class="value">${currentOrder?.eventDate || 'TBD'}</div>
            </div>
            <div>
              <div class="label">Guest Count</div>
              <div class="value">${currentOrder?.guestCount || '0'} people</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center">Qty</th>
                <th style="text-align: right">Price</th>
                <th style="text-align: right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceItems
                .map(
                  (item) =>
                    `<tr>
                <td>${item.name || '(empty)'}</td>
                <td style="text-align: center">${item.qty}</td>
                <td style="text-align: right">$${item.price.toFixed(2)}</td>
                <td style="text-align: right"><strong>$${(item.qty * item.price).toFixed(2)}</strong></td>
              </tr>`
                )
                .join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Food Cost:</span>
              <span>$${foodCost.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Labor (${laborHours}h @ $${laborRate}/h):</span>
              <span>$${laborCost.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Shipping & Delivery:</span>
              <span>$${shippingCost.toFixed(2)}</span>
            </div>
            <div class="total-row" style="font-weight: bold; font-size: 18px; border-top: 2px solid #f3f4f6; padding-top: 10px; margin-top: 10px;">
              <span>TOTAL DUE:</span>
              <span class="total-amount">$${total.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your business! 🙏</p>
            <p style="margin-top: 10px;">Payment due upon delivery</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Download as HTML (can be printed to PDF)
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent)
    );
    element.setAttribute('download', `invoice-${currentOrder?.clientName || 'guest'}-${Date.now()}.html`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">
      {/* Select Order */}
      <div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">📄 Professional Invoices</h2>
        <select
          title="Select an order"
          value={selectedOrder || ''}
          onChange={(e) => setSelectedOrder(e.target.value)}
          className="w-full px-4 py-3 border-2 border-teal-900 rounded-xl font-semibold focus:border-amber-500 focus:outline-none text-lg"
        >
          <option value="">Select an order to create invoice...</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.clientName} - {order.eventDate} ({order.guestCount} guests)
            </option>
          ))}
        </select>
      </div>

      {selectedOrder && (
        <>
          {/* Invoice Items */}
          <div className="bg-emerald-50 rounded-2xl p-8 border-2 border-teal-900">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Invoice Items</h3>
            <div className="space-y-3">
              {invoiceItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-end bg-white rounded-lg p-4 border-2 border-teal-900"
                >
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...invoiceItems];
                      updated[index].name = e.target.value;
                      setInvoiceItems(updated);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded font-semibold"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => {
                      const updated = [...invoiceItems];
                      updated[index].qty = parseInt(e.target.value);
                      setInvoiceItems(updated);
                    }}
                    className="w-16 px-3 py-2 border border-gray-300 rounded font-bold text-center"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => {
                      const updated = [...invoiceItems];
                      updated[index].price = parseFloat(e.target.value);
                      setInvoiceItems(updated);
                    }}
                    className="w-20 px-3 py-2 border border-gray-300 rounded font-bold text-center"
                  />
                  <p className="font-black text-lg text-gray-900 min-w-fit">
                    ${(item.qty * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setInvoiceItems([...invoiceItems, { name: '', qty: 1, price: 0 }])}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800"
            >
              + Add Item
            </button>
          </div>

          {/* Labor & Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-teal-50 rounded-2xl p-6 border-2 border-teal-900">
              <label className="block text-sm font-bold text-teal-900 mb-3">Labor Hours</label>
              <input
                type="number"
                min="0"
                placeholder="4"
                value={laborHours}
                onChange={(e) => setLaborHours(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border-2 border-teal-900 rounded-lg font-bold text-xl text-center"
              />
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-teal-900">
              <label className="block text-sm font-bold text-emerald-900 mb-3">Hourly Rate</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-xl font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="25"
                  value={laborRate}
                  onChange={(e) => setLaborRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 pl-8 border-2 border-teal-900 rounded-lg font-bold text-xl text-center"
                />
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-600">
              <label className="block text-sm font-bold text-amber-900 mb-3">Shipping Cost</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-xl font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 pl-8 border-2 border-amber-600 rounded-lg font-bold text-xl text-center"
                />
              </div>
            </div>
          </div>

          {/* Total & Download */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 border-3 border-amber-600">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg">
                <span>Food Items:</span>
                <span className="font-bold">
                  $
                  {invoiceItems
                    .reduce((sum, item) => sum + item.qty * item.price, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Labor:</span>
                <span className="font-bold">${(laborHours * laborRate).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg border-t-2 border-amber-600 pt-4">
                <span className="text-2xl font-black">TOTAL:</span>
                <span className="text-4xl font-black text-amber-600">
                  $
                  {(
                    invoiceItems.reduce((sum, item) => sum + item.qty * item.price, 0) +
                    laborHours * laborRate +
                    shippingCost
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={generatePDF}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black py-4 rounded-xl text-lg uppercase tracking-wide shadow-lg hover:shadow-2xl"
            >
              📥 Download Professional Invoice
            </button>
            <p className="text-sm text-amber-900 mt-3 text-center">
              💡 Tip: Open the downloaded file in your browser and print to PDF for a professional look
            </p>
          </div>
        </>
      )}
    </div>
  );
}
