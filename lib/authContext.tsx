'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { users as demoUsers } from '@/data/users';
import { findUserByPhone, normalizePhoneNumber } from '@/lib/phoneNumber';

export type OtpIntent = 'login' | 'register';

export interface User {
  userId: string;
  phone: string;
  name: string;
  email?: string;
  createdAt: string;
  phoneVerified: boolean;
  accountStatus: 'active';
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  sendOTP: (phone: string, intent?: OtpIntent) => Promise<{ phone: string; intent: OtpIntent }>;
  verifyOTP: (otp: string, intent?: OtpIntent) => Promise<{ accountExists: boolean; user?: User }>;
  createAccount: (name: string, email: string) => Promise<User>;
  applyAuthenticatedSession: (user: User) => Promise<void>;
  signup: (name: string, email?: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  currentPhone: string | null;
  checkAccount: (phone: string, email?: string) => Promise<{ phoneExists: boolean; emailExists: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USERS_KEY = 'maemes.users';
const LEGACY_REGISTERED_USERS_KEY = 'maemes.registeredUsers';

function readRegisteredUsers(): User[] {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    const legacyStored = JSON.parse(localStorage.getItem(LEGACY_REGISTERED_USERS_KEY) || '[]') as User[];
    const seeded: User[] = demoUsers.map(candidate => ({
      ...candidate,
      phone: normalizePhoneNumber(candidate.phone) || candidate.phone,
      createdAt: new Date(0).toISOString(),
      phoneVerified: true,
      accountStatus: 'active',
    }));
    const merged = [...stored, ...legacyStored, ...seeded].reduce<User[]>((users, candidate) => {
      const phone = normalizePhoneNumber(candidate.phone);
      if (!phone || users.some(user => user.phone === phone)) return users;
      users.push({
        ...candidate,
        phone,
        phoneVerified: true,
        accountStatus: 'active',
      });
      return users;
    }, []);
    if (legacyStored.length || !localStorage.getItem(USERS_KEY)) {
      saveRegisteredUsers(merged);
    }
    return merged;
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhone, setCurrentPhone] = useState<string | null>(null);
  const [currentOtpIntent, setCurrentOtpIntent] = useState<OtpIntent>('login');
  const [, setOtpSent] = useState(false);
  const [mockOtp] = useState<string>('1234'); // Mock OTP for development

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as User;
        const phone = normalizePhoneNumber(parsed.phone);
        if (phone) {
          const migratedUser: User = {
            ...parsed,
            phone,
            phoneVerified: true,
            accountStatus: 'active',
          };
          setUser(migratedUser);
          const registeredUsers = readRegisteredUsers();
          if (!registeredUsers.some(candidate => candidate.phone === phone)) {
            saveRegisteredUsers([...registeredUsers, migratedUser]);
          }
          localStorage.setItem('currentUser', JSON.stringify(migratedUser));
        }
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const sendOTP = async (phone: string, intent: OtpIntent = 'login') => {
    setIsLoading(true);
    try {
      const canonicalPhone = normalizePhoneNumber(phone);
      if (!canonicalPhone) throw new Error('Invalid phone number');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setCurrentPhone(canonicalPhone);
      setCurrentOtpIntent(intent);
      setOtpSent(true);
      // In production, this would call an SMS provider like Twilio
      // For now, we use mock OTP: 1234
      return { phone: canonicalPhone, intent };
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkAccount = async (phone: string, email?: string) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const normalisedPhone = normalizePhoneNumber(phone);
    if (!normalisedPhone) return { phoneExists: false, emailExists: false };
    const normalisedEmail = email?.trim().toLowerCase();
    const registeredUsers = readRegisteredUsers();
    const phoneExists = Boolean(findUserByPhone(registeredUsers, normalisedPhone));
    const emailExists = Boolean(normalisedEmail && registeredUsers.some(
      candidate => candidate.email?.trim().toLowerCase() === normalisedEmail
    ));
    return { phoneExists, emailExists };
  };

  const verifyOTP = async (otp: string, intent: OtpIntent = currentOtpIntent) => {
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

      const normalisedPhone = normalizePhoneNumber(currentPhone);
      if (!normalisedPhone) throw new Error('Invalid phone number');
      const registeredUser = findUserByPhone(readRegisteredUsers(), normalisedPhone);
      const accountExists = Boolean(registeredUser);
      
      if (intent === 'login' && registeredUser) {
        const existingUser = registeredUser;
        setUser(existingUser);
        localStorage.setItem('currentUser', JSON.stringify(existingUser));
        setOtpSent(false);
        return { accountExists: true, user: existingUser };
      }

      return { accountExists };
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (name: string, email: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (!currentPhone) {
        throw new Error('No phone number set');
      }

      const normalisedPhone = normalizePhoneNumber(currentPhone);
      if (!normalisedPhone) throw new Error('Invalid phone number');
      const registeredUsers = readRegisteredUsers();
      if (findUserByPhone(registeredUsers, normalisedPhone)) {
        throw new Error('An account already exists with this phone number.');
      }
      const normalisedEmail = email.trim().toLowerCase();
      if (registeredUsers.some(candidate => candidate.email?.trim().toLowerCase() === normalisedEmail)) {
        throw new Error('An account already exists with this email address.');
      }

      const newUser: User = {
        userId: `user_${Date.now()}`,
        phone: normalisedPhone,
        name,
        email: normalisedEmail,
        createdAt: new Date().toISOString(),
        phoneVerified: true,
        accountStatus: 'active',
      };
      saveRegisteredUsers([...registeredUsers, newUser]);
      setOtpSent(false);
      return newUser;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const applyAuthenticatedSession = async (authenticatedUser: User) => {
    const canonicalPhone = normalizePhoneNumber(authenticatedUser.phone);
    if (!canonicalPhone) throw new Error('Invalid phone number');
    const activeUser: User = {
      ...authenticatedUser,
      phone: canonicalPhone,
      phoneVerified: true,
      accountStatus: 'active',
    };
    localStorage.setItem('currentUser', JSON.stringify(activeUser));
    setUser(activeUser);
  };

  const signup = async (name: string, email?: string) => {
    const newUser = await createAccount(name, email || '');
    await applyAuthenticatedSession(newUser);
    return newUser;
  };

  const logout = () => {
    if (user) {
      const registeredUsers = readRegisteredUsers();
      if (!findUserByPhone(registeredUsers, user.phone)) {
        saveRegisteredUsers([...registeredUsers, {
          ...user,
          phone: normalizePhoneNumber(user.phone) || user.phone,
          phoneVerified: true,
          accountStatus: 'active',
        }]);
      }
    }
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
        createAccount,
        applyAuthenticatedSession,
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
