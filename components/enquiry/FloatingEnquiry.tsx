'use client';

import {
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  RefreshCw,
  Send,
  UserRound,
  Volume2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  message: string;
  captcha: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  postcode: '',
  message: '',
  captcha: '',
};

const captchaCharacters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const focusableSelector = 'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

function createCaptcha() {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const values = crypto.getRandomValues(new Uint32Array(6));
    return Array.from(values, (value) => captchaCharacters[value % captchaCharacters.length]).join('');
  }

  return Array.from({ length: 6 }, () => captchaCharacters[Math.floor(Math.random() * captchaCharacters.length)]).join('');
}

function validate(values: FormValues, captchaCode: string): FormErrors {
  const errors: FormErrors = {};
  const phoneDigits = values.phone.replace(/\D/g, '');
  const postcodePattern = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (phoneDigits.length < 7 || phoneDigits.length > 15) errors.phone = 'Enter a valid phone number.';
  if (!postcodePattern.test(values.postcode.trim())) errors.postcode = 'Enter a valid UK postcode.';
  if (values.message.trim().length < 10) errors.message = 'Please enter at least 10 characters.';
  if (!values.captcha.trim()) errors.captcha = 'Enter the captcha code.';
  else if (values.captcha.trim().toUpperCase() !== captchaCode) errors.captcha = 'Captcha does not match. Please try again.';

  return errors;
}

