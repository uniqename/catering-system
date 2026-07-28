'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const CardBorder = { boxShadow: '0 0 0 0.5px rgba(215, 168, 89, 0.08)' };

export default function InquiriesForm({ onAdd }: { onAdd: (order: any) => void }) {
  const [form, setForm] = useState({
    clientName: '',
    phone: '',
    email: '',
    eventDate: '',
    guestCount: '',
    eventType: 'wedding',
    budget: '',
    venue: '',
    notes: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.clientName || !form.eventDate || !form.guestCount || !form.phone || !form.email) {
      setError('Please fill in all required fields');
      return;
    }

    onAdd(form);
    setSuccess(true);
    setForm({
      clientName: '',
      phone: '',
      email: '',
      eventDate: '',
      guestCount: '',
      eventType: 'wedding',
      budget: '',
      venue: '',
      notes: '',
    });

    setTimeout(() => setSuccess(false), 3000);
  };

  const eventTypes = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'birthday', label: 'Birthday Party' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'funeral', label: 'Funeral Catering' },
    { value: 'church', label: 'Church Event' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h2 style={{ color: '#d7a859' }} className="text-3xl font-bold mb-2">New Inquiry</h2>
          <p style={{ color: '#a8d5ca' }} className="text-sm">Capture client details and event requirements</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }} className="mb-6 border-l-4 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle style={{ color: '#ef4444' }} className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p style={{ color: '#fca5a5' }} className="font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' }} className="mb-6 border-l-4 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle2 style={{ color: '#10B981' }} className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p style={{ color: '#86efac' }} className="font-semibold">Inquiry created successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6">
            <h3 style={{ color: '#d7a859' }} className="text-lg font-bold mb-6">Client Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  placeholder="e.g., Sarah Johnson"
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g., (555) 123-4567"
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g., sarah@example.com"
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6">
            <h3 style={{ color: '#d7a859' }} className="text-lg font-bold mb-6">Event Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Event Type *
                </label>
                <select
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-3 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                >
                  {eventTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-3 border rounded-lg focus:border-[#d7a859] focus:outline-none transition"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Guest Count *
                </label>
                <input
                  type="number"
                  min="10"
                  value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                  placeholder="e.g., 150"
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Budget Range
                </label>
                <input
                  type="text"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="e.g., $3,000 - $5,000"
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Venue
                </label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  placeholder="e.g., Marriott Ballroom, Downtown"
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div style={{ backgroundColor: '#0f2416', ...CardBorder }} className="rounded-xl p-6">
            <h3 style={{ color: '#d7a859' }} className="text-lg font-bold mb-6">Special Requests & Notes</h3>

            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Dietary restrictions, allergies, menu preferences, special instructions, or how they found you..."
              style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
              className="w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:border-[#d7a859] focus:outline-none transition h-32 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
            className="w-full py-3 font-bold rounded-lg transition hover:opacity-90 text-lg"
          >
            Create Inquiry
          </button>
        </form>
      </div>
    </div>
  );
}
