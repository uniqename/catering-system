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
    inquiry: { color: 'bg-emerald-600', badge: 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300', emoji: '💬' },
    quoted: { color: 'bg-amber-600', badge: 'bg-amber-900/30 border-amber-700/50 text-amber-300', emoji: '📄' },
    confirmed: { color: 'bg-cyan-600', badge: 'bg-cyan-900/30 border-cyan-700/50 text-cyan-300', emoji: '✅' },
    delivered: { color: 'bg-purple-600', badge: 'bg-purple-900/30 border-purple-700/50 text-purple-300', emoji: '🎉' },
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-6">📭</p>
        <p className="text-emerald-300 text-xl font-semibold mb-2">No orders yet</p>
        <p className="text-emerald-400">Start by creating your first inquiry!</p>
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
            className="border border-emerald-900/30 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-200 bg-gradient-to-br from-slate-900/50 to-slate-800/50 hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white">{order.clientName}</h3>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <span className="text-emerald-300">📅 {order.eventDate}</span>
                  <span className="text-emerald-300">👥 {order.guestCount} guests</span>
                  <span className="text-emerald-300 capitalize">{order.eventType}</span>
                </div>
              </div>
              <span className={`${status.color} text-white px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap ml-4`}>
                {status.emoji} {order.status.toUpperCase()}
              </span>
            </div>

            {order.notes && (
              <div className={`${status.badge} rounded-xl p-4 mb-5 border`}>
                <p className="font-semibold mb-1">💬 Client Notes:</p>
                <p className="text-emerald-200">{order.notes}</p>
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                className="px-4 py-2 border-2 border-emerald-700/30 rounded-lg text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-slate-800 text-white"
              >
                <option value="inquiry">💬 Inquiry</option>
                <option value="quoted">📄 Quoted</option>
                <option value="confirmed">✅ Confirmed</option>
                <option value="delivered">🎉 Delivered</option>
              </select>

              <button type="button" className="px-5 py-2 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg hover:shadow-lg font-bold text-sm transition">
                📝 Edit
              </button>
              <button type="button" className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg hover:shadow-lg font-bold text-sm transition">
                🧾 Invoice
              </button>
              <button type="button" className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-lg hover:shadow-lg font-bold text-sm transition">
                💬 Notes
              </button>
            </div>

            <p className="text-xs text-emerald-400 mt-4">📆 Created: {order.createdAt}</p>
          </div>
        );
      })},
    </div>
  );
}
