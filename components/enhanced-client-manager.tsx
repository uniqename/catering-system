'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Phone, Mail, MapPin, History } from 'lucide-react';

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  preferences: string;
  notes: string;
  totalSpent: number;
  eventCount: number;
  lastEventDate: string;
  createdAt: string;
}

export default function EnhancedClientManager({ orders = [] }: { orders?: any[] }) {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [editingClient, setEditingClient] = useState<Partial<ClientProfile> | null>(null);
  const [view, setView] = useState<'list' | 'profile' | 'edit' | 'new'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  const [newClient, setNewClient] = useState<Partial<ClientProfile>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    preferences: '',
    notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('catering_clients_enhanced');
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      // Initialize with demo clients
      const demoClients: ClientProfile[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '(555) 123-4567',
          address: '456 Oak Street',
          city: 'Atlanta',
          state: 'GA',
          zipCode: '30301',
          preferences: 'Vegetarian options preferred',
          notes: 'Very organized, likes regular communication',
          totalSpent: 4200,
          eventCount: 1,
          lastEventDate: '2026-07-25',
          createdAt: '2026-07-01',
        },
        {
          id: '2',
          name: 'Michael Brown',
          email: 'michael@company.com',
          phone: '(555) 987-6543',
          address: '789 Business Ave',
          city: 'Atlanta',
          state: 'GA',
          zipCode: '30302',
          preferences: 'Corporate standard menu',
          notes: 'Repeat client, handles everything through email',
          totalSpent: 2625,
          eventCount: 1,
          lastEventDate: '2026-08-10',
          createdAt: '2026-06-28',
        },
      ];
      setClients(demoClients);
      localStorage.setItem('catering_clients_enhanced', JSON.stringify(demoClients));
    }
  }, []);

  const saveClients = (updated: ClientProfile[]) => {
    setClients(updated);
    localStorage.setItem('catering_clients_enhanced', JSON.stringify(updated));
  };

  const addClient = () => {
    if (!newClient.name || !newClient.email) {
      alert('Name and email are required');
      return;
    }

    const client: ClientProfile = {
      id: `cli_${Date.now()}`,
      name: newClient.name as string,
      email: newClient.email as string,
      phone: newClient.phone as string || '',
      address: newClient.address as string || '',
      city: newClient.city as string || '',
      state: newClient.state as string || '',
      zipCode: newClient.zipCode as string || '',
      preferences: newClient.preferences as string || '',
      notes: newClient.notes as string || '',
      totalSpent: 0,
      eventCount: 0,
      lastEventDate: '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    saveClients([client, ...clients]);
    setNewClient({ name: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', preferences: '', notes: '' });
    setView('list');
  };

  const updateClient = () => {
    if (!editingClient || !editingClient.id) return;

    const updated = clients.map(c => c.id === editingClient.id ? { ...c, ...editingClient } as ClientProfile : c);
    saveClients(updated);
    setEditingClient(null);
    setView('profile');
  };

  const deleteClient = (id: string) => {
    if (confirm('Are you sure? This will delete all client data.')) {
      saveClients(clients.filter(c => c.id !== id));
      setView('list');
    }
  };

  const clientOrders = selectedClient ? orders.filter(o => o.clientName === selectedClient.name) : [];
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.includes(searchTerm));

  // List View
  if (view === 'list') {
    return (
      <div style={{ backgroundColor: '#0a1911' }} className="p-8 min-h-screen">
        <div className="max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">Client Management</h1>
            <button
              onClick={() => setView('new')}
              style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
              className="px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90"
            >
              <Plus className="w-5 h-5" /> New Client
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ backgroundColor: '#102418', borderColor: '#d7a859', color: 'white' }}
            className="w-full px-4 py-3 border-2 rounded-lg mb-6"
          />

          {/* Clients Grid */}
          {filteredClients.length === 0 ? (
            <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-12 text-center">
              <p style={{ color: '#a8d5ca' }} className="text-lg mb-4">No clients found</p>
              <button
                onClick={() => setView('new')}
                style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                className="px-6 py-2 rounded-lg font-bold hover:opacity-90"
              >
                Add First Client
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredClients.map(client => (
                <div key={client.id} style={{ backgroundColor: '#102418' }} className="rounded-lg p-6 cursor-pointer hover:shadow-lg transition">
                  <div onClick={() => { setSelectedClient(client); setView('profile'); }}>
                    <h3 style={{ color: '#d7a859' }} className="text-xl font-bold mb-2">{client.name}</h3>
                    <div style={{ color: '#a8d5ca' }} className="space-y-1 text-sm mb-4">
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {client.email}</p>
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {client.phone || 'N/A'}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {client.city}, {client.state || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ borderTopColor: '#d7a859' }} className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t-2">
                    <div>
                      <p style={{ color: '#a8d5ca' }} className="text-xs">Total Spent</p>
                      <p style={{ color: '#d7a859' }} className="font-bold">${client.totalSpent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p style={{ color: '#a8d5ca' }} className="text-xs">Events</p>
                      <p style={{ color: '#d7a859' }} className="font-bold">{client.eventCount}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedClient(client); setView('profile'); }}
                      style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                      className="flex-1 px-3 py-2 rounded font-semibold text-sm hover:opacity-90"
                    >
                      View
                    </button>
                    <button
                      onClick={() => { setEditingClient(client); setView('edit'); }}
                      style={{ color: '#d7a859' }}
                      className="p-2 hover:bg-[#102418] rounded"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      style={{ color: '#ef4444' }}
                      className="p-2 hover:bg-[#102418] rounded"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Profile View
  if (view === 'profile' && selectedClient) {
    return (
      <div style={{ backgroundColor: '#0a1911' }} className="p-8 min-h-screen">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">{selectedClient.name}</h1>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingClient(selectedClient); setView('edit'); }}
                style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                className="px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => setView('list')}
                style={{ color: '#d7a859' }}
                className="px-4 py-2 rounded-lg font-bold hover:opacity-80"
              >
                ← Back
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Contact Info */}
            <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-6">
              <h2 style={{ color: '#d7a859' }} className="font-bold mb-4">Contact Information</h2>
              <div style={{ color: '#a8d5ca' }} className="space-y-3">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {selectedClient.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {selectedClient.phone || 'N/A'}</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {selectedClient.address || 'N/A'}</p>
                {selectedClient.city && <p style={{ color: '#a8d5ca' }} className="text-sm">{selectedClient.city}, {selectedClient.state} {selectedClient.zipCode}</p>}
              </div>
            </div>

            {/* Business Stats */}
            <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-6">
              <h2 style={{ color: '#d7a859' }} className="font-bold mb-4">Client History</h2>
              <div style={{ color: '#a8d5ca' }} className="space-y-3">
                <div>
                  <p className="text-sm">Total Spent</p>
                  <p style={{ color: '#d7a859' }} className="text-2xl font-bold">${selectedClient.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm">Number of Events</p>
                  <p style={{ color: '#d7a859' }} className="text-2xl font-bold">{selectedClient.eventCount}</p>
                </div>
                <div>
                  <p className="text-sm">Last Event</p>
                  <p style={{ color: '#d7a859' }} className="font-bold">{selectedClient.lastEventDate ? new Date(selectedClient.lastEventDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences & Notes */}
          {(selectedClient.preferences || selectedClient.notes) && (
            <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-6 mb-8">
              {selectedClient.preferences && (
                <div className="mb-4">
                  <h3 style={{ color: '#d7a859' }} className="font-bold mb-2">Preferences</h3>
                  <p style={{ color: '#a8d5ca' }}>{selectedClient.preferences}</p>
                </div>
              )}
              {selectedClient.notes && (
                <div>
                  <h3 style={{ color: '#d7a859' }} className="font-bold mb-2">Notes</h3>
                  <p style={{ color: '#a8d5ca' }}>{selectedClient.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Order History */}
          <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-6">
            <h2 style={{ color: '#d7a859' }} className="font-bold mb-4 flex items-center gap-2">
              <History className="w-5 h-5" /> Order History
            </h2>
            {clientOrders.length === 0 ? (
              <p style={{ color: '#a8d5ca' }}>No orders yet</p>
            ) : (
              <div className="space-y-3">
                {clientOrders.map(order => (
                  <div key={order.id} style={{ backgroundColor: '#0a1911', borderLeftColor: '#d7a859' }} className="border-l-4 p-4 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ color: '#d7a859' }} className="font-bold">{order.eventType} - {order.guestCount} guests</p>
                        <p style={{ color: '#a8d5ca' }} className="text-sm">{new Date(order.eventDate).toLocaleDateString()}</p>
                      </div>
                      <span style={{ backgroundColor: '#d7a859', color: '#0a1911' }} className="px-3 py-1 rounded font-semibold text-sm capitalize">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Edit View
  if (view === 'edit' && editingClient) {
    return (
      <div style={{ backgroundColor: '#0a1911' }} className="p-8 min-h-screen">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">Edit Client</h1>
            <button
              onClick={() => setView('profile')}
              style={{ color: '#d7a859' }}
              className="px-4 py-2 rounded-lg font-bold hover:opacity-80"
            >
              ← Cancel
            </button>
          </div>

          <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={editingClient.name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={editingClient.email || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  value={editingClient.phone || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">City</label>
                <input
                  type="text"
                  value={editingClient.city || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, city: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">State</label>
                <input
                  type="text"
                  value={editingClient.state || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, state: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={editingClient.zipCode || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, zipCode: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Address</label>
              <input
                type="text"
                value={editingClient.address || ''}
                onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                className="w-full px-4 py-2 border-2 rounded-lg"
              />
            </div>

            <div>
              <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Preferences</label>
              <textarea
                value={editingClient.preferences || ''}
                onChange={(e) => setEditingClient({ ...editingClient, preferences: e.target.value })}
                placeholder="Dietary preferences, allergies, etc."
                rows={3}
                style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                className="w-full px-4 py-2 border-2 rounded-lg"
              />
            </div>

            <div>
              <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Notes</label>
              <textarea
                value={editingClient.notes || ''}
                onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                placeholder="Internal notes about this client"
                rows={3}
                style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                className="w-full px-4 py-2 border-2 rounded-lg"
              />
            </div>

            <div className="flex gap-3 pt-6 border-t-2" style={{ borderTopColor: '#d7a859' }}>
              <button
                onClick={updateClient}
                style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                className="px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90"
              >
                <Save className="w-5 h-5" /> Save Changes
              </button>
              <button
                onClick={() => setView('profile')}
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

  // New Client View
  if (view === 'new') {
    return (
      <div style={{ backgroundColor: '#0a1911' }} className="p-8 min-h-screen">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">Add New Client</h1>
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
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Name *</label>
                <input
                  type="text"
                  value={newClient.name || ''}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Client full name"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Email *</label>
                <input
                  type="email"
                  value={newClient.email || ''}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="client@example.com"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  value={newClient.phone || ''}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">City</label>
                <input
                  type="text"
                  value={newClient.city || ''}
                  onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                  placeholder="City"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">State</label>
                <input
                  type="text"
                  value={newClient.state || ''}
                  onChange={(e) => setNewClient({ ...newClient, state: e.target.value })}
                  placeholder="State"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={newClient.zipCode || ''}
                  onChange={(e) => setNewClient({ ...newClient, zipCode: e.target.value })}
                  placeholder="ZIP Code"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Address</label>
              <input
                type="text"
                value={newClient.address || ''}
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                placeholder="Street address"
                style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                className="w-full px-4 py-2 border-2 rounded-lg"
              />
            </div>

            <div>
              <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Preferences</label>
              <textarea
                value={newClient.preferences || ''}
                onChange={(e) => setNewClient({ ...newClient, preferences: e.target.value })}
                placeholder="Dietary preferences, allergies, special requests..."
                rows={3}
                style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                className="w-full px-4 py-2 border-2 rounded-lg"
              />
            </div>

            <div>
              <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Notes</label>
              <textarea
                value={newClient.notes || ''}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                placeholder="Internal notes..."
                rows={3}
                style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                className="w-full px-4 py-2 border-2 rounded-lg"
              />
            </div>

            <div className="flex gap-3 pt-6 border-t-2" style={{ borderTopColor: '#d7a859' }}>
              <button
                onClick={addClient}
                style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                className="px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90"
              >
                <Plus className="w-5 h-5" /> Create Client
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
