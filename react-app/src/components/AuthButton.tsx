// src/components/AuthButton.tsx
import React from 'react';
import { useUserContext } from '../contexts/UserContext';

/**
 * Props for the AuthButton component
 * @interface
 */
interface AuthButtonProps {
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Authentication button component that toggles between login and logout
 * 
 * @component
 * @param {AuthButtonProps} props - Component props
 * @returns {JSX.Element} Rendered auth button
 * 
 * @example
 * <AuthButton className="my-4" />
 */
const AuthButton: React.FC<AuthButtonProps> = ({ className = '' }) => {
  const { isAuthenticated, login, logout } = useUserContext();

  return (
    <button
      onClick={() => isAuthenticated ? logout() : login()}
      className={`
        ${isAuthenticated ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'}
        text-white font-bold py-2 px-4 rounded
        transition-colors duration-200
        ${className}
      `}
    >
      {isAuthenticated ? 'Log Out' : 'Log In'}
    </button>
  );
};

export default AuthButton;