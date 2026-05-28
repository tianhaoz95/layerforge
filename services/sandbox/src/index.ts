import express from 'express';
import cors from 'cors';
import { runRouter } from './routes/run';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: '512kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', supportedLanguages: ['python', 'rust'] });
});

app.use('/run', runRouter);

app.listen(PORT, () => {
  console.log(`Sandbox service listening on port ${PORT}`);
});
