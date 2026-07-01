'use client';

import { useState } from 'react';

interface Order {
  id: string;
  clientName: string;
  eventDate: string;
  guestCount: number;
  status: string;
}

export default function WhatsAppIntegrator({ orders }: { orders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageType, setMessageType] = useState<'quote' | 'confirmation' | 'reminder'>('quote');
  const [customMessage, setCustomMessage] = useState('');

  const currentOrder = orders.find((o) => o.id === selectedOrder);

  const generateMessage = (): string => {
    if (customMessage) return customMessage;

    if (!currentOrder) return '';

    switch (messageType) {
      case 'quote':
        return `Hi ${currentOrder.clientName}! 👋\n\nThank you for your catering inquiry for ${currentOrder.guestCount} guests on ${currentOrder.eventDate}.\n\nI've prepared a customized quote for you. Please check the invoice attached or reply with any questions.\n\nLooking forward to serving you! 🍽️\n\n- Your Catering Team`;

      case 'confirmation':
        return `Hi ${currentOrder.clientName}! ✅\n\nGreat news! Your catering order for ${currentOrder.guestCount} guests on ${currentOrder.eventDate} has been CONFIRMED.\n\nI'll be preparing everything fresh and will deliver on time. If you have any last-minute requests, just let me know!\n\n🍽️ See you soon!`;

      case 'reminder':
        return `Hi ${currentOrder.clientName}! 📍\n\nJust a friendly reminder - your catering event is coming up on ${currentOrder.eventDate}!\n\nI'm all set and ready to deliver delicious food for ${currentOrder.guestCount} guests. See you soon! 🎉`;

      default:
        return '';
    }
  };

  const sendViaWhatsApp = () => {
    if (!phoneNumber) {
      alert('Please enter a phone number');
      return;
    }

    const message = generateMessage();
    if (!message) {
      alert('Please select an order or write a custom message');
      return;
    }

    // Clean phone number (remove spaces, dashes, etc)
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // WhatsApp Web URL with pre-filled message
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };

  const copyMessage = () => {
    const message = generateMessage();
    navigator.clipboard.writeText(message);
    alert('Message copied to clipboard!');
  };

  const messageTemplates = [
    {
      id: 'quote',
      label: '💬 Send Quote',
      icon: '📋',
      description: 'Share price estimate with client',
    },
    {
      id: 'confirmation',
      label: '✅ Send Confirmation',
      icon: '✅',
      description: 'Confirm order is locked in',
    },
    {
      id: 'reminder',
      label: '🔔 Send Reminder',
      icon: '🔔',
      description: 'Remind about upcoming event',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-3 border-green-400">
        <h2 className="text-3xl font-black text-gray-900 mb-2">💬 WhatsApp Integration</h2>
        <p className="text-gray-600">Send quotes, confirmations & reminders directly to WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Setup */}
        <div className="space-y-6">
          {/* Select Order */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">1️⃣ Select Order</label>
            <select
              title="Select an order"
              value={selectedOrder || ''}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:outline-none text-lg"
            >
              <option value="">Choose order...</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.clientName} - {order.eventDate}
                </option>
              ))}
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">2️⃣ WhatsApp Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567 or country code + number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Include country code (e.g., +1 for USA, +44 for UK)
            </p>
          </div>

          {/* Message Type */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">3️⃣ Choose Message</label>
            <div className="grid grid-cols-1 gap-3">
              {messageTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setMessageType(template.id as any)}
                  className={`p-4 rounded-xl border-2 transition text-left ${
                    messageType === template.id
                      ? 'bg-green-500 text-white border-green-600'
                      : 'bg-white border-gray-200 hover:border-green-400'
                  }`}
                >
                  <div className="font-bold text-lg">{template.icon} {template.label}</div>
                  <div className={`text-sm ${messageType === template.id ? 'text-green-100' : 'text-gray-600'}`}>
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">Or Write Custom Message</label>
            <textarea
              placeholder="Write your own WhatsApp message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
            />
          </div>

          {/* Send Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={sendViaWhatsApp}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black py-4 rounded-xl transition shadow-lg hover:shadow-2xl text-lg uppercase tracking-wide"
            >
              💬 Send via WhatsApp
            </button>
            <button
              type="button"
              onClick={copyMessage}
              className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-900 font-black py-4 rounded-xl transition"
            >
              📋 Copy
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">📱 Message Preview</label>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 h-96 overflow-y-auto">
            {generateMessage() ? (
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-gray-900 font-semibold text-sm whitespace-pre-wrap leading-relaxed">
                    {generateMessage()}
                  </p>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                  <p>
                    <strong>💡 How it works:</strong> Click "Send via WhatsApp" to open WhatsApp with this
                    message pre-filled. Your client can review and send it!
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center pt-32">Select an order and message type to preview</p>
            )}
          </div>
        </div>
      </div>

      {/* Template Guide */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-xl">
        <p className="text-sm text-blue-900 font-bold mb-3">📚 Template Guide:</p>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            <strong>Quote:</strong> Use when you've calculated a price and want to send it to the client for approval
          </li>
          <li>
            <strong>Confirmation:</strong> Use after the client accepts the quote and the order is locked in
          </li>
          <li>
            <strong>Reminder:</strong> Use a few days before the event to confirm they're ready</li>
          <li>
            <strong>Custom:</strong> Write your own message for any situation
          </li>
        </ul>
      </div>

      {/* Pro Tips */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-xl">
        <p className="text-sm text-amber-900 font-bold mb-3">⚡ Pro Tips:</p>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>✅ Keep messages short and friendly - WhatsApp is personal!</li>
          <li>✅ Always include your phone number so they can call back</li>
          <li>✅ Use this to save 30+ minutes/week on back-and-forth communication</li>
          <li>✅ Clients love WhatsApp - reply rates are 10x higher than email</li>
        </ul>
      </div>
    </div>
  );
}
