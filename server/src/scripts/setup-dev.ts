// scripts/setup-dev.ts
import { promises as fs } from 'fs';
import path from 'path';

async function setupDevEnvironment() {
  // Create uploads directory in project root
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const subdirs = ['test', 'products', 'commissions'];

  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);

    for (const subdir of subdirs) {
      const dir = path.join(uploadsDir, subdir);
      await fs.mkdir(dir, { recursive: true });
      console.log('Created subdirectory:', dir);
    }

    console.log('\nDevelopment environment setup complete!');
  } catch (err) {
    console.error('Error setting up development environment:', err);
    process.exit(1);
  }
}

setupDevEnvironment();