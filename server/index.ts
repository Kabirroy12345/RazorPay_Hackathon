import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import resolveRouter from './api/resolve';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mount the API routes
app.use('/api', resolveRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Aura Ledger Backend Running' });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
