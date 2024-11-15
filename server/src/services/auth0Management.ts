/**
 * Auth0 Management API Service
 * 
 * Handles interactions with Auth0 Management API including:
 * - Getting management API access tokens
 * - Fetching user roles
 * 
 * @module services/auth0Management
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface ManagementTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

class Auth0ManagementService {
  private static instance: Auth0ManagementService;
  private managementToken: string | null = null;
  private tokenExpiresAt: number = 0;

  private constructor() {}

  public static getInstance(): Auth0ManagementService {
    if (!this.instance) {
      this.instance = new Auth0ManagementService();
    }
    return this.instance;
  }

  /**
   * Gets a valid management API token, refreshing if necessary
   * 
   * @returns {Promise<string>} Valid management API token
   * @throws {Error} If token acquisition fails
   */
  private async getManagementToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.managementToken && Date.now() < this.tokenExpiresAt) {
      return this.managementToken;
    }

    const tokenUrl = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;
    const payload = {
      client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
      client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials'
    };

    try {
      const response = await axios.post<ManagementTokenResponse>(tokenUrl, payload);
      this.managementToken = response.data.access_token;
      // Set expiration to slightly before actual expiry to ensure token validity
      this.tokenExpiresAt = Date.now() + (response.data.expires_in * 1000) - 60000;
      return this.managementToken;
    } catch (error) {
      console.error('Error obtaining Management API token:', error);
      throw new Error('Failed to obtain Management API token');
    }
  }

  /**
   * Fetches user roles from Auth0
   * 
   * @param {string} userId - Auth0 user ID (including identity provider prefix)
   * @returns {Promise<Role[]>} Array of user roles
   * @throws {Error} If role fetching fails
   */
  public async getUserRoles(userId: string): Promise<Role[]> {
    try {
      const token = await this.getManagementToken();
      const response = await axios.get<Role[]>(
        `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`,
        {
          headers: { authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw new Error('Failed to fetch user roles');
    }
  }
}

// Export singleton instance
export const auth0ManagementService = Auth0ManagementService.getInstance();