// src/routes/user.routes.ts
/**
 * User Routes
 * 
 * Defines routes for user role operations.
 */
import express from 'express';
import { checkJwt } from '../middleware/authMiddleware';
import { getUserRoles } from '../controllers/user.controller';

const router = express.Router();

router.get('/roles', checkJwt, getUserRoles);

export default router;
