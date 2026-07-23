'use client';

import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Check, Loader2, X } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

type AuthView = 'phone' | 'login-otp' | 'registration' | 'registration-otp' | 'success';
type FieldErrors = Partial<Record<'name' | 'phone' | 'email', string>>;

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
  const { sendOTP, verifyOTP, signup, currentPhone, checkAccount } = useAuth();
  const titleId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const registrationPhoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const submissionRef = useRef(false);
  const completionRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<AuthView>('phone');
  const [phone, setPhone] = useState('');
  const [registrationPhone, setRegistrationPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [guestLoading, setGuestLoading] = useState(false);
  const [successKind, setSuccessKind] = useState<'login' | 'registration'>('login');
  const [resendNotice, setResendNotice] = useState('');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    completionRef.current = false;
    submissionRef.current = false;
    setView('phone');
    setPhone('');
    setRegistrationPhone('');
    setOtp('');
    setName('');
    setEmail('');
    setError('');
    setFieldErrors({});
    setLoading(false);
    setGuestLoading(false);
    setSuccessKind('login');
    setResendNotice('');
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
    const target = view === 'phone'
      ? phoneRef.current
      : view === 'login-otp' || view === 'registration-otp'
        ? otpRef.current
        : view === 'registration'
          ? nameRef.current
          : null;
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
    setResendNotice('');
  };

  const openRegistration = () => {
    setRegistrationPhone(phone);
    setOtp('');
    setError('');
    setFieldErrors({});
    setView('registration');
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
      const account = await checkAccount(`+44${digits}`);
      if (!account.phoneExists) {
        setError('We could not find an account with this phone number.');
        phoneRef.current?.focus();
        return;
      }
      await sendOTP(`+44${digits}`);
      setOtp('');
      setResendSeconds(30);
      setView('login-otp');
    } catch {
      setError('We could not send a code. Please try again.');
      phoneRef.current?.focus();
    } finally {
      submissionRef.current = false;
      setLoading(false);
    }
  };

  const completeAuthentication = (kind: 'login' | 'registration' = 'login') => {
    if (completionRef.current) return;
    completionRef.current = true;
    setSuccessKind(kind);
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
      if (!result.accountExists) {
        setError('We could not find an account with this phone number.');
        return;
      }
      completeAuthentication('login');
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
      setResendNotice('A new verification code has been sent.');
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
    const nextErrors: FieldErrors = {};
    const trimmedName = name.trim();
    const registrationDigits = registrationPhone.replace(/\D/g, '');
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName || !/[A-Za-z]/.test(trimmedName) || !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(trimmedName)) {
      nextErrors.name = 'Please enter your name.';
    }
    if (registrationDigits.length !== 10) nextErrors.phone = 'Please enter a valid phone number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    setFieldErrors(nextErrors);
    if (nextErrors.name) nameRef.current?.focus();
    else if (nextErrors.phone) registrationPhoneRef.current?.focus();
    else if (nextErrors.email) emailRef.current?.focus();
    if (Object.keys(nextErrors).length) return;

    submissionRef.current = true;
    setLoading(true);
    setError('');
    try {
      const account = await checkAccount(`+44${registrationDigits}`, trimmedEmail);
      if (account.phoneExists || account.emailExists) {
        const duplicateErrors: FieldErrors = {};
        if (account.phoneExists) duplicateErrors.phone = 'An account already exists with this phone number. Sign in instead.';
        if (account.emailExists) duplicateErrors.email = 'An account already exists with this email address.';
        setFieldErrors(duplicateErrors);
        if (account.phoneExists) registrationPhoneRef.current?.focus();
        else emailRef.current?.focus();
        return;
      }
      await sendOTP(`+44${registrationDigits}`);
      setOtp('');
      setResendSeconds(30);
      setView('registration-otp');
    } catch (nextError) {
      setError(customerMessage(nextError, 'We could not send a verification code. Please try again.'));
    } finally {
      submissionRef.current = false;
      setLoading(false);
    }
  };

  const submitRegistrationOtp = async (event?: FormEvent) => {
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
      await verifyOTP(otp);
      await signup(name.trim(), email.trim().toLowerCase());
      completeAuthentication('registration');
    } catch (nextError) {
      setError(customerMessage(nextError, 'We could not create your account. Please try again.'));
      otpRef.current?.focus();
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
            {view === 'registration'
              ? 'Create New Account'
              : view === 'registration-otp'
                ? 'Verify Your Phone Number'
                : view === 'login-otp'
                  ? 'Verify Your Number'
                  : view === 'success'
                    ? successKind === 'registration' ? 'Account Created Successfully' : 'Signed In'
                    : 'Sign In'}
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
            {view === 'phone' && 'Sign in to continue your order.'}
            {view === 'login-otp' && `Enter the verification code sent to ${maskPhone(currentPhone)}.`}
            {view === 'registration-otp' && `Enter the verification code sent to ${maskPhone(currentPhone)}.`}
            {view === 'registration' && 'Enter your details, then verify your phone number.'}
            {view === 'success' && (successKind === 'registration'
              ? `Welcome to Maeme’s, ${name.trim().split(/\s+/)[0] || 'customer'}. Continuing…`
              : 'Welcome back. Continuing…')}
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
              {error.includes('could not find an account') && (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={openRegistration}
                    className="min-h-11 flex-1 rounded-xl border border-[#99041e] px-3 text-sm font-black text-[#99041e]"
                  >
                    Create New Account
                  </button>
                  <button
                    type="button"
                    onClick={() => phoneRef.current?.focus()}
                    className="min-h-11 flex-1 rounded-xl px-3 text-sm font-black text-[#99041e]"
                  >
                    Try Another Number
                  </button>
                </div>
              )}
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
                onClick={openRegistration}
                className="mt-3 min-h-[52px] w-full rounded-2xl border-2 border-[#99041e] bg-white px-5 text-sm font-black text-[#99041e] transition hover:bg-[#fff0d5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60"
              >
                Create New Account
              </button>
            </form>
          )}

          {view === 'login-otp' && (
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
              {resendNotice && <p aria-live="polite" className="mt-2 text-sm font-bold text-[#126336]">{resendNotice}</p>}
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
                    setFieldErrors((current) => ({ ...current, name: undefined }));
                  }}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? `${titleId}-name-error` : undefined}
                  className="mt-2 min-h-[52px] w-full rounded-2xl border border-[#d9c9bd] bg-white px-4 text-base font-semibold outline-none focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10"
                />
                <ErrorMessage id={`${titleId}-name-error`} message={fieldErrors.name || ''} />
              </div>
              <div>
                <label htmlFor={`${titleId}-registration-phone`} className="block text-sm font-black text-[#31201b]">Phone Number</label>
                <div className="mt-2 flex min-h-[52px] overflow-hidden rounded-2xl border border-[#d9c9bd] bg-white focus-within:border-[#99041e] focus-within:ring-4 focus-within:ring-[#99041e]/10">
                  <span className="flex items-center border-r border-[#ead8c6] px-4 text-sm font-black text-[#99041e]">+44</span>
                  <input
                    ref={registrationPhoneRef}
                    id={`${titleId}-registration-phone`}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={registrationPhone}
                    onChange={(event) => {
                      setRegistrationPhone(formatPhoneInput(event.target.value));
                      setFieldErrors((current) => ({ ...current, phone: undefined }));
                    }}
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? `${titleId}-phone-error` : undefined}
                    className="min-w-0 flex-1 bg-transparent px-4 text-base font-semibold text-[#31201b] outline-none"
                  />
                </div>
                <ErrorMessage id={`${titleId}-phone-error`} message={fieldErrors.phone || ''} />
                {fieldErrors.phone?.includes('already exists') && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhone(registrationPhone);
                      setView('phone');
                      setError('');
                      setFieldErrors({});
                    }}
                    className="mt-2 min-h-11 text-sm font-black text-[#99041e] underline underline-offset-4"
                  >
                    Continue with Phone
                  </button>
                )}
              </div>
              <div>
                <label htmlFor={`${titleId}-email`} className="block text-sm font-black text-[#31201b]">Email Address</label>
                <input
                  ref={emailRef}
                  id={`${titleId}-email`}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFieldErrors((current) => ({ ...current, email: undefined }));
                  }}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? `${titleId}-email-error` : undefined}
                  className="mt-2 min-h-[52px] w-full rounded-2xl border border-[#d9c9bd] bg-white px-4 text-base font-semibold outline-none focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10"
                />
                <ErrorMessage id={`${titleId}-email-error`} message={fieldErrors.email || ''} />
              </div>
              <ErrorMessage id={`${titleId}-error`} message={error} />
              <ActionButton loading={loading} label="Create Account" loadingLabel="Creating account…" />
              <button
                type="button"
                onClick={() => {
                  setView('phone');
                  setError('');
                  setFieldErrors({});
                }}
                className="flex min-h-11 w-full items-center justify-center gap-2 text-sm font-black text-[#99041e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257]"
              >
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            </form>
          )}

          {view === 'registration-otp' && (
            <form onSubmit={submitRegistrationOtp} className="mt-6">
              <label htmlFor={`${titleId}-registration-otp`} className="block text-sm font-black text-[#31201b]">Verification Code</label>
              <input
                ref={otpRef}
                id={`${titleId}-registration-otp`}
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
                aria-describedby={error ? `${titleId}-registration-otp-error` : undefined}
                className="mt-2 min-h-[54px] w-full rounded-2xl border border-[#d9c9bd] bg-white px-4 text-center text-2xl font-black tracking-[0.5em] text-[#31201b] outline-none focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10"
              />
              <ErrorMessage id={`${titleId}-registration-otp-error`} message={error} />
              {resendNotice && <p aria-live="polite" className="mt-2 text-sm font-bold text-[#126336]">{resendNotice}</p>}
              <ActionButton loading={loading} label="Verify & Create Account" loadingLabel="Creating account…" />
              <div className="mt-5 grid gap-2 text-sm font-black sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('registration');
                    setOtp('');
                    setError('');
                    window.setTimeout(() => registrationPhoneRef.current?.focus(), 0);
                  }}
                  className="inline-flex min-h-11 items-center gap-1 text-[#99041e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257]"
                >
                  <ArrowLeft size={16} /> Change Number
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView('registration');
                    setOtp('');
                    setError('');
                  }}
                  className="min-h-11 text-[#99041e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257]"
                >
                  Back to Registration
                </button>
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={loading || resendSeconds > 0}
                  className="min-h-11 text-[#99041e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257] disabled:text-[#8a7770] sm:col-span-2"
                >
                  {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : 'Resend Code'}
                </button>
              </div>
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
