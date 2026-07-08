'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface User {
  userId: string;
  phone: string;
  name: string;
  email?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<{ accountExists: boolean }>;
  signup: (name: string, email?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  currentPhone: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhone, setCurrentPhone] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [mockOtp, setMockOtp] = useState<string>('1234'); // Mock OTP for development

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const sendOTP = async (phone: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setCurrentPhone(phone);
      setOtpSent(true);
      // In production, this would call an SMS provider like Twilio
      // For now, we use mock OTP: 1234
      console.log('[v0] OTP sent to', phone, '- Mock OTP: 1234');
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string): Promise<{ accountExists: boolean }> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      // Mock OTP verification
      if (otp !== mockOtp) {
        throw new Error('Invalid OTP');
      }

      if (!currentPhone) {
        throw new Error('No phone number set');
      }

      // Check if user exists (mock: even phone numbers exist, odd don't)
      const accountExists = parseInt(currentPhone.replace(/\D/g, '')) % 2 === 0;
      
      if (accountExists) {
        // Mock user login
        const existingUser: User = {
          userId: `user_${currentPhone.replace(/\D/g, '')}`,
          phone: currentPhone,
          name: 'John Doe',
          email: `user${currentPhone.replace(/\D/g, '')}@example.com`,
          createdAt: new Date().toISOString(),
        };
        setUser(existingUser);
        localStorage.setItem('currentUser', JSON.stringify(existingUser));
        setOtpSent(false);
      }
      
      return { accountExists };
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email?: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (!currentPhone) {
        throw new Error('No phone number set');
      }

      const newUser: User = {
        userId: `user_${Date.now()}`,
        phone: currentPhone,
        name,
        email: email || undefined,
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setOtpSent(false);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        sendOTP,
        verifyOTP,
        signup,
        logout,
        isAuthenticated: !!user,
        currentPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
