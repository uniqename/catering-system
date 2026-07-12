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

  const statusConfig = {
    inquiry: { color: 'bg-amber-500', lightBg: 'bg-amber-50', text: 'text-amber-900', emoji: '❓' },
    quoted: { color: 'bg-teal-900', lightBg: 'bg-teal-50', text: 'text-teal-900', emoji: '📄' },
    confirmed: { color: 'bg-emerald-700', lightBg: 'bg-emerald-50', text: 'text-emerald-900', emoji: '✅' },
    delivered: { color: 'bg-amber-500', lightBg: 'bg-amber-50', text: 'text-amber-900', emoji: '🎉' },
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-6">📭</p>
        <p className="text-gray-600 text-xl font-semibold mb-2">No orders yet</p>
        <p className="text-gray-500">Start by creating your first inquiry!</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => {
        const status = statusConfig[order.status];
        return (
          <div
            key={order.id}
            className="border-2 border-teal-900 rounded-2xl p-6 hover:shadow-xl hover:border-amber-500 transition-all duration-200 bg-gradient-to-br from-white to-emerald-50"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900">{order.clientName}</h3>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <span className="text-gray-600">📅 {order.eventDate}</span>
                  <span className="text-gray-600">👥 {order.guestCount} guests</span>
                  <span className="text-gray-600 capitalize">{order.eventType}</span>
                </div>
              </div>
              <span className={`${status.color} text-white px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap ml-4`}>
                {status.emoji} {order.status.toUpperCase()}
              </span>
            </div>

            {order.notes && (
              <div className={`${status.lightBg} ${status.text} rounded-xl p-4 mb-5 border border-opacity-20 border-gray-300`}>
                <p className="font-semibold mb-1">💬 Client Notes:</p>
                <p>{order.notes}</p>
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <select
                aria-label="Update order status"
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                className="px-4 py-2 border-2 border-teal-900 rounded-lg text-sm font-bold focus:ring-2 focus:ring-teal-900 focus:border-transparent transition bg-white"
              >
                <option value="inquiry">❓ Inquiry</option>
                <option value="quoted">📄 Quoted</option>
                <option value="confirmed">✅ Confirmed</option>
                <option value="delivered">🎉 Delivered</option>
              </select>

              <button type="button" className="px-5 py-2 bg-gradient-to-r from-teal-800 to-teal-900 text-white rounded-lg hover:shadow-lg font-bold text-sm transition">
                📝 Edit
              </button>
              <button type="button" className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg font-bold text-sm transition">
                🧾 Invoice
              </button>
              <button type="button" className="px-5 py-2 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-lg hover:shadow-lg font-bold text-sm transition">
                💬 Notes
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-4">📆 Created: {order.createdAt}</p>
          </div>
        );
      })}
    </div>
  );
}
