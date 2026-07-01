'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  unit_cost: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<'menu' | 'checkout' | 'confirmation'>('menu');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
  });
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('id, name, price, unit_cost')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          qty: 1,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((c) => (c.id === id ? { ...c, qty } : c))
      );
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.phone || !form.date) {
      setError('All fields required');
      return;
    }

    if (cart.length === 0) {
      setError('Add at least one item to your order');
      return;
    }

    setSubmitting(true);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: 'guest',
          client_name: form.name,
          order_date: new Date().toISOString().split('T')[0],
          delivery_date: form.date,
          status: 'pending',
          notes: `Email: ${form.email}, Phone: ${form.phone}`,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        qty: item.qty,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderId(orderData.id);
      setStep('confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <p className="text-white text-lg">Loading menu...</p>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">Your delicious feast is on the way</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-dashed border-purple-300">
            <p className="text-sm text-gray-600 mb-1">Order Code</p>
            <p className="text-3xl font-bold text-purple-600 font-mono">
              {orderId.substring(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-gray-900 mb-3">Order Details</p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Name:</span>
                <span className="font-medium float-right">{form.name}</span>
              </p>
              <p>
                <span className="text-gray-600">Items:</span>
                <span className="font-medium float-right">{cart.length}</span>
              </p>
              <p>
                <span className="text-gray-600">Delivery:</span>
                <span className="font-medium float-right">{form.date}</span>
              </p>
              <p className="border-t pt-2">
                <span className="text-gray-900 font-semibold">Total:</span>
                <span className="font-bold text-purple-600 float-right">${total.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-6">
            A confirmation email has been sent to {form.email}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <h1 className="text-5xl font-black text-white mb-2">🍽️ Order Your Feast</h1>
          <p className="text-purple-100 text-lg">Pick your items & get ready to enjoy!</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu */}
          {step === 'menu' && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Items</h2>
                {menuItems.length === 0 ? (
                  <p className="text-gray-500">No items available</p>
                ) : (
                  <div className="grid gap-4">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 transition"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-2xl font-bold text-purple-600">${item.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Checkout Form */}
          {step === 'checkout' && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Details</h2>
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Your phone"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Date *
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 space-y-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
                    >
                      {submitting ? 'Placing Order...' : 'Complete Order'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('menu')}
                      className="w-full border-2 border-gray-300 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      Back to Menu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🛒 Your Cart ({cart.length})
              </h3>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Add items to get started</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="border-b pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 text-xs font-bold"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="text-gray-600 hover:text-gray-900 font-bold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
                              className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                            />
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="text-gray-600 hover:text-gray-900 font-bold"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-bold text-purple-600">${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-black text-purple-600">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {step === 'menu' && (
                      <button
                        onClick={() => setStep('checkout')}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition"
                      >
                        Proceed to Checkout
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
