'use client';

import { useState } from 'react';

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
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-amber-950 mb-2">New Inquiry Form</h2>
        <p className="text-amber-700">Capture a new client inquiry and move it through your sales pipeline</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 font-semibold">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded text-green-700 font-semibold">
          ✓ Inquiry created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client Information */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-amber-950 mb-6">Client Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2 uppercase tracking-wider">
                Name *
              </label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="e.g., Sarah Johnson"
                className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-emerald-300 mb-2 uppercase tracking-wider">
                Phone *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g., (555) 123-4567"
                className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2 uppercase tracking-wider">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g., sarah@example.com"
                className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
              />
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-amber-950 mb-6">Event Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2 uppercase tracking-wider">
                Event Type *
              </label>
              <select
                value={form.eventType}
                onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg text-amber-950 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2 uppercase tracking-wider">
                Event Date *
              </label>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg text-amber-950 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2 uppercase tracking-wider">
                Guest Count *
              </label>
              <input
                type="number"
                value={form.guestCount}
                onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                placeholder="e.g., 150"
                className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2 uppercase tracking-wider">
                Budget Range
              </label>
              <input
                type="text"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="e.g., $3,000 - $5,000"
                className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-amber-900 mb-2 uppercase tracking-wider">
              Venue
            </label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="e.g., Marriott Ballroom, Downtown"
              className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <label className="block text-sm font-bold text-amber-900 mb-2 uppercase tracking-wider">
            Special Requests & Notes
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Dietary restrictions, allergies, menu preferences, special instructions, or how they found you..."
            rows={5}
            className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black py-4 rounded-lg transition shadow-lg hover:shadow-2xl text-lg uppercase tracking-wide"
        >
          + Create New Inquiry
        </button>
      </form>
    </div>
  );
}
