'use client';

import { X, Edit3, Send, FileText, Calendar, Phone, MapPin, Mail, ChevronRight, Users, DollarSign, CheckCircle, Scale, Upload, Clock } from 'lucide-react';
import { useState } from 'react';

interface Order {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: 'inquiry' | 'quoted' | 'deposit_paid' | 'confirmed' | 'delivered';
  phone?: string;
  email?: string;
  venue?: string;
  budget?: string;
  notes?: string;
  heroImage?: string;
}

const STATUS_CONFIG = {
  inquiry: { label: 'Inquiry', color: '#14b8a6' },
  quoted: { label: 'Proposal Sent', color: '#fbbf24' },
  confirmed: { label: 'Confirmed', color: '#10b981' },
  delivered: { label: 'Completed', color: '#10b981' },
  deposit_paid: { label: 'Deposit Paid', color: '#fbbf24' }
};

export default function EventDetailPanel({
  event,
  onClose
}: {
  event: Order;
  onClose: () => void;
}) {
  const [heroImage, setHeroImage] = useState<string | null>(event.heroImage || null);
  const [activeTab, setActiveTab] = useState('Overview');

  const eventDate = new Date(event.eventDate);
  const dateStr = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const progressStages = [
    { key: 'inquiry', label: 'Inquiry', date: 'May 10' },
    { key: 'quoted', label: 'Proposal Sent', date: 'May 12' },
    { key: 'deposit_paid', label: 'Deposit Paid', date: 'May 20' },
    { key: 'confirmed', label: 'Confirmed', date: 'May 21' }
  ];

  const statusOrder = { inquiry: 1, quoted: 2, deposit_paid: 3, confirmed: 4, delivered: 5 };
  const currentStatusOrder = statusOrder[event.status as keyof typeof statusOrder] || 0;

  const getProgressStatus = (stageKey: string) => {
    const stageOrder = statusOrder[stageKey as keyof typeof statusOrder] || 0;
    if (stageOrder < currentStatusOrder) return 'completed';
    if (stageOrder === currentStatusOrder) return 'current';
    return 'pending';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setHeroImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f2416', borderLeftColor: 'rgba(215, 168, 89, 0.1)' }} className="w-[500px] border-l overflow-y-auto flex flex-col">
      <div className="sticky top-0 bg-gradient-to-b from-[#0f2416] to-transparent p-6 flex justify-end z-10">
        <button onClick={onClose} className="p-2 hover:bg-[#102418] rounded-lg transition">
          <X style={{ color: '#d7a859' }} className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 pb-6 space-y-5">
        {/* Hero Image + Status & Title - Horizontal */}
        <div className="flex gap-4">
          {/* Hero Image with Upload */}
          <div className="relative group flex-shrink-0">
            <div style={{ backgroundColor: '#0a1911' }} className="w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center">
              {heroImage ? (
                <img src={heroImage} alt="Event" className="w-full h-full object-cover" />
              ) : (
                <div style={{ color: '#d7a859', opacity: 0.3 }} className="text-2xl">🎉</div>
              )}
            </div>
            <label className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
              <Upload style={{ color: '#d7a859' }} className="w-6 h-6" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Status & Title */}
          <div className="flex-1">
            <div
              style={{
                backgroundColor: STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG].color,
                color: '#0a1911'
              }}
              className="inline-block px-3 py-1 rounded-md text-xs font-bold mb-2"
            >
              {STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG].label}
            </div>

            <h1 style={{ color: '#ffffff' }} className="text-2xl font-extrabold mb-2">
              {event.clientName} & {event.eventType === 'wedding' ? 'Wedding' : event.eventType === 'birthday' ? 'Birthday' : 'Event'}
            </h1>

            <div style={{ color: '#a8d5ca' }} className="flex items-center gap-2 text-xs mb-1">
              <Calendar className="w-4 h-4" />
              {dateStr}
            </div>
            <div style={{ color: '#a8d5ca' }} className="flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4" />
              4:00 PM - 11:00 PM
            </div>
          </div>
        </div>

        {/* Action Buttons - Icon on top, text below - Card style */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => alert('Edit Order: ' + event.clientName)}
            style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.2)' }}
            className="flex flex-col items-center justify-center py-3 px-2 rounded-md border hover:bg-[#143528] transition"
          >
            <Edit3 style={{ color: '#d7a859' }} className="w-5 h-5 mb-1" />
            <span style={{ color: '#d7a859' }} className="text-xs font-bold text-center">Edit Order</span>
          </button>
          <button
            onClick={() => alert('Send Proposal to ' + event.clientName)}
            style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.2)' }}
            className="flex flex-col items-center justify-center py-3 px-2 rounded-md border hover:bg-[#143528] transition"
          >
            <Send style={{ color: '#d7a859' }} className="w-5 h-5 mb-1" />
            <span style={{ color: '#d7a859' }} className="text-xs font-bold text-center">Send Proposal</span>
          </button>
          <button
            onClick={() => alert('Create Invoice for ' + event.clientName)}
            style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.2)' }}
            className="flex flex-col items-center justify-center py-3 px-2 rounded-md border hover:bg-[#143528] transition"
          >
            <FileText style={{ color: '#d7a859' }} className="w-5 h-5 mb-1" />
            <span style={{ color: '#d7a859' }} className="text-xs font-bold text-center">Create Invoice</span>
          </button>
          <button
            onClick={() => alert('More options for ' + event.clientName)}
            style={{ backgroundColor: '#102418', borderColor: 'rgba(215, 168, 89, 0.2)', color: '#d7a859' }}
            className="flex flex-col items-center justify-center py-3 px-2 rounded-md border hover:bg-[#143528] transition text-lg font-bold"
          >
            ⋮
          </button>
        </div>

        {/* Tabs - With gaps and gold underline on active */}
        <div className="flex gap-3 text-xs border-b border-b-[rgba(215,168,89,0.15)]">
          {['Overview', 'Menu & Details', 'Timeline', 'Payments', 'Notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                color: tab === activeTab ? '#d7a859' : '#a8d5ca',
                borderBottomColor: tab === activeTab ? '#d7a859' : 'transparent'
              }}
              className="py-3 font-bold border-b-2 transition hover:text-[#d7a859] whitespace-nowrap"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Event Information */}
        <div>
          <h3 style={{ color: '#ffffff' }} className="text-xs font-bold mb-3">
            Event Information
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p style={{ color: '#ffffff' }} className="text-xs mb-1">
                Client
              </p>
              <p style={{ color: '#d7a859' }} className="text-sm font-bold mb-3">
                {event.clientName}
              </p>
              <div>
                <p style={{ color: '#ffffff' }} className="text-xs mb-1">Phone</p>
                <p style={{ color: '#ffffff' }} className="text-xs mb-2">
                  {event.phone || '(614) 555-0196'}
                </p>
              </div>
              <div>
                <p style={{ color: '#ffffff' }} className="text-xs mb-1">Email</p>
                <p style={{ color: '#ffffff' }} className="text-xs">
                  {event.email || 'contact@email.com'}
                </p>
              </div>
            </div>

            <div>
              <p style={{ color: '#ffffff' }} className="text-xs mb-1">
                Venue
              </p>
              <p style={{ color: '#ffffff' }} className="text-sm font-semibold mb-2">
                {event.venue || 'TBD'}
              </p>
              <div>
                <p style={{ color: '#ffffff' }} className="text-xs mb-1">Address</p>
                <p style={{ color: '#ffffff' }} className="text-xs mb-0.5">
                  {event.venue ? '123 Celebration Way' : 'TBD'}
                </p>
                <p style={{ color: '#ffffff' }} className="text-xs mb-3">
                  {event.venue ? 'Columbus, OH 43215' : ''}
                </p>
              </div>
              <p style={{ color: '#ffffff' }} className="text-xs mb-1">Event Type</p>
              <p style={{ color: '#ffffff' }} className="text-sm font-semibold capitalize">
                {event.eventType}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h3 style={{ color: '#ffffff' }} className="text-xs font-bold mb-3">
            Summary
          </h3>
          <div className="grid grid-cols-4 gap-0">
            <div className="flex items-center gap-2 p-3 border-r" style={{ borderColor: 'rgba(215, 168, 89, 0.15)' }}>
              <div className="flex-shrink-0 p-2 rounded-full" style={{ backgroundColor: 'rgba(215, 168, 89, 0.15)' }}>
                <Users style={{ color: '#d7a859' }} className="w-5 h-5" />
              </div>
              <div>
                <p style={{ color: '#a8d5ca' }} className="text-xs font-bold">Guests</p>
                <p style={{ color: '#ffffff' }} className="text-base font-bold">{event.guestCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border-r" style={{ borderColor: 'rgba(215, 168, 89, 0.15)' }}>
              <div className="flex-shrink-0 p-2 rounded-full" style={{ backgroundColor: 'rgba(215, 168, 89, 0.15)' }}>
                <FileText style={{ color: '#d7a859' }} className="w-5 h-5" />
              </div>
              <div>
                <p style={{ color: '#a8d5ca' }} className="text-xs font-bold">Total</p>
                <p style={{ color: '#ffffff' }} className="text-base font-bold">{event.budget || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border-r" style={{ borderColor: 'rgba(215, 168, 89, 0.15)' }}>
              <div className="flex-shrink-0 p-2 rounded-full" style={{ backgroundColor: 'rgba(215, 168, 89, 0.15)' }}>
                <CheckCircle style={{ color: '#d7a859' }} className="w-5 h-5" />
              </div>
              <div>
                <p style={{ color: '#a8d5ca' }} className="text-xs font-bold">Paid</p>
                <p style={{ color: '#ffffff' }} className="text-base font-bold">$2,340.00</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3">
              <div className="flex-shrink-0 p-2 rounded-full" style={{ backgroundColor: 'rgba(215, 168, 89, 0.15)' }}>
                <Scale style={{ color: '#d7a859' }} className="w-5 h-5" />
              </div>
              <div>
                <p style={{ color: '#a8d5ca' }} className="text-xs font-bold">Balance</p>
                <p style={{ color: '#ffffff' }} className="text-base font-bold">{event.budget || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress - Horizontal Timeline with connecting line */}
        <div>
          <h3 style={{ color: '#ffffff' }} className="text-xs font-bold mb-4">
            Progress
          </h3>
          <div className="flex items-center justify-between gap-0 relative pb-10">
            {/* Connecting line - goes through the circles */}
            <div className="absolute top-1.5 left-2 right-2 h-px z-0" style={{ backgroundColor: 'rgba(215, 168, 89, 0.3)' }}></div>

            {progressStages.map((stage, idx) => {
              const status = getProgressStatus(stage.key);
              return (
                <div key={stage.key} className="flex-1 flex flex-col items-center relative">
                  {/* Circle - sits on the connecting line */}
                  <div
                    style={{
                      backgroundColor: status === 'completed' ? '#10b981' : status === 'current' ? '#fbbf24' : '#0f2416',
                      borderColor: status === 'pending' ? '#d7a859' : 'transparent',
                      color: status === 'pending' ? 'transparent' : '#0a1911'
                    }}
                    className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-xs mb-3 relative z-10 ${status === 'pending' ? 'border border-[#d7a859]' : ''}`}
                  >
                    {status === 'completed' && '✓'}
                    {status === 'current' && '●'}
                  </div>
                  {/* Label and date */}
                  <p style={{ color: '#ffffff' }} className="text-xs font-bold text-center whitespace-normal">
                    {stage.label}
                  </p>
                  <p style={{ color: '#a8d5ca' }} className="text-xs mt-1">
                    {stage.date}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps & Team - Side by Side */}
        <div className="grid grid-cols-2 gap-6">
          {/* Next Steps */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: '#ffffff' }} className="text-xs font-bold tracking-wider">
                Next Steps
              </h3>
              <ChevronRight style={{ color: '#d7a859' }} className="w-3 h-3" />
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Send timeline to client', date: 'May 25', done: true },
                { label: 'Final menu tasting', date: 'May 30', done: true },
                { label: 'Confirm final guest count', date: 'Jun 5', done: false }
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    {step.done ? (
                      <CheckCircle style={{ color: '#10b981' }} className="w-4 h-4" />
                    ) : (
                      <div style={{ borderColor: '#d7a859' }} className="w-4 h-4 rounded-full border"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p style={{ color: '#ffffff' }} className={`text-xs ${step.done ? 'line-through opacity-60' : ''}`}>
                      {step.label}
                    </p>
                  </div>
                  <p style={{ color: '#a8d5ca' }} className="text-xs flex-shrink-0">
                    {step.date}
                  </p>
                </div>
              ))}
            </div>
            <button onClick={() => alert('View all tasks for ' + event.clientName)} style={{ color: '#d7a859' }} className="text-xs font-bold mt-4 flex items-center gap-1 hover:opacity-80">
              View All Tasks <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Team Assignment */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: '#ffffff' }} className="text-xs font-bold tracking-wider">
                Team Assignment
              </h3>
              <ChevronRight style={{ color: '#d7a859' }} className="w-3 h-3" />
            </div>
            <div
              style={{ backgroundColor: '#0a1911', borderColor: 'rgba(215, 168, 89, 0.15)' }}
              className="rounded-md border space-y-2.5 p-3"
            >
              {[
                { role: 'Event Manager', name: 'Enam Egyir' },
                { role: 'Chef Lead', name: 'Chef Kofi' },
                { role: 'Service Staff', name: '6 Staff' },
                { role: 'Bartender', name: '2 Bartenders' }
              ].map((member, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1 flex items-center gap-2">
                    <p style={{ color: '#ffffff' }} className="text-xs font-semibold">
                      {member.role}
                    </p>
                    <p style={{ color: '#ffffff' }} className="text-xs">
                      {member.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => alert('Manage team for ' + event.clientName)} style={{ color: '#d7a859' }} className="text-xs font-bold mt-4 flex items-center gap-1 hover:opacity-80">
              Manage Team <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
