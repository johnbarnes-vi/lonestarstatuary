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

import React, { useState, useEffect } from 'react';
import { useUserContext } from './contexts/UserContext';
import { User } from '@lonestar/shared'; // Importing types from shared resource

/**
 * Represents the response from the health check endpoint
 */
interface ApiResponse {
  message: string;
  timestamp: string;
}

/**
 * Represents the response from the file upload endpoint
 */
interface FileResponse {
  message: string;
  fileUrl: string;
}

/**
 * Represents the response from the file listing endpoint
 */
interface FilesResponse {
  files: string[];
}

/**
 * Root application component that manages file uploads and backend communication
 * 
 * @returns {JSX.Element} The rendered application
 */
function App() {
  const { isAuthenticated, user, login, logout, fetchWithAuth } = useUserContext();
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<FileResponse | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches existing files on component mount
   */
  useEffect(() => {
    fetchTestFiles();
  }, []);

  /**
     * Performs a health check request to the backend
     * 
     * @async
     * @stateChanges
     * - loading: true -> false (tracks request status)
     * - error: null -> string | null (tracks error state)
     * - response: null -> ApiResponse | null (stores backend response)
     */
  const checkBackend = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth('/api/admin/health', { method: 'GET' });
      if (!res.ok) throw new Error('API request failed');
      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles file upload events from the file input
   * Uploads the selected file and updates the UI accordingly
   * 
   * @async
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event
   * @stateChanges
   * - loading: true -> false (tracks upload status)
   * - error: null -> string | null (tracks upload errors)
   * - uploadedFile: null -> FileResponse | null (stores upload response)
   * - files: string[] -> string[] (updated via fetchFiles)
   */
  const handleTestFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;

    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/disk/test/files', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data: FileResponse = await res.json();
      setUploadedFile(data);
      // Refresh file list
      fetchTestFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches the list of previously uploaded files
   * 
   * @async
   * @sideEffect Logs errors to console
   * @stateChanges
   * - files: string[] -> string[] (updates with fetched file URLs)
   */
  const fetchTestFiles = async () => {
    try {
      const res = await fetch('/api/disk/test/files', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch files');
      const data: FilesResponse = await res.json();
      setFiles(data.files);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Lone Star Statuary
          </h1>
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={() => login()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Log In
            </button>
          )}
        </div>

        {!isAuthenticated ? (
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
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Welcome back, {user?.name}!
              </p>
            </div>

            {/* Health Check Section */}
            <div className="mb-8">
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

            {/* File Upload Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Test File Upload</h2>
              <input
                type="file"
                onChange={handleTestFileUpload}
                className="mb-4"
                accept="image/*"
              />

              {uploadedFile && (
                <div className="mt-4">
                  <p className="text-green-600">{uploadedFile.message}</p>
                  <img
                    src={uploadedFile.fileUrl}
                    alt="Uploaded file"
                    className="mt-2 max-w-full h-auto rounded"
                  />
                </div>
              )}
            </div>

            {/* Existing Files Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Uploaded Files</h2>
              <div className="grid grid-cols-2 gap-4">
                {files.map((fileUrl, index) => (
                  <img
                    key={index}
                    src={fileUrl}
                    alt={`Uploaded file ${index + 1}`}
                    className="w-full h-auto rounded"
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;