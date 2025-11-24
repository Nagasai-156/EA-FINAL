import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import problemsRouter from './routers/problems';
import filesRouter from './routers/files';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Static serve uploads and storage
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
app.use('/storage', express.static(path.resolve(process.cwd(), 'storage')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/problems', problemsRouter);
app.use('/api/files', filesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
