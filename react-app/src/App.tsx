/**
 * Main Application Component
 * 
 * This component serves as the root of the Lone Star Statuary frontend application.
 * Currently implements a proof-of-concept interface for testing backend connectivity
 * and file upload functionality.
 * 
 * Features:
 * - Backend health check
 * - File upload capability
 * - Display of uploaded files
 * - Error handling and loading states
 * 
 * @module App
 */

import React from 'react';
import { useUserContext } from './contexts/UserContext';
import AuthButton from './components/AuthButton';
import AdminPanel from './components/AdminPanel';
//import { User } from '@lonestar/shared'; // Importing types from shared resource

/**
 * Root application component that manages file uploads and backend communication
 * 
 * @returns {JSX.Element} The rendered application
 */
function App() {
  const { isAuthenticated } = useUserContext();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Lone Star Statuary
          </h1>
          <AuthButton />
        </div>

        {/* Customer View */}
        {!isAuthenticated && (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Welcome to Lone Star Statuary
            </h2>
            <p className="text-gray-600 mb-6">
              Discover our collection of handcrafted classical sculptures and custom statuary commissions.
            </p>
            <p className="text-gray-500 text-sm">
              Please log in to explore our full catalog and services.
            </p>
          </div>
        )}

        {/* Admin View */}
        {isAuthenticated && (
          <AdminPanel />
        )}
      </div>
    </div>
  );
}

export default App;