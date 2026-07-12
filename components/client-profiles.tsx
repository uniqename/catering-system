'use client';

import { useState } from 'react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastOrder: string;
  totalOrders: number;
  preferences: string;
}

export default function ClientProfiles({
  orders,
  onSelectClient,
}: {
  orders: any[];
  onSelectClient: (clientName: string) => void;
}) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Extract unique clients from orders
  const clientMap = new Map<string, any>();
  orders.forEach((order) => {
    if (!clientMap.has(order.clientName)) {
      clientMap.set(order.clientName, {
        id: order.clientName,
        name: order.clientName,
        email: '',
        phone: '',
        lastOrder: order.createdAt,
        totalOrders: 0,
        preferences: order.notes || '',
      });
    }
    const client = clientMap.get(order.clientName);
    client.totalOrders += 1;
  });

  const clients = Array.from(clientMap.values()).sort(
    (a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime()
  );

  const getClientOrders = (clientName: string) =>
    orders.filter((o) => o.clientName === clientName);

  const getClientStats = (clientName: string) => {
    const clientOrders = getClientOrders(clientName);
    const confirmed = clientOrders.filter((o) => o.status === 'confirmed').length;
    const delivered = clientOrders.filter((o) => o.status === 'delivered').length;
    return { confirmed, delivered, total: clientOrders.length };
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-6">👥</p>
        <p className="text-gray-600 text-xl font-semibold">No clients yet</p>
        <p className="text-gray-500">Create an order to start building your client list</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Client List */}
      <div className="lg:col-span-1">
        <h3 className="text-2xl font-black text-gray-900 mb-4">👥 Clients</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {clients.map((client) => {
            const stats = getClientStats(client.name);
            return (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client.name)}
                className={`w-full text-left p-4 rounded-xl transition border-2 ${
                  selectedClient === client.name
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-800 shadow-lg'
                    : 'bg-white border-teal-900 hover:border-amber-500 hover:shadow-md'
                }`}
              >
                <p className="font-bold text-sm">{client.name}</p>
                <p className={`text-xs ${selectedClient === client.name ? 'text-amber-50' : 'text-gray-500'}`}>
                  {stats.total} order{stats.total !== 1 ? 's' : ''} • {stats.delivered} delivered
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Client Details */}
      {selectedClient && (
        <div className="lg:col-span-2 space-y-6">
          {(() => {
            const client = clients.find((c) => c.name === selectedClient);
            const clientOrders = getClientOrders(selectedClient);
            const stats = getClientStats(selectedClient);

            return (
              <>
                {/* Client Header */}
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 border-2 border-amber-600">
                  <h2 className="text-3xl font-black text-gray-900">{client?.name}</h2>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-amber-900 text-sm font-bold uppercase">Total Orders</p>
                      <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                    </div>
                    <div>
                      <p className="text-emerald-900 text-sm font-bold uppercase">Confirmed</p>
                      <p className="text-3xl font-black text-gray-900">{stats.confirmed}</p>
                    </div>
                    <div>
                      <p className="text-teal-900 text-sm font-bold uppercase">Delivered</p>
                      <p className="text-3xl font-black text-gray-900">{stats.delivered}</p>
                    </div>
                  </div>
                </div>

                {/* Order History */}
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4">📋 Order History</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {clientOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl p-4 border-2 border-teal-900 hover:border-amber-500 transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-gray-900">{order.eventType}</p>
                            <p className="text-sm text-gray-600">📅 {order.eventDate} • 👥 {order.guestCount} guests</p>
                          </div>
                          <span className="px-2 py-1 bg-teal-100 text-teal-900 rounded text-xs font-bold">
                            {order.status}
                          </span>
                        </div>
                        {order.notes && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{order.notes}</p>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectClient(selectedClient)}
                          className="mt-3 px-3 py-1 bg-emerald-100 text-emerald-900 rounded hover:bg-emerald-200 text-xs font-bold transition"
                        >
                          🔄 Reorder
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Notes */}
                {client?.preferences && (
                  <div className="bg-teal-50 border-l-4 border-teal-900 p-4 rounded">
                    <p className="text-sm text-teal-900 font-bold mb-2">💡 Client Preferences:</p>
                    <p className="text-sm text-teal-800">{client.preferences}</p>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
