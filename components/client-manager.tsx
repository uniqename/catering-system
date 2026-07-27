'use client';

import { useState, useEffect } from 'react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastOrder?: string;
  totalOrders: number;
  preferences?: string;
}

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: string;
}

export default function ClientManager({ orders = [] }: { orders?: Order[] }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<Client>>({});
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('catering_clients');
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      // Extract from orders
      const clientMap = new Map<string, Client>();
      orders.forEach(order => {
        if (!clientMap.has(order.clientName)) {
          clientMap.set(order.clientName, {
            id: order.clientName.toLowerCase().replace(/\s+/g, '-'),
            name: order.clientName,
            email: '',
            phone: '',
            lastOrder: order.eventDate,
            totalOrders: 0,
            preferences: '',
          });
        }
        const client = clientMap.get(order.clientName)!;
        client.totalOrders += 1;
      });
      const newClients = Array.from(clientMap.values());
      setClients(newClients);
      localStorage.setItem('catering_clients', JSON.stringify(newClients));
    }
  }, [orders]);

  const saveClients = (updated: Client[]) => {
    setClients(updated);
    localStorage.setItem('catering_clients', JSON.stringify(updated));
  };

  const addClient = () => {
    if (!newClient.name) {
      alert('Please enter a client name');
      return;
    }
    const client: Client = {
      id: newClient.name.toLowerCase().replace(/\s+/g, '-'),
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      totalOrders: 0,
      preferences: '',
    };
    saveClients([client, ...clients]);
    setNewClient({ name: '', email: '', phone: '' });
    setShowNewForm(false);
  };

  const updateClient = () => {
    if (!selectedClient) return;
    const updated = clients.map(c =>
      c.id === selectedClient.id ? { ...selectedClient, ...editData } : c
    );
    saveClients(updated);
    setSelectedClient({ ...selectedClient, ...editData });
    setEditMode(false);
  };

  const deleteClient = (id: string) => {
    if (confirm('Delete this client?')) {
      saveClients(clients.filter(c => c.id !== id));
      if (selectedClient?.id === id) {
        setSelectedClient(null);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Clients ({clients.length})</h2>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition"
        >
          + Add Client
        </button>
      </div>

      {/* New Client Form */}
      {showNewForm && (
        <div className="bg-slate-900/50 border-2 border-emerald-700/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">New Client</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name *"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="px-4 py-2 border-2 border-emerald-700/30 bg-slate-800 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              className="px-4 py-2 border-2 border-emerald-700/30 bg-slate-800 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              className="px-4 py-2 border-2 border-emerald-700/30 bg-slate-800 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addClient}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
            >
              Save Client
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-emerald-300 rounded-lg font-bold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Clients List & Details */}
      <div className="grid grid-cols-3 gap-6">
        {/* Client List */}
        <div className="bg-slate-900/50 rounded-2xl border-2 border-emerald-700/30 p-6">
          <h3 className="font-bold text-lg text-white mb-4">All Clients</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {clients.length === 0 ? (
              <p className="text-emerald-400 text-center py-8">No clients yet</p>
            ) : (
              clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => {
                    setSelectedClient(client);
                    setEditMode(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition border-2 ${
                    selectedClient?.id === client.id
                      ? 'bg-amber-600 text-white border-amber-500 font-bold'
                      : 'bg-slate-800 border-emerald-700/30 hover:border-amber-500 text-emerald-300 hover:text-emerald-200'
                  }`}
                >
                  <p className="font-semibold">{client.name}</p>
                  <p className="text-xs text-emerald-400">{client.totalOrders} order{client.totalOrders !== 1 ? 's' : ''}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Client Details */}
        {selectedClient && (
          <div className="col-span-2 bg-slate-900/50 rounded-2xl border-2 border-emerald-700/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{selectedClient.name}</h3>
              <div className="flex gap-2">
                {!editMode ? (
                  <>
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setEditData(selectedClient);
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteClient(selectedClient.id)}
                      className="px-4 py-2 bg-red-900/30 border border-red-700/50 text-red-300 hover:bg-red-900/50 rounded-lg font-bold transition"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={updateClient}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-emerald-300 rounded-lg font-bold transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-emerald-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-emerald-700/30 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-emerald-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-emerald-700/30 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-emerald-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-emerald-700/30 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-emerald-300 mb-2">Preferences & Notes</label>
                  <textarea
                    value={editData.preferences || ''}
                    onChange={(e) => setEditData({ ...editData, preferences: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-emerald-700/30 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4">
                    <p className="text-xs font-bold text-emerald-400 uppercase">Total Orders</p>
                    <p className="text-2xl font-black text-amber-400 mt-1">{selectedClient.totalOrders}</p>
                  </div>
                  <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4">
                    <p className="text-xs font-bold text-emerald-400 uppercase">Last Order</p>
                    <p className="text-lg font-bold text-emerald-300 mt-1">{selectedClient.lastOrder || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
                  <p className="text-sm font-bold text-amber-400 mb-2">📧 Email</p>
                  <p className="text-sm text-amber-300">{selectedClient.email || 'Not set'}</p>
                </div>

                <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-4">
                  <p className="text-sm font-bold text-emerald-400 mb-2">📱 Phone</p>
                  <p className="text-sm text-emerald-300">{selectedClient.phone || 'Not set'}</p>
                </div>

                {selectedClient.preferences && (
                  <div className="bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-4">
                    <p className="text-sm font-bold text-cyan-400 mb-2">💡 Preferences & Notes</p>
                    <p className="text-sm text-cyan-300">{selectedClient.preferences}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
