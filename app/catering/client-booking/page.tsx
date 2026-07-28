'use client';

import { useState } from 'react';
import { Calendar, Users, MessageSquare, Phone, Mail, Send } from 'lucide-react';

export default function ClientBookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'wedding',
    eventDate: '',
    guestCount: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.eventDate && formData.guestCount) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', eventType: 'wedding', eventDate: '', guestCount: '', message: '' });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div style={{ backgroundColor: '#0a1911', minHeight: '100vh' }} className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <img src="/garage-to-table-logo.png" alt="Garage to Table" className="w-32 h-32 object-contain mx-auto mb-6" />
          <h1 style={{ color: '#d7a859' }} className="text-4xl font-bold mb-2">Garage to Table Catering</h1>
          <p style={{ color: '#a8d5ca' }} className="text-lg">Curated meals, flavored with love</p>
        </div>

        {submitted ? (
          <div style={{ backgroundColor: '#0f2416', borderColor: '#10B981' }} className="border-2 rounded-xl p-8 text-center">
            <div style={{ color: '#10B981' }} className="mb-4">
              <MessageSquare className="w-16 h-16 mx-auto" />
            </div>
            <h2 style={{ color: '#10B981' }} className="text-2xl font-bold mb-2">Thank you!</h2>
            <p style={{ color: '#ffffff' }} className="mb-4">Your inquiry has been received. We'll get back to you within 24 hours.</p>
            <p style={{ color: '#a8d5ca' }} className="text-sm">Check your email for confirmation details</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f2416' }} className="rounded-xl p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#d7a859] transition"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#d7a859] transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#d7a859] transition"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2">Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#d7a859] transition"
                >
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="graduation">Graduation Party</option>
                  <option value="baby-shower">Baby Shower</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2">Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#d7a859] transition"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2">Number of Guests</label>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  required
                  min="10"
                  style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#d7a859] transition"
                  placeholder="50"
                />
              </div>
            </div>

            <div>
              <label style={{ color: '#d7a859' }} className="block text-sm font-bold mb-2">Tell us about your event</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#ffffff' }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#d7a859] transition"
                placeholder="Share any dietary restrictions, menu preferences, or special requests..."
                rows={4}
              ></textarea>
            </div>

            <button
              type="submit"
              style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
              className="w-full py-3 font-bold rounded-lg transition hover:opacity-90 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" /> Send Inquiry
            </button>

            <p style={{ color: '#a8d5ca' }} className="text-xs text-center">
              We'll review your request and get back to you within 24 hours with custom menu options and pricing.
            </p>
          </form>
        )}

        {/* Footer */}
        <div style={{ backgroundColor: '#0f2416' }} className="rounded-xl p-6 mt-8 text-center">
          <h3 style={{ color: '#d7a859' }} className="font-bold mb-3">Get in Touch</h3>
          <div className="space-y-2">
            <a href="tel:+1-555-123-4567" style={{ color: '#a8d5ca' }} className="flex items-center justify-center gap-2 hover:text-[#d7a859] transition">
              <Phone className="w-4 h-4" /> +1 (555) 123-4567
            </a>
            <a href="mailto:info@garageotable.com" style={{ color: '#a8d5ca' }} className="flex items-center justify-center gap-2 hover:text-[#d7a859] transition">
              <Mail className="w-4 h-4" /> info@garageotable.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
