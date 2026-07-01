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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.eventDate || !form.guestCount) {
      alert('Please fill in all required fields');
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

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Client Name *
          </label>
          <input
            type="text"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Event Date *
          </label>
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Number of Guests *
          </label>
          <input
            type="number"
            value={form.guestCount}
            onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
            placeholder="100"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Event Type
          </label>
          <select
            value={form.eventType}
            onChange={(e) => setForm({ ...form, eventType: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          >
            <option value="wedding">💒 Wedding</option>
            <option value="birthday">🎂 Birthday</option>
            <option value="corporate">💼 Corporate</option>
            <option value="graduation">🎓 Graduation</option>
            <option value="funeral">🙏 Funeral</option>
            <option value="other">🎪 Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Notes / Special Requests
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Any dietary restrictions, preferences, or special requests..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition text-lg"
      >
        ➕ Create Inquiry
      </button>
    </form>
  );
}
