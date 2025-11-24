import app from './app';
import dotenv from 'dotenv';
import { ensureDir, UPLOAD_DIR, STORAGE_DIR } from './services/storage';
import path from 'path';

dotenv.config();

async function start() {
  try {
    // Ensure directories exist
    await ensureDir(UPLOAD_DIR);
    await ensureDir(STORAGE_DIR);
    await ensureDir(path.join(STORAGE_DIR, 'waves'));

    const PORT = process.env.PORT || 4000;
    
    app.listen(PORT, () => {
      console.log(`🚀 Backend listening on http://localhost:${PORT}`);
      console.log(`📁 Uploads directory: ${UPLOAD_DIR}`);
      console.log(`📁 Storage directory: ${STORAGE_DIR}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
