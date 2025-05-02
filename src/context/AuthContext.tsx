'use client'; // This context needs to run on the client

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config'; // Import initialized auth instance

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>; // Adjust return type as needed
  logout: () => Promise<void>;
}

// Provide a default value matching the context type, but with null/initial states
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => {}, // Default no-op async function
    logout: async () => {}, // Default no-op async function
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // Use Firebase function to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      // No need to setUser here, onAuthStateChanged will handle it
      setLoading(false);
      return userCredential; // Return credential if needed
    } catch (error) {
      setLoading(false);
      console.error("Login error in AuthContext:", error);
      throw error; // Re-throw error to be caught by the calling component
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // No need to setUser(null) here, onAuthStateChanged will handle it
      setLoading(false);
    } catch (error) {
        setLoading(false);
        console.error("Logout error in AuthContext:", error);
        throw error; // Re-throw error
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  // Don't render children until loading is false to prevent flash of unauthenticated content
  // You might want a more sophisticated loading state indicator (e.g., a spinner)
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
       {/* Or show a global loading spinner: loading ? <GlobalSpinner /> : children */}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
