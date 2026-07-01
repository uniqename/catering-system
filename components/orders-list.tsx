'use client';

interface Order {
  id: string;
  clientName: string;
  eventDate: string;
  guestCount: number;
  eventType: string;
  notes: string;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
  createdAt: string;
}

export default function OrdersList({
  orders,
  onUpdate,
}: {
  orders: Order[];
  onUpdate: (orders: Order[]) => void;
}) {
  const updateStatus = (id: string, newStatus: Order['status']) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o));
    onUpdate(updated);
  };

  const statusColors = {
    inquiry: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
  };

  const statusEmojis = {
    inquiry: '❓',
    quoted: '📄',
    confirmed: '✅',
    delivered: '🎉',
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-3xl mb-4">📭</p>
        <p className="text-gray-500 text-lg">No orders yet. Create your first inquiry!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{order.clientName}</h3>
              <p className="text-sm text-gray-500">
                📅 {order.eventDate} • 👥 {order.guestCount} guests • {order.eventType}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full font-bold ${statusColors[order.status]}`}>
              {statusEmojis[order.status]} {order.status.toUpperCase()}
            </span>
          </div>

          {order.notes && (
            <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded">💬 {order.notes}</p>
          )}

          <div className="flex gap-2 flex-wrap">
            <select
              value={order.status}
              onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="inquiry">❓ Inquiry</option>
              <option value="quoted">📄 Quoted</option>
              <option value="confirmed">✅ Confirmed</option>
              <option value="delivered">🎉 Delivered</option>
            </select>

            <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium text-sm">
              📝 Edit
            </button>
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium text-sm">
              🧾 Invoice
            </button>
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium text-sm">
              💬 Notes
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3">Created: {order.createdAt}</p>
        </div>
      ))}
    </div>
  );
}
