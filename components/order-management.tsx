'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, Trash2, DollarSign, Calendar, Users, Utensils } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  eventType: string;
  venue: string;
  menu: string[];
  specialRequests: string;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'paid' | 'delivered' | 'invoiced';
  estimatedCost: number;
  actualCost: number;
  deposit: number;
  balance: number;
  createdAt: string;
  invoiceGenerated: boolean;
  paymentStatus: 'pending' | 'partial' | 'paid';
}

export default function OrderManagement({ orders: initialOrders = [] }: { orders?: any[] }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [view, setView] = useState<'list' | 'detail' | 'create' | 'edit'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    clientName: '',
    email: '',
    phone: '',
    eventDate: '',
    eventTime: '18:00',
    guestCount: 50,
    eventType: 'wedding',
    venue: '',
    menu: [],
    specialRequests: '',
    status: 'inquiry',
    estimatedCost: 0,
    actualCost: 0,
    deposit: 0,
    balance: 0,
    invoiceGenerated: false,
    paymentStatus: 'pending',
  });

  useEffect(() => {
    const saved = localStorage.getItem('catering_orders_full');
    if (saved) {
      setOrders(JSON.parse(saved));
    } else if (initialOrders.length > 0) {
      // Convert initial orders to full Order format
      const converted = initialOrders.map((o: any) => ({
        ...o,
        email: o.email || '',
        phone: o.phone || '',
        eventTime: o.eventTime || '18:00',
        venue: o.venue || '',
        menu: o.menu || [],
        specialRequests: o.notes || '',
        estimatedCost: o.guestCount * 35,
        actualCost: 0,
        deposit: (o.guestCount * 35) * 0.5,
        balance: (o.guestCount * 35) * 0.5,
        invoiceGenerated: false,
        paymentStatus: 'pending' as const,
      }));
      setOrders(converted);
      localStorage.setItem('catering_orders_full', JSON.stringify(converted));
    }
  }, [initialOrders]);

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem('catering_orders_full', JSON.stringify(updated));
  };

  const createOrder = () => {
    if (!newOrder.clientName || !newOrder.email || !newOrder.eventDate) {
      alert('Name, email, and event date are required');
      return;
    }

    const guestCount = newOrder.guestCount || 50;
    const cost = guestCount * 35;

    const order: Order = {
      id: `ord_${Date.now()}`,
      clientName: newOrder.clientName as string,
      email: newOrder.email as string,
      phone: newOrder.phone as string || '',
      eventDate: newOrder.eventDate as string,
      eventTime: newOrder.eventTime as string || '18:00',
      guestCount,
      eventType: newOrder.eventType as string || 'wedding',
      venue: newOrder.venue as string || '',
      menu: newOrder.menu || [],
      specialRequests: newOrder.specialRequests as string || '',
      status: 'inquiry' as const,
      estimatedCost: cost,
      actualCost: 0,
      deposit: cost * 0.5,
      balance: cost * 0.5,
      createdAt: new Date().toISOString().split('T')[0],
      invoiceGenerated: false,
      paymentStatus: 'pending' as const,
    };

    saveOrders([order, ...orders]);
    setNewOrder({});
    setView('list');
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    saveOrders(updated);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const recordPayment = (orderId: string, amount: number) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const newBalance = o.balance - amount;
        const newPaymentStatus = newBalance <= 0 ? 'paid' as const : 'partial' as const;
        return { ...o, balance: Math.max(0, newBalance), paymentStatus: newPaymentStatus };
      }
      return o;
    });
    saveOrders(updated);
    if (selectedOrder?.id === orderId) {
      const updatedOrder = updated.find(o => o.id === orderId);
      if (updatedOrder) setSelectedOrder(updatedOrder);
    }
  };

  const deleteOrder = (id: string) => {
    if (confirm('Delete this order? This cannot be undone.')) {
      saveOrders(orders.filter(o => o.id !== id));
      setView('list');
    }
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  // List View
  if (view === 'list') {
    return (
      <div style={{ backgroundColor: '#0a1911' }} className="p-8 min-h-screen">
        <div className="max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">Orders & Events</h1>
            <button
              onClick={() => { setNewOrder({}); setView('create'); }}
              style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
              className="px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90"
            >
              <Plus className="w-5 h-5" /> New Order
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {['all', 'inquiry', 'quoted', 'confirmed', 'invoiced', 'paid', 'delivered'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  backgroundColor: filterStatus === status ? '#d7a859' : '#102418',
                  color: filterStatus === status ? '#0a1911' : '#a8d5ca'
                }}
                className="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition capitalize"
              >
                {status}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-12 text-center">
              <p style={{ color: '#a8d5ca' }}>No orders found</p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#102418' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottomColor: '#d7a859' }} className="border-b-2">
                    <th style={{ color: '#d7a859' }} className="px-6 py-4 text-left font-bold">Client</th>
                    <th style={{ color: '#d7a859' }} className="px-6 py-4 text-left font-bold">Event</th>
                    <th style={{ color: '#d7a859' }} className="px-6 py-4 text-left font-bold">Date</th>
                    <th style={{ color: '#d7a859' }} className="px-6 py-4 text-left font-bold">Guests</th>
                    <th style={{ color: '#d7a859' }} className="px-6 py-4 text-right font-bold">Cost</th>
                    <th style={{ color: '#d7a859' }} className="px-6 py-4 text-left font-bold">Status</th>
                    <th style={{ color: '#d7a859' }} className="px-6 py-4 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} style={{ borderBottomColor: '#0a1911' }} className="border-b hover:bg-[#0a1911] transition">
                      <td style={{ color: '#d7a859' }} className="px-6 py-4 font-bold">{order.clientName}</td>
                      <td style={{ color: '#a8d5ca' }} className="px-6 py-4 capitalize">{order.eventType}</td>
                      <td style={{ color: '#a8d5ca' }} className="px-6 py-4">{new Date(order.eventDate).toLocaleDateString()}</td>
                      <td style={{ color: '#a8d5ca' }} className="px-6 py-4 flex items-center gap-1">
                        <Users className="w-4 h-4" /> {order.guestCount}
                      </td>
                      <td style={{ color: '#d7a859' }} className="px-6 py-4 text-right font-bold">${order.estimatedCost.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span style={{
                          backgroundColor: order.status === 'confirmed' ? '#10B981' : order.status === 'paid' ? '#3B82F6' : order.status === 'delivered' ? '#8B5CF6' : '#F59E0B',
                          color: 'white'
                        }} className="px-3 py-1 rounded-full text-xs font-semibold capitalize">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => { setSelectedOrder(order); setView('detail'); }}
                          style={{ color: '#d7a859' }}
                          className="hover:opacity-80"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detail View
  if (view === 'detail' && selectedOrder) {
    return (
      <div style={{ backgroundColor: '#0a1911' }} className="p-8 min-h-screen">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">{selectedOrder.clientName} - {selectedOrder.eventType}</h1>
            <button
              onClick={() => setView('list')}
              style={{ color: '#d7a859' }}
              className="px-4 py-2 rounded-lg font-bold hover:opacity-80"
            >
              ← Back
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Event Details */}
            <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-6">
              <h2 style={{ color: '#d7a859' }} className="font-bold mb-4">Event Details</h2>
              <div style={{ color: '#a8d5ca' }} className="space-y-3">
                <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(selectedOrder.eventDate).toLocaleDateString()} @ {selectedOrder.eventTime}</p>
                <p className="flex items-center gap-2"><Users className="w-4 h-4" /> {selectedOrder.guestCount} guests</p>
                <p className="flex items-center gap-2"><Utensils className="w-4 h-4" /> {selectedOrder.eventType}</p>
                {selectedOrder.venue && <p className="text-sm">📍 {selectedOrder.venue}</p>}
              </div>
            </div>

            {/* Financial Summary */}
            <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-6">
              <h2 style={{ color: '#d7a859' }} className="font-bold mb-4">Financial</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: '#a8d5ca' }}>Estimated Cost:</span>
                  <span style={{ color: '#d7a859' }} className="font-bold">${selectedOrder.estimatedCost.toLocaleString()}</span>
                </div>
                <div style={{ borderTopColor: '#d7a859' }} className="border-t-2 pt-3">
                  <span style={{ color: '#a8d5ca' }}>Deposit (50%):</span>
                  <span style={{ color: '#10B981' }} className="font-bold">${selectedOrder.deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#a8d5ca' }}>Balance Due:</span>
                  <span style={{ color: selectedOrder.balance > 0 ? '#F59E0B' : '#10B981' }} className="font-bold">${selectedOrder.balance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-6 mb-8">
            <h2 style={{ color: '#d7a859' }} className="font-bold mb-4">Client Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p style={{ color: '#a8d5ca' }} className="text-sm">Email</p>
                <p style={{ color: '#d7a859' }} className="font-bold">{selectedOrder.email}</p>
              </div>
              <div>
                <p style={{ color: '#a8d5ca' }} className="text-sm">Phone</p>
                <p style={{ color: '#d7a859' }} className="font-bold">{selectedOrder.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Status & Actions */}
          <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-6 mb-8">
            <h2 style={{ color: '#d7a859' }} className="font-bold mb-4">Status & Actions</h2>

            <div className="space-y-4">
              <div>
                <p style={{ color: '#a8d5ca' }} className="text-sm mb-2">Current Status</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg font-semibold capitalize"
                >
                  <option value="inquiry">Inquiry</option>
                  <option value="quoted">Quoted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="invoiced">Invoiced</option>
                  <option value="paid">Paid</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {selectedOrder.balance > 0 && (
                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-sm mb-2">Record Payment</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount"
                      id="paymentAmount"
                      style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                      className="flex-1 px-4 py-2 border-2 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('paymentAmount') as HTMLInputElement;
                        const amount = parseFloat(input.value);
                        if (amount > 0) {
                          recordPayment(selectedOrder.id, amount);
                          input.value = '';
                        }
                      }}
                      style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                      className="px-6 py-2 rounded-lg font-bold hover:opacity-90"
                    >
                      <DollarSign className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{ backgroundColor: '#102418', borderColor: '#ef4444' }} className="rounded-lg p-6 border-l-4">
            <button
              onClick={() => deleteOrder(selectedOrder.id)}
              style={{ color: '#ef4444' }}
              className="font-bold hover:opacity-80"
            >
              Delete Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Create View
  if (view === 'create') {
    return (
      <div style={{ backgroundColor: '#0a1911' }} className="p-8 min-h-screen">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">Create New Order</h1>
            <button
              onClick={() => setView('list')}
              style={{ color: '#d7a859' }}
              className="px-4 py-2 rounded-lg font-bold hover:opacity-80"
            >
              ← Cancel
            </button>
          </div>

          <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Client Name *</label>
                <input
                  type="text"
                  value={newOrder.clientName || ''}
                  onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Email *</label>
                <input
                  type="email"
                  value={newOrder.email || ''}
                  onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  value={newOrder.phone || ''}
                  onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Event Type</label>
                <select
                  value={newOrder.eventType || 'wedding'}
                  onChange={(e) => setNewOrder({ ...newOrder, eventType: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                >
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate</option>
                  <option value="birthday">Birthday</option>
                  <option value="graduation">Graduation</option>
                  <option value="funeral">Funeral</option>
                  <option value="church">Church</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Event Date *</label>
                <input
                  type="date"
                  value={newOrder.eventDate || ''}
                  onChange={(e) => setNewOrder({ ...newOrder, eventDate: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Event Time</label>
                <input
                  type="time"
                  value={newOrder.eventTime || '18:00'}
                  onChange={(e) => setNewOrder({ ...newOrder, eventTime: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Guest Count</label>
                <input
                  type="number"
                  value={newOrder.guestCount || 50}
                  onChange={(e) => setNewOrder({ ...newOrder, guestCount: parseInt(e.target.value) })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Venue</label>
                <input
                  type="text"
                  value={newOrder.venue || ''}
                  onChange={(e) => setNewOrder({ ...newOrder, venue: e.target.value })}
                  placeholder="Venue name/address"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Special Requests/Notes</label>
              <textarea
                value={newOrder.specialRequests || ''}
                onChange={(e) => setNewOrder({ ...newOrder, specialRequests: e.target.value })}
                placeholder="Dietary restrictions, allergies, preferences..."
                rows={4}
                style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                className="w-full px-4 py-2 border-2 rounded-lg"
              />
            </div>

            <div style={{ borderTopColor: '#d7a859' }}>
              <button
                onClick={createOrder}
                style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                className="px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90"
              >
                <Plus className="w-5 h-5" /> Create Order
              </button>
              <button
                onClick={() => setView('list')}
                style={{ color: '#d7a859' }}
                className="px-6 py-3 rounded-lg font-bold hover:opacity-80"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
