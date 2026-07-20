'use client';

import { useState, useEffect } from 'react';

interface ShippingRecord {
  id: string;
  date: string;
  carrier: string;
  destination: string;
  packageType: 'standard' | 'custom-5layer' | 'special-gift';
  outcome: 'intact' | 'damaged' | 'claim-filed' | 'claim-denied';
  damageDetails: string;
  claimAmount: number;
  notes: string;
}

export default function ShippingLog() {
  const [records, setRecords] = useState<ShippingRecord[]>([]);
  const [form, setForm] = useState<{
    date: string;
    carrier: string;
    destination: string;
    packageType: 'standard' | 'custom-5layer' | 'special-gift';
    outcome: 'intact' | 'damaged' | 'claim-filed' | 'claim-denied';
    damageDetails: string;
    claimAmount: number;
    notes: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    carrier: 'fedex',
    destination: '',
    packageType: 'standard',
    outcome: 'intact',
    damageDetails: '',
    claimAmount: 0,
    notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('catering_shipping');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  const saveRecords = (updated: ShippingRecord[]) => {
    setRecords(updated);
    localStorage.setItem('catering_shipping', JSON.stringify(updated));
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destination) {
      alert('Please enter destination');
      return;
    }

    const newRecord: ShippingRecord = {
      id: Date.now().toString(),
      ...form,
    };

    saveRecords([newRecord, ...records]);
    setForm({
      date: new Date().toISOString().split('T')[0],
      carrier: 'fedex',
      destination: '',
      packageType: 'standard',
      outcome: 'intact',
      damageDetails: '',
      claimAmount: 0,
      notes: '',
    });
  };

  const deleteRecord = (id: string) => {
    saveRecords(records.filter((r) => r.id !== id));
  };

  const calculateStats = () => {
    const totalShipments = records.length;
    const standardShipments = records.filter((r) => r.packageType === 'standard').length;
    const customShipments = records.filter((r) => r.packageType === 'custom-5layer').length;
    const giftShipments = records.filter((r) => r.packageType === 'special-gift').length;

    const intactCount = records.filter((r) => r.outcome === 'intact').length;
    const damagedCount = records.filter((r) => r.outcome === 'damaged').length;
    const claimsFiledCount = records.filter((r) => r.outcome === 'claim-filed').length;
    const claimsDeniedCount = records.filter((r) => r.outcome === 'claim-denied').length;

    const standardDamageRate = standardShipments > 0
      ? ((records.filter((r) => r.packageType === 'standard' && r.outcome !== 'intact').length / standardShipments) * 100).toFixed(1)
      : '0';

    const customDamageRate = customShipments > 0
      ? ((records.filter((r) => r.packageType === 'custom-5layer' && r.outcome !== 'intact').length / customShipments) * 100).toFixed(1)
      : '0';

    const totalClaimsAmount = records.reduce((sum, r) => sum + (r.outcome === 'claim-filed' ? r.claimAmount : 0), 0);
    const intactRate = totalShipments > 0 ? ((intactCount / totalShipments) * 100).toFixed(1) : '0';

    return {
      totalShipments,
      standardShipments,
      customShipments,
      giftShipments,
      intactCount,
      damagedCount,
      claimsFiledCount,
      claimsDeniedCount,
      standardDamageRate: parseFloat(standardDamageRate),
      customDamageRate: parseFloat(customDamageRate),
      totalClaimsAmount,
      intactRate: parseFloat(intactRate),
    };
  };

  const stats = calculateStats();
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'intact':
        return 'bg-green-100 text-green-900 border-green-300';
      case 'damaged':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'claim-filed':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'claim-denied':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'intact':
        return '✅';
      case 'damaged':
        return '❌';
      case 'claim-filed':
        return '📝';
      case 'claim-denied':
        return '⛔';
      default:
        return '📦';
    }
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-700">
          <p className="text-green-900 text-sm font-bold uppercase tracking-wide">Total Shipments</p>
          <p className="text-4xl font-black text-green-900 mt-2">{stats.totalShipments}</p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border-2 border-teal-900">
          <p className="text-teal-900 text-sm font-bold uppercase tracking-wide">Delivery Success</p>
          <p className="text-4xl font-black text-teal-900 mt-2">{stats.intactRate}%</p>
          <p className="text-xs text-teal-700 mt-1">{stats.intactCount} intact</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-600">
          <p className="text-amber-900 text-sm font-bold uppercase tracking-wide">5-Layer Box Performance</p>
          <p className="text-3xl font-black text-amber-900 mt-2">{stats.customDamageRate}%</p>
          <p className="text-xs text-amber-700 mt-1">damage rate</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-600">
          <p className="text-red-900 text-sm font-bold uppercase tracking-wide">Standard Box Performance</p>
          <p className="text-3xl font-black text-red-900 mt-2">{stats.standardDamageRate}%</p>
          <p className="text-xs text-red-700 mt-1">damage rate</p>
        </div>
      </div>

      {/* Add Record Form */}
      <form onSubmit={handleAddRecord} className="bg-white rounded-2xl border-2 border-teal-900 p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">📦 Log Shipment</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Ship Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Carrier</label>
            <select
              title="Shipping carrier"
              value={form.carrier}
              onChange={(e) => setForm({ ...form, carrier: e.target.value })}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="fedex">FedEx</option>
              <option value="ups">UPS</option>
              <option value="usps">USPS</option>
              <option value="dhl">DHL</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Destination</label>
            <input
              type="text"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              placeholder="e.g., New York, NY or Customer name"
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Package Type</label>
            <select
              title="Package type"
              value={form.packageType}
              onChange={(e) => setForm({ ...form, packageType: e.target.value as any })}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="standard">📦 Standard Box</option>
              <option value="custom-5layer">🛡️ Custom 5-Layer Box</option>
              <option value="special-gift">🎁 Special Sale Gift Package</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Outcome</label>
            <select
              title="Shipment outcome"
              value={form.outcome}
              onChange={(e) => setForm({ ...form, outcome: e.target.value as any })}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="intact">✅ Delivered Intact</option>
              <option value="damaged">❌ Damaged</option>
              <option value="claim-filed">📝 Claim Filed</option>
              <option value="claim-denied">⛔ Claim Denied</option>
            </select>
          </div>

          {form.outcome !== 'intact' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Damage Details</label>
              <textarea
                value={form.damageDetails}
                onChange={(e) => setForm({ ...form, damageDetails: e.target.value })}
                placeholder="Describe the damage, photos taken, etc."
                rows={2}
                className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          )}

          {form.outcome === 'claim-filed' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Claim Amount ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-lg font-bold text-teal-700">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.claimAmount}
                  onChange={(e) => setForm({ ...form, claimAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 pl-8 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>
          )}

          <div className={form.outcome === 'claim-filed' ? '' : 'md:col-span-2'}>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Additional Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any other details..."
              rows={2}
              className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black py-3 rounded-xl transition shadow-lg hover:shadow-2xl text-lg uppercase tracking-wide"
        >
          📤 Log Shipment
        </button>
      </form>

      {/* Box Comparison Analysis */}
      {stats.totalShipments > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border-2 border-amber-600 p-6">
            <p className="text-lg font-black text-gray-900 mb-4">📦 Standard Box</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Shipments:</span>
                <span className="font-bold text-gray-900">{stats.standardShipments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Damage Rate:</span>
                <span className="font-bold text-red-600">{stats.standardDamageRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-green-700 p-6">
            <p className="text-lg font-black text-gray-900 mb-4">🛡️ 5-Layer Custom Box</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Shipments:</span>
                <span className="font-bold text-gray-900">{stats.customShipments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Damage Rate:</span>
                <span className="font-bold text-green-600">{stats.customDamageRate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipment History */}
      {records.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-gray-600 text-lg font-semibold">No shipments logged yet</p>
          <p className="text-gray-500 mt-1">Start tracking shipments to measure packaging effectiveness</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-gray-900">📋 Shipment History</h3>
          {sortedRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-2xl border-2 border-teal-900 p-6 hover:shadow-lg transition">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-black text-gray-900">{record.destination}</p>
                  <p className="text-sm text-gray-600 mt-1">📅 {record.date} • 🚚 {record.carrier.toUpperCase()}</p>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-black border ${getOutcomeColor(record.outcome)}`}>
                    {getOutcomeIcon(record.outcome)} {record.outcome.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-xs font-bold text-gray-600 mb-1">PACKAGE TYPE</p>
                <p className="text-sm font-semibold text-gray-900">
                  {record.packageType === 'standard' && '📦 Standard Box'}
                  {record.packageType === 'custom-5layer' && '🛡️ Custom 5-Layer Box'}
                  {record.packageType === 'special-gift' && '🎁 Special Gift Package'}
                </p>
              </div>

              {record.damageDetails && (
                <div className="bg-red-50 border-l-4 border-red-300 p-3 mb-3">
                  <p className="text-xs font-bold text-red-900 mb-1">DAMAGE DETAILS</p>
                  <p className="text-sm text-red-800">{record.damageDetails}</p>
                </div>
              )}

              {record.claimAmount > 0 && (
                <div className="text-sm font-bold text-yellow-900 bg-yellow-50 p-2 rounded mb-3">
                  💰 Claim Amount: ${record.claimAmount.toFixed(2)}
                </div>
              )}

              {record.notes && <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mb-3">{record.notes}</p>}

              <button
                onClick={() => deleteRecord(record.id)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-bold text-xs transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* R&D Tips */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-l-4 border-teal-900 p-6 rounded-xl">
        <p className="text-sm font-bold text-teal-900 mb-2">💡 Packaging R&D Tips:</p>
        <ul className="text-sm text-teal-900 space-y-1">
          <li>✓ Compare standard vs. 5-layer box damage rates to validate investment</li>
          <li>✓ Document all damage with photos for insurance claims</li>
          <li>✓ Track claim outcomes to understand carrier responsiveness</li>
          <li>✓ Use this data to adjust packaging strategy and pricing</li>
        </ul>
      </div>
    </div>
  );
}
