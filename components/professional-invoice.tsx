'use client';

import { useState, useEffect, useRef } from 'react';

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  downPayment: number;
  balance: number;
  laborHours: number;
  laborRate: number;
  laborTotal: number;
  miscCosts: number;
  notes: string;
  logoUrl: string;
  ownerSignature: string;
  clientSignature: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';
  createdAt: string;
}

export default function ProfessionalInvoice() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [view, setView] = useState<'list' | 'create' | 'view'>('list');
  const [logo, setLogo] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<Invoice>>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lineItems: [{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    laborHours: 0,
    laborRate: 0,
    laborTotal: 0,
    miscCosts: 0,
    downPayment: 0,
    tax: 0,
    notes: '',
    status: 'draft',
  });

  useEffect(() => {
    const saved = localStorage.getItem('catering_invoices');
    if (saved) {
      setInvoices(JSON.parse(saved));
    }
    const savedLogo = localStorage.getItem('catering_logo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const logoData = event.target?.result as string;
      setLogo(logoData);
      localStorage.setItem('catering_logo', logoData);
    };
    reader.readAsDataURL(file);
  };

  const calculateInvoiceTotal = (items: InvoiceLineItem[], laborHours: number, laborRate: number, miscCosts: number, tax: number) => {
    const itemsSubtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const laborTotal = laborHours * laborRate;
    const subtotal = itemsSubtotal + laborTotal + miscCosts;
    const taxAmount = subtotal * (tax / 100);
    return {
      itemsSubtotal,
      laborTotal,
      subtotal,
      tax: taxAmount,
      total: subtotal + taxAmount,
    };
  };

  const handleAddLineItem = () => {
    const newItems = [
      ...(form.lineItems || []),
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, amount: 0 },
    ];
    setForm({ ...form, lineItems: newItems });
  };

  const handleRemoveLineItem = (id: string) => {
    const newItems = (form.lineItems || []).filter((item) => item.id !== id);
    setForm({ ...form, lineItems: newItems });
  };

  const handleUpdateLineItem = (id: string, field: string, value: any) => {
    const newItems = (form.lineItems || []).map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });
    setForm({ ...form, lineItems: newItems });
  };

  const handleCreateInvoice = () => {
    if (!form.clientName || !form.eventDate) {
      alert('Please fill in required fields');
      return;
    }

    const calculations = calculateInvoiceTotal(
      form.lineItems || [],
      form.laborHours || 0,
      form.laborRate || 0,
      form.miscCosts || 0,
      form.tax || 0
    );

    const invoiceId = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`;
    const newInvoice: Invoice = {
      id: invoiceId,
      clientName: form.clientName,
      clientEmail: form.clientEmail || '',
      clientPhone: form.clientPhone || '',
      eventDate: form.eventDate,
      invoiceDate: form.invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: form.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lineItems: form.lineItems || [],
      subtotal: calculations.subtotal,
      tax: calculations.tax,
      total: calculations.total,
      downPayment: form.downPayment || 0,
      balance: calculations.total - (form.downPayment || 0),
      laborHours: form.laborHours || 0,
      laborRate: form.laborRate || 0,
      laborTotal: calculations.laborTotal,
      miscCosts: form.miscCosts || 0,
      notes: form.notes || '',
      logoUrl: logo,
      ownerSignature: '',
      clientSignature: '',
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    localStorage.setItem('catering_invoices', JSON.stringify(updated));

    setSelectedInvoice(newInvoice);
    setView('view');
    setForm({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      eventDate: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lineItems: [{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }],
      laborHours: 0,
      laborRate: 0,
      laborTotal: 0,
      miscCosts: 0,
      downPayment: 0,
      tax: 0,
      notes: '',
      status: 'draft',
    });
  };

  const startSignature = (isOwner: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDrawing = false;

    canvas.onmousedown = () => {
      isDrawing = true;
    };

    canvas.onmousemove = (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.lineTo(x, y);
      ctx.stroke();
    };

    canvas.onmouseup = () => {
      isDrawing = false;
    };

    canvas.onmouseleave = () => {
      isDrawing = false;
    };
  };

  const captureSignature = (isOwner: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL();
    if (selectedInvoice) {
      const updated = invoices.map((inv) =>
        inv.id === selectedInvoice.id
          ? isOwner
            ? { ...inv, ownerSignature: signatureData }
            : { ...inv, clientSignature: signatureData }
          : inv
      );
      setInvoices(updated);
      localStorage.setItem('catering_invoices', JSON.stringify(updated));
      setSelectedInvoice(
        isOwner ? { ...selectedInvoice, ownerSignature: signatureData } : { ...selectedInvoice, clientSignature: signatureData }
      );
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Delete this invoice? This cannot be undone.')) {
      const updated = invoices.filter((inv) => inv.id !== id);
      setInvoices(updated);
      localStorage.setItem('catering_invoices', JSON.stringify(updated));
      setView('list');
      setSelectedInvoice(null);
    }
  };

  const calculations =
    selectedInvoice && form
      ? calculateInvoiceTotal(
          selectedInvoice.lineItems,
          selectedInvoice.laborHours,
          selectedInvoice.laborRate,
          selectedInvoice.miscCosts,
          selectedInvoice.tax
        )
      : null;

  return (
    <div className="space-y-8 print:space-y-0">
      {/* Toolbar */}
      <div className="flex gap-2 mb-6 print:hidden">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg font-bold transition ${view === 'list' ? 'bg-amber-600 text-white' : 'bg-white border-2 border-teal-900'}`}
          >
            📋 Invoices
          </button>
          <button
            onClick={() => setView('create')}
            className={`px-4 py-2 rounded-lg font-bold transition ${view === 'create' ? 'bg-amber-600 text-white' : 'bg-white border-2 border-teal-900'}`}
          >
            ➕ New Invoice
          </button>
          {selectedInvoice && (
            <button
              onClick={() => setView('view')}
              className={`px-4 py-2 rounded-lg font-bold transition ${view === 'view' ? 'bg-amber-600 text-white' : 'bg-white border-2 border-teal-900'}`}
            >
              👁️ View
            </button>
          )}
        </div>

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-2xl border-2 border-teal-900 p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">📋 Invoices</h2>

          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">📄</p>
              <p className="text-gray-600 text-lg font-semibold">No invoices yet</p>
              <button
                onClick={() => setView('create')}
                className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700"
              >
                Create First Invoice
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="border-2 border-teal-900 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-black text-lg text-gray-900">{inv.id}</p>
                      <p className="text-sm text-gray-600">{inv.clientName}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        inv.status === 'paid'
                          ? 'bg-green-100 text-green-900'
                          : inv.status === 'overdue'
                            ? 'bg-red-100 text-red-900'
                            : 'bg-yellow-100 text-yellow-900'
                      }`}
                    >
                      {inv.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>Invoice Date: {inv.invoiceDate}</p>
                    <p>Due: {inv.dueDate}</p>
                    <p className="font-bold text-gray-900">Total: ${inv.total.toFixed(2)}</p>
                    <p className="text-emerald-700">Down Payment: ${inv.downPayment.toFixed(2)}</p>
                    <p className="font-bold text-teal-900">Balance: ${inv.balance.toFixed(2)}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setView('view');
                      }}
                      className="flex-1 px-3 py-2 bg-teal-900 text-white rounded-lg hover:bg-teal-950 font-bold text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteInvoice(inv.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-bold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create View */}
      {view === 'create' && (
        <div className="bg-white rounded-2xl border-2 border-teal-900 p-8 max-w-4xl">
          <h2 className="text-2xl font-black text-gray-900 mb-6">✨ Create Professional Invoice</h2>

          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border-2 border-amber-600">
              <label className="block text-sm font-bold text-gray-700 mb-3">Business Logo</label>
              <div className="flex gap-4">
                {logo && <img src={logo} alt="Logo" className="h-24 object-contain" />}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-bold"
                >
                  📷 Upload Logo
                </button>
              </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Client Name *</label>
                <input
                  type="text"
                  value={form.clientName || ''}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={form.clientEmail || ''}
                  onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={form.clientPhone || ''}
                  onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Date *</label>
                <input
                  type="date"
                  value={form.eventDate || ''}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>

            {/* Invoice Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Invoice Date</label>
                <input
                  type="date"
                  value={form.invoiceDate || ''}
                  onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate || ''}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Down Payment</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-lg font-bold text-teal-700">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.downPayment || 0}
                    onChange={(e) => setForm({ ...form, downPayment: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 pl-8 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">📝 Menu Items</h3>
                <button
                  onClick={handleAddLineItem}
                  className="px-3 py-1 bg-teal-900 text-white rounded text-sm font-bold hover:bg-teal-950"
                >
                  + Add Item
                </button>
              </div>

              <div className="space-y-3">
                {(form.lineItems || []).map((item, idx) => (
                  <div key={item.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleUpdateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="w-20 px-2 py-1 bg-white rounded text-sm font-bold text-right">${item.amount.toFixed(2)}</span>
                    {(form.lineItems?.length || 0) > 1 && (
                      <button
                        onClick={() => handleRemoveLineItem(item.id)}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-bold hover:bg-red-200"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Labor & Misc */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Labor Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.laborHours || 0}
                  onChange={(e) => setForm({ ...form, laborHours: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hourly Rate ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-lg font-bold text-teal-700">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.laborRate || 0}
                    onChange={(e) => setForm({ ...form, laborRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 pl-8 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Misc Costs ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-lg font-bold text-teal-700">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.miscCosts || 0}
                    onChange={(e) => setForm({ ...form, miscCosts: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 pl-8 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </div>
            </div>

            {/* Tax & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.tax || 0}
                  onChange={(e) => setForm({ ...form, tax: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div></div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
              <textarea
                value={form.notes || ''}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Payment terms, special instructions, thank you note..."
                rows={3}
                className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            <button
              onClick={handleCreateInvoice}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black py-4 rounded-xl transition shadow-lg text-lg uppercase"
            >
              📄 Create Invoice
            </button>
          </div>
        </div>
      )}

      {/* View Invoice */}
      {view === 'view' && selectedInvoice && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-900 text-white rounded-lg hover:bg-teal-950 font-bold"
            >
              🖨️ Print
            </button>
            <button
              onClick={() => setView('list')}
              className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 font-bold"
            >
              ← Back
            </button>
          </div>

          {/* Invoice Display */}
          <div className="bg-white rounded-2xl border-2 border-teal-900 p-12 shadow-2xl" id="invoice-content">
            <style>{`
              @media print {
                body { margin: 0; padding: 0; }
                #invoice-content { border: none; box-shadow: none; margin: 0; padding: 0; }
                .print\\:hidden { display: none !important; }
              }
            `}</style>

            {/* Header */}
            <div className="grid grid-cols-2 gap-8 mb-12 pb-8 border-b-2 border-teal-900">
              <div>
                {selectedInvoice.logoUrl && <img src={selectedInvoice.logoUrl} alt="Logo" className="h-24 object-contain" />}
                <div className="mt-4">
                  <p className="font-black text-xl text-gray-900">Garage to Table Catering</p>
                  <p className="text-sm text-gray-600">Bringing authentic African cuisine to your table</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-5xl font-black text-amber-600 mb-4">INVOICE</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Invoice #:</strong> {selectedInvoice.id}
                  </p>
                  <p>
                    <strong>Invoice Date:</strong> {selectedInvoice.invoiceDate}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {selectedInvoice.dueDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Client & Event Info */}
            <div className="grid grid-cols-2 gap-8 mb-12 pb-8 border-b-2 border-gray-200">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Bill To</p>
                <p className="font-black text-lg text-gray-900">{selectedInvoice.clientName}</p>
                {selectedInvoice.clientEmail && <p className="text-sm text-gray-600">{selectedInvoice.clientEmail}</p>}
                {selectedInvoice.clientPhone && <p className="text-sm text-gray-600">{selectedInvoice.clientPhone}</p>}
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Event Details</p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {selectedInvoice.eventDate}
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-12">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-teal-900 bg-teal-50">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Description</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-900">Qty</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900">Unit Price</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.lineItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-semibold">{item.description}</td>
                      <td className="text-center py-3 px-4 text-gray-600">{item.quantity}</td>
                      <td className="text-right py-3 px-4 text-gray-600">${item.unitPrice.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 text-gray-900 font-bold">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}

                  {/* Labor */}
                  {selectedInvoice.laborHours > 0 && (
                    <tr className="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-50">
                      <td className="py-3 px-4 text-gray-900 font-bold">Labor ({selectedInvoice.laborHours}h @ ${selectedInvoice.laborRate}/h)</td>
                      <td className="text-center py-3 px-4"></td>
                      <td className="text-right py-3 px-4"></td>
                      <td className="text-right py-3 px-4 text-emerald-900 font-bold">${selectedInvoice.laborTotal.toFixed(2)}</td>
                    </tr>
                  )}

                  {/* Misc */}
                  {selectedInvoice.miscCosts > 0 && (
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-900 font-bold">Miscellaneous Costs</td>
                      <td className="text-center py-3 px-4"></td>
                      <td className="text-right py-3 px-4"></td>
                      <td className="text-right py-3 px-4 text-gray-900 font-bold">${selectedInvoice.miscCosts.toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                {selectedInvoice.notes && (
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-teal-900">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-2">Notes</p>
                    <p className="text-sm text-gray-700">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-bold text-gray-900">${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                {selectedInvoice.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Tax ({selectedInvoice.tax}%):</span>
                    <span className="font-bold text-gray-900">${(selectedInvoice.subtotal * (selectedInvoice.tax / 100)).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg border-t-2 border-b-2 border-teal-900 py-2 my-2">
                  <span className="font-black text-gray-900">TOTAL:</span>
                  <span className="font-black text-amber-600">${selectedInvoice.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Down Payment:</span>
                  <span className="font-bold text-emerald-700">${selectedInvoice.downPayment.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg border-t-2 border-teal-900 pt-2">
                  <span className="font-black text-gray-900">BALANCE DUE:</span>
                  <span className="font-black text-red-600">${selectedInvoice.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t-2 border-gray-200">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase mb-3">Authorized by</p>
                <div className="border-b-2 border-gray-400 h-16 mb-2"></div>
                <p className="text-xs text-gray-600">Your Signature</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 uppercase mb-3">Client Agreement</p>
                <div className="border-b-2 border-gray-400 h-16 mb-2"></div>
                <p className="text-xs text-gray-600">Client Signature</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t-2 border-gray-200 text-center text-xs text-gray-600">
              <p>Thank you for your business! Payment is due by {selectedInvoice.dueDate}</p>
              <p className="mt-2">Questions? Contact us at your earliest convenience</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
