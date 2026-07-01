'use client';

import { useState } from 'react';

export default function QuickOrderForm({ onAdd }: { onAdd: (order: any) => void }) {
  const [form, setForm] = useState({
    clientName: '',
    eventDate: '',
    guestCount: '',
    eventType: 'wedding',
    notes: '',
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.clientName || !form.eventDate || !form.guestCount) {
      setError('Please fill in all required fields');
      return;
    }
    onAdd(form);
    setForm({
      clientName: '',
      eventDate: '',
      guestCount: '',
      eventType: 'wedding',
      notes: '',
    });
  };

  const eventTypes = [
    { value: 'wedding', label: '💒 Wedding', icon: '💒' },
    { value: 'birthday', label: '🎂 Birthday', icon: '🎂' },
    { value: 'corporate', label: '💼 Corporate Event', icon: '💼' },
    { value: 'graduation', label: '🎓 Graduation', icon: '🎓' },
    { value: 'funeral', label: '🙏 Funeral Catering', icon: '🙏' },
    { value: 'other', label: '🎪 Other', icon: '🎪' },
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 font-semibold">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Client Name *
          </label>
          <input
            type="text"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            placeholder="e.g., Sarah Johnson"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition text-lg"
          />
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Event Date *
          </label>
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition text-lg"
          />
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Number of Guests *
          </label>
          <input
            type="number"
            value={form.guestCount}
            onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
            placeholder="e.g., 150"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition text-lg"
          />
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Event Type
          </label>
          <select
            title="Event type"
            aria-label="Select event type"
            value={form.eventType}
            onChange={(e) => setForm({ ...form, eventType: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition text-lg font-semibold"
          >
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-lg font-bold text-gray-900 mb-3">
          Special Requests & Notes
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Any dietary restrictions, allergies, preferences, menu requests, or special instructions..."
          rows={5}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition text-lg"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-4 rounded-xl transition shadow-lg hover:shadow-2xl text-lg uppercase tracking-wide"
      >
        ➕ Create New Inquiry
      </button>
    </form>
  );
}
