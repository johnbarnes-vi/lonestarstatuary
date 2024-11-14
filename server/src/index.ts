// src/index.ts
import express from 'express';
import { Response, Request } from 'express';
import { upload } from './config/upload';
import path from 'path';
import { promises as fs } from 'fs';  // Using promises version for better async handling
import fs_sync from 'fs';  // We still need sync version for multer setup

const app = express();

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    message: 'Backend is operational!',
    timestamp: new Date().toISOString()
  });
});

// src/index.ts
app.post('/api/test/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('File upload details:', {
    originalname: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    destination: req.file.destination,
    size: req.file.size
  });

  const fileUrl = `/uploads/test/${req.file.filename}`;
  
  // Verify file exists after save
  if (!fs_sync.existsSync(req.file.path)) {
    console.error('File not found at path after upload:', req.file.path);
    return res.status(500).json({ error: 'File save failed' });
  }

  res.json({
    message: 'File uploaded successfully',
    fileUrl,
    details: {
      path: req.file.path,
      size: req.file.size
    }
  });
});

// Get list of test uploads
app.get('/api/test/files', async (req: Request, res: Response) => {
  try {
    const testDir = path.join(process.env.UPLOAD_DIR || '/app/uploads', 'test');
    const files = await fs.readdir(testDir);
    const fileUrls = files.map(file => `/uploads/test/${file}`);
    res.json({ files: fileUrls });
  } catch (error) {
    console.error('Error reading upload directory:', error);
    res.status(500).json({ error: 'Failed to read uploads directory' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});