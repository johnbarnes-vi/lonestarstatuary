// src/utils/uploadUtils.ts

import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Valid upload directory types
 * Constrains upload destinations to specific subdirectories
 */
export type UploadDirectory = 'test' | 'products' | 'commissions';

// We can add this array to make it easy to iterate over all directories
export const UPLOAD_DIRECTORIES: UploadDirectory[] = ['test', 'products', 'commissions'];

/**
 * Gets the base upload directory based on environment
 * 
 * @throws {Error} If UPLOAD_DIR is not set in production environment
 * @returns {string} The base upload directory path
 */
export const getBaseUploadDir = (): string => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    if (!process.env.UPLOAD_DIR) {
      throw new Error('UPLOAD_DIR environment variable must be set in production');
    }
    return process.env.UPLOAD_DIR;
  }

  return path.join(process.cwd(), 'uploads');
};



/**
 * Gets the full path for a specific upload directory
 * 
 * @param {UploadDirectory} directory - The subdirectory name
 * @returns {string} The full directory path
 */
export const getUploadPath = (directory: UploadDirectory): string => {
  return path.join(getBaseUploadDir(), directory);
};

/**
 * Gets all upload directory paths
 * 
 * @returns {string[]} Array of full paths for all upload directories
 */
export const getAllUploadPaths = (): string[] => {
    return UPLOAD_DIRECTORIES.map(getUploadPath);
  };