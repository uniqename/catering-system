'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface BusinessSettings {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  taxRate: number;
  defaultEventBuffer: number; // days before event to start prep
  minEventSize: number;
  maxEventSize: number;
  depositeRequired: number; // percentage
  currency: string;
  timezone: string;
}

export default function BusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings>({
    businessName: 'Garage to Table',
    ownerName: 'Alexandra',
    email: 'info@garageotable.com',
    phone: '+1 (555) 123-4567',
    address: '123 Culinary Lane',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30301',
    website: 'www.garageotable.com',
    businessHoursStart: '09:00',
    businessHoursEnd: '18:00',
    taxRate: 15,
    defaultEventBuffer: 7,
    minEventSize: 10,
    maxEventSize: 500,
    depositeRequired: 50,
    currency: 'USD',
    timezone: 'America/Chicago',
  });

  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'business' | 'operations' | 'financial'>('business');

  useEffect(() => {
    const saved = localStorage.getItem('business_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('business_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = (key: keyof BusinessSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div style={{ backgroundColor: '#0a1911' }} className="p-8 min-h-screen">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 style={{ color: '#d7a859' }} className="text-3xl font-bold">Business Settings</h1>
          <button
            onClick={saveSettings}
            style={{ backgroundColor: '#d7a859', color: '#0a1911' }}
            className="px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90"
          >
            <Save className="w-5 h-5" /> Save Changes
          </button>
        </div>

        {saved && (
          <div style={{ backgroundColor: '#10B981', borderColor: '#059669' }} className="border-l-4 rounded-lg p-4 mb-6 text-white font-semibold">
            ✓ Settings saved successfully
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b-2" style={{ borderBottomColor: '#d7a859' }}>
          {(['business', 'operations', 'financial'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                color: tab === t ? '#d7a859' : '#a8d5ca',
                borderBottomColor: tab === t ? '#d7a859' : 'transparent'
              }}
              className="px-6 py-3 font-semibold border-b-2 capitalize transition"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Business Info Tab */}
        {tab === 'business' && (
          <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-8 space-y-6">
            <h2 style={{ color: '#d7a859' }} className="text-xl font-bold mb-6">Business Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Business Name</label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => updateSetting('businessName', e.target.value)}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Owner Name</label>
                <input
                  type="text"
                  value={settings.ownerName}
                  onChange={(e) => updateSetting('ownerName', e.target.value)}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => updateSetting('phone', e.target.value)}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Website
                </label>
                <input
                  type="url"
                  value={settings.website}
                  onChange={(e) => updateSetting('website', e.target.value)}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSetting('timezone', e.target.value)}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                >
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ color: '#d7a859' }} className="block font-bold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => updateSetting('address', e.target.value)}
                placeholder="Street address"
                style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                className="w-full px-4 py-2 border-2 rounded-lg mb-3"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => updateSetting('city', e.target.value)}
                  placeholder="City"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="px-4 py-2 border-2 rounded-lg"
                />
                <input
                  type="text"
                  value={settings.state}
                  onChange={(e) => updateSetting('state', e.target.value)}
                  placeholder="State"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="px-4 py-2 border-2 rounded-lg"
                />
                <input
                  type="text"
                  value={settings.zipCode}
                  onChange={(e) => updateSetting('zipCode', e.target.value)}
                  placeholder="ZIP"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="px-4 py-2 border-2 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Operations Tab */}
        {tab === 'operations' && (
          <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-8 space-y-6">
            <h2 style={{ color: '#d7a859' }} className="text-xl font-bold mb-6">Operations & Policies</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Business Hours Start</label>
                <input
                  type="time"
                  value={settings.businessHoursStart}
                  onChange={(e) => updateSetting('businessHoursStart', e.target.value)}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Business Hours End</label>
                <input
                  type="time"
                  value={settings.businessHoursEnd}
                  onChange={(e) => updateSetting('businessHoursEnd', e.target.value)}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Minimum Event Size (guests)</label>
                <input
                  type="number"
                  value={settings.minEventSize}
                  onChange={(e) => updateSetting('minEventSize', parseInt(e.target.value))}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Maximum Event Size (guests)</label>
                <input
                  type="number"
                  value={settings.maxEventSize}
                  onChange={(e) => updateSetting('maxEventSize', parseInt(e.target.value))}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Event Prep Buffer (days before)</label>
                <input
                  type="number"
                  value={settings.defaultEventBuffer}
                  onChange={(e) => updateSetting('defaultEventBuffer', parseInt(e.target.value))}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Deposit Required (%)</label>
                <input
                  type="number"
                  value={settings.depositeRequired}
                  onChange={(e) => updateSetting('depositeRequired', parseInt(e.target.value))}
                  min="0"
                  max="100"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Financial Tab */}
        {tab === 'financial' && (
          <div style={{ backgroundColor: '#102418' }} className="rounded-lg p-8 space-y-6">
            <h2 style={{ color: '#d7a859' }} className="text-xl font-bold mb-6">Financial Settings</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>

              <div>
                <label style={{ color: '#d7a859' }} className="block font-bold mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSetting('currency', e.target.value)}
                  style={{ backgroundColor: '#0a1911', borderColor: '#d7a859', color: 'white' }}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>

            <div style={{ backgroundColor: '#0a1911', borderLeftColor: '#d7a859' }} className="border-l-4 rounded p-4">
              <p style={{ color: '#d7a859' }} className="font-bold mb-2">Summary</p>
              <ul style={{ color: '#a8d5ca' }} className="text-sm space-y-1">
                <li>Tax Rate: {settings.taxRate}%</li>
                <li>Deposit Required: {settings.depositeRequired}% of total</li>
                <li>Currency: {settings.currency}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
