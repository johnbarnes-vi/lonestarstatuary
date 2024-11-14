import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';  // Using promises version
import fs_sync from 'fs';  // We still need sync version for multer setup

// Ensure upload directories exist
const createUploadDirs = async () => {
    const baseDir = process.env.UPLOAD_DIR || '/app/uploads';
    const dirs = [
        path.join(baseDir, 'test'),
        path.join(baseDir, 'products'),
        path.join(baseDir, 'commissions')
    ];

    for (const dir of dirs) {
        if (!fs_sync.existsSync(dir)) {
            await fs.mkdir(dir, { recursive: true });
        }
    }
};

// Create directories on startup
createUploadDirs().catch(err => {
    console.error('Failed to create upload directories:', err);
    process.exit(1);  // Exit if we can't create essential directories
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const baseDir = process.env.UPLOAD_DIR || '/app/uploads';
        const uploadDir = path.join(baseDir, 'test'); // For our test endpoint
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Add timestamp to prevent naming conflicts
        const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        cb(null, fileName);
    }
});

export const upload = multer({
    storage,
    // size limits determined in nginx config
});