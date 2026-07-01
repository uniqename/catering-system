'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Ingredient {
  id: string;
  name: string;
  unit_cost: number;
  qty: number;
  active: boolean;
}

export default function IngredientsSection({ userId }: { userId: string }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', unit_cost: '', qty: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIngredients();
  }, [userId]);

  const fetchIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) throw error;
      setIngredients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ingredients');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.unit_cost || !form.qty) {
      setError('All fields required');
      return;
    }

    try {
      const { error } = await supabase.from('ingredients').insert({
        user_id: userId,
        name: form.name,
        unit_cost: parseFloat(form.unit_cost),
        qty: parseFloat(form.qty),
        active: true,
      });

      if (error) throw error;
      setForm({ name: '', unit_cost: '', qty: '' });
      await fetchIngredients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add ingredient');
    }
  };

  const updateQty = async (id: string, newQty: number) => {
    try {
      const { error } = await supabase
        .from('ingredients')
        .update({ qty: newQty })
        .eq('id', id);

      if (error) throw error;
      await fetchIngredients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ingredient');
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchIngredients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ingredient');
    }
  };

  if (loading) return <div>Loading ingredients...</div>;

  const lowStockItems = ingredients.filter((i) => i.qty < 5);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Add Ingredient</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Ingredient name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Unit cost"
              step="0.01"
              value={form.unit_cost}
              onChange={(e) => setForm({ ...form, unit_cost: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Quantity on hand"
              step="0.1"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Add Ingredient
          </button>
        </form>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-medium text-yellow-800">
            Low Stock Alert: {lowStockItems.length} ingredient(s) below 5 units
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Ingredients</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Unit Cost</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Qty</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Value</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient) => (
                <tr
                  key={ingredient.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${
                    ingredient.qty < 5 ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{ingredient.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">${ingredient.unit_cost.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <input
                      type="number"
                      step="0.1"
                      value={ingredient.qty}
                      onChange={(e) => updateQty(ingredient.id, parseFloat(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ${(ingredient.qty * ingredient.unit_cost).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => deleteIngredient(ingredient.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
