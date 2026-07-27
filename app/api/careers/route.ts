import { NextResponse } from 'next/server';
import { AVAILABILITY_OPTIONS, CAREER_CV_EXTENSIONS, CAREER_CV_MAX_BYTES, CAREER_ROLES, DAYS_OF_WEEK, REFERRAL_SOURCES } from '@/lib/careerData';
import { BRANCHES } from '@/lib/branchData';

const allowedRoleIds = new Set(CAREER_ROLES.map((role) => role.id));
const allowedBranches = new Set(['any', ...BRANCHES.filter((branch) => branch.isOpen !== false).map((branch) => branch.branchId)]);
const allowedReferralSources = new Set<string>(REFERRAL_SOURCES);
const allowedAvailability = new Set<string>(AVAILABILITY_OPTIONS);
const allowedCvExtensions = new Set<string>(CAREER_CV_EXTENSIONS);

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > CAREER_CV_MAX_BYTES + 1024 * 1024) {
      return NextResponse.json({ message: 'The uploaded CV is too large.' }, { status: 413 });
    }

    const data = await request.formData();
    const cv = data.get('cv');
    const errors = await validateApplication(data, cv);
    if (errors.length > 0) {
      return NextResponse.json({ message: 'Please check your application details.', errors }, { status: 400 });
    }

    const webhookUrl = process.env.CAREERS_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ message: 'Career applications are temporarily unavailable.' }, { status: 503 });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: data,
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'Career applications are temporarily unavailable.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Career applications are temporarily unavailable.' }, { status: 500 });
  }
}

async function validateApplication(data: FormData, cv: FormDataEntryValue | null): Promise<string[]> {
  const errors: string[] = [];
  const value = (key: string) => String(data.get(key) || '').trim();
  const email = value('email');
  const phone = value('phone').replace(/[\s()-]/g, '');
  const role = value('preferredRole');
  const branch = value('preferredBranch');
  const referral = value('referralSource');

  if (value('fullName').length < 2) errors.push('fullName');
  if (!/^\+?[0-9]{10,15}$/.test(phone)) errors.push('phone');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
  if (value('postcode').length < 3) errors.push('postcode');
  if (!allowedRoleIds.has(role as (typeof CAREER_ROLES)[number]['id'])) errors.push('preferredRole');
  if (!allowedBranches.has(branch)) errors.push('preferredBranch');
  if (!allowedReferralSources.has(referral)) errors.push('referralSource');
  if (referral === 'Other' && value('referralOther').length < 2) errors.push('referralOther');
  if (value('experience').length < 10) errors.push('experience');
  if (value('motivation').length < 10) errors.push('motivation');
  if (value('rightToWork') !== 'yes') errors.push('rightToWork');
  if (value('accurateConsent') !== 'yes') errors.push('accurateConsent');
  if (value('privacyConsent') !== 'yes') errors.push('privacyConsent');

  const availabilityValid = DAYS_OF_WEEK.some((day) => {
    const selection = value(`availability.${day.toLowerCase()}`);
    return allowedAvailability.has(selection) && selection !== 'Unavailable';
  });
  if (!availabilityValid) errors.push('availability');

  const cvExtension = cv instanceof File ? cv.name.split('.').pop()?.toLowerCase() : undefined;
  if (!(cv instanceof File) || cv.size === 0 || cv.size > CAREER_CV_MAX_BYTES || !cvExtension || !allowedCvExtensions.has(cvExtension)) {
    errors.push('cv');
  } else if (!(await hasValidCvSignature(cv))) {
    errors.push('cv');
  }

  return errors;
}

async function hasValidCvSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4B && [0x03, 0x05, 0x07].includes(bytes[2]);
  const isLegacyDoc = bytes[0] === 0xD0 && bytes[1] === 0xCF && bytes[2] === 0x11 && bytes[3] === 0xE0;
  return isPdf || isZip || isLegacyDoc;
}
