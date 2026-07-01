'use client';

import { useState, useRef } from 'react';

export default function VoiceNotes() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<any[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

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
          transcript: '[Transcription will appear here]',
          notes: '',
        };

        setRecordings([newRecording, ...recordings]);
      };

      mediaRecorder.start();
      setIsRecording(true);
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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎤 Voice Notes</h2>
        <p className="text-gray-600 mb-6">
          Record conversations with clients. Notes are saved for easy reference.
        </p>

        <div className="flex gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition"
            >
              🔴 Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition animate-pulse"
            >
              ⏹ Stop Recording
            </button>
          )}
          {isRecording && <span className="text-red-600 font-bold text-lg">Recording...</span>}
        </div>
      </div>

      {recordings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-3xl mb-4">🎙️</p>
          <p className="text-gray-500">No recordings yet. Start recording your client conversations!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">📚 Your Recordings</h3>
          {recordings.map((recording) => (
            <div key={recording.id} className="border-2 border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-gray-900">📝 {recording.timestamp}</p>
                </div>
                <button
                  onClick={() => deleteRecording(recording.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                >
                  Delete
                </button>
              </div>

              <audio
                controls
                src={recording.audioUrl}
                className="w-full mb-4"
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  💬 Notes / Transcript
                </label>
                <textarea
                  value={recording.notes}
                  onChange={(e) => updateNotes(recording.id, e.target.value)}
                  placeholder="Write notes about this recording... key details, client requests, menu items discussed, etc."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Use this to save important client details, dietary restrictions, menu preferences, and delivery notes. You can reference these notes when creating invoices or confirming orders.
        </p>
      </div>
    </div>
  );
}
