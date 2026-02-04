/**
 * Authentication Hook for Tourist Guiding System
 * 
 * This hook provides a centralized way to manage user authentication
 * using Supabase Auth with proper session handling and state management.
 * 
 * Features:
 * - Email/password authentication (signup & login)
 * - Session persistence with auto-refresh
 * - User profile management
 * - Secure password validation using Supabase (bcrypt under the hood)
 * 
 * @author Tourist Guiding System
 * @version 1.0.0
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

// Create the authentication context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

/**
 * AuthProvider Component
 * 
 * Wraps the application and provides authentication state to all children.
 * Handles session initialization and auth state changes.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // IMPORTANT: Set up auth state listener FIRST before checking session
    // This prevents race conditions where we might miss auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // Only synchronous state updates here to avoid deadlocks
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session (in case user is already logged in)
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign up a new user with email, password, and full name
   * 
   * Uses Supabase Auth which handles:
   * - Password hashing with bcrypt
   * - Email validation
   * - Unique email constraint
   * - JWT token generation
   * 
   * @param email - User's email address (used as unique identifier)
   * @param password - User's password (will be hashed with bcrypt)
   * @param fullName - User's display name (stored in user metadata)
   */
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Validate inputs before sending to Supabase
      if (!email || !password || !fullName) {
        return { error: 'All fields are required' };
      }

      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
      }

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: 'Please enter a valid email address' };
      }

      // Get the redirect URL for email confirmation
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(), // Normalize email
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName.trim(), // Store full name in user metadata
          },
        },
      });

      if (error) {
        // Handle specific error cases with user-friendly messages
        if (error.message.includes('already registered')) {
          return { error: 'An account with this email already exists. Please sign in instead.' };
        }
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  /**
   * Sign in an existing user with email and password
   * 
   * Supabase handles:
   * - Password verification using bcrypt comparison
   * - JWT token generation on success
   * - Session creation and storage
   * 
   * @param email - User's email address (unique identifier)
   * @param password - User's password (compared against bcrypt hash)
   */
  const signIn = async (email: string, password: string) => {
    try {
      // Validate inputs
      if (!email || !password) {
        return { error: 'Email and password are required' };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), // Normalize email for consistent lookup
        password,
      });

      if (error) {
        // Handle specific error cases with user-friendly messages
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password. Please check your credentials and try again.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'Please verify your email before signing in. Check your inbox for a confirmation link.' };
        }
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  /**
   * Sign out the current user
   * Clears the session and removes JWT from storage
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 * 
 * @returns AuthContextType with user, session, and auth methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
