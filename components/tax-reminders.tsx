'use client';

import { useState, useEffect } from 'react';

interface Reminder {
  id: string;
  name: string;
  dueDate: string;
  category: 'license' | 'tax' | 'other';
  daysBeforeAlert: number;
  notes: string;
  completed: boolean;
}

export default function TaxReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [form, setForm] = useState({
    name: '',
    dueDate: '',
    category: 'license' as const,
    daysBeforeAlert: 14,
    notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('catering_reminders');
    if (saved) {
      setReminders(JSON.parse(saved));
    } else {
      // Load default reminders
      const defaults = [
        {
          id: '1',
          name: 'Vendor License Renewal',
          dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          category: 'license' as const,
          daysBeforeAlert: 30,
          notes: 'Annual vendor license renewal with health department',
          completed: false,
        },
        {
          id: '2',
          name: 'Sales Tax Filing (Biannual)',
          dueDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
          category: 'tax' as const,
          daysBeforeAlert: 7,
          notes: 'File sales tax return every 6 months',
          completed: false,
        },
        {
          id: '3',
          name: 'Year-End Tax Prep with CPA',
          dueDate: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
          category: 'tax' as const,
          daysBeforeAlert: 45,
          notes: 'Schedule CPA meeting for year-end accounting',
          completed: false,
        },
      ];
      setReminders(defaults);
      localStorage.setItem('catering_reminders', JSON.stringify(defaults));
    }
  }, []);

  const saveReminders = (updated: Reminder[]) => {
    setReminders(updated);
    localStorage.setItem('catering_reminders', JSON.stringify(updated));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.dueDate) {
      alert('Please fill in required fields');
      return;
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      ...form,
      completed: false,
    };

    saveReminders([newReminder, ...reminders]);
    setForm({
      name: '',
      dueDate: '',
      category: 'license',
      daysBeforeAlert: 14,
      notes: '',
    });
  };

  const toggleComplete = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
    saveReminders(updated);
  };

  const deleteReminder = (id: string) => {
    saveReminders(reminders.filter((r) => r.id !== id));
  };

  const getStatus = (dueDate: string, daysBeforeAlert: number) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntil = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) return { label: 'OVERDUE', color: 'bg-red-100 text-red-900', icon: '🔴' };
    if (daysUntil <= daysBeforeAlert) return { label: 'URGENT', color: 'bg-amber-100 text-amber-900', icon: '⚠️' };
    if (daysUntil <= 60) return { label: 'COMING UP', color: 'bg-yellow-100 text-yellow-900', icon: '📅' };
    return { label: 'ON TRACK', color: 'bg-green-100 text-green-900', icon: '✅' };
  };

  const sortedReminders = [...reminders].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const activeReminders = sortedReminders.filter((r) => !r.completed);
  const completedReminders = sortedReminders.filter((r) => r.completed);

  // Calculate metrics
  const totalReminders = reminders.length;
  const upcomingCount = activeReminders.filter(
    (r) => {
      const days = Math.ceil((new Date(r.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 && days <= 60;
    }
  ).length;
  const overdueCount = activeReminders.filter(
    (r) => Math.ceil((new Date(r.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 0
  ).length;

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border-2 border-teal-900">
          <p className="text-teal-900 text-sm font-bold uppercase tracking-wide">Total Reminders</p>
          <p className="text-4xl font-black text-teal-900 mt-2">{totalReminders}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-700">
          <p className="text-green-900 text-sm font-bold uppercase tracking-wide">Completed</p>
          <p className="text-4xl font-black text-green-900 mt-2">{completedReminders.length}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-600">
          <p className="text-yellow-900 text-sm font-bold uppercase tracking-wide">Coming Up</p>
          <p className="text-4xl font-black text-yellow-900 mt-2">{upcomingCount}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-600">
          <p className="text-red-900 text-sm font-bold uppercase tracking-wide">Overdue</p>
          <p className="text-4xl font-black text-red-900 mt-2">{overdueCount}</p>
        </div>
      </div>

      {/* Add Reminder Form */}
      <form onSubmit={handleAddReminder} className="bg-white rounded-2xl border-2 border-teal-900 p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">📅 Add New Reminder</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Reminder Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Annual License Renewal, Q4 Tax Filing"
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Due Date</label>
            <input
              type="date"
              title="Due date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Category</label>
            <select
              title="Reminder category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="license">📄 License</option>
              <option value="tax">💰 Tax</option>
              <option value="other">📋 Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Alert Days Before</label>
            <input
              type="number"
              title="Alert days before due date"
              min="1"
              value={form.daysBeforeAlert}
              onChange={(e) => setForm({ ...form, daysBeforeAlert: parseInt(e.target.value) || 14 })}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional details or CPA instructions..."
              rows={2}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black py-3 rounded-xl transition shadow-lg hover:shadow-2xl text-lg uppercase tracking-wide"
        >
          ➕ Add Reminder
        </button>
      </form>

      {/* Active Reminders */}
      {activeReminders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-gray-900">📌 Active Reminders</h3>
          {activeReminders.map((reminder) => {
            const status = getStatus(reminder.dueDate, reminder.daysBeforeAlert);
            const daysUntil = Math.ceil((new Date(reminder.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div
                key={reminder.id}
                className="bg-white rounded-2xl border-2 border-teal-900 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-lg font-black text-gray-900">{reminder.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      📅 {new Date(reminder.dueDate).toLocaleDateString()} ({daysUntil} days away)
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black whitespace-nowrap ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                </div>

                {reminder.notes && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mb-3">
                    💡 {reminder.notes}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleComplete(reminder.id)}
                    className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-bold text-sm transition"
                  >
                    ✅ Mark Done
                  </button>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-bold text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <details className="bg-white rounded-2xl border-2 border-green-700 p-6">
          <summary className="cursor-pointer font-black text-lg text-green-900 hover:text-green-800">
            ✅ Completed ({completedReminders.length})
          </summary>
          <div className="mt-4 space-y-2">
            {completedReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div>
                  <p className="font-semibold text-green-900 line-through">{reminder.name}</p>
                  <p className="text-xs text-green-700">{reminder.dueDate}</p>
                </div>
                <button
                  onClick={() => toggleComplete(reminder.id)}
                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold hover:bg-amber-200 transition"
                >
                  Undo
                </button>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Pro Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-600 p-6 rounded-xl">
        <p className="text-sm font-bold text-amber-900 mb-2">💡 Tax & Compliance Tips:</p>
        <ul className="text-sm text-amber-900 space-y-1">
          <li>✓ Set reminders 30+ days before license renewals</li>
          <li>✓ CPA sister's lead time: discuss with Alexandra for recommended window</li>
          <li>✓ Keep all receipts and invoices for tax year</li>
          <li>✓ File sales tax early to avoid penalties</li>
          <li>✓ Schedule year-end accounting by November</li>
        </ul>
      </div>
    </div>
  );
}
