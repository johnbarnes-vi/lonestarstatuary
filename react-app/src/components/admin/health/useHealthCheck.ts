// src/hooks/admin/useHealthCheck.ts

import { useState } from 'react';
import { useUserContext } from '../../../contexts/UserContext';

interface HealthCheckResponse {
    message: string;
    timestamp: string;
    roles?: string[];
    userId?: string;
}

export const useHealthCheck = () => {
    const { fetchWithAuth } = useUserContext();
    const [response, setResponse] = useState<HealthCheckResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkHealth = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchWithAuth('/api/admin/health');
            if (!res.ok) throw new Error('API request failed');
            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return {
        checkHealth,
        response,
        loading,
        error
    };
};