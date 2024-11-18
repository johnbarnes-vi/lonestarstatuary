// src/components/admin/files/TestFileManager.tsx

import React, { useEffect } from 'react';
import { useTestFiles } from './useTestFiles';

export const TestFileManager: React.FC = () => {
    const { uploadedFile, files, loading, uploadFile, fetchFiles } = useTestFiles();

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    return (
        <div className="space-y-8">
            {/* Upload Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Test File Upload</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-4"
                    accept="image/*"
                    disabled={loading}
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

            {/* File Gallery Section */}
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
    );
};