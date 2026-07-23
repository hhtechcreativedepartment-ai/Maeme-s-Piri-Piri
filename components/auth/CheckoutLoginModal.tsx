'use client';

import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Check, Loader2, X } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

type AuthView = 'phone' | 'otp' | 'registration' | 'success';

interface CheckoutLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  onContinueAsGuest?: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function customerMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;
  if (/invalid otp/i.test(error.message)) return 'The code is incorrect or has expired.';
  if (/no phone/i.test(error.message)) return 'Please enter your mobile number again.';
  return fallback;
}

function maskPhone(phone: string | null) {
  if (!phone) return 'your mobile number';
  const digits = phone.replace(/\D/g, '');
  return `+44 •••• ${digits.slice(-4)}`;
}

export default function CheckoutLoginModal({
  isOpen,
  onClose,
  onAuthenticated,
  onContinueAsGuest,
  returnFocusRef,
}: CheckoutLoginModalProps) {
  const { sendOTP, verifyOTP, signup, currentPhone } = useAuth();
  const titleId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const submissionRef = useRef(false);
  const completionRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<AuthView>('phone');
  const [registrationJourney, setRegistrationJourney] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [guestLoading, setGuestLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    completionRef.current = false;
    submissionRef.current = false;
    setView('phone');
    setRegistrationJourney(false);
    setPhone('');
    setOtp('');
    setName('');
    setEmail('');
    setError('');
    setLoading(false);
    setGuestLoading(false);
    setResendSeconds(0);

    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    window.setTimeout(() => phoneRef.current?.focus(), 0);

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || resendSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isOpen, resendSeconds]);

  useEffect(() => {
    if (!isOpen) return;
    const target = view === 'phone' ? phoneRef.current : view === 'otp' ? otpRef.current : nameRef.current;
    window.setTimeout(() => target?.focus(), 0);
  }, [isOpen, view]);

  const closeModal = () => {
    if (loading) return;
    onClose();
    window.setTimeout(() => returnFocusRef?.current?.focus(), 0);
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== 'Tab' || !modalRef.current) return;

    const controls = Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableSelector));
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, '').replace(/^44/, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneInput(event.target.value));
    setError('');
  };

  const submitPhone = async (event?: FormEvent) => {
    event?.preventDefault();
    if (submissionRef.current) return;
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Please enter a valid mobile number.');
      phoneRef.current?.focus();
      return;
    }

    submissionRef.current = true;
    setLoading(true);
    setError('');
    try {
      await sendOTP(`+44${digits}`);
      setOtp('');
      setResendSeconds(30);
      setView('otp');
    } catch {
      setError('We could not send a code. Please try again.');
      phoneRef.current?.focus();
    } finally {
      submissionRef.current = false;
      setLoading(false);
    }
  };

  const completeAuthentication = () => {
    if (completionRef.current) return;
    completionRef.current = true;
    setView('success');
    window.setTimeout(onAuthenticated, 350);
  };

  const continueAsGuest = () => {
    if (!onContinueAsGuest || submissionRef.current || completionRef.current) return;
    submissionRef.current = true;
    completionRef.current = true;
    setGuestLoading(true);
    window.setTimeout(onContinueAsGuest, 150);
  };

  const submitOtp = async (event?: FormEvent) => {
    event?.preventDefault();
    if (submissionRef.current) return;
    if (otp.length !== 4) {
      setError('Please enter the verification code.');
      otpRef.current?.focus();
      return;
    }

    submissionRef.current = true;
    setLoading(true);
    setError('');
    try {
      const result = await verifyOTP(otp);
      if (result.accountExists) {
        completeAuthentication();
      } else {
        setView('registration');
      }
    } catch (nextError) {
      setError(customerMessage(nextError, 'We could not verify the code. Please try again.'));
      otpRef.current?.focus();
    } finally {
      submissionRef.current = false;
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (submissionRef.current || resendSeconds > 0 || !currentPhone) return;
    submissionRef.current = true;
    setLoading(true);
    setError('');
    try {
      await sendOTP(currentPhone);
      setResendSeconds(30);
    } catch {
      setError('We could not resend the code. Please try again.');
    } finally {
      submissionRef.current = false;
      setLoading(false);
    }
  };

  const submitRegistration = async (event?: FormEvent) => {
    event?.preventDefault();
    if (submissionRef.current) return;
    if (!name.trim()) {
      setError('Please enter your name.');
      nameRef.current?.focus();
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    submissionRef.current = true;
    setLoading(true);
    setError('');
    try {
      await signup(name.trim(), email.trim() || undefined);
      completeAuthentication();
    } catch (nextError) {
      setError(customerMessage(nextError, 'We could not create your account. Please try again.'));
    } finally {
      submissionRef.current = false;
      setLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2b0710]/60 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onKeyDown={handleDialogKeyDown}
        className="flex max-h-[calc(100dvh-24px)] w-[calc(100%-24px)] max-w-[460px] flex-col overflow-hidden rounded-[24px] border border-[#e5a93e] bg-[#fffaf2] shadow-[0_24px_70px_rgba(43,7,16,0.24)]"
      >
        <header className="relative flex min-h-[76px] shrink-0 items-center justify-center bg-[#ffc257] px-16 py-4">
          <h2 id={titleId} className="text-center text-2xl font-black text-[#99041e]">
            {view === 'registration' ? 'Create Account' : view === 'otp' ? 'Verification' : view === 'success' ? 'Signed In' : 'Sign In'}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            disabled={loading}
            aria-label="Close sign in"
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#99041e] text-white transition hover:bg-[#7f0318] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white disabled:opacity-60"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-6 [-webkit-overflow-scrolling:touch] sm:px-7 sm:py-7">
          <p id={descriptionId} className="text-center text-sm font-semibold leading-6 text-[#6b5b55]">
            {view === 'phone' && (registrationJourney
              ? 'Enter your mobile number to start creating your Maeme’s account.'
              : 'Sign in to continue your order.')}
            {view === 'otp' && `Enter the verification code sent to ${maskPhone(currentPhone)}.`}
            {view === 'registration' && 'Complete your details to create your Maeme’s account.'}
            {view === 'success' && 'Your account is ready. Continuing to your order…'}
          </p>

          {view === 'phone' && (
            <form onSubmit={submitPhone} className="mt-6">
              <label htmlFor={`${titleId}-phone`} className="block text-sm font-black text-[#31201b]">Mobile Number</label>
              <div className="mt-2 flex min-h-[52px] overflow-hidden rounded-2xl border border-[#d9c9bd] bg-white focus-within:border-[#99041e] focus-within:ring-4 focus-within:ring-[#99041e]/10">
                <span className="flex items-center border-r border-[#ead8c6] px-4 text-sm font-black text-[#99041e]">+44</span>
                <input
                  ref={phoneRef}
                  id={`${titleId}-phone`}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={handlePhoneChange}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${titleId}-error` : undefined}
                  className="min-w-0 flex-1 bg-transparent px-4 text-base font-semibold text-[#31201b] outline-none"
                />
              </div>
              <ErrorMessage id={`${titleId}-error`} message={error} />
              <ActionButton loading={loading} label="Continue with Phone" loadingLabel="Sending code…" />
              {onContinueAsGuest && (
                <button
                  type="button"
                  onClick={continueAsGuest}
                  disabled={loading || guestLoading}
                  aria-busy={guestLoading}
                  className="mt-3 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#99041e] bg-white px-5 text-base font-black text-[#99041e] transition hover:bg-[#fff0d5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60 disabled:cursor-wait disabled:opacity-70"
                >
                  {guestLoading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
                  {guestLoading ? 'Continuing…' : 'Continue as Guest'}
                </button>
              )}
              <p className="px-2 pt-4 text-center text-xs font-semibold leading-5 text-[#78645d]">
                By continuing, you agree to our{' '}
                <a href="/terms-and-conditions" className="underline decoration-[#99041e]/40 underline-offset-2 hover:text-[#99041e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257]">
                  Terms
                </a>{' '}
                and{' '}
                <a href="/privacy-policy" className="underline decoration-[#99041e]/40 underline-offset-2 hover:text-[#99041e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257]">
                  Privacy Policy
                </a>
                .
              </p>
              <div className="my-5 h-px bg-[#ead8c6]" />
              <p className="text-center text-sm font-black text-[#31201b]">New to Maeme’s?</p>
              <button
                type="button"
                onClick={() => {
                  setRegistrationJourney(true);
                  setError('');
                  phoneRef.current?.focus();
                }}
                className="mt-3 min-h-[52px] w-full rounded-2xl border-2 border-[#99041e] bg-white px-5 text-sm font-black text-[#99041e] transition hover:bg-[#fff0d5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60"
              >
                Create Account
              </button>
            </form>
          )}

          {view === 'otp' && (
            <form onSubmit={submitOtp} className="mt-6">
              <label htmlFor={`${titleId}-otp`} className="block text-sm font-black text-[#31201b]">Verification Code</label>
              <input
                ref={otpRef}
                id={`${titleId}-otp`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={4}
                value={otp}
                onChange={(event) => {
                  setOtp(event.target.value.replace(/\D/g, '').slice(0, 4));
                  setError('');
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${titleId}-error` : undefined}
                className="mt-2 min-h-[54px] w-full rounded-2xl border border-[#d9c9bd] bg-white px-4 text-center text-2xl font-black tracking-[0.5em] text-[#31201b] outline-none focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10"
              />
              <ErrorMessage id={`${titleId}-error`} message={error} />
              <ActionButton loading={loading} label="Verify & Continue" loadingLabel="Verifying…" />
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-black">
                <button
                  type="button"
                  onClick={() => {
                    setView('phone');
                    setOtp('');
                    setError('');
                  }}
                  className="inline-flex min-h-11 items-center gap-1 text-[#99041e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257]"
                >
                  <ArrowLeft size={16} /> Change Number
                </button>
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={loading || resendSeconds > 0}
                  className="min-h-11 text-[#99041e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257] disabled:text-[#8a7770]"
                >
                  {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {view === 'registration' && (
            <form onSubmit={submitRegistration} className="mt-6 space-y-4">
              <div>
                <label htmlFor={`${titleId}-name`} className="block text-sm font-black text-[#31201b]">Full Name</label>
                <input
                  ref={nameRef}
                  id={`${titleId}-name`}
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError('');
                  }}
                  className="mt-2 min-h-[52px] w-full rounded-2xl border border-[#d9c9bd] bg-white px-4 text-base font-semibold outline-none focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10"
                />
              </div>
              <div>
                <label htmlFor={`${titleId}-email`} className="block text-sm font-black text-[#31201b]">Email Address <span className="font-semibold text-[#78645d]">(optional)</span></label>
                <input
                  id={`${titleId}-email`}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError('');
                  }}
                  className="mt-2 min-h-[52px] w-full rounded-2xl border border-[#d9c9bd] bg-white px-4 text-base font-semibold outline-none focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10"
                />
              </div>
              <ErrorMessage id={`${titleId}-error`} message={error} />
              <ActionButton loading={loading} label="Create Account" loadingLabel="Creating account…" />
              <button
                type="button"
                onClick={() => {
                  setView('phone');
                  setRegistrationJourney(false);
                  setError('');
                }}
                className="flex min-h-11 w-full items-center justify-center gap-2 text-sm font-black text-[#99041e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257]"
              >
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            </form>
          )}

          {view === 'success' && (
            <div className="py-8 text-center" aria-live="polite">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#99041e] text-[#ffc257]">
                <Check size={30} aria-hidden="true" />
              </span>
            </div>
          )}

          <span className="sr-only" aria-live="polite">{loading ? 'Authentication request in progress.' : ''}</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

function ErrorMessage({ id, message }: { id: string; message: string }) {
  if (!message) return null;
  return <p id={id} role="alert" className="mt-2 text-sm font-black text-[#99041e]">{message}</p>;
}

function ActionButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      className="mt-5 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-[#99041e] px-5 text-base font-black text-white transition hover:bg-[#7f0318] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60 disabled:cursor-wait disabled:opacity-70"
    >
      {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
      {loading ? loadingLabel : label}
    </button>
  );
}
