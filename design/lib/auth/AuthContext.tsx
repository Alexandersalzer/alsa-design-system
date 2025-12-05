/**
 * Auth Context - Cookie-based Authentication
 * No token storage in frontend - httpOnly cookies only
 */

'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/api/auth/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  login: (username: string, password: string, mfaCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  /**
   * Fetch current user from backend
   * Validates session via cookies
   */
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setLoading(false);
    } catch {
      // No valid session - this is OK for login page
      console.log('No active session, user needs to login');
      setUser(null);
      setLoading(false);
    }
  }, []);
  
  /**
   * Login user
   * Backend sets httpOnly cookies
   */
  const login = useCallback(async (username: string, password: string, mfaCode?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(username, password, mfaCode);
      
      // Check if MFA required
      if (response.requiresMFA && !mfaCode) {
        setLoading(false);
        setError('MFA_REQUIRED');
        throw new Error('MFA code required');
      }
      
      // Login successful - cookies are set by backend
      setUser(response.user);
      setLoading(false);
      
      // Don't redirect here - let calling component handle it
      // This prevents race condition with state updates
      
    } catch (error: any) {
      setUser(null);
      setLoading(false);
      
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      
      throw error;
    }
  }, [router]);
  
  /**
   * Logout user
   * Clears cookies and redirects to login
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state
      setUser(null);
      setError(null);
      setLoading(false);
      
      // Dispatch cache invalidation
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('blimpify:invalidateAll'));
      }
      
      // Redirect to login
      router.push('/login');
    }
  }, [router]);
  
  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  }, []);
  
  /**
   * Initialize auth on mount
   * Check if user has valid session
   */
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  /**
   * Listen for auth expired events
   */
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
    };
    
    window.addEventListener('authExpired', handleAuthExpired);
    
    return () => {
      window.removeEventListener('authExpired', handleAuthExpired);
    };
  }, []);
  
  const value: AuthContextType = {
    user,
    loading,
    error,
    setError,
    login,
    logout,
    refreshUser,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default AuthContext;

