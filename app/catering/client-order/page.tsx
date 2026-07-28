'use client';

import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Send } from 'lucide-react';

export default function ClientOrderPage() {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);

  const menuItems = [
    { id: 'jollof', name: 'Jollof Rice', price: 45, category: 'mains', desc: 'Aromatic West African rice' },
    { id: 'chicken', name: 'Grilled Chicken', price: 55, category: 'mains', desc: 'Herb-marinated grilled chicken' },
    { id: 'beefstew', name: 'Beef Stew', price: 50, category: 'mains', desc: 'Slow-cooked tender beef' },
    { id: 'friedrice', name: 'Fried Rice', price: 40, category: 'mains', desc: 'Savory fried rice medley' },
    { id: 'plantains', name: 'Fried Plantains', price: 25, category: 'sides', desc: 'Golden fried plantain slices' },
    { id: 'greensal', name: 'Green Salad', price: 20, category: 'sides', desc: 'Fresh mixed green salad' },
    { id: 'coleslaw', name: 'Coleslaw', price: 18, category: 'sides', desc: 'Crisp cabbage coleslaw' },
  ];

  const drinks = [
    { id: 'water', name: 'Bottled Water', price: 3, desc: '500ml' },
    { id: 'juice', name: 'Fresh Juice', price: 8, desc: 'Mixed fruit juice' },
    { id: 'soda', name: 'Soda', price: 5, desc: 'Assorted sodas' },
    { id: 'wine', name: 'Red Wine', price: 35, desc: 'Premium red wine bottle' },
  ];

  const rentals = [
    { id: 'table-round', name: 'Round Table (seats 8)', price: 80, desc: 'Elegant round dining table' },
    { id: 'table-rect', name: 'Rectangular Table (seats 10)', price: 100, desc: 'Long dining table' },
    { id: 'chairs', name: 'Dining Chairs (per 4)', price: 40, desc: 'Set of 4 chairs' },
    { id: 'linens', name: 'Table Linens Set', price: 35, desc: 'Premium table linens' },
  ];

  const addToCart = (id: string) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const getItemPrice = (id: string) => {
    const item = [...menuItems, ...drinks, ...rentals].find(i => i.id === id);
    return item?.price || 0;
  };

  const getItemName = (id: string) => {
    const item = [...menuItems, ...drinks, ...rentals].find(i => i.id === id);
    return item?.name || '';
  };

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => sum + (getItemPrice(id) * qty), 0);
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleSubmit = () => {
    if (cartCount === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setCart({});
      setSubmitted(false);
    }, 3000);
  };

  const MenuItem = ({ item }: { item: any }) => (
    <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p style={{ color: '#d7a859' }} className="font-bold text-sm">{item.name}</p>
          <p style={{ color: '#a8d5ca' }} className="text-xs mb-2">{item.desc}</p>
        </div>
        <p style={{ color: '#d7a859' }} className="font-bold">${item.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-1 hover:bg-[#102418] rounded transition"
        >
          <Minus style={{ color: '#d7a859' }} className="w-4 h-4" />
        </button>
        <span style={{ color: '#ffffff' }} className="text-sm font-bold min-w-[30px] text-center">
          {cart[item.id] || 0}
        </span>
        <button
          onClick={() => addToCart(item.id)}
          className="p-1 hover:bg-[#102418] rounded transition"
        >
          <Plus style={{ color: '#d7a859' }} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <img src="/garage-to-table-logo.png" alt="Garage to Table" className="w-24 h-24 object-contain mx-auto mb-4" />
          <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold mb-2">Garage to Table</h1>
          <p style={{ color: '#a8d5ca' }} className="text-sm">Curated meals, flavored with love</p>
        </div>

        {submitted ? (
          <div style={{ backgroundColor: '#0f2416', borderColor: '#10B981' }} className="border-2 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <div style={{ color: '#10B981' }} className="mb-4 text-4xl">✓</div>
            <h2 style={{ color: '#10B981' }} className="text-2xl font-bold mb-2">Order Submitted!</h2>
            <p style={{ color: '#ffffff' }} className="mb-4">Thank you for your order. We'll confirm your catering details within 24 hours.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu & Items */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main Dishes */}
              <div>
                <h2 style={{ color: '#d7a859' }} className="text-xl font-bold mb-4">Main Dishes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.filter(i => i.category === 'mains').map(item => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Sides */}
              <div>
                <h2 style={{ color: '#d7a859' }} className="text-xl font-bold mb-4">Sides & Vegetables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.filter(i => i.category === 'sides').map(item => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Drinks */}
              <div>
                <h2 style={{ color: '#d7a859' }} className="text-xl font-bold mb-4">Beverages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {drinks.map(item => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Table Rentals */}
              <div>
                <h2 style={{ color: '#d7a859' }} className="text-xl font-bold mb-4">Event Rentals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rentals.map(item => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Sidebar */}
            <div>
              <div style={{ backgroundColor: '#0f2416', borderColor: 'rgba(215, 168, 89, 0.08)' }} className="border rounded-xl p-6 sticky top-8">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingCart style={{ color: '#d7a859' }} className="w-6 h-6" />
                  <h3 style={{ color: '#d7a859' }} className="text-lg font-bold">Order Summary</h3>
                </div>

                {cartCount === 0 ? (
                  <p style={{ color: '#a8d5ca' }} className="text-sm text-center py-8">
                    Add items to your order
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                      {Object.entries(cart).map(([id, qty]) => (
                        <div key={id} style={{ backgroundColor: '#0a1911' }} className="p-3 rounded-lg">
                          <p style={{ color: '#ffffff' }} className="text-sm font-semibold">
                            {getItemName(id)}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p style={{ color: '#a8d5ca' }} className="text-xs">
                              {qty} × ${getItemPrice(id)}
                            </p>
                            <p style={{ color: '#d7a859' }} className="font-bold">
                              ${qty * getItemPrice(id)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="border-t pt-4 mb-6">
                      <div className="flex items-center justify-between">
                        <p style={{ color: '#a8d5ca' }} className="text-sm">Subtotal:</p>
                        <p style={{ color: '#ffffff' }} className="font-bold">${cartTotal}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p style={{ color: '#a8d5ca' }} className="text-sm">Tax (15%):</p>
                        <p style={{ color: '#ffffff' }} className="font-bold">${(cartTotal * 0.15).toFixed(2)}</p>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#d7a859' }} className="p-4 rounded-lg mb-6">
                      <p style={{ color: '#0a1911' }} className="text-xs uppercase tracking-wide">Total</p>
                      <p style={{ color: '#0a1911' }} className="text-3xl font-black">
                        ${(cartTotal * 1.15).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={handleSubmit}
                      style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                      className="w-full py-3 font-bold rounded-lg transition hover:opacity-90 flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" /> Submit Order
                    </button>
                  </>
                )}

                <div style={{ borderTopColor: 'rgba(215, 168, 89, 0.1)' }} className="border-t mt-6 pt-4">
                  <p style={{ color: '#a8d5ca' }} className="text-xs text-center">
                    Questions? Contact us at info@garageotable.com or call +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
