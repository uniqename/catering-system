'use client';

import { useState, useEffect } from 'react';

export default function QRIntake({ onCreateOrder }: { onCreateOrder?: (order: any) => void }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [intakeLink, setIntakeLink] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');

  useEffect(() => {
    // Generate the intake link - this would be your mobile intake form URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${baseUrl}/intake?ref=qr`;
    setIntakeLink(link);

    // Generate QR code using a public API (qr-server.com)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
    setQrCodeUrl(qrUrl);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(intakeLink);
    setCopyFeedback('Copied!');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'intake-qr-code.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to download QR code');
    }
  };

  return (
    <div className="space-y-8">
      {/* QR Code Display */}
      <div className="bg-white rounded-2xl border-2 border-teal-900 p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">📱 QR Code Client Self-Intake</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-xl border-2 border-teal-900 mb-4">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="Client Intake QR Code" className="w-64 h-64 rounded-lg" />
              ) : (
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">Loading QR...</div>
              )}
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={downloadQRCode}
                disabled={!qrCodeUrl}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black rounded-lg transition disabled:opacity-50"
              >
                📥 Download QR
              </button>
              <button
                onClick={copyToClipboard}
                className="flex-1 px-4 py-2 bg-teal-900 hover:bg-teal-950 text-white font-black rounded-lg transition"
              >
                {copyFeedback || '📋 Copy Link'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border-2 border-amber-600">
              <h3 className="font-black text-gray-900 mb-3">📋 How It Works</h3>
              <ol className="text-sm text-gray-700 space-y-2">
                <li>1️⃣ <strong>Display QR Code</strong> on your website, menu, or business card</li>
                <li>2️⃣ <strong>Clients scan</strong> with their phone camera or QR app</li>
                <li>3️⃣ <strong>Opens mobile form</strong> to fill in order details</li>
                <li>4️⃣ <strong>Auto-creates inquiry</strong> in your system for follow-up</li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-6 border-2 border-teal-900">
              <h3 className="font-black text-gray-900 mb-3">📱 Mobile Form Collects</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Client name & contact</li>
                <li>✓ Event date & type</li>
                <li>✓ Guest count & budget</li>
                <li>✓ Special requests & dietary info</li>
                <li>✓ Preferred delivery location</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-xs font-bold text-blue-900 mb-2">💡 Pro Tips:</p>
              <ul className="text-xs text-blue-900 space-y-1">
                <li>• Print QR on menus, invoices, and packaging</li>
                <li>• Share link on social media (Instagram, WhatsApp)</li>
                <li>• Add to email signature for easy sharing</li>
                <li>• Track source: &quot;?ref=qr&quot; parameter</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Form Preview */}
      <div className="bg-white rounded-2xl border-2 border-teal-900 p-8">
        <h3 className="text-xl font-black text-gray-900 mb-6">📲 Mobile Intake Form Preview</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mobile Phone Mock-up */}
          <div className="flex justify-center">
            <div className="w-80 bg-black rounded-3xl p-3 shadow-2xl" style={{ aspectRatio: '9/19' }}>
              <div className="bg-white rounded-2xl h-full overflow-hidden flex flex-col">
                {/* Status Bar */}
                <div className="bg-teal-900 text-white text-xs font-bold px-4 py-2 flex justify-between">
                  <span>9:41</span>
                  <span>📶 📡 🔋</span>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="text-center mb-4">
                    <p className="font-black text-lg text-gray-900">🍽️ Order Inquiry</p>
                    <p className="text-xs text-gray-600">Quick & easy ordering</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Name *</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full px-2 py-1 border border-teal-900 rounded text-xs"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Event Date *</label>
                    <input type="date" className="w-full px-2 py-1 border border-teal-900 rounded text-xs" disabled />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Guests</label>
                    <input
                      type="number"
                      placeholder="50"
                      className="w-full px-2 py-1 border border-teal-900 rounded text-xs"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Type</label>
                    <select className="w-full px-2 py-1 border border-teal-900 rounded text-xs" disabled>
                      <option>Select...</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Special Requests</label>
                    <textarea placeholder="Allergies, preferences..." className="w-full px-2 py-1 border border-teal-900 rounded text-xs" disabled />
                  </div>

                  <button className="w-full bg-amber-600 text-white font-bold py-2 rounded text-xs" disabled>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Schema & Customization */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 border-2 border-emerald-700">
              <h4 className="font-black text-gray-900 mb-3">📝 Form Fields (Configurable)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-600">*</span>
                  <span className="text-gray-700"><strong>Client Name</strong> - Required</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600">*</span>
                  <span className="text-gray-700"><strong>Event Date</strong> - Required</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">○</span>
                  <span className="text-gray-700"><strong>Guest Count</strong> - Optional</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">○</span>
                  <span className="text-gray-700"><strong>Event Type</strong> - Optional</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">○</span>
                  <span className="text-gray-700"><strong>Budget</strong> - Optional</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">○</span>
                  <span className="text-gray-700"><strong>Description</strong> - Optional</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-xs font-bold text-blue-900 mb-2">🔄 Workflow:</p>
              <ol className="text-xs text-blue-900 space-y-1">
                <li>1. Client submits form via mobile</li>
                <li>2. Creates inquiry in "Orders" tab</li>
                <li>3. You review & contact client</li>
                <li>4. Convert to confirmed order</li>
              </ol>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded">
              <p className="text-xs font-bold text-amber-900 mb-2">📌 Next Step:</p>
              <p className="text-xs text-amber-900">
                Confirm intake form fields with Alexandra, then customize the mobile form to match exact requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-xl">
        <p className="text-sm font-bold text-blue-900 mb-2">🚀 Integration Status:</p>
        <ul className="text-sm text-blue-900 space-y-1">
          <li>✅ QR code generation working</li>
          <li>✅ Deep link to mobile form ready</li>
          <li>⏳ Mobile intake form UI (ready to customize)</li>
          <li>📌 Awaiting field schema from Alexandra</li>
        </ul>
      </div>
    </div>
  );
}
