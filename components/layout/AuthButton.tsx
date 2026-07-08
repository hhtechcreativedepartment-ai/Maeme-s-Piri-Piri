'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function AuthButton() {
  const { user } = useAuth();
  const router = useRouter();

  if (user) return null;

  return (
    <>
      <button
        onClick={() => router.push('/login?redirect=/')}
        className="ml-2 hidden rounded-full border-2 border-[#99041e] px-6 py-2 text-sm font-bold text-[#99041e] transition-colors hover:bg-[#FFF5F5] sm:inline-block"
        aria-label="Sign in"
      >
        Sign In
      </button>

      <button
        onClick={() => router.push('/login?redirect=/')}
        className="ml-2 hidden rounded-full border-2 border-[#99041e] px-6 py-2 text-sm font-bold text-[#99041e] transition-colors hover:bg-[#FFF5F5] sm:inline-block"
        aria-label="Sign up"
      >
        Sign Up
      </button>
    </>
  );
}
