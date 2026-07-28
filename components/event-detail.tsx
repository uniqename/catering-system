'use client';

import { useState } from 'react';
import { ChevronLeft, Edit3, Trash2, Clock, Users, MapPin, DollarSign, CheckCircle2, Circle } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'delivered';
  phone?: string;
  email?: string;
  venue?: string;
  budget?: string;
  notes?: string;
}

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

export default function EventDetail({
  event,
  onBack,
  onCreateInvoice
}: {
  event: Order;
  onBack: () => void;
  onCreateInvoice: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(event);

  const eventDate = new Date(event.eventDate);
  const today = new Date();
  const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isUpcoming = eventDate > today;

  const statusFlow = [
    { status: 'inquiry', label: 'Inquiry Received', icon: Circle },
    { status: 'quoted', label: 'Proposal Sent', icon: Circle },
    { status: 'confirmed', label: 'Event Confirmed', icon: Circle },
    { status: 'delivered', label: 'Event Completed', icon: Circle }
  ];

  const currentStatusIndex = statusFlow.findIndex(s => s.status === event.status);

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-5xl mx-auto">
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
              <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold capitalize">
                {event.eventType}
              </h1>
              <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">
                Event ID: {event.id}
              </p>
            </div>
          </div>

          {!isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }}
                className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-[#102418] transition"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={onCreateInvoice}
                style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition"
              >
                <DollarSign className="w-4 h-4" /> Create Invoice
              </button>
            </div>
          )}
        </div>

        {/* Status Alert */}
        {isUpcoming && daysUntil <= 7 && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: '#ef4444'
            }}
            className="border rounded-lg p-4 mb-6"
          >
            <p style={{ color: '#fca5a5' }} className="font-bold">
              ⚠️ Event in {daysUntil} day{daysUntil !== 1 ? 's' : ''}!
            </p>
            <p style={{ color: '#fca5a5' }} className="text-sm mt-1">
              Make sure all preparations are complete.
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Client Information */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">
                Client Information
              </h2>

              <div className="space-y-4">
                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                    Name
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                    />
                  ) : (
                    <p style={{ color: '#ffffff' }} className="font-semibold">
                      {event.clientName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                      <span className="w-4 h-4">📧</span> Email
                    </p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          backgroundColor: '#0a1911',
                          borderColor: 'rgba(215, 168, 89, 0.2)',
                          color: '#ffffff'
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                      />
                    ) : (
                      <p style={{ color: '#ffffff' }} className="font-semibold">
                        {event.email || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                      <span className="w-4 h-4">📞</span> Phone
                    </p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          backgroundColor: '#0a1911',
                          borderColor: 'rgba(215, 168, 89, 0.2)',
                          color: '#ffffff'
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                      />
                    ) : (
                      <p style={{ color: '#ffffff' }} className="font-semibold">
                        {event.phone || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">
                Event Details
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Event Date
                    </p>
                    <p style={{ color: '#d7a859' }} className="font-bold text-lg">
                      {eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p style={{ color: '#a8d5ca' }} className="text-xs mt-1">
                      {isUpcoming ? `${daysUntil} days away` : 'Past event'}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Guest Count
                    </p>
                    <p style={{ color: '#ffffff' }} className="font-bold text-lg">
                      {event.guestCount}
                    </p>
                    <p style={{ color: '#a8d5ca' }} className="text-xs mt-1">
                      guests expected
                    </p>
                  </div>
                </div>

                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Venue
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.venue || ''}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="Venue address"
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                    />
                  ) : (
                    <p style={{ color: '#ffffff' }} className="font-semibold">
                      {event.venue || 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Budget
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.budget || ''}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g., $3,000 - $5,000"
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                    />
                  ) : (
                    <p style={{ color: '#d7a859' }} className="font-bold text-lg">
                      {event.budget || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">
                Notes & Special Requests
              </h2>

              {isEditing ? (
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{
                    backgroundColor: '#0a1911',
                    borderColor: 'rgba(215, 168, 89, 0.2)',
                    color: '#ffffff'
                  }}
                  className="w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition resize-none h-24"
                  placeholder="Add notes about menu preferences, dietary restrictions, etc."
                />
              ) : (
                <p style={{ color: '#ffffff' }}>
                  {event.notes || 'No notes added'}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                  className="flex-1 py-3 font-bold rounded-lg transition hover:opacity-90"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }}
                  className="flex-1 py-3 font-bold rounded-lg transition hover:bg-[#102418]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-6">
                Event Timeline
              </h3>

              <div className="space-y-4">
                {statusFlow.map((step, idx) => (
                  <div key={step.status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        style={{
                          backgroundColor: idx <= currentStatusIndex ? '#d7a859' : '#102418'
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        {idx <= currentStatusIndex ? (
                          <CheckCircle2 className="w-5 h-5" style={{ color: '#0a1911' }} />
                        ) : (
                          <Circle className="w-4 h-4" style={{ color: '#d7a859' }} />
                        )}
                      </div>
                      {idx < statusFlow.length - 1 && (
                        <div
                          style={{
                            backgroundColor: idx < currentStatusIndex ? '#d7a859' : 'rgba(215, 168, 89, 0.2)'
                          }}
                          className="w-1 h-8 mt-2"
                        ></div>
                      )}
                    </div>
                    <div>
                      <p style={{ color: '#ffffff' }} className="font-semibold text-sm">
                        {step.label}
                      </p>
                      <p style={{ color: '#a8d5ca' }} className="text-xs">
                        {idx === currentStatusIndex ? 'Current' : idx < currentStatusIndex ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-4">
                Status
              </h3>

              <div
                style={{
                  backgroundColor: event.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(215, 168, 89, 0.1)',
                  borderColor: event.status === 'confirmed' ? '#10B981' : '#d7a859'
                }}
                className="border rounded-lg p-4"
              >
                <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                  Current Status
                </p>
                <p style={{
                  color: event.status === 'confirmed' ? '#10B981' : '#d7a859'
                }} className="font-bold text-lg capitalize">
                  {event.status.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-4">
                Event Checklist
              </h3>

              <div className="space-y-3">
                {[
                  { label: 'Menu Finalized', done: event.status !== 'inquiry' },
                  { label: 'Deposit Received', done: event.status === 'confirmed' },
                  { label: 'Invoice Sent', done: event.status !== 'inquiry' },
                  { label: 'Confirmed by Client', done: event.status === 'confirmed' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.done}
                      readOnly
                      className="w-4 h-4 rounded"
                      style={{
                        backgroundColor: item.done ? '#d7a859' : '#102418',
                        borderColor: '#d7a859'
                      }}
                    />
                    <p style={{ color: '#ffffff' }} className="text-sm">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
