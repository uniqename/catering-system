'use client';

import { useState, useEffect } from 'react';

interface RentalItem {
  id: string;
  name: string;
  quantityOwned: number;
  originalCost: number;
  replacementValue: number;
  usageFrequency: number;
  calculatedRate: number;
  overrideRate: number | null;
  addOnMode: boolean;
  notes: string;
}

export default function RentalPricing() {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [form, setForm] = useState({
    name: '',
    quantityOwned: 1,
    originalCost: 0,
    replacementValue: 0,
    usageFrequency: 150,
    addOnMode: false,
    notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('catering_rentals');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  const saveItems = (updated: RentalItem[]) => {
    setItems(updated);
    localStorage.setItem('catering_rentals', JSON.stringify(updated));
  };

  const calculateRate = (originalCost: number, frequency: number) => {
    return frequency > 0 ? originalCost / frequency : 0;
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      alert('Please enter item name');
      return;
    }

    const newItem: RentalItem = {
      id: Date.now().toString(),
      name: form.name,
      quantityOwned: form.quantityOwned,
      originalCost: form.originalCost,
      replacementValue: form.replacementValue,
      usageFrequency: form.usageFrequency,
      calculatedRate: calculateRate(form.originalCost, form.usageFrequency),
      overrideRate: null,
      addOnMode: form.addOnMode,
      notes: form.notes,
    };

    saveItems([newItem, ...items]);
    setForm({
      name: '',
      quantityOwned: 1,
      originalCost: 0,
      replacementValue: 0,
      usageFrequency: 150,
      addOnMode: false,
      notes: '',
    });
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter((i) => i.id !== id));
  };

  const updateItemRate = (id: string, overrideRate: number | null) => {
    const updated = items.map((i) => (i.id === id ? { ...i, overrideRate } : i));
    saveItems(updated);
  };

  const updateItemMode = (id: string, addOnMode: boolean) => {
    const updated = items.map((i) => (i.id === id ? { ...i, addOnMode } : i));
    saveItems(updated);
  };

  const totalRentalValue = items.reduce((sum, i) => sum + i.replacementValue * i.quantityOwned, 0);
  const totalOriginalCost = items.reduce((sum, i) => sum + i.originalCost, 0);
  const avgPerUseRate = items.length > 0
    ? items.reduce((sum, i) => sum + (i.overrideRate ?? i.calculatedRate), 0) / items.length
    : 0;

  return (
    <div className="space-y-8">
      {/* Form */}
      <form onSubmit={handleAddItem} className="bg-white rounded-2xl border-2 border-teal-900 p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">🪑 Add Rental Item</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Item Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Chiavari Chair, Round Table"
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Quantity Owned</label>
            <input
              type="number"
              min="1"
              value={form.quantityOwned}
              onChange={(e) => setForm({ ...form, quantityOwned: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Original Purchase Cost</label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-lg font-bold text-teal-700">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.originalCost}
                onChange={(e) => setForm({ ...form, originalCost: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full px-4 py-2 pl-8 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Replacement Value</label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-lg font-bold text-emerald-700">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.replacementValue}
                onChange={(e) => setForm({ ...form, replacementValue: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full px-4 py-2 pl-8 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Expected Uses (Useful Life)</label>
            <input
              type="number"
              min="1"
              value={form.usageFrequency}
              onChange={(e) => setForm({ ...form, usageFrequency: parseInt(e.target.value) || 150 })}
              placeholder="150"
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <p className="text-xs text-gray-500 mt-1">
              Rate = Cost ÷ Uses = ${(form.originalCost / form.usageFrequency).toFixed(2)}/use
            </p>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer mt-6">
              <input
                type="checkbox"
                checked={form.addOnMode}
                onChange={(e) => setForm({ ...form, addOnMode: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm font-bold text-gray-700">Show as add-on (non-itemized)</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">Unchecked = itemize separately per booking</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Condition, damage history, maintenance notes..."
            rows={2}
            className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black py-3 rounded-xl transition shadow-lg hover:shadow-2xl text-lg uppercase tracking-wide"
        >
          ➕ Add Rental Item
        </button>
      </form>

      {/* Summary Stats */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-700">
            <p className="text-emerald-900 text-sm font-bold uppercase tracking-wide">Total Inventory Value</p>
            <p className="text-4xl font-black text-emerald-900 mt-2">${totalRentalValue.toFixed(2)}</p>
            <p className="text-xs text-emerald-700 mt-1">{items.length} item types</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-600">
            <p className="text-amber-900 text-sm font-bold uppercase tracking-wide">Total Investment</p>
            <p className="text-4xl font-black text-amber-900 mt-2">${totalOriginalCost.toFixed(2)}</p>
            <p className="text-xs text-amber-700 mt-1">Initial purchase cost</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-600">
            <p className="text-purple-900 text-sm font-bold uppercase tracking-wide">Average Rate per Use</p>
            <p className="text-4xl font-black text-purple-900 mt-2">${avgPerUseRate.toFixed(2)}</p>
            <p className="text-xs text-purple-700 mt-1">Weighted average</p>
          </div>
        </div>
      )}

      {/* Rental Items */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <p className="text-6xl mb-4">🪑</p>
          <p className="text-gray-600 text-lg font-semibold">No rental items yet</p>
          <p className="text-gray-500 mt-1">Start tracking rental inventory to include in pricing</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-gray-900">📦 Rental Inventory</h3>
          {items.map((item) => {
            const currentRate = item.overrideRate ?? item.calculatedRate;
            return (
              <div key={item.id} className="bg-white rounded-2xl border-2 border-teal-900 p-6 hover:shadow-lg transition">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="font-black text-lg text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600 mt-1">Qty: {item.quantityOwned}</p>
                    {item.notes && <p className="text-xs text-gray-500 mt-1">📝 {item.notes}</p>}
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-teal-900">${currentRate.toFixed(2)}/use</p>
                    <p className="text-xs text-gray-500">
                      {item.overrideRate ? '(Manual override)' : `(${item.usageFrequency} uses)`}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs font-bold">ORIGINAL COST</p>
                      <p className="font-bold text-gray-900">${item.originalCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold">REPLACEMENT VALUE</p>
                      <p className="font-bold text-gray-900">${item.replacementValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold">CALCULATED RATE</p>
                      <p className="font-bold text-gray-900">${item.calculatedRate.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold">TOTAL VALUE</p>
                      <p className="font-bold text-gray-900">${(item.replacementValue * item.quantityOwned).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Override Rate (optional)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-sm font-bold text-gray-600">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.overrideRate ?? ''}
                        onChange={(e) => updateItemRate(item.id, e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Leave blank"
                        className="w-full px-3 py-1 pl-7 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={item.addOnMode}
                        onChange={(e) => updateItemMode(item.id, e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="font-semibold text-gray-700">Add-on mode</span>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-bold text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-600 bg-amber-50 p-2 rounded">
                  {item.addOnMode
                    ? '🏷️ Will show as add-on (not itemized per booking)'
                    : '📋 Will itemize separately on each booking'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-700 p-6 rounded-xl">
        <p className="text-sm font-bold text-emerald-900 mb-2">💡 Rental Pricing Strategy:</p>
        <ul className="text-sm text-emerald-900 space-y-1">
          <li>✓ Use cost-per-use formula: original cost ÷ useful lifespan</li>
          <li>✓ Override rates for premium items or special pricing</li>
          <li>✓ Add-on mode: hide complexity from clients, charge bundled</li>
          <li>✓ Track replacement value for insurance &amp; liability</li>
        </ul>
      </div>
    </div>
  );
}
