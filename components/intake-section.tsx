'use client';

import { useState, useRef } from 'react';
import QRCode from 'qrcode.react';

export default function IntakeSection() {
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const intakeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/order`
    : 'http://localhost:3000/order';

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'catering-intake-qr.png';
        link.click();
      }
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(intakeUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Menu</h2>
        <p className="text-gray-600 mb-6">
          Clients scan the QR code or click the link to order. They fill out their info and select items like buying tickets.
        </p>

        <div className="bg-blue-50 rounded-lg p-6 mb-6 border-l-4 border-blue-500">
          <p className="text-sm font-semibold text-blue-900 mb-3">Intake Link</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-white p-3 rounded border border-gray-300 text-sm break-all">
              {intakeUrl}
            </code>
            <button
              onClick={copyLink}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded whitespace-nowrap"
            >
              Copy Link
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowQR(!showQR)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition w-full mb-4"
        >
          {showQR ? 'Hide QR Code' : 'Show QR Code'}
        </button>

        {showQR && (
          <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
            <div ref={qrRef} className="bg-white p-4 rounded-lg">
              <QRCode
                value={intakeUrl}
                size={256}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>
            <button
              onClick={downloadQRCode}
              className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded"
            >
              Download QR Code
            </button>
            <p className="text-sm text-gray-600 text-center">
              Print this or send to clients. They scan it to order!
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Client scans QR or clicks link</li>
            <li>✓ Lands on fun intake page</li>
            <li>✓ Selects items (like concert tickets)</li>
            <li>✓ Enters delivery date & contact</li>
            <li>✓ Gets order confirmation</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Tips</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>📱 Best on mobile devices</li>
            <li>💬 Share QR via WhatsApp/SMS</li>
            <li>📧 Email the link to groups</li>
            <li>🎨 Print QR for flyers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
