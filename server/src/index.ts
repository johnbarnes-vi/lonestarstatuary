// src/index.ts
import express from 'express';
import { Response, Request } from 'express';

const app = express();

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    message: 'Backend is operational!',
    timestamp: new Date().toISOString()
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});