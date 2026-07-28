'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, Download, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
  budget?: string;
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

export default function RevenueAnalytics({
  orders,
  onBack
}: {
  orders: Order[];
  onBack: () => void;
}) {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year' | 'all'>('month');
  const [groupBy, setGroupBy] = useState<'type' | 'client' | 'status'>('type');

  const parseAmount = (budget: string | undefined): number => {
    if (!budget) return 0;
    const match = budget.match(/\d+(?:,\d{3})*(?:\.\d{2})?/);
    if (match) {
      return parseFloat(match[0].replace(/,/g, ''));
    }
    return 0;
  };

  const getDateRange = () => {
    const now = new Date();
    let start = new Date();

    switch (timeRange) {
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        start = new Date(0);
        break;
    }

    return { start, end: now };
  };

  const filteredOrders = useMemo(() => {
    const { start, end } = getDateRange();
    return orders.filter(order => {
      const eventDate = new Date(order.eventDate);
      return eventDate >= start && eventDate <= end;
    });
  }, [orders, timeRange]);

  const revenueData = useMemo(() => {
    const data: Record<string, { revenue: number; count: number; avgValue: number }> = {};

    const key = groupBy === 'type' ? 'eventType' : groupBy === 'client' ? 'clientName' : 'status';

    filteredOrders.forEach(order => {
      const groupKey = String(order[key as keyof Order]);
      const amount = parseAmount(order.budget);

      if (!data[groupKey]) {
        data[groupKey] = { revenue: 0, count: 0, avgValue: 0 };
      }

      data[groupKey].revenue += amount;
      data[groupKey].count += 1;
    });

    Object.keys(data).forEach(key => {
      data[key].avgValue = data[key].revenue / data[key].count;
    });

    return Object.entries(data)
      .map(([name, stats]) => ({
        name,
        ...stats
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, groupBy]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalEvents = filteredOrders.length;
  const avgEventValue = totalEvents > 0 ? totalRevenue / totalEvents : 0;

  const confirmedRevenue = filteredOrders
    .filter(o => o.status === 'confirmed')
    .reduce((sum, o) => sum + parseAmount(o.budget), 0);

  const pendingRevenue = filteredOrders
    .filter(o => o.status === 'quoted')
    .reduce((sum, o) => sum + parseAmount(o.budget), 0);

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-[#102418] rounded-lg transition"
            >
              <ChevronLeft style={{ color: '#d7a859' }} className="w-6 h-6" />
            </button>
            <div>
              <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">
                Revenue Analytics
              </h1>
              <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">
                Track your catering business performance and revenue trends
              </p>
            </div>
          </div>

          <button
            style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }}
            className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-[#102418] transition"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Total Revenue
            </p>
            <p style={{ color: '#d7a859' }} className="text-3xl font-black">
              ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
            <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">
              {timeRange === 'month' ? 'Last 30 days' : timeRange === 'quarter' ? 'Last 90 days' : timeRange === 'year' ? 'Last year' : 'All time'}
            </p>
          </div>

          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" /> Total Events
            </p>
            <p style={{ color: '#10B981' }} className="text-3xl font-black">
              {totalEvents}
            </p>
            <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">
              {totalEvents === 1 ? 'event' : 'events'} served
            </p>
          </div>

          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Avg Event Value
            </p>
            <p style={{ color: '#d7a859' }} className="text-3xl font-black">
              ${avgEventValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
            <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">
              average per event
            </p>
          </div>

          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
            <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Confirmed Revenue
            </p>
            <p style={{ color: '#10B981' }} className="text-3xl font-black">
              ${confirmedRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
            <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">
              locked in
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Analytics */}
          <div className="col-span-2 space-y-6">
            {/* Filters */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-3">
                    Time Range
                  </p>
                  <div className="space-y-2">
                    {(['month', 'quarter', 'year', 'all'] as const).map(range => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        style={{
                          backgroundColor: timeRange === range ? '#d7a859' : 'transparent',
                          color: timeRange === range ? '#0a1911' : '#d7a859',
                          borderColor: '#d7a859'
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm font-semibold transition hover:opacity-90"
                      >
                        {range === 'month' ? 'Last 30 Days' : range === 'quarter' ? 'Last 90 Days' : range === 'year' ? 'Last Year' : 'All Time'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-3">
                    Group By
                  </p>
                  <div className="space-y-2">
                    {(['type', 'client', 'status'] as const).map(group => (
                      <button
                        key={group}
                        onClick={() => setGroupBy(group)}
                        style={{
                          backgroundColor: groupBy === group ? '#d7a859' : 'transparent',
                          color: groupBy === group ? '#0a1911' : '#d7a859',
                          borderColor: '#d7a859'
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm font-semibold transition hover:opacity-90"
                      >
                        {group === 'type' ? 'Event Type' : group === 'client' ? 'By Client' : 'By Status'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown Table */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl border overflow-hidden">
              <div className="p-6 border-b" style={{ borderColor: 'rgba(215, 168, 89, 0.1)' }}>
                <h2 style={{ color: '#d7a859' }} className="font-bold text-lg">
                  Revenue Breakdown
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#0a1911', borderBottomColor: 'rgba(215, 168, 89, 0.1)' }} className="border-b">
                      <th style={{ color: '#d7a859' }} className="text-left py-4 px-6 font-bold text-sm">
                        {groupBy === 'type' ? 'Event Type' : groupBy === 'client' ? 'Client Name' : 'Status'}
                      </th>
                      <th style={{ color: '#d7a859' }} className="text-right py-4 px-6 font-bold text-sm">
                        Revenue
                      </th>
                      <th style={{ color: '#d7a859' }} className="text-right py-4 px-6 font-bold text-sm">
                        Events
                      </th>
                      <th style={{ color: '#d7a859' }} className="text-right py-4 px-6 font-bold text-sm">
                        Avg Value
                      </th>
                      <th style={{ color: '#d7a859' }} className="text-right py-4 px-6 font-bold text-sm">
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <p style={{ color: '#a8d5ca' }}>No revenue data for selected range</p>
                        </td>
                      </tr>
                    ) : (
                      revenueData.map((item, idx) => (
                        <tr
                          key={idx}
                          style={{ borderBottomColor: 'rgba(215, 168, 89, 0.05)' }}
                          className="border-b hover:bg-[#102418] transition"
                        >
                          <td style={{ color: '#ffffff' }} className="py-4 px-6 font-semibold text-sm capitalize">
                            {item.name}
                          </td>
                          <td style={{ color: '#d7a859' }} className="text-right py-4 px-6 font-bold text-sm">
                            ${item.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                          </td>
                          <td style={{ color: '#a8d5ca' }} className="text-right py-4 px-6 text-sm">
                            {item.count}
                          </td>
                          <td style={{ color: '#a8d5ca' }} className="text-right py-4 px-6 text-sm">
                            ${item.avgValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="text-right py-4 px-6 text-sm">
                            <div className="flex items-center justify-end gap-2">
                              <div style={{ backgroundColor: '#102418', width: '60px', height: '24px' }} className="rounded-lg overflow-hidden">
                                <div
                                  style={{
                                    backgroundColor: '#d7a859',
                                    width: `${totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0}%`,
                                    height: '100%'
                                  }}
                                  className="transition-all"
                                ></div>
                              </div>
                              <span style={{ color: '#d7a859' }} className="font-bold w-10 text-right">
                                {totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 100) : 0}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Confirmed vs Pending */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-6">
                Revenue Pipeline
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p style={{ color: '#a8d5ca' }} className="text-sm">
                      Confirmed
                    </p>
                    <p style={{ color: '#10B981' }} className="font-bold text-sm">
                      ${confirmedRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#102418', height: '8px' }} className="rounded-full overflow-hidden">
                    <div
                      style={{
                        backgroundColor: '#10B981',
                        width: `${totalRevenue > 0 ? (confirmedRevenue / totalRevenue) * 100 : 0}%`,
                        height: '100%'
                      }}
                      className="rounded-full"
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p style={{ color: '#a8d5ca' }} className="text-sm">
                      Pending (Quoted)
                    </p>
                    <p style={{ color: '#f59e0b' }} className="font-bold text-sm">
                      ${pendingRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#102418', height: '8px' }} className="rounded-full overflow-hidden">
                    <div
                      style={{
                        backgroundColor: '#f59e0b',
                        width: `${totalRevenue > 0 ? (pendingRevenue / totalRevenue) * 100 : 0}%`,
                        height: '100%'
                      }}
                      className="rounded-full"
                    ></div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.1)' }} className="border rounded-lg p-4 mt-6">
                <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                  Conversion Rate
                </p>
                <p style={{ color: '#d7a859' }} className="text-2xl font-black">
                  {totalEvents > 0 ? Math.round((confirmedRevenue / totalRevenue) * 100) : 0}%
                </p>
                <p style={{ color: '#a8d5ca' }} className="text-xs mt-1">
                  of quoted events confirmed
                </p>
              </div>
            </div>

            {/* Top 3 Items */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-4">
                Top 3 by Revenue
              </h3>

              <div className="space-y-3">
                {revenueData.slice(0, 3).map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#0a1911' }} className="rounded-lg p-3">
                    <div className="flex items-start justify-between mb-1">
                      <p style={{ color: '#ffffff' }} className="font-semibold text-sm capitalize">
                        {item.name}
                      </p>
                      <p style={{ color: '#d7a859' }} className="font-bold text-sm">
                        #{idx + 1}
                      </p>
                    </div>
                    <p style={{ color: '#d7a859' }} className="font-bold mb-2">
                      ${item.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                    <p style={{ color: '#a8d5ca' }} className="text-xs">
                      {item.count} {item.count === 1 ? 'event' : 'events'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-4">
                Quick Insights
              </h3>

              <div className="space-y-3">
                {revenueData.length > 0 && (
                  <>
                    <div style={{ backgroundColor: '#0a1911' }} className="rounded-lg p-3">
                      <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-1">
                        Most Profitable
                      </p>
                      <p style={{ color: '#d7a859' }} className="font-bold capitalize">
                        {revenueData[0].name}
                      </p>
                    </div>

                    {revenueData.length > 1 && (
                      <div style={{ backgroundColor: '#0a1911' }} className="rounded-lg p-3">
                        <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-1">
                          Highest Avg Value
                        </p>
                        <p style={{ color: '#d7a859' }} className="font-bold capitalize">
                          {[...revenueData].sort((a, b) => b.avgValue - a.avgValue)[0].name}
                        </p>
                      </div>
                    )}

                    <div style={{ backgroundColor: '#0a1911' }} className="rounded-lg p-3">
                      <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-1">
                        Total Bookings
                      </p>
                      <p style={{ color: '#10B981' }} className="font-bold">
                        {totalEvents} events
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
