import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);

export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads');
export const STORAGE_DIR = process.env.STORAGE_DIR || path.resolve(process.cwd(), 'storage');

export async function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

export function safeFilename(original: string) {
  const ts = Date.now();
  const clean = original.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  return `${ts}_${clean}`;
}
