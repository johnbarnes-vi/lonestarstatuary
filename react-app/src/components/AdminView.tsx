// src/components/AdminView.tsx
import React from 'react';
import { useUserContext } from '../contexts/UserContext';
import { HealthCheck } from './admin/health/HealthCheck';
import { TestFileManager } from './admin/test-files/TestFileManager';
import { ProductManager } from './admin/products/ProductManager'

/**
 * Administrative panel component providing system health checks and file management
 * 
 * @component
 * @returns {JSX.Element} Rendered admin panel
 */
const AdminView: React.FC = () => {
    const { user } = useUserContext();

    return (
        <>
            <div className="mb-4">
                <p className="text-gray-600">
                    Welcome back, {user?.name}!
                </p>
            </div>

            {/* Health Check Section */}
            <HealthCheck />

            {/* Test-file Section */}
            <TestFileManager />


            {/* Product Management Section */}
            <ProductManager />
        </>
    );
};

export default AdminView;