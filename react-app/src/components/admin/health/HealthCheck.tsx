// src/components/admin/health/HealthCheck.tsx

import React from 'react';
import { useHealthCheck } from './useHealthCheck';

export const HealthCheck: React.FC = () => {
    const { checkHealth, response, loading, error } = useHealthCheck();

    return (
        <div className="mb-8">
            <button
                onClick={checkHealth}
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
    );
};