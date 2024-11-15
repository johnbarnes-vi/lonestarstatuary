// src/routes/admin.routes.ts
import express from 'express';
import { checkJwt } from '../middleware/authMiddleware';
import { healthCheck } from '../controllers/admin.controller';

const router = express.Router();

router.get('/health', checkJwt, healthCheck);

export default router;