import type { UserSession } from '@/types';
import { readStorage, removeStorage, writeStorage } from '@/utils/storage';
import { users } from '@/data/users';
import { findUserByPhone, normalizePhoneNumber } from '@/lib/phoneNumber';

const SESSION_KEY = 'maemes.userSession';
const USERS_KEY = 'maemes.users';
const MOCK_OTP = '1234';

function getUsers() {
  return readStorage<UserSession[]>(USERS_KEY, users);
}

function saveUsers(nextUsers: UserSession[]) {
  writeStorage(USERS_KEY, nextUsers);
}

export const authStore = {
  get userSession() {
    return readStorage<UserSession | null>(SESSION_KEY, null);
  },

  login(phone: string) {
    const normalisedPhone = normalizePhoneNumber(phone);
    if (!normalisedPhone) return null;
    const user = findUserByPhone(getUsers(), normalisedPhone) || null;
    if (user) writeStorage(SESSION_KEY, user);
    return user;
  },

  logout() {
    removeStorage(SESSION_KEY);
  },

  createAccount(data: Omit<UserSession, 'userId'>) {
    const normalisedPhone = normalizePhoneNumber(data.phone);
    if (!normalisedPhone) throw new Error('Invalid phone number');
    const existingUsers = getUsers();
    if (findUserByPhone(existingUsers, normalisedPhone)) {
      throw new Error('An account already exists with this phone number.');
    }
    const newUser: UserSession = {
      ...data,
      phone: normalisedPhone,
      userId: `user-${Date.now()}`,
    };
    const nextUsers = [...existingUsers, newUser];
    saveUsers(nextUsers);
    writeStorage(SESSION_KEY, newUser);
    return newUser;
  },

  verifyOtp(otp: string) {
    return otp === MOCK_OTP;
  },

  persistUserSession(user: UserSession) {
    writeStorage(SESSION_KEY, user);
    return user;
  },
};
