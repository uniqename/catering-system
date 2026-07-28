'use client';

import { useState } from 'react';
import { ChevronLeft, Send, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

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

export default function InquiryDetail({
  inquiry,
  onBack,
  onUpdate,
  onDelete,
  onSendProposal,
  onCreateInvoice
}: {
  inquiry: Order;
  onBack: () => void;
  onUpdate: (inquiry: Order) => void;
  onDelete: (id: string) => void;
  onSendProposal: (id: string) => void;
  onCreateInvoice: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(inquiry);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(inquiry.id);
    onBack();
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      inquiry: '#10B981',
      quoted: '#f59e0b',
      confirmed: '#10B981',
      delivered: '#10B981'
    };
    return colors[status] || '#10B981';
  };

  const statusActions = {
    inquiry: ['Send Proposal', 'Create Estimate'],
    quoted: ['Send Proposal', 'Create Invoice'],
    confirmed: ['Create Invoice', 'Send Reminder'],
    delivered: ['View Invoice', 'Send Thank You']
  };

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-4xl mx-auto">
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
                {isEditing ? 'Edit Inquiry' : 'Inquiry Details'}
              </h1>
              <p style={{ color: '#a8d5ca' }} className="text-sm mt-1">
                Inquiry ID: {inquiry.id}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }}
                  className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-[#102418] transition"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                  className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-[#102418] transition"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {showDeleteConfirm && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }} className="border rounded-xl p-6 mb-8">
            <p style={{ color: '#fca5a5' }} className="mb-4">Are you sure you want to delete this inquiry? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                className="px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{ backgroundColor: 'rgba(215, 168, 89, 0.1)', color: '#d7a859' }}
                className="px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#102418] transition"
              >
                Cancel
              </button>
            </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                    Name
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) =>
                        setFormData({ ...formData, clientName: e.target.value })
                      }
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                    />
                  ) : (
                    <p style={{ color: '#ffffff' }} className="font-semibold">
                      {formData.clientName}
                    </p>
                  )}
                </div>

                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                    Phone
                  </p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                    />
                  ) : (
                    <p style={{ color: '#ffffff' }} className="font-semibold">
                      {formData.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                    Email
                  </p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                    />
                  ) : (
                    <p style={{ color: '#ffffff' }} className="font-semibold">
                      {formData.email || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h2 style={{ color: '#d7a859' }} className="text-lg font-bold mb-4">
                Event Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                    Event Type
                  </p>
                  {isEditing ? (
                    <select
                      value={formData.eventType}
                      onChange={(e) =>
                        setFormData({ ...formData, eventType: e.target.value })
                      }
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                    >
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="graduation">Graduation</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p style={{ color: '#ffffff' }} className="font-semibold capitalize">
                      {formData.eventType}
                    </p>
                  )}
                </div>

                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                    Event Date
                  </p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) =>
                        setFormData({ ...formData, eventDate: e.target.value })
                      }
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                    />
                  ) : (
                    <p style={{ color: '#ffffff' }} className="font-semibold">
                      {new Date(formData.eventDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>

                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                    Guest Count
                  </p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.guestCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guestCount: parseInt(e.target.value)
                        })
                      }
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                    />
                  ) : (
                    <p style={{ color: '#ffffff' }} className="font-semibold">
                      {formData.guestCount} guests
                    </p>
                  )}
                </div>

                <div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                    Budget
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.budget || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      placeholder="e.g., $3,000 - $5,000"
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                    />
                  ) : (
                    <p style={{ color: '#ffffff' }} className="font-semibold">
                      {formData.budget || 'Not specified'}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-2">
                    Venue
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.venue || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, venue: e.target.value })
                      }
                      placeholder="e.g., Marriott Ballroom, Downtown"
                      style={{
                        backgroundColor: '#0a1911',
                        borderColor: 'rgba(215, 168, 89, 0.2)',
                        color: '#ffffff'
                      }}
                      className="w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                    />
                  ) : (
                    <p style={{ color: '#ffffff' }} className="font-semibold">
                      {formData.venue || 'Not specified'}
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
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  style={{
                    backgroundColor: '#0a1911',
                    borderColor: 'rgba(215, 168, 89, 0.2)',
                    color: '#ffffff'
                  }}
                  className="w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition resize-none h-32"
                  placeholder="Add notes about dietary restrictions, preferences, or special requests..."
                />
              ) : (
                <p style={{ color: '#ffffff' }} className="font-semibold">
                  {formData.notes || 'No notes added'}
                </p>
              )}
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                  className="flex-1 py-3 font-bold rounded-lg transition hover:opacity-90"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setFormData(inquiry);
                    setIsEditing(false);
                  }}
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
            {/* Status */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <p style={{ color: '#a8d5ca' }} className="text-xs uppercase tracking-wide mb-3">
                Current Status
              </p>
              <span
                style={{ backgroundColor: getStatusColor(inquiry.status), color: '#0a1911' }}
                className="text-sm font-bold px-4 py-2 rounded-lg inline-block"
              >
                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
              </span>
            </div>

            {/* Actions */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-4">
                Next Steps
              </h3>

              <div className="space-y-2">
                {statusActions[inquiry.status as keyof typeof statusActions]?.map(
                  (action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (action.includes('Proposal')) onSendProposal(inquiry.id);
                        if (action.includes('Invoice')) onCreateInvoice(inquiry.id);
                      }}
                      style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
                      className="w-full py-2 font-semibold rounded-lg text-sm transition hover:opacity-90 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> {action}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Timeline */}
            <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6 border">
              <h3 style={{ color: '#d7a859' }} className="font-bold mb-4">
                Timeline
              </h3>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div style={{ backgroundColor: '#d7a859' }} className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p style={{ color: '#ffffff' }} className="text-sm font-semibold">
                      Inquiry Received
                    </p>
                    <p style={{ color: '#a8d5ca' }} className="text-xs">
                      Today
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    style={{ backgroundColor: inquiry.status !== 'inquiry' ? '#d7a859' : '#102418' }}
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  ></div>
                  <div>
                    <p style={{ color: '#ffffff' }} className="text-sm font-semibold">
                      Proposal Sent
                    </p>
                    <p style={{ color: '#a8d5ca' }} className="text-xs">
                      {inquiry.status !== 'inquiry' ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    style={{ backgroundColor: inquiry.status === 'confirmed' ? '#d7a859' : '#102418' }}
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  ></div>
                  <div>
                    <p style={{ color: '#ffffff' }} className="text-sm font-semibold">
                      Event Confirmed
                    </p>
                    <p style={{ color: '#a8d5ca' }} className="text-xs">
                      {inquiry.status === 'confirmed' ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    style={{ backgroundColor: inquiry.status === 'delivered' ? '#d7a859' : '#102418' }}
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  ></div>
                  <div>
                    <p style={{ color: '#ffffff' }} className="text-sm font-semibold">
                      Event Delivered
                    </p>
                    <p style={{ color: '#a8d5ca' }} className="text-xs">
                      {inquiry.status === 'delivered' ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
