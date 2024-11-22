// src/hooks/admin/useTestFiles.ts

import { useState, useCallback } from 'react';
import { useUserContext } from '../../../contexts/UserContext';

interface FileResponse {
    message: string;
    fileUrl: string;
}

interface FilesResponse {
    files: string[];
}

export const useTestFiles = () => {
    const { fetchWithAuth } = useUserContext();
    const [uploadedFile, setUploadedFile] = useState<FileResponse | null>(null);
    const [files, setFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFiles = useCallback(async () => {
        try {
            const res = await fetchWithAuth('/api/disk/test/files', { method: 'GET' });
            if (!res.ok) throw new Error('Failed to fetch files');
            const data: FilesResponse = await res.json();
            setFiles(data.files);
        } catch (err) {
            console.error('Error fetching files:', err);
        }
    }, [fetchWithAuth]); // No dependencies as it doesn't use any external values

    const uploadFile = useCallback(async (file: File) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetchWithAuth('/api/disk/test/files', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            const data: FileResponse = await res.json();
            setUploadedFile(data);
            await fetchFiles();
        } catch (err) {
            console.error(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setLoading(false);
        }
    }, [fetchFiles, fetchWithAuth]); // Include fetchFiles in dependencies

    return {
        uploadedFile,
        files,
        loading,
        uploadFile,
        fetchFiles
    };
};