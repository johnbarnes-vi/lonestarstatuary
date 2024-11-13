// src/App.tsx
import React, { useState } from 'react';

interface ApiResponse {
  message: string;
  timestamp: string;
}

function App() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBackend = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('API request failed');
      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Lone Star Statuary
        </h1>
        
        <button
          onClick={checkBackend}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Backend Connection'}
        </button>

        {error && (
          <div className="mt-4 text-red-600">
            Error: {error}
          </div>
        )}

        {response && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700">Backend Response:</h2>
            <pre className="mt-2 bg-gray-50 p-4 rounded">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;