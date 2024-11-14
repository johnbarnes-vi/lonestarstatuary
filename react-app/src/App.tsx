// src/App.tsx
import React, { useState, useEffect } from 'react';

interface ApiResponse {
  message: string;
  timestamp: string;
}

interface FileResponse {
  message: string;
  fileUrl: string;
}

interface FilesResponse {
  files: string[];
}

function App() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<FileResponse | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing files on load
  useEffect(() => {
    fetchFiles();
  }, []);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;

    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/test/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data: FileResponse = await res.json();
      setUploadedFile(data);
      // Refresh file list
      fetchFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/test/files');
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Lone Star Statuary
        </h1>
        
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
            onChange={handleFileUpload}
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
      </div>
    </div>
  );
}

export default App;