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
import { Routes, Route } from 'react-router-dom';
import { useUserContext } from './contexts/UserContext';
import AuthButton from './components/AuthButton';
import AdminView from './components/AdminView';
import CustomerView from './components/CustomerView';
import ProductDetails from './components/products/ProductDetails';
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
      <div className="max-w-7xl mx-auto">
        {/* Top Bar - Always visible */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Lone Star Statuary
            </h1>
            <AuthButton />
          </div>
        </div>

        {/* Routes */}
        <Routes>
          {/* Product Details Route */}
          <Route
            path="/products/:slug"
            element={<ProductDetails />}
          />

          {/* Default Route (Home) */}
          <Route
            path="/"
            element={
              <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-full p-6">
                {isAuthenticated ? <AdminView /> : <CustomerView />}
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;