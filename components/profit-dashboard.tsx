'use client';

interface MenuItem {
  name: string;
  qty: number;
  price: number;
  cost?: number;
}

interface Order {
  id: string;
  status: string;
  items?: MenuItem[];
}

export default function ProfitDashboard({ orders }: { orders: any[] }) {
  // Sample menu items for demo (in real version, would come from separate menu database)
  const menuCosts: { [key: string]: number } = {
    'Jollof Rice': 5,
    'Fried Rice': 4.5,
    'Coleslaw': 1.5,
    'Fried Plantains': 2,
    'Chicken': 6,
    'Fish': 7,
    'Dumplings': 3,
    'Pies': 2,
  };

  // Calculate metrics from invoice data
  const calculateStats = () => {
    const items: { [key: string]: { qty: number; revenue: number; cost: number } } = {};

    orders.forEach((order) => {
      // This is simplified - in real version you'd have item-level detail
      // For now, estimate from event type
      const baseItems = estimateItemsFromEvent(order);
      baseItems.forEach((item) => {
        if (!items[item.name]) {
          items[item.name] = { qty: 0, revenue: 0, cost: 0 };
        }
        items[item.name].qty += item.qty;
        items[item.name].revenue += item.qty * item.price;
        items[item.name].cost += item.qty * (menuCosts[item.name] || item.price * 0.3);
      });
    });

    return Object.entries(items).map(([name, stats]) => ({
      name,
      qty: stats.qty,
      revenue: stats.revenue,
      cost: stats.cost,
      margin: stats.revenue - stats.cost,
      marginPercent: ((stats.revenue - stats.cost) / stats.revenue) * 100,
    }));
  };

  const estimateItemsFromEvent = (order: any) => {
    // Simple estimation based on event type and guest count
    const guests = parseInt(order.guestCount) || 50;
    const items = [
      { name: 'Jollof Rice', qty: Math.ceil(guests / 3), price: 8 },
      { name: 'Fried Rice', qty: Math.ceil(guests / 3), price: 8 },
      { name: 'Chicken', qty: Math.ceil(guests / 4), price: 12 },
    ];
    return items;
  };

  const stats = calculateStats();
  const totalRevenue = stats.reduce((sum, item) => sum + item.revenue, 0);
  const totalCost = stats.reduce((sum, item) => sum + item.cost, 0);
  const totalMargin = totalRevenue - totalCost;
  const avgMarginPercent = stats.length > 0 ? stats.reduce((sum, item) => sum + item.marginPercent, 0) / stats.length : 0;

  const topItems = [...stats].sort((a, b) => b.margin - a.margin).slice(0, 5);

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-6">📊</p>
        <p className="text-gray-600 text-xl font-semibold">No data yet</p>
        <p className="text-gray-500">Create some orders to see profit analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border-2 border-teal-900">
          <p className="text-teal-900 text-sm font-bold uppercase tracking-wide">Total Revenue</p>
          <p className="text-4xl font-black text-teal-900 mt-2">${totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-600">
          <p className="text-amber-900 text-sm font-bold uppercase tracking-wide">Total Cost</p>
          <p className="text-4xl font-black text-amber-900 mt-2">${totalCost.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border-2 border-emerald-700">
          <p className="text-emerald-900 text-sm font-bold uppercase tracking-wide">Total Profit</p>
          <p className="text-4xl font-black text-emerald-900 mt-2">${totalMargin.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border-2 border-amber-600">
          <p className="text-amber-900 text-sm font-bold uppercase tracking-wide">Avg Margin</p>
          <p className="text-4xl font-black text-amber-900 mt-2">{avgMarginPercent.toFixed(0)}%</p>
        </div>
      </div>

      {/* Top Performing Items */}
      <div className="bg-white rounded-2xl border-2 border-teal-900 p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">⭐ Top Profit Makers</h2>
        <div className="space-y-4">
          {topItems.map((item, index) => (
            <div key={item.name} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black flex items-center justify-center text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="font-black text-green-600">${item.margin.toFixed(2)} profit</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-900 to-emerald-700 h-2 rounded-full"
                      style={{ width: `${Math.min(item.marginPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm font-bold text-gray-600 w-12 text-right">{item.marginPercent.toFixed(0)}%</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {item.qty} sold • ${item.revenue.toFixed(2)} revenue • ${item.cost.toFixed(2)} cost
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Items */}
      <div className="bg-white rounded-2xl border-2 border-teal-900 p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">📊 All Items Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-teal-900">
                <th className="text-left py-3 font-bold text-gray-900">Item</th>
                <th className="text-center py-3 font-bold text-gray-900">Sold</th>
                <th className="text-right py-3 font-bold text-gray-900">Revenue</th>
                <th className="text-right py-3 font-bold text-gray-900">Cost</th>
                <th className="text-right py-3 font-bold text-green-700">Profit</th>
                <th className="text-right py-3 font-bold text-purple-700">Margin %</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((item) => (
                <tr key={item.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 font-semibold text-gray-900">{item.name}</td>
                  <td className="text-center text-gray-600">{item.qty}</td>
                  <td className="text-right text-gray-600">${item.revenue.toFixed(2)}</td>
                  <td className="text-right text-gray-600">${item.cost.toFixed(2)}</td>
                  <td className="text-right font-bold text-emerald-700">${item.margin.toFixed(2)}</td>
                  <td className="text-right">
                    <span className="font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                      {item.marginPercent.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pro Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-600 p-6 rounded-xl">
        <p className="text-sm text-amber-900 font-bold mb-2">💡 Smart Pricing Tips:</p>
        <ul className="text-sm text-amber-900 space-y-1">
          <li>✅ Your highest-margin items: {topItems[0]?.name} ({topItems[0]?.marginPercent.toFixed(0)}%)</li>
          <li>📈 Focus on high-margin items to boost overall profits</li>
          <li>🎯 Consider bundling low-margin items with high-margin ones</li>
          <li>💰 Current average margin: {avgMarginPercent.toFixed(0)}% - aim for 60%+</li>
        </ul>
      </div>
    </div>
  );
}
