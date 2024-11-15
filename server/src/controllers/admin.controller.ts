// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { auth0ManagementService } from '../services/auth0Management';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.payload.sub;
    if (!userId) {
      return res.status(401).json({ error: 'No user ID found in token' });
    }

    const roles = await auth0ManagementService.getUserRoles(userId);
    
    res.json({
      message: 'Backend is operational!',
      timestamp: new Date().toISOString(),
      roles,
      userId
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch roles',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};