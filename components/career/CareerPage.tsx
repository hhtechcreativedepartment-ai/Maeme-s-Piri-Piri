'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Select } from '@base-ui/react/select';
import { useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Search,
  Sparkles,
  Store,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { BRANCHES } from '@/lib/branchData';
import {
  AVAILABILITY_OPTIONS,
  CAREER_CV_ACCEPT,
  CAREER_ROLES,
  DAYS_OF_WEEK,
  REFERRAL_SOURCES,
  isAllowedCvFile,
} from '@/lib/careerData';

type FormErrors = Record<string, string>;

const benefits = [
  { title: 'Grow with Us', copy: "Develop practical skills and explore new opportunities as Maeme's continues to grow.", icon: Sparkles },
  { title: 'Supportive Team', copy: 'Work in an environment built around teamwork, respect and good customer service.', icon: Users },
  { title: 'Flexible Opportunities', copy: 'Explore branch-based roles with shift availability that may suit different schedules.', icon: Clock3 },
  { title: 'Valuable Experience', copy: 'Build experience across food preparation, customer service and restaurant operations.', icon: Store },
];

const journey = [
  { title: 'Choose a Role', copy: "Select your preferred position and Maeme's branch." },
  { title: 'Submit Your Details', copy: 'Complete the application and upload your CV.' },
  { title: 'Application Review', copy: 'The recruitment team will review the information and contact suitable applicants.' },
];

const faqs = [
  ['Do I need previous restaurant experience?', 'Experience requirements vary by role. Relevant experience can help, while some positions may include training.'],
  ['Can I apply for more than one role?', 'Choose the role that best matches your current goals. You can describe interest in other roles within your application.'],
  ['Can I choose my preferred branch?', 'Yes. Select a current branch or choose Any Branch if you are flexible.'],
  ['What CV format should I upload?', 'Upload a PDF, DOC or DOCX file no larger than 5 MB.'],
  ['Are flexible shifts available?', 'Shift availability depends on the role and branch. Share your availability accurately in the application.'],
  ['How will I know if I have been shortlisted?', 'The recruitment team may contact applicants whose experience matches a suitable opportunity.'],
];

export default function CareerPage() {
  const applicationRef = useRef<HTMLElement>(null);
  const [selectedRole, setSelectedRole] = useState('');

  const applyForRole = (roleId?: string) => {
    if (roleId) setSelectedRole(roleId);
    applicationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="overflow-x-clip bg-[#FFF8F2] text-[#351817]">
      <section id="career-top" className="scroll-mt-24 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1320px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#99041E]">Join the Maeme&apos;s team</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Build Your Career with <span className="text-[#99041E]">Maeme&apos;s</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#715D57] sm:text-lg sm:leading-8">
              Join a growing food brand where teamwork, energy and great customer service come together.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => applyForRole()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#99041E] px-6 text-sm font-black text-white shadow-[0_14px_32px_rgba(153,4,30,0.18)] transition hover:bg-[#7D0318] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC257]/55">
                View Application Form <ArrowRight size={17} />
              </button>
              <button type="button" onClick={() => applyForRole()} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#DDBEAA] bg-white px-6 text-sm font-black text-[#99041E] transition hover:bg-[#FFF1DD] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC257]/55">
                Apply Now
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[26px] border border-[#E8CCBA] bg-white p-2 shadow-[0_24px_64px_rgba(74,32,20,0.10)]">
            <Image src="/images/franchise-partners.jpg" alt="Maeme's restaurant team working together" width={776} height={494} priority className="aspect-[776/494] w-full rounded-[20px] object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <SectionHeading eyebrow="Working at Maeme's" title="Why Work at Maeme's?" copy="We're looking for positive, reliable and customer-focused people who want to develop their skills and grow with the Maeme's team." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ title, copy, icon: Icon }) => (
              <article key={title} className="rounded-[20px] border border-[#E9D3C5] bg-[#FFFBF7] p-5 shadow-[0_12px_30px_rgba(74,32,20,0.045)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0D2] text-[#99041E]"><Icon size={20} /></span>
                <h3 className="mt-4 text-lg font-black text-[#99041E]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#715D57]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#99041E] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#FFC257]">What happens next</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">Your Application Journey</h2>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {journey.map((step, index) => (
              <li key={step.title} className="rounded-[20px] border border-white/15 bg-white/[0.07] p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFC257] text-sm font-black text-[#99041E]">{index + 1}</span>
                <h3 className="mt-4 text-lg font-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section ref={applicationRef} id="career-application" className="scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1080px]">
          <SectionHeading eyebrow="Application form" title="Apply to Join Maeme's" copy="Complete the form below to submit your application." />
          <CareerApplicationForm selectedRole={selectedRole} onRoleChange={setSelectedRole} />
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <SectionHeading eyebrow="Behind the counter" title="Life at Maeme's" copy="A look at the restaurants, service and teamwork that shape the Maeme's experience." />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['/images/franchise-partners.jpg', '/images/stores/maemes-store-2.png', '/images/stores/maemes-store-3.png'].map((src, index) => (
              <Image key={src} src={src} alt={index === 0 ? "Maeme's restaurant team" : "Maeme's restaurant interior"} width={776} height={494} loading="lazy" className="h-56 w-full rounded-[20px] border border-[#E8CCBA] object-cover sm:h-64" />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[900px]">
          <SectionHeading eyebrow="Helpful information" title="Career FAQs" />
          <div className="mt-7 space-y-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-[18px] border border-[#E8CCBA] bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-[#351817] focus-visible:outline-none focus-visible:text-[#99041E]">
                  {question}<ChevronDown className="shrink-0 text-[#99041E] transition group-open:rotate-180" size={19} />
                </summary>
                <p className="mt-3 border-t border-[#F0DED2] pt-3 text-sm leading-6 text-[#715D57]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-5 rounded-[24px] bg-[#99041E] p-6 text-white shadow-[0_18px_46px_rgba(153,4,30,0.18)] sm:flex-row sm:items-center sm:p-8">
          <div><h2 className="text-2xl font-black">Have a question about working at Maeme&apos;s?</h2><p className="mt-2 text-sm text-white/75">Contact our team for general recruitment enquiries.</p></div>
          <Link href="/contact" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#FFC257] px-6 text-sm font-black text-[#99041E] hover:bg-white sm:w-auto">Contact Us</Link>
        </div>
      </section>
    </main>
  );
}

function CareerApplicationForm({ selectedRole, onRoleChange }: { selectedRole: string; onRoleChange: (value: string) => void }) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [branch, setBranch] = useState('');
  const [referral, setReferral] = useState('');
  const [availability, setAvailability] = useState<Record<string, string>>(
    () => Object.fromEntries(DAYS_OF_WEEK.map((day) => [day, 'Unavailable'])),
  );
  const [cv, setCv] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set('preferredRole', selectedRole);
    data.set('preferredBranch', branch);
    data.set('referralSource', referral);
    data.delete('cv');
    if (cv) data.set('cv', cv);
    const nextErrors = validateCareerForm(data, cv);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0];
      window.setTimeout(() => document.getElementById(first)?.focus(), 0);
      return;
    }
    setStatus('submitting');
    try {
      const response = await fetch('/api/careers', { method: 'POST', body: data });
      if (!response.ok) throw new Error('Submission failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return <div role="status" className="mt-8 rounded-[24px] border border-[#B9DFC7] bg-white p-7 text-center shadow-sm"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5ED] text-[#176B3A]"><Check /></span><h3 className="mt-4 text-2xl font-black">Application Submitted Successfully</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#715D57]">Thank you for your interest in joining Maeme&apos;s. Our recruitment team will review your application and contact you if a suitable opportunity is available.</p><div className="mt-5"><button type="button" onClick={() => { formRef.current?.reset(); setCv(null); setBranch(''); onRoleChange(''); setStatus('idle'); }} className="min-h-11 rounded-xl bg-[#99041E] px-5 text-sm font-black text-white">Return to Career Page</button></div></div>;
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="mt-8 rounded-[24px] border border-[#E8CCBA] bg-white p-5 shadow-[0_18px_50px_rgba(74,32,20,0.07)] sm:p-8">
      <FormSection title="Personal Details" number="01">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="fullName" label="Full Name" error={errors.fullName}><input id="fullName" name="fullName" autoComplete="name" placeholder="Enter your full name" className={inputClass} aria-invalid={Boolean(errors.fullName)} /></Field>
          <Field id="phone" label="Phone Number" error={errors.phone}><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Enter your phone number" className={inputClass} aria-invalid={Boolean(errors.phone)} /></Field>
          <Field id="email" label="Email Address" error={errors.email}><input id="email" name="email" type="email" autoComplete="email" placeholder="Enter your email address" className={inputClass} aria-invalid={Boolean(errors.email)} /></Field>
          <Field id="postcode" label="Postcode" error={errors.postcode}><input id="postcode" name="postcode" autoComplete="postal-code" placeholder="Enter your postcode" className={inputClass} aria-invalid={Boolean(errors.postcode)} /></Field>
        </div>
      </FormSection>

      <FormSection title="Role Preferences" number="02">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="preferredRole" label="Preferred Role" error={errors.preferredRole}><BrandedSelect id="preferredRole" value={selectedRole} onValueChange={onRoleChange} placeholder="Select a role" options={CAREER_ROLES.map((role) => ({ value: role.id, label: role.title }))} /></Field>
          <Field id="preferredBranch" label="Preferred Branch" error={errors.preferredBranch}><SearchableBranchSelect value={branch} onChange={setBranch} /></Field>
        </div>
      </FormSection>

      <FormSection title="Availability" number="03">
        <p className="mb-4 text-sm text-[#715D57]">Select your preferred availability for at least one day.</p>
        <div id="availability" tabIndex={-1} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DAYS_OF_WEEK.map((day) => <div key={day}><label htmlFor={`availability-${day.toLowerCase()}`} className="mb-1.5 block text-xs font-black text-[#5A4038]">{day}</label><BrandedSelect id={`availability-${day.toLowerCase()}`} name={`availability.${day.toLowerCase()}`} value={availability[day]} onValueChange={(value) => setAvailability((current) => ({ ...current, [day]: value }))} placeholder="Select availability" compact options={AVAILABILITY_OPTIONS.map((option) => ({ value: option, label: option }))} /></div>)}
        </div>
        {errors.availability && <ErrorText id="availability-error">{errors.availability}</ErrorText>}
      </FormSection>

      <FormSection title="Experience and Application" number="04">
        <div className="grid gap-5">
          <Field id="experience" label="Previous Experience" error={errors.experience}><textarea id="experience" name="experience" className={`${inputClass} min-h-28 resize-y py-3`} placeholder="Tell us about relevant experience" /></Field>
          <Field id="motivation" label="Why would you like to work at Maeme's?" error={errors.motivation}><textarea id="motivation" name="motivation" className={`${inputClass} min-h-28 resize-y py-3`} placeholder="Tell us what interests you about joining the team" /></Field>
          <div className="grid gap-5 sm:grid-cols-2"><Field id="startDate" label="Earliest Available Start Date — Optional"><input id="startDate" name="startDate" type="date" className={inputClass} /></Field><Field id="referralSource" label="How did you find out about this job?" error={errors.referralSource}><BrandedSelect id="referralSource" value={referral} onValueChange={setReferral} placeholder="Select an option" options={REFERRAL_SOURCES.map((source) => ({ value: source, label: source }))} /></Field></div>
          {referral === 'Other' && <Field id="referralOther" label="Please tell us where you heard about this role" error={errors.referralOther}><input id="referralOther" name="referralOther" className={inputClass} /></Field>}
          <label className="flex min-h-11 items-start gap-3 rounded-xl border border-[#E8D2C4] bg-[#FFFBF7] p-4 text-sm font-semibold"><input id="rightToWork" name="rightToWork" value="yes" type="checkbox" className="mt-0.5 h-5 w-5 accent-[#99041E]" />I confirm that I have the right to work in the location for which I am applying.</label>
          {errors.rightToWork && <ErrorText>{errors.rightToWork}</ErrorText>}
        </div>
      </FormSection>

      <FormSection title="CV and Consent" number="05">
        <Field id="cv" label="Upload Your CV" error={errors.cv}>
          <label htmlFor="cv" className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-[#D9AE92] bg-[#FFFBF7] p-5 text-center transition hover:border-[#99041E] hover:bg-[#FFF5E7] focus-within:ring-4 focus-within:ring-[#FFC257]/40"><Upload className="text-[#99041E]" /><span className="mt-2 text-sm font-black">{cv ? 'Replace your CV' : 'Choose your CV'}</span><span className="mt-1 text-xs text-[#715D57]">Accepted formats: PDF, DOC and DOCX · Maximum 5 MB</span><input ref={cvInputRef} id="cv" type="file" name="cv" accept={CAREER_CV_ACCEPT} className="sr-only" onChange={(event) => { const file = event.target.files?.[0] || null; if (file && !isAllowedCvFile(file)) { event.target.value = ''; setCv(null); setErrors((current) => ({ ...current, cv: 'Please upload a PDF, DOC or DOCX file no larger than 5 MB.' })); } else { setCv(file); setErrors((current) => ({ ...current, cv: '' })); } }} /></label>
          {cv && <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#E8D2C4] bg-white p-3"><div className="flex min-w-0 items-center gap-2"><FileText className="shrink-0 text-[#99041E]" size={18} /><span className="truncate text-sm font-bold">{cv.name}</span><span className="shrink-0 text-xs text-[#806F68]">{formatFileSize(cv.size)}</span></div><button type="button" onClick={() => { setCv(null); if (cvInputRef.current) cvInputRef.current.value = ''; }} aria-label="Remove selected CV" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#99041E] hover:bg-[#FFF1DD]"><Trash2 size={17} /></button></div>}
        </Field>
        <div className="mt-5 space-y-3">
          <label className="flex items-start gap-3 text-sm font-semibold"><input id="accurateConsent" name="accurateConsent" value="yes" type="checkbox" className="mt-0.5 h-5 w-5 accent-[#99041E]" />I confirm that the information provided is accurate.</label>{errors.accurateConsent && <ErrorText>{errors.accurateConsent}</ErrorText>}
          <label className="flex items-start gap-3 text-sm font-semibold"><input id="privacyConsent" name="privacyConsent" value="yes" type="checkbox" className="mt-0.5 h-5 w-5 accent-[#99041E]" />I have read the <Link href="/privacy-policy" target="_blank" className="text-[#99041E] underline">Privacy Policy</Link>.</label>{errors.privacyConsent && <ErrorText>{errors.privacyConsent}</ErrorText>}
        </div>
      </FormSection>

      {status === 'error' && <div role="alert" className="mt-6 rounded-xl border border-[#E8B8BE] bg-[#FFF3F4] p-4 text-sm font-bold text-[#99041E]">We could not submit your application. Please check your details and try again.</div>}
      <button type="submit" disabled={status === 'submitting'} className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#99041E] px-7 text-base font-black text-white shadow-[0_12px_28px_rgba(153,4,30,0.18)] transition hover:bg-[#7D0318] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC257]/55 disabled:cursor-wait disabled:opacity-65">{status === 'submitting' ? 'Submitting Application…' : 'Submit Application'}</button>
    </form>
  );
}

function SearchableBranchSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const options = useMemo(() => BRANCHES.filter((branch) => branch.isOpen !== false && [branch.branchName, branch.address, branch.postcode].join(' ').toLowerCase().includes(query.toLowerCase())), [query]);
  const selected = BRANCHES.find((item) => item.branchId === value);
  return <div className="relative"><button id="preferredBranch" type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={`${inputClass} flex min-w-0 cursor-pointer items-center justify-between bg-white pl-4 pr-4 text-left shadow-[0_8px_22px_rgba(63,24,18,0.05)] hover:border-[#C9A98C]`}><span className={`min-w-0 truncate ${selected || value === 'any' ? '' : 'text-[#9D8981]'}`}>{value === 'any' ? 'Any Branch' : selected ? selected.branchName : 'Select a branch'}</span><ChevronDown size={18} strokeWidth={2.5} className={`ml-4 shrink-0 text-[#99041E] transition-transform ${open ? 'rotate-180' : ''}`} /></button>{open && <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-[#E5CBBB] bg-white shadow-[0_18px_45px_rgba(74,32,20,0.14)]"><label className="relative block border-b border-[#F0DED2] p-2"><span className="sr-only">Search branches</span><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#99041E]" size={16} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or postcode" className="min-h-11 w-full rounded-lg bg-[#FFF9F1] pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#99041E]/15" /></label><div role="listbox" className="max-h-60 overflow-y-auto p-1.5"><button type="button" role="option" aria-selected={value === 'any'} onClick={() => { onChange('any'); setOpen(false); }} className="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-bold outline-none transition hover:bg-[#FFF1DD] focus:bg-[#FFF1DD] aria-selected:bg-[#FFF1DD] aria-selected:text-[#99041E]">Any Branch</button>{options.map((branch) => <button key={branch.branchId} type="button" role="option" aria-selected={value === branch.branchId} onClick={() => { onChange(branch.branchId); setOpen(false); }} className="block min-h-12 w-full rounded-lg px-3 py-2 text-left outline-none transition hover:bg-[#FFF1DD] focus:bg-[#FFF1DD] aria-selected:bg-[#FFF1DD] aria-selected:text-[#99041E]"><span className="block text-sm font-black">{branch.branchName}</span><span className="block text-xs text-[#715D57]">{branch.address}, {branch.postcode}</span></button>)}{options.length === 0 && <p className="px-3 py-6 text-center text-sm text-[#715D57]">No branches match your search.</p>}</div></div>}</div>;
}

function BrandedSelect({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  options,
  compact = false,
}: {
  id: string;
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  compact?: boolean;
}) {
  return (
    <Select.Root items={options} name={name} value={value || null} onValueChange={(nextValue) => onValueChange(nextValue ?? '')}>
      <Select.Trigger id={id} className={`${inputClass} flex cursor-pointer items-center justify-between bg-white pl-4 pr-4 text-left shadow-[0_8px_22px_rgba(63,24,18,0.05)] hover:border-[#C9A98C] data-popup-open:border-[#99041E] data-popup-open:ring-4 data-popup-open:ring-[#99041E]/10 ${compact ? 'min-h-11' : ''}`}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="ml-4 flex shrink-0 text-[#99041E] transition-transform duration-200 data-popup-open:rotate-180">
          <ChevronDown size={18} strokeWidth={2.5} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="z-[90] outline-none" sideOffset={8} alignItemWithTrigger={false}>
          <Select.Popup className="min-w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-hidden rounded-xl border border-[#EAD8C6] bg-white p-1.5 text-[#351817] shadow-[0_18px_45px_rgba(63,24,18,0.14)] outline-none transition-[transform,opacity] duration-150 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <Select.List className="max-h-64 overflow-y-auto">
              {options.map((option) => (
                <Select.Item key={option.value} value={option.value} className="flex min-h-10 cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm outline-none transition-colors data-highlighted:bg-[#FFF4E6] data-highlighted:text-[#99041E] data-selected:font-semibold data-selected:text-[#99041E]">
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="flex shrink-0 text-[#99041E]"><Check size={16} strokeWidth={2.5} /></Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

function validateCareerForm(data: FormData, cv: File | null): FormErrors {
  const error: FormErrors = {}; const value = (key: string) => String(data.get(key) || '').trim();
  if (value('fullName').length < 2) error.fullName = 'Please enter your full name.';
  if (!/^\+?[0-9\s()-]{10,20}$/.test(value('phone'))) error.phone = 'Please enter a valid phone number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) error.email = 'Please enter a valid email address.';
  if (value('postcode').length < 3) error.postcode = 'Please enter your postcode.';
  if (!value('preferredRole')) error.preferredRole = 'Please select a preferred role.';
  if (!value('preferredBranch')) error.preferredBranch = 'Please select a preferred branch.';
  if (!DAYS_OF_WEEK.some((day) => value(`availability.${day.toLowerCase()}`) !== 'Unavailable')) error.availability = 'Please select your availability.';
  if (value('experience').length < 10) error.experience = 'Please tell us about your previous experience.';
  if (value('motivation').length < 10) error.motivation = "Please tell us why you would like to work at Maeme's.";
  if (!value('referralSource')) error.referralSource = 'Please select how you heard about this job.';
  if (value('referralSource') === 'Other' && value('referralOther').length < 2) error.referralOther = 'Please tell us where you heard about this role.';
  if (value('rightToWork') !== 'yes') error.rightToWork = 'Please confirm your right to work.';
  if (!cv || !isAllowedCvFile(cv)) error.cv = 'Please upload a valid CV.';
  if (value('accurateConsent') !== 'yes') error.accurateConsent = 'Please confirm that your information is accurate.';
  if (value('privacyConsent') !== 'yes') error.privacyConsent = 'Please confirm that you have read the Privacy Policy.';
  return error;
}

const inputClass = 'min-h-12 w-full rounded-xl border border-[#DEC5B5] bg-[#FFFDF9] px-4 text-sm text-[#351817] outline-none transition placeholder:text-[#9D8981] focus:border-[#99041E] focus:ring-4 focus:ring-[#99041E]/8';
function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) { return <div><p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#99041E]">{eyebrow}</p><h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">{title}</h2>{copy && <p className="mt-3 max-w-2xl text-sm leading-6 text-[#715D57] sm:text-base sm:leading-7">{copy}</p>}</div>; }
function FormSection({ title, number, children }: { title: string; number: string; children: ReactNode }) { return <fieldset className="border-0 border-b border-[#F0DED2] py-7 first:pt-0 last:border-0 last:pb-0"><legend className="mb-5 flex items-center gap-3 text-xl font-black"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF0D2] text-xs text-[#99041E]">{number}</span>{title}</legend>{children}</fieldset>; }
function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) { return <div><label htmlFor={id} className="mb-2 block text-sm font-black text-[#4D3530]">{label}</label>{children}{error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}</div>; }
function ErrorText({ id, children }: { id?: string; children: ReactNode }) { return <p id={id} className="mt-1.5 text-xs font-bold text-[#99041E]">{children}</p>; }
function formatFileSize(bytes: number) { return `${(bytes / 1024 / 1024).toFixed(1)} MB`; }
