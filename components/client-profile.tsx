'use client';

import { useState } from 'react';
import { ChevronLeft, Mail, Phone, Calendar, DollarSign, FileText } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

export default function ClientProfile({
  clientName,
  orders,
  onBack,
  onViewInquiry
}: {
  clientName: string;
  orders: Order[];
  onBack: () => void;
  onViewInquiry: (id: string) => void;
}) {
  const clientOrders = orders.filter(o => o.clientName === clientName);
  const lifetimeValue = clientOrders.filter(o => o.status === 'confirmed' || o.status === 'delivered').length * 2500; // Estimate
  const totalEvents = clientOrders.length;
  const confirmedEvents = clientOrders.filter(o => o.status === 'confirmed' || o.status === 'delivered').length;

  const [notes, setNotes] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      inquiry: '#10B981',
      quoted: '#f59e0b',
      confirmed: '#10B981',
      delivered: '#10B981'
    };
    return colors[status] || '#10B981';
  };

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#102418] rounded-lg transition"
          >
            <ChevronLeft style={{ color: '#d7a859' }} className="w-6 h-6" />
          </button>
          <div>
            <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">
              {clientName}
            </h1>
            <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">
              Client Profile
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
                <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                  Lifetime Value
                </p>
                <p style={{ color: '#d7a859' }} className="text-3xl font-black">
                  ${lifetimeValue.toLocaleString()}
                </p>
                <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">
                  {confirmedEvents} confirmed events
                </p>
              </div>

              <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
                <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                  Total Events
                </p>
                <p style={{ color: '#d7a859' }} className="text-3xl font-black">
                  {totalEvents}
                </p>
                <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">
                  {clientOrders.filter(o => o.status === 'inquiry').length} inquiries
                </p>
              </div>

              <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
                <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                  Avg. Guest Count
                </p>
                <p style={{ color: '#d7a859' }} className="text-3xl font-black">
                  {totalEvents > 0 ? Math.round(clientOrders.reduce((sum, o) => sum + o.guestCount, 0) / totalEvents) : 0}
                </p>
                <p style={{ color: '#a8d5ca' }} className="text-xs mt-2">
                  per event
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail style={{ color: '#d7a859' }} className="w-4 h-4" />
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide">
                      Email
                    </p>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Add email address"
                    style={{
                      backgroundColor: '#0a1911',
                      borderColor: 'rgba(215, 168, 89, 0.2)',
                      color: '#ffffff'
                    }}
                    className="w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone style={{ color: '#d7a859' }} className="w-4 h-4" />
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide">
                      Phone
                    </p>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Add phone number"
                    style={{
                      backgroundColor: '#0a1911',
                      borderColor: 'rgba(215, 168, 89, 0.2)',
                      color: '#ffffff'
                    }}
                    className="w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Event History */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">
                Event History ({totalEvents})
              </h2>

              <div className="space-y-3">
                {clientOrders.length === 0 ? (
                  <p style={{ color: '#a8d5ca' }} className="text-sm text-center py-8">
                    No events yet
                  </p>
                ) : (
                  clientOrders
                    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
                    .map(order => (
                      <button
                        key={order.id}
                        onClick={() => onViewInquiry(order.id)}
                        style={{ backgroundColor: '#0a1911' }}
                        className="w-full p-4 rounded-lg hover:bg-[#102418] transition text-left border border-transparent hover:border-[#d7a859]"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p style={{ color: '#d7a859' }} className="font-bold">
                              {order.eventType.charAt(0).toUpperCase() + order.eventType.slice(1)}
                            </p>
                            <p style={{ color: '#a8d5ca' }} className="text-xs mt-1">
                              {new Date(order.eventDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })} • {order.guestCount} guests
                            </p>
                          </div>
                          <span
                            style={{ backgroundColor: getStatusColor(order.status), color: '#0a1911' }}
                            className="text-xs font-bold px-3 py-1 rounded flex-shrink-0"
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </button>
                    ))
                )}
              </div>
            </div>

            {/* Notes */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">
                Notes
              </h2>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this client, preferences, communication history, etc."
                style={{
                  backgroundColor: '#0a1911',
                  borderColor: 'rgba(215, 168, 89, 0.2)',
                  color: '#ffffff'
                }}
                className="w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition resize-none h-32"
              />

              <button
                style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                className="mt-3 w-full py-2 font-bold rounded-lg transition hover:opacity-90 text-sm"
              >
                Save Notes
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-4">
                Quick Stats
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p style={{ color: '#a8d5ca' }} className="text-sm">
                    Inquiries
                  </p>
                  <p style={{ color: '#d7a859' }} className="font-bold">
                    {clientOrders.filter(o => o.status === 'inquiry').length}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p style={{ color: '#a8d5ca' }} className="text-sm">
                    Proposals Sent
                  </p>
                  <p style={{ color: '#d7a859' }} className="font-bold">
                    {clientOrders.filter(o => o.status === 'quoted').length}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p style={{ color: '#a8d5ca' }} className="text-sm">
                    Confirmed
                  </p>
                  <p style={{ color: '#d7a859' }} className="font-bold">
                    {clientOrders.filter(o => o.status === 'confirmed').length}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p style={{ color: '#a8d5ca' }} className="text-sm">
                    Completed
                  </p>
                  <p style={{ color: '#d7a859' }} className="font-bold">
                    {clientOrders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-4">
                Recent Activity
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <div style={{ backgroundColor: '#d7a859' }} className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p style={{ color: '#ffffff' }} className="font-semibold">
                      Profile viewed
                    </p>
                    <p style={{ color: '#a8d5ca' }} className="text-xs">
                      Today
                    </p>
                  </div>
                </div>

                {clientOrders.length > 0 && (
                  <div className="flex gap-2">
                    <div style={{ backgroundColor: '#d7a859' }} className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p style={{ color: '#ffffff' }} className="font-semibold">
                        Event booked
                      </p>
                      <p style={{ color: '#a8d5ca' }} className="text-xs">
                        {Math.floor(Math.random() * 30)} days ago
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-4">
                Actions
              </h3>

              <div className="space-y-2">
                <button
                  style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                  className="w-full py-2 font-bold rounded-lg transition hover:opacity-90 text-sm flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Send Email
                </button>
                <button
                  style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }}
                  className="w-full py-2 font-bold rounded-lg transition hover:bg-[#102418] text-sm"
                >
                  View Invoices
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