export default function FloatingEnquiry() {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const submissionLockRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [captchaCode, setCaptchaCode] = useState('');
  const isCaptchaVerified = Boolean(values.captcha) && values.captcha.trim().toUpperCase() === captchaCode;

  const refreshCaptcha = useCallback(() => {
    setCaptchaCode(createCaptcha());
    setValues((current) => ({ ...current, captcha: '' }));
    setErrors((current) => ({ ...current, captcha: undefined }));
  }, []);

  const closePanel = useCallback(() => {
    if (isSubmitting) return;
    setIsOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, [isSubmitting]);

  useEffect(() => {
    setCaptchaCode(createCaptcha());
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closePanel, isOpen]);

  const openPanel = () => {
    if (!captchaCode) setCaptchaCode(createCaptcha());
    setIsOpen(true);
  };

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const speakCaptcha = () => {
    if (!('speechSynthesis' in window) || !captchaCode) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(captchaCode.split('').join(' '));
    utterance.rate = 0.75;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionLockRef.current) return;

    const nextErrors = validate(values, captchaCode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalidField = Object.keys(nextErrors)[0] as keyof FormValues;
      panelRef.current?.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)?.focus();
      return;
    }

    submissionLockRef.current = true;
    setIsSubmitting(true);

    // Matches the existing website's frontend-only enquiry confirmation.
    await new Promise((resolve) => window.setTimeout(resolve, 700));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setValues(initialValues);
    setCaptchaCode(createCaptcha());
    submissionLockRef.current = false;
  };

  const resetAndClose = () => {
    if (isSubmitting) return;
    closePanel();
  };

  return (
    <div className="maemes-enquiry-root fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[95] sm:bottom-6 sm:right-6">
      {isOpen && (
        <>
          <button
            type="button"
            className="maemes-enquiry-backdrop fixed inset-0 z-0 cursor-default bg-[#99041e]/12 backdrop-blur-[2px]"
            onClick={closePanel}
            aria-label="Close enquiry form"
            tabIndex={-1}
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="maemes-enquiry-panel fixed inset-x-2 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.75rem)] z-10 flex max-h-[calc(100dvh-6.5rem)] flex-col overflow-hidden rounded-[24px] border border-[#99041e]/15 bg-white shadow-[0_28px_80px_rgba(91,12,27,0.22)] sm:inset-x-auto sm:bottom-[6.75rem] sm:right-6 sm:w-[min(430px,calc(100vw-3rem))]"
          >
            <div className="maemes-enquiry-header flex shrink-0 items-start justify-between gap-4 border-b border-[#99041e]/10 bg-[linear-gradient(135deg,#fff_0%,#fff8ed_100%)] px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#99041e]">We&apos;re here to help</p>
                <h2 id={titleId} className="mt-1 text-2xl font-bold text-[#99041e]">Enquire Now</h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closePanel}
                disabled={isSubmitting}
                className="maemes-enquiry-close flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#99041e]/20 bg-white text-[#99041e] transition hover:bg-[#fff3df] active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/45 disabled:opacity-50"
                aria-label="Close enquiry form"
              >
                <X size={19} />
              </button>
            </div>

            <div className="maemes-enquiry-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 [scrollbar-color:#99041e_transparent] [scrollbar-width:thin]">
              {isSubmitted ? (
                <div className="maemes-enquiry-success flex min-h-[390px] flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3df] text-[#99041e]">
                    <CheckCircle2 size={34} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-[#99041e]">Enquiry received</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#725d56]">
                    Thank you for contacting Maeme&apos;s. Our team will review your message and get back to you.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      closePanel();
                    }}
                    className="mt-6 min-h-11 rounded-full border border-[#99041e] bg-white px-6 text-sm font-bold text-[#99041e] transition hover:bg-[#fff8ed] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/45"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form className="maemes-enquiry-form space-y-3.5" onSubmit={handleSubmit} noValidate>
                  <EnquiryField label="Enter Name" name="name" icon={UserRound} value={values.name} error={errors.name} onChange={(value) => updateField('name', value)} autoComplete="name" />
                  <EnquiryField label="Enter Email" name="email" type="email" icon={Mail} value={values.email} error={errors.email} onChange={(value) => updateField('email', value)} autoComplete="email" />
                  <EnquiryField label="Enter Phone" name="phone" type="tel" icon={Phone} value={values.phone} error={errors.phone} onChange={(value) => updateField('phone', value)} autoComplete="tel" inputMode="tel" />
                  <EnquiryField label="Enter PostCode" name="postcode" icon={MapPin} value={values.postcode} error={errors.postcode} onChange={(value) => updateField('postcode', value)} autoComplete="postal-code" />

                  <label className="maemes-enquiry-field block">
                    <span className="mb-1.5 block text-xs font-bold text-[#5f4540]">Enter Message</span>
                    <span className={`flex rounded-xl border bg-white transition focus-within:ring-4 focus-within:ring-[#ffc257]/25 ${errors.message ? 'border-[#99041e]' : 'border-[#d9c8bf] focus-within:border-[#99041e]'}`}>
                      <MessageSquareText size={17} className="ml-3 mt-3.5 shrink-0 text-[#99041e]" />
                      <textarea
                        name="message"
                        value={values.message}
                        onChange={(event) => updateField('message', event.target.value)}
                        className="min-h-24 w-full resize-y bg-transparent px-3 py-3 text-sm text-[#5f4540] outline-none placeholder:text-[#a58f88]"
                        placeholder="How can we help?"
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? 'maemes-enquiry-message-error' : undefined}
                      />
                    </span>
                    {errors.message && <span id="maemes-enquiry-message-error" className="mt-1 block text-xs font-semibold text-[#99041e]">{errors.message}</span>}
                  </label>

                  <div className="maemes-enquiry-captcha rounded-[18px] border border-[#ffc257]/70 bg-[#fff8ed] p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-[#99041e]">Captcha verification</p>
                        <p className="mt-0.5 text-[10px] text-[#806961]">Enter the characters shown below.</p>
                      </div>
                      <div className="flex gap-1">
                        <button type="button" onClick={speakCaptcha} className="flex h-9 w-9 items-center justify-center rounded-full text-[#99041e] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257]" aria-label="Listen to captcha">
                          <Volume2 size={17} />
                        </button>
                        <button type="button" onClick={refreshCaptcha} className="flex h-9 w-9 items-center justify-center rounded-full text-[#99041e] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257]" aria-label="Generate a new captcha">
                          <RefreshCw size={17} />
                        </button>
                      </div>
                    </div>

                    <div className="relative mt-3 overflow-hidden rounded-xl border border-[#99041e]/15 bg-white px-4 py-3">
                      <span className="pointer-events-none absolute -left-5 top-2 h-px w-32 rotate-[12deg] bg-[#99041e]/35" />
                      <span className="pointer-events-none absolute right-0 top-7 h-1 w-28 -rotate-[8deg] rounded-full bg-[#ffc257]/70" />
                      <span className="pointer-events-none absolute left-1/3 top-0 h-16 w-px rotate-[22deg] bg-[#ffc257]/55" />
                      <p aria-label={`Captcha code ${captchaCode.split('').join(' ')}`} className="relative select-none text-center font-mono text-xl font-bold tracking-[0.32em] text-[#99041e] [text-shadow:1px_1px_0_#ffc257]">
                        {captchaCode}
                      </p>
                    </div>

                    <label className="mt-3 block">
                      <span className="mb-1.5 block text-xs font-bold text-[#5f4540]">Enter Captcha</span>
                      <input
                        name="captcha"
                        value={values.captcha}
                        onChange={(event) => updateField('captcha', event.target.value.toUpperCase())}
                        autoComplete="off"
                        spellCheck={false}
                        className={`min-h-11 w-full rounded-xl border bg-white px-3 text-sm uppercase tracking-[0.12em] text-[#5f4540] outline-none transition focus:ring-4 focus:ring-[#ffc257]/25 ${errors.captcha ? 'border-[#99041e]' : 'border-[#d9c8bf] focus:border-[#99041e]'}`}
                        aria-invalid={Boolean(errors.captcha)}
                        aria-describedby={errors.captcha ? 'maemes-enquiry-captcha-error' : undefined}
                      />
                      {errors.captcha ? (
                        <span id="maemes-enquiry-captcha-error" className="mt-1 block text-xs font-semibold text-[#99041e]">{errors.captcha}</span>
                      ) : isCaptchaVerified ? (
                        <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#99041e]">
                          <CheckCircle2 size={13} /> Captcha verified
                        </span>
                      ) : null}
                    </label>
                  </div>

                  <div className="maemes-enquiry-actions grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={resetAndClose}
                      disabled={isSubmitting}
                      className="min-h-12 rounded-full border border-[#99041e] bg-white px-4 text-sm font-bold text-[#99041e] transition hover:bg-[#fff8ed] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/40 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#99041e] px-4 text-sm font-bold text-white shadow-[0_8px_22px_rgba(153,4,30,0.2)] transition hover:bg-[#7f0318] active:scale-[0.98] active:bg-[#680214] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/45 disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                          Sending
                        </>
                      ) : (
                        <>
                          Submit <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={isOpen ? closePanel : openPanel}
        aria-label={isOpen ? 'Close enquiry form' : 'Open enquiry form'}
        aria-expanded={isOpen}
        className={`maemes-enquiry-trigger relative z-20 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_14px_34px_rgba(153,4,30,0.28)] transition hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/50 sm:h-16 sm:w-16 ${
          isOpen ? 'border-2 border-[#ffc257] bg-[#99041e] hover:bg-[#7f0318]' : 'border-0 bg-transparent'
        }`}
      >
        {isOpen ? (
          <X size={23} />
        ) : (
          <img
            src="/images/maemes-3d-enquiry-email-icon.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
          />
        )}
        {!isOpen && <span className="pointer-events-none absolute -left-16 top-1/2 hidden -translate-y-1/2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#99041e] shadow-[0_8px_20px_rgba(91,12,27,0.12)] sm:block">Enquiry</span>}
      </button>
    </div>
  );
}

function EnquiryField({
  label,
  name,
  type = 'text',
  icon: Icon,
  value,
  error,
  onChange,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: keyof FormValues;
  type?: string;
  icon: typeof UserRound;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: 'tel';
}) {
  const errorId = `maemes-enquiry-${name}-error`;

  return (
    <label className="maemes-enquiry-field block">
      <span className="mb-1.5 block text-xs font-bold text-[#5f4540]">{label}</span>
      <span className={`flex min-h-11 items-center rounded-xl border bg-white transition focus-within:ring-4 focus-within:ring-[#ffc257]/25 ${error ? 'border-[#99041e]' : 'border-[#d9c8bf] focus-within:border-[#99041e]'}`}>
        <Icon size={17} className="ml-3 shrink-0 text-[#99041e]" />
        <input
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className="min-h-11 w-full bg-transparent px-3 text-sm text-[#5f4540] outline-none"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      </span>
      {error && <span id={errorId} className="mt-1 block text-xs font-semibold text-[#99041e]">{error}</span>}
    </label>
  );
}
