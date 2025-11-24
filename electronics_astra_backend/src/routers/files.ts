import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadProblemFile } from '../controllers/fileController';
import { UPLOAD_DIR } from '../services/storage';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const fname = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    cb(null, fname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/:problemId', upload.single('file'), uploadProblemFile);

export default router;
