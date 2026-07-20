'use client';

import { useState, useEffect } from 'react';

interface CostEntry {
  id: string;
  period: string;
  date: string;
  ingredients: number;
  gas: number;
  packaging: number;
  overhead: number;
  notes: string;
}

export default function RealCostIntake() {
  const [costs, setCosts] = useState<CostEntry[]>([]);
  const [form, setForm] = useState({
    period: 'monthly',
    date: new Date().toISOString().split('T')[0],
    ingredients: 0,
    gas: 0,
    packaging: 0,
    overhead: 0,
    notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('catering_costs');
    if (saved) {
      setCosts(JSON.parse(saved));
    }
  }, []);

  const saveCosts = (updated: CostEntry[]) => {
    setCosts(updated);
    localStorage.setItem('catering_costs', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = form.ingredients + form.gas + form.packaging + form.overhead;
    if (total === 0) {
      alert('Please enter at least one cost');
      return;
    }

    const newEntry: CostEntry = {
      id: Date.now().toString(),
      ...form,
    };

    saveCosts([newEntry, ...costs]);
    setForm({
      period: 'monthly',
      date: new Date().toISOString().split('T')[0],
      ingredients: 0,
      gas: 0,
      packaging: 0,
      overhead: 0,
      notes: '',
    });
  };

  const deleteCost = (id: string) => {
    saveCosts(costs.filter((c) => c.id !== id));
  };

  const calculateStats = () => {
    const total = costs.reduce(
      (sum, c) => sum + c.ingredients + c.gas + c.packaging + c.overhead,
      0
    );
    const avgMonthly = costs.length > 0 ? total / costs.length : 0;
    const latest = costs[0];

    return { total, avgMonthly, latest };
  };

  const stats = calculateStats();
  const sortedCosts = [...costs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-teal-900 p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">💸 Record Business Costs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Period</label>
            <select
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="monthly">Monthly</option>
              <option value="biweekly">Biweekly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">🥘 Ingredients</label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-lg font-bold text-teal-700">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.ingredients}
                onChange={(e) => setForm({ ...form, ingredients: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full px-4 py-2 pl-8 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">⛽ Gas/Transport</label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-lg font-bold text-emerald-700">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.gas}
                onChange={(e) => setForm({ ...form, gas: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full px-4 py-2 pl-8 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">📦 Packaging</label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-lg font-bold text-amber-700">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.packaging}
                onChange={(e) => setForm({ ...form, packaging: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full px-4 py-2 pl-8 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">🏢 Overhead</label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-lg font-bold text-purple-700">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.overhead}
                onChange={(e) => setForm({ ...form, overhead: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full px-4 py-2 pl-8 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Any special notes about this period's costs..."
            rows={3}
            className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black py-3 rounded-xl transition shadow-lg hover:shadow-2xl text-lg uppercase tracking-wide"
        >
          💾 Save Cost Entry
        </button>
      </form>

      {/* Summary Stats */}
      {costs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-600">
            <p className="text-amber-900 text-sm font-bold uppercase tracking-wide">Total Costs Recorded</p>
            <p className="text-4xl font-black text-amber-900 mt-2">${stats.total.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-600">
            <p className="text-purple-900 text-sm font-bold uppercase tracking-wide">Average per Period</p>
            <p className="text-4xl font-black text-purple-900 mt-2">${stats.avgMonthly.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border-2 border-teal-900">
            <p className="text-teal-900 text-sm font-bold uppercase tracking-wide">Latest Entry</p>
            <p className="text-2xl font-black text-teal-900 mt-2">
              ${(
                (stats.latest?.ingredients || 0) +
                (stats.latest?.gas || 0) +
                (stats.latest?.packaging || 0) +
                (stats.latest?.overhead || 0)
              ).toFixed(2)}
            </p>
            <p className="text-xs text-teal-700 mt-1">{stats.latest?.date}</p>
          </div>
        </div>
      )}

      {/* Cost History */}
      {costs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-gray-600 text-lg font-semibold">No costs recorded yet</p>
          <p className="text-gray-500 mt-1">Start tracking your business costs to see accurate profit margins</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-teal-900 p-8">
          <h3 className="text-2xl font-black text-gray-900 mb-6">📊 Cost History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-teal-900">
                  <th className="text-left py-3 font-bold text-gray-900">Date</th>
                  <th className="text-right py-3 font-bold text-gray-900">🥘 Ingredients</th>
                  <th className="text-right py-3 font-bold text-gray-900">⛽ Gas</th>
                  <th className="text-right py-3 font-bold text-gray-900">📦 Packaging</th>
                  <th className="text-right py-3 font-bold text-gray-900">🏢 Overhead</th>
                  <th className="text-right py-3 font-bold text-teal-900">Total</th>
                  <th className="text-center py-3 font-bold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedCosts.map((cost) => {
                  const total = cost.ingredients + cost.gas + cost.packaging + cost.overhead;
                  return (
                    <tr key={cost.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 font-semibold text-gray-900">{cost.date}</td>
                      <td className="text-right text-gray-600">${cost.ingredients.toFixed(2)}</td>
                      <td className="text-right text-gray-600">${cost.gas.toFixed(2)}</td>
                      <td className="text-right text-gray-600">${cost.packaging.toFixed(2)}</td>
                      <td className="text-right text-gray-600">${cost.overhead.toFixed(2)}</td>
                      <td className="text-right font-bold text-teal-900">${total.toFixed(2)}</td>
                      <td className="text-center">
                        <button
                          onClick={() => deleteCost(cost.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-bold text-xs transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {costs.length > 0 && (
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-600 p-4 rounded">
              <p className="text-sm font-bold text-amber-900">💡 Cost Tracking Tips:</p>
              <ul className="text-xs text-amber-900 mt-2 space-y-1">
                <li>✓ Keep receipts for all expenses</li>
                <li>✓ Update costs monthly for accurate profit margins</li>
                <li>✓ Track overhead (rent, utilities, equipment) to reflect true costs</li>
                <li>✓ These costs will be used to adjust profit dashboard margins</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
