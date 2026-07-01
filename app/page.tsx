'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/catering');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100">
      <div className="text-center">
        <p className="text-6xl mb-4">🍽️</p>
        <p className="text-2xl font-bold text-gray-900">Catering System</p>
        <p className="text-gray-600 mt-2">Loading...</p>
      </div>
    </div>
  );
}
