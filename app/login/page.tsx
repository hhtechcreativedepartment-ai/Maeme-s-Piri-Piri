'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

type LoginStep = 'phone' | 'otp' | 'signup';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sendOTP, verifyOTP, signup, currentPhone } = useAuth();

  const redirectTarget = searchParams.get('redirect') || '/';
  const guestTarget = redirectTarget === '/' ? '/menu' : redirectTarget;

  const [step, setStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhoneValue = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(-10);
    if (!digits) return '';
    if (digits.length <= 3) return `+44 ${digits}`;
    if (digits.length <= 6) return `+44 ${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `+44 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  };

  const formatPhoneInputValue = (value: string) => formatPhoneValue(value).replace(/^\+44\s?/, '');

  useEffect(() => {
    if (currentPhone) {
      setPhone(formatPhoneInputValue(currentPhone));
    } else {
      setPhone('');
    }
  }, [currentPhone]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneInputValue(e.target.value));
    setError('');
  };

  const getNormalizedPhone = () => phone.replace(/\D/g, '').slice(-10);

  const handleSendOTP = async () => {
    const cleanedPhone = getNormalizedPhone();
    if (cleanedPhone.length !== 10) {
      setError('Please enter a valid UK phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendOTP(`+44${cleanedPhone}`);
      setStep('otp');
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const cleanedPhone = getNormalizedPhone();
    if (cleanedPhone.length !== 10) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendOTP(`+44${cleanedPhone}`);
    } catch {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      setError('Please enter a 4-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyOTP(otp);
      if (result.accountExists) {
        router.push(redirectTarget);
      } else {
        setStep('signup');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signup(name.trim(), email.trim() || undefined);
      router.push(redirectTarget);
    } catch {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fff8ed]">
      <div className="grid min-h-screen min-w-0 grid-cols-1 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[url('/images/premium-hero-chicken.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#6b0714]/90 via-[#99041e]/85 to-[#3b050c]/95" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
            <img src="/images/maemes-logo.png" alt="Maeme's logo" className="h-16 w-auto" />
            <div className="max-w-md">
              <p className="text-4xl font-black leading-tight text-white">Fresh food.<br />Simple ordering.</p>
              <p className="mt-5 text-base leading-7 text-white/80">
                Browse as a guest. Sign in only when you're ready to place your order.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-screen max-w-full min-w-0 items-center justify-start overflow-hidden bg-white px-6 py-10 sm:justify-center sm:px-8 lg:w-auto lg:px-10">
          <div className="w-full max-w-[340px] min-w-0 sm:max-w-[480px]">
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 text-sm font-bold text-[#99041e] transition-colors hover:text-[#7f0318]"
            >
              <ChevronLeft size={18} />
              Back to Maeme's
            </button>

            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <img src="/images/maemes-logo.png" alt="Maeme's logo" className="h-12 w-auto" />
              <div>
                <p className="text-lg font-black text-[#1a120f]">Maeme's</p>
                <p className="text-sm text-[#6b5b55]">Fresh food. Simple ordering.</p>
              </div>
            </div>

            {step === 'phone' && (
              <div>
                <h2 className="mb-2 text-[2rem] font-black leading-tight text-[#1a120f] sm:text-4xl">
                  <span className="block sm:inline">Hey there, feeling</span>{' '}
                  <span className="block sm:inline">hungry?</span>
                </h2>
                <p className="mb-8 text-sm text-[#6b5b55]">Login to continue your order.</p>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#1a120f]">Phone number</label>
                    <div className="flex items-center gap-2 rounded-2xl border border-[#ead8c6] bg-[#fff8ed] px-4 py-3 transition focus-within:border-[#99041e] focus-within:ring-4 focus-within:ring-[#99041e]/10">
                      <span className="text-sm font-black text-[#99041e]">+44</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="7123 456789"
                        inputMode="numeric"
                        className="w-full bg-transparent text-sm font-semibold text-[#1a120f] outline-none"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-[#f5c7c7] bg-[#fff5f5] px-4 py-3 text-sm font-semibold text-[#99041e]">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#99041e] px-6 py-3 text-base font-black text-white transition hover:bg-[#7f0318] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      'Continue with phone'
                    )}
                  </button>

                  <button
                    onClick={() => router.push(guestTarget)}
                    className="w-full rounded-2xl border-2 border-[#99041e] px-6 py-3 text-base font-bold text-[#99041e] transition hover:bg-[#fff5f5]"
                  >
                    Continue as guest
                  </button>

                  <p className="px-2 pt-2 text-center text-xs leading-5 text-[#8a7d74]">
                    By continuing, you agree to our{' '}
                    <a href="/terms-and-conditions" className="font-semibold underline hover:text-[#99041e]">
                      terms
                    </a>{' '}
                    and{' '}
                    <a href="/privacy-policy" className="font-semibold underline hover:text-[#99041e]">
                      privacy policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}

            {step === 'otp' && (
              <div>
                <h2 className="mb-2 text-[2rem] font-black leading-tight text-[#1a120f] sm:text-4xl">Check your messages</h2>
                <p className="mb-8 text-sm text-[#6b5b55]">
                  We sent a four-digit code to {currentPhone ? formatPhoneValue(currentPhone) : `+44 ${phone}`}.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#1a120f]">OTP code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setOtp(val);
                        setError('');
                      }}
                      placeholder="1234"
                      maxLength={4}
                      inputMode="numeric"
                      className="w-full rounded-2xl border border-[#ead8c6] bg-[#fff8ed] px-4 py-3 text-center text-2xl font-black tracking-[0.35em] text-[#1a120f] outline-none transition focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10"
                      disabled={loading}
                    />
                    <p className="mt-2 text-xs text-[#8a7d74]">Dev: use mock OTP 1234 if SMS is not connected.</p>
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-[#f5c7c7] bg-[#fff5f5] px-4 py-3 text-sm font-semibold text-[#99041e]">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 4}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#99041e] px-6 py-3 text-base font-black text-white transition hover:bg-[#7f0318] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify code'
                    )}
                  </button>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="flex-1 rounded-2xl border border-[#ead8c6] px-4 py-3 text-sm font-bold text-[#99041e] transition hover:bg-[#fff5f5]"
                    >
                      Resend code
                    </button>
                    <button
                      onClick={() => {
                        setStep('phone');
                        setOtp('');
                        setError('');
                      }}
                      disabled={loading}
                      className="flex-1 rounded-2xl border border-[#99041e] px-4 py-3 text-sm font-bold text-[#99041e] transition hover:bg-[#fff5f5]"
                    >
                      Change number
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 'signup' && (
              <div>
                <h2 className="mb-2 text-[2rem] font-black leading-tight text-[#1a120f] sm:text-4xl">Nice to meet you</h2>
                <p className="mb-8 text-sm text-[#6b5b55]">One last detail before we save your account.</p>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#1a120f]">Full name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                      }}
                      placeholder="Ava Taylor"
                      className="w-full rounded-2xl border border-[#ead8c6] bg-[#fff8ed] px-4 py-3 text-sm font-semibold text-[#1a120f] outline-none transition focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#1a120f]">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="ava@example.com"
                      className="w-full rounded-2xl border border-[#ead8c6] bg-[#fff8ed] px-4 py-3 text-sm font-semibold text-[#1a120f] outline-none transition focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#1a120f]">Phone number</label>
                    <input
                      type="text"
                      value={currentPhone ? formatPhoneValue(currentPhone) : '+44 '}
                      disabled
                      className="w-full rounded-2xl border border-[#ead8c6] bg-[#f7f2e9] px-4 py-3 text-sm font-semibold text-[#6b5b55]"
                    />
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-[#f5c7c7] bg-[#fff5f5] px-4 py-3 text-sm font-semibold text-[#99041e]">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#99041e] px-6 py-3 text-base font-black text-white transition hover:bg-[#7f0318] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setStep('otp');
                      setError('');
                    }}
                    disabled={loading}
                    className="w-full rounded-2xl border border-[#99041e] px-6 py-3 text-base font-bold text-[#99041e] transition hover:bg-[#fff5f5]"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
