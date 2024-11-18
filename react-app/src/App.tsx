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
import AdminView from './components/AdminView';
import CustomerView from './components/CustomerView';
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

        {/* Main Content */}
        {isAuthenticated ? <AdminView /> : <CustomerView />}
      </div>
    </div>
  );
}

export default App;