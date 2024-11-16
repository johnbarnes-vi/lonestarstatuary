/**
 * User Context Provider
 * 
 * Provides user-related state and functionality throughout the application.
 * Wraps Auth0 authentication with application-specific user data and behaviors.
 * 
 * @module contexts/UserContext
 */

import React, { createContext, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * Valid HTTP methods for API requests
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Interface defining the shape of the context value
 */
interface UserContextValue {
  isAuthenticated: boolean;
  user: {
    email?: string;
    name?: string;
    // Add other user properties as needed
  } | null;
  login: () => Promise<void>;
  logout: () => void;
  // Add fetchWithAuth to the context value
  fetchWithAuth: (
    url: string,
    options?: Omit<RequestInit, 'method'> & { method?: HttpMethod }
  ) => Promise<Response>;
}

/**
 * Props type for the UserProvider component
 */
interface UserProviderProps {
  children: React.ReactNode;
}

// Create context with a default value matching our interface
const UserContext = createContext<UserContextValue | null>(null);

/**
 * Custom hook to consume the UserContext
 * 
 * @throws {Error} If used outside of UserProvider
 * @returns {UserContextValue} The user context value
 */
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

/**
 * Provider component that wraps the application and provides user context
 * 
 * @component
 * @param {UserProviderProps} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  /**
   * Helper function for making authenticated API calls
   * 
   * @param {string} url - The URL to fetch from
   * @param {Object} options - Fetch options including HTTP method
   * @returns {Promise<Response>} Fetch response promise
   * 
   * @example
   * const response = await fetchWithAuth('/api/data', { method: 'POST', body: JSON.stringify(data) });
   */
  const fetchWithAuth = async (
    url: string,
    options: Omit<RequestInit, 'method'> & { method?: HttpMethod } = { method: 'GET' }
  ): Promise<Response> => {
    try {
      const token = await getAccessTokenSilently();
      return fetch(url, {
        method: options.method || 'GET',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });
    } catch (error) {
      console.error('Error in fetchWithAuth:', error);
      throw error;
    }
  };

  // Define the context value object
  const value: UserContextValue = {
    isAuthenticated,
    user: user ? {
      email: user.email,
      name: user.name,
      // Add other user properties as needed
    } : null,
    login: loginWithRedirect,
    logout: () => auth0Logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      }
    }),
    fetchWithAuth,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};