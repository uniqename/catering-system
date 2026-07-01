'use client';

import { useState, useRef } from 'react';

export default function VoiceNotes() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const timestamp = new Date().toLocaleString();

        const newRecording = {
          id: Date.now().toString(),
          timestamp,
          audioUrl,
          duration: recordingTime,
          notes: '',
        };

        setRecordings([newRecording, ...recordings]);
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

  const deleteRecording = (id: string) => {
    setRecordings(recordings.filter((r) => r.id !== id));
  };

  const updateNotes = (id: string, notes: string) => {
    setRecordings(
      recordings.map((r) => (r.id === id ? { ...r, notes } : r))
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Recording Button Section */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 border-3 border-red-400">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-2">🎤 Voice Recorder</h2>
          <p className="text-gray-600 mb-8">Record client conversations for easy reference</p>

          <div className="flex flex-col items-center gap-6">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white font-black py-6 px-12 rounded-2xl text-2xl transition shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                🔴 Start Recording
              </button>
            ) : (
              <div className="space-y-4 w-full">
                <div className="text-center">
                  <p className="text-6xl font-black text-red-600 font-mono mb-4">{formatTime(recordingTime)}</p>
                  <p className="text-lg font-bold text-red-600 animate-pulse">● Recording in progress...</p>
                </div>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-black py-6 rounded-2xl text-xl transition shadow-lg"
                >
                  ⏹ Stop Recording
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recordings List */}
      {recordings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-6xl mb-6">🎙️</p>
          <p className="text-gray-600 text-xl font-semibold mb-2">No recordings yet</p>
          <p className="text-gray-500">Start recording your client conversations!</p>
        </div>
      ) : (
        <div className="space-y-5">
          <h3 className="text-2xl font-black text-gray-900">📚 Saved Recordings</h3>
          {recordings.map((recording) => (
            <div
              key={recording.id}
              className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-red-400 transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="font-black text-gray-900 text-lg">📝 {recording.timestamp}</p>
                  <p className="text-sm text-gray-500 mt-1">Duration: {formatTime(recording.duration)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteRecording(recording.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-bold text-sm transition"
                >
                  Delete
                </button>
              </div>

              <audio
                controls
                src={recording.audioUrl}
                className="w-full mb-6 rounded-lg"
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  💬 Notes & Details
                </label>
                <textarea
                  value={recording.notes}
                  onChange={(e) => updateNotes(recording.id, e.target.value)}
                  placeholder="Dietary restrictions • Menu preferences • Client requests • Delivery notes • Payment terms..."
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition text-lg"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-xl">
        <p className="text-sm text-blue-900 font-semibold mb-2">💡 Pro Tips:</p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Save dietary restrictions and allergies for quick reference</li>
          <li>• Note preferred menu items and special requests</li>
          <li>• Record payment terms and delivery instructions</li>
          <li>• Keep client contact preferences and peak dates</li>
        </ul>
      </div>
    </div>
  );
}
