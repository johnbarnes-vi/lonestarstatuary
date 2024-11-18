// src/hooks/admin/useTestFiles.ts

import { useState } from 'react';

interface FileResponse {
    message: string;
    fileUrl: string;
}

interface FilesResponse {
    files: string[];
}

export const useTestFiles = () => {
    const [uploadedFile, setUploadedFile] = useState<FileResponse | null>(null);
    const [files, setFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const uploadFile = async (file: File) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/disk/test/files', {
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
    };

    const fetchFiles = async () => {
        try {
            const res = await fetch('/api/disk/test/files', { method: 'GET' });
            if (!res.ok) throw new Error('Failed to fetch files');
            const data: FilesResponse = await res.json();
            setFiles(data.files);
        } catch (err) {
            console.error('Error fetching files:', err);
        }
    };

    return {
        uploadedFile,
        files,
        loading,
        uploadFile,
        fetchFiles
    };
};