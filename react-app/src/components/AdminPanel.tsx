// src/components/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';

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
 * Administrative panel component providing system health checks and file management
 * 
 * @component
 * @returns {JSX.Element} Rendered admin panel
 */
const AdminPanel: React.FC = () => {
    const { fetchWithAuth, user } = useUserContext();
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
    );
};

export default AdminPanel;