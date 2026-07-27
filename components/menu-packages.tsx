'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerServing: number;
  available: boolean;
}

interface Package {
  id: string;
  name: string;
  description: string;
  guestCount: string; // e.g., "25-50"
  price: number;
  items: string[]; // MenuItem IDs
  servings: number;
}

export default function MenuPackages() {
  const [view, setView] = useState<'menu' | 'packages'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [newItem, setNewItem] = useState({ name: '', category: 'main', description: '', pricePerServing: 0 });
  const [newPackage, setNewPackage] = useState({ name: '', description: '', guestCount: '', price: 0, servings: 0 });

  useEffect(() => {
    const savedItems = localStorage.getItem('catering_menu_items');
    const savedPackages = localStorage.getItem('catering_packages');

    if (savedItems) setMenuItems(JSON.parse(savedItems));
    else setMenuItems([
      { id: '1', name: 'Jollof Rice', category: 'main', description: 'Authentic West African jollof rice', pricePerServing: 8, available: true },
      { id: '2', name: 'Grilled Chicken', category: 'protein', description: 'Perfectly grilled and seasoned chicken', pricePerServing: 12, available: true },
      { id: '3', name: 'Beef Stew', category: 'main', description: 'Traditional slow-cooked beef stew', pricePerServing: 10, available: true },
      { id: '4', name: 'Fried Plantains', category: 'side', description: 'Golden crispy plantain slices', pricePerServing: 4, available: true },
    ]);

    if (savedPackages) setPackages(JSON.parse(savedPackages));
    else setPackages([
      { id: '1', name: 'Starter Package', description: 'Perfect for intimate gatherings', guestCount: '10-25', price: 250, items: ['1', '4'], servings: 25 },
      { id: '2', name: 'Professional Package', description: 'Ideal for corporate events', guestCount: '50-100', price: 1250, items: ['1', '2', '3', '4'], servings: 75 },
      { id: '3', name: 'Premium Package', description: 'Luxury catering for grand events', guestCount: '100+', price: 2500, items: ['1', '2', '3', '4'], servings: 150 },
    ]);
  }, []);

  const saveMenuItems = (items: MenuItem[]) => {
    setMenuItems(items);
    localStorage.setItem('catering_menu_items', JSON.stringify(items));
  };

  const savePackages = (pkgs: Package[]) => {
    setPackages(pkgs);
    localStorage.setItem('catering_packages', JSON.stringify(pkgs));
  };

  const addMenuItem = () => {
    if (!newItem.name || !newItem.pricePerServing) {
      alert('Please fill in all fields');
      return;
    }
    const item: MenuItem = {
      id: `item_${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      description: newItem.description,
      pricePerServing: newItem.pricePerServing,
      available: true,
    };
    saveMenuItems([item, ...menuItems]);
    setNewItem({ name: '', category: 'main', description: '', pricePerServing: 0 });
  };

  const deleteMenuItem = (id: string) => {
    saveMenuItems(menuItems.filter(item => item.id !== id));
  };

  const addPackage = () => {
    if (!newPackage.name || !newPackage.price) {
      alert('Please fill in required fields');
      return;
    }
    const pkg: Package = {
      id: `pkg_${Date.now()}`,
      name: newPackage.name,
      description: newPackage.description,
      guestCount: newPackage.guestCount,
      price: newPackage.price,
      items: [],
      servings: newPackage.servings,
    };
    savePackages([pkg, ...packages]);
    setNewPackage({ name: '', description: '', guestCount: '', price: 0, servings: 0 });
  };

  const deletePackage = (id: string) => {
    savePackages(packages.filter(pkg => pkg.id !== id));
  };

  if (view === 'menu') {
    return (
      <div style={{ backgroundColor: '#0B3D36' }} className="p-8 min-h-screen">
        <div className="max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 style={{ color: '#D4A64A' }} className="text-3xl font-bold">Menu Items</h1>
            <button
              onClick={() => setView('packages')}
              style={{ color: '#D4A64A' }}
              className="font-semibold hover:opacity-80"
            >
              View Packages →
            </button>
          </div>

          {/* Add New Item */}
          <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6 mb-8">
            <h2 style={{ color: '#D4A64A' }} className="font-bold mb-4">Add Menu Item</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
                className="px-4 py-2 border-2 rounded-lg"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
                className="px-4 py-2 border-2 rounded-lg"
              >
                <option value="main">Main Course</option>
                <option value="protein">Protein</option>
                <option value="side">Side Dish</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
                className="px-4 py-2 border-2 rounded-lg col-span-2"
              />
              <input
                type="number"
                placeholder="Price per serving"
                value={newItem.pricePerServing}
                onChange={(e) => setNewItem({ ...newItem, pricePerServing: parseFloat(e.target.value) })}
                style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
                className="px-4 py-2 border-2 rounded-lg"
              />
              <button
                onClick={addMenuItem}
                style={{ backgroundColor: '#D4A64A', color: '#0B3D36' }}
                className="font-bold rounded-lg hover:opacity-90"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="space-y-4">
            {menuItems.map(item => (
              <div key={item.id} style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6 flex items-start justify-between">
                <div className="flex-1">
                  <h3 style={{ color: '#D4A64A' }} className="font-bold text-lg">{item.name}</h3>
                  <p style={{ color: '#a8d5ca' }} className="text-sm">{item.description}</p>
                  <div className="flex gap-4 mt-2">
                    <span style={{ color: '#a8d5ca' }} className="text-sm">Category: <span style={{ color: '#D4A64A' }} className="font-semibold capitalize">{item.category}</span></span>
                    <span style={{ color: '#a8d5ca' }} className="text-sm">Price: <span style={{ color: '#D4A64A' }} className="font-semibold">${item.pricePerServing}/serving</span></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    style={{ color: '#EF4444' }}
                    className="p-2 hover:bg-[#0B3D36] rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Packages View
  return (
    <div style={{ backgroundColor: '#0B3D36' }} className="p-8 min-h-screen">
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 style={{ color: '#D4A64A' }} className="text-3xl font-bold">Catering Packages</h1>
          <button
            onClick={() => setView('menu')}
            style={{ color: '#D4A64A' }}
            className="font-semibold hover:opacity-80"
          >
            ← View Menu
          </button>
        </div>

        {/* Add New Package */}
        <div style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6 mb-8">
          <h2 style={{ color: '#D4A64A' }} className="font-bold mb-4">Create Package</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Package name"
              value={newPackage.name}
              onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
              style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
              className="px-4 py-2 border-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Guest count (e.g., 25-50)"
              value={newPackage.guestCount}
              onChange={(e) => setNewPackage({ ...newPackage, guestCount: e.target.value })}
              style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
              className="px-4 py-2 border-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Description"
              value={newPackage.description}
              onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
              style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
              className="px-4 py-2 border-2 rounded-lg col-span-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={newPackage.price}
              onChange={(e) => setNewPackage({ ...newPackage, price: parseFloat(e.target.value) })}
              style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
              className="px-4 py-2 border-2 rounded-lg"
            />
            <input
              type="number"
              placeholder="Max servings"
              value={newPackage.servings}
              onChange={(e) => setNewPackage({ ...newPackage, servings: parseInt(e.target.value) })}
              style={{ backgroundColor: '#0B3D36', borderColor: '#D4A64A', color: 'white' }}
              className="px-4 py-2 border-2 rounded-lg"
            />
            <button
              onClick={addPackage}
              style={{ backgroundColor: '#D4A64A', color: '#0B3D36' }}
              className="font-bold rounded-lg hover:opacity-90 col-span-2"
            >
              Create Package
            </button>
          </div>
        </div>

        {/* Packages List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} style={{ backgroundColor: '#1a5f54' }} className="rounded-lg p-6 relative">
              <button
                onClick={() => deletePackage(pkg.id)}
                style={{ color: '#EF4444' }}
                className="absolute top-4 right-4 hover:bg-[#0B3D36] p-2 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <h3 style={{ color: '#D4A64A' }} className="font-bold text-xl mb-2">{pkg.name}</h3>
              <p style={{ color: '#a8d5ca' }} className="text-sm mb-4">{pkg.description}</p>
              <div className="space-y-2 mb-4">
                <p style={{ color: '#a8d5ca' }} className="text-sm">Guests: <span style={{ color: '#D4A64A' }} className="font-bold">{pkg.guestCount}</span></p>
                <p style={{ color: '#a8d5ca' }} className="text-sm">Price: <span style={{ color: '#10B981' }} className="font-bold text-lg">${pkg.price}</span></p>
                <p style={{ color: '#a8d5ca' }} className="text-sm">Servings: <span style={{ color: '#D4A64A' }} className="font-bold">{pkg.servings}</span></p>
              </div>
              <p style={{ color: '#a8d5ca' }} className="text-xs">Per serving: ${(pkg.price / pkg.servings).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
