// src/controllers/user.controller.ts
/**
 * User Roles Controller
 * 
 * Handles user role operations through Auth0 Management API.
 * Used to supplement client-side user profile with role information.
 * 
 * @module controllers/user
 */
import { Request, Response } from 'express';
import { auth0ManagementService } from '../services/auth0Management';

export const getUserRoles = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.payload.sub;
    if (!userId) {
      return res.status(401).json({ error: 'No user ID found in token' });
    }

    const roles = await auth0ManagementService.getUserRoles(userId);
    res.json({ roles });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user roles',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};