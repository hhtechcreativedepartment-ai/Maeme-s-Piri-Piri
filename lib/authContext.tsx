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
  checkAccount: (phone: string, email?: string) => Promise<{ phoneExists: boolean; emailExists: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const REGISTERED_USERS_KEY = 'maemes.registeredUsers';

function normalisePhone(phone: string) {
  return `+44${phone.replace(/\D/g, '').slice(-10)}`;
}

function readRegisteredUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]') as User[];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: User[]) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhone, setCurrentPhone] = useState<string | null>(null);
  const [, setOtpSent] = useState(false);
  const [mockOtp] = useState<string>('1234'); // Mock OTP for development

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
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkAccount = async (phone: string, email?: string) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const normalisedPhone = normalisePhone(phone);
    const normalisedEmail = email?.trim().toLowerCase();
    const registeredUsers = readRegisteredUsers();
    const phoneExists = registeredUsers.some(candidate => normalisePhone(candidate.phone) === normalisedPhone)
      || parseInt(normalisedPhone.replace(/\D/g, ''), 10) % 2 === 0;
    const emailExists = Boolean(normalisedEmail && registeredUsers.some(
      candidate => candidate.email?.trim().toLowerCase() === normalisedEmail
    ));
    return { phoneExists, emailExists };
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

      const normalisedPhone = normalisePhone(currentPhone);
      const registeredUser = readRegisteredUsers().find(
        candidate => normalisePhone(candidate.phone) === normalisedPhone
      );
      // Existing prototype accounts use even phone numbers; newly registered
      // accounts are resolved from the same persisted auth registry.
      const accountExists = Boolean(registeredUser) || parseInt(normalisedPhone.replace(/\D/g, ''), 10) % 2 === 0;
      
      if (accountExists) {
        // Mock user login
        const existingUser: User = registeredUser || {
          userId: `user_${normalisedPhone.replace(/\D/g, '')}`,
          phone: normalisedPhone,
          name: 'John Doe',
          email: `user${normalisedPhone.replace(/\D/g, '')}@example.com`,
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

      const normalisedPhone = normalisePhone(currentPhone);
      const registeredUsers = readRegisteredUsers();
      if (registeredUsers.some(candidate => normalisePhone(candidate.phone) === normalisedPhone)) {
        throw new Error('An account already exists with this phone number.');
      }
      const normalisedEmail = email?.trim().toLowerCase();
      if (normalisedEmail && registeredUsers.some(candidate => candidate.email?.trim().toLowerCase() === normalisedEmail)) {
        throw new Error('An account already exists with this email address.');
      }

      const newUser: User = {
        userId: `user_${Date.now()}`,
        phone: normalisedPhone,
        name,
        email: normalisedEmail || undefined,
        createdAt: new Date().toISOString(),
      };
      saveRegisteredUsers([...registeredUsers, newUser]);
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
        checkAccount,
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
