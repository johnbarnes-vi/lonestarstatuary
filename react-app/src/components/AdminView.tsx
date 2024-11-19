import React, { useState } from 'react';
import { CollapsibleSection } from './common/CollapsibleSection';
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
    const [isHealthCheckExpanded, setIsHealthCheckExpanded] = useState(true);
    const [isFileManagerExpanded, setIsFileManagerExpanded] = useState(true);
    const [isProductManagerExpanded, setIsProductManagerExpanded] = useState(true);

    return (
        <>
            <div className="mb-4">
                <p className="text-gray-600">
                    Welcome back, {user?.name}!
                </p>
            </div>

            <div className="space-y-4">
                <CollapsibleSection
                    title="Health Check"
                    maxHeight='FULL_HEIGHT'
                    isExpanded={isHealthCheckExpanded}
                    onToggle={() => setIsHealthCheckExpanded(!isHealthCheckExpanded)}
                >
                    <HealthCheck />
                </CollapsibleSection>

                <CollapsibleSection
                    title="Test File Manager"
                    maxHeight="400px"
                    isExpanded={isFileManagerExpanded}
                    onToggle={() => setIsFileManagerExpanded(!isFileManagerExpanded)}
                >
                    <TestFileManager />
                </CollapsibleSection>

                <CollapsibleSection
                    title="Product Management"
                    maxHeight='FULL_HEIGHT'
                    isExpanded={isProductManagerExpanded}
                    onToggle={() => setIsProductManagerExpanded(!isProductManagerExpanded)}
                >
                    <ProductManager />
                </CollapsibleSection>
            </div>
        </>
    );
};

export default AdminView;