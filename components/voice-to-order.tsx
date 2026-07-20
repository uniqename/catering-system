'use client';

import { useState, useRef, useEffect } from 'react';

interface VoiceOrder {
  id: string;
  timestamp: string;
  duration: number;
  audioUrl: string;
  rawTranscript: string;
  extractedData: {
    clientName: string;
    eventDate: string;
    description: string;
    guestCount?: number;
    eventType?: string;
    budget?: number;
  };
  status: 'recorded' | 'transcribed' | 'reviewed' | 'converted';
  notes: string;
}

export default function VoiceToOrder({ onCreateOrder }: { onCreateOrder?: (order: any) => void }) {
  const [voiceOrders, setVoiceOrders] = useState<VoiceOrder[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<VoiceOrder | null>(null);
  const [editingData, setEditingData] = useState<VoiceOrder['extractedData'] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('catering_voice_orders');
    if (saved) {
      setVoiceOrders(JSON.parse(saved));
    }
  }, []);

  const saveVoiceOrders = (updated: VoiceOrder[]) => {
    setVoiceOrders(updated);
    localStorage.setItem('catering_voice_orders', JSON.stringify(updated));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingTime(0);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newOrder: VoiceOrder = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          duration: recordingTime,
          audioUrl,
          rawTranscript: '[Transcription pending - integration with Claude API]',
          extractedData: {
            clientName: '',
            eventDate: '',
            description: '',
          },
          status: 'recorded',
          notes: '',
        };

        saveVoiceOrders([newOrder, ...voiceOrders]);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const deleteVoiceOrder = (id: string) => {
    saveVoiceOrders(voiceOrders.filter((v) => v.id !== id));
    if (selectedOrder?.id === id) {
      setSelectedOrder(null);
      setEditingData(null);
    }
  };

  const updateExtractedData = (id: string, data: VoiceOrder['extractedData']) => {
    const updated = voiceOrders.map((v) => (v.id === id ? { ...v, extractedData: data, status: 'reviewed' as const } : v));
    saveVoiceOrders(updated);
    setEditingData(data);
    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, extractedData: data, status: 'reviewed' });
    }
  };

  const convertToOrder = (order: VoiceOrder) => {
    if (!order.extractedData.clientName || !order.extractedData.eventDate) {
      alert('Please fill in at least client name and event date');
      return;
    }

    const newOrder = {
      clientName: order.extractedData.clientName,
      eventDate: order.extractedData.eventDate,
      guestCount: order.extractedData.guestCount || 50,
      eventType: order.extractedData.eventType || 'other',
      notes: order.extractedData.description,
    };

    if (onCreateOrder) {
      onCreateOrder(newOrder);
    }

    const updated = voiceOrders.map((v) => (v.id === order.id ? { ...v, status: 'converted' as const } : v));
    saveVoiceOrders(updated);
    setSelectedOrder({ ...order, status: 'converted' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedOrders = [...voiceOrders].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-8">
      {/* Recording Section */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-3 border-amber-600">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-2">🎤 Voice-to-Order Capture</h2>
          <p className="text-gray-600 mb-8">Record client call → Auto-extract order details → Review & convert</p>

          <div className="flex flex-col items-center gap-6">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="bg-amber-600 hover:bg-amber-700 text-white font-black py-6 px-12 rounded-2xl text-2xl transition shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                🔴 Start Recording
              </button>
            ) : (
              <div className="space-y-4 w-full">
                <div className="text-center">
                  <p className="text-6xl font-black text-amber-700 font-mono mb-4">{formatTime(recordingTime)}</p>
                  <p className="text-lg font-bold text-amber-700 animate-pulse">● Recording in progress...</p>
                </div>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="w-full bg-teal-900 hover:bg-teal-950 text-white font-black py-6 rounded-2xl text-xl transition shadow-lg"
                >
                  ⏹ Stop Recording
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 bg-teal-100 border-l-4 border-teal-900 p-4 rounded text-left">
            <p className="text-sm font-bold text-teal-900 mb-2">📝 What to record:</p>
            <ul className="text-sm text-teal-800 space-y-1">
              <li>✓ Client name and contact info</li>
              <li>✓ Event date and type</li>
              <li>✓ Guest count and budget</li>
              <li>✓ Menu preferences and dietary restrictions</li>
              <li>✓ Any special requests or delivery notes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Voice Orders List */}
      {sortedOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <p className="text-6xl mb-4">🎙️</p>
          <p className="text-gray-600 text-lg font-semibold">No voice recordings yet</p>
          <p className="text-gray-500 mt-1">Start recording your client conversations!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-1 space-y-2 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-black text-gray-900 mb-4">📚 Recordings ({sortedOrders.length})</h3>
            {sortedOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  setEditingData(order.extractedData);
                }}
                className={`w-full text-left p-4 rounded-xl transition border-2 ${
                  selectedOrder?.id === order.id
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-800 shadow-lg'
                    : 'bg-white border-teal-900 hover:border-amber-500 hover:shadow-md'
                }`}
              >
                <p className="font-bold text-sm">{order.timestamp}</p>
                <p className={`text-xs ${selectedOrder?.id === order.id ? 'text-amber-50' : 'text-gray-500'}`}>
                  {formatTime(order.duration)} • {order.status}
                </p>
                {order.extractedData.clientName && (
                  <p className={`text-xs font-semibold mt-1 ${selectedOrder?.id === order.id ? 'text-amber-50' : 'text-teal-900'}`}>
                    {order.extractedData.clientName}
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Order Details */}
          {selectedOrder && editingData && (
            <div className="lg:col-span-2 space-y-6">
              {/* Audio Player */}
              <div className="bg-white rounded-2xl border-2 border-teal-900 p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4">🎵 Audio Recording</h3>
                <audio
                  controls
                  src={selectedOrder.audioUrl}
                  className="w-full rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2">{selectedOrder.timestamp} • {formatTime(selectedOrder.duration)}</p>
              </div>

              {/* Raw Transcript */}
              <div className="bg-white rounded-2xl border-2 border-teal-900 p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4">📝 Raw Transcript</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 max-h-32 overflow-y-auto">
                  {selectedOrder.rawTranscript}
                </div>
                <p className="text-xs text-gray-500 mt-2">💡 Powered by Claude API speech-to-text (coming soon)</p>
              </div>

              {/* Extracted Data - Editable */}
              <div className="bg-white rounded-2xl border-2 border-teal-900 p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4">✏️ Extract & Edit Order Data</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      value={editingData.clientName}
                      onChange={(e) => setEditingData({ ...editingData, clientName: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Event Date *</label>
                    <input
                      type="date"
                      value={editingData.eventDate}
                      onChange={(e) => setEditingData({ ...editingData, eventDate: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Guest Count</label>
                    <input
                      type="number"
                      value={editingData.guestCount || ''}
                      onChange={(e) => setEditingData({ ...editingData, guestCount: parseInt(e.target.value) || undefined })}
                      placeholder="50"
                      className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Event Type</label>
                    <select
                      value={editingData.eventType || ''}
                      onChange={(e) => setEditingData({ ...editingData, eventType: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      <option value="">Select type...</option>
                      <option value="wedding">💒 Wedding</option>
                      <option value="birthday">🎂 Birthday</option>
                      <option value="corporate">💼 Corporate</option>
                      <option value="graduation">🎓 Graduation</option>
                      <option value="other">🎪 Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description & Special Requests</label>
                    <textarea
                      value={editingData.description}
                      onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                      placeholder="Menu preferences, dietary restrictions, delivery notes..."
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-teal-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateExtractedData(selectedOrder.id, editingData)}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition"
                    >
                      💾 Save Edits
                    </button>
                    <button
                      onClick={() => convertToOrder(selectedOrder)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 font-bold transition"
                    >
                      ✅ Convert to Order
                    </button>
                    <button
                      onClick={() => deleteVoiceOrder(selectedOrder.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-bold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Integration Status */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-xl">
        <p className="text-sm font-bold text-blue-900 mb-2">🚀 Integration Status:</p>
        <ul className="text-sm text-blue-900 space-y-1">
          <li>✓ Voice recording capture working</li>
          <li>⏳ Claude API speech-to-text transcription (ready to integrate)</li>
          <li>⏳ Auto-extract order data from transcript (ready to integrate)</li>
          <li>📌 Awaiting field confirmation from Alexandra for intake schema</li>
        </ul>
      </div>
    </div>
  );
}
