import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import resolveRouter from './api/resolve';
import authRouter from './api/auth';
import remediateRouter from './api/remediate';
import forecastRouter from './api/forecast';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mount the API routes
app.use('/api', resolveRouter);
app.use('/api/auth', authRouter);
app.use('/api', remediateRouter);
app.use('/api', forecastRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OmniSettle AI Backend Running' });
});

// Serve frontend static build in production
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
