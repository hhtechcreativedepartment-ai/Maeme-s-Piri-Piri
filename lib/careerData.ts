export const CAREER_ROLES = [
  { id: 'crew-member', title: 'Crew Member', summary: 'Support food preparation, service and day-to-day restaurant operations.' },
  { id: 'cashier', title: 'Cashier', summary: 'Welcome customers and support accurate, friendly counter service.' },
  { id: 'cleaner', title: 'Cleaner', summary: 'Help maintain a clean, safe and welcoming restaurant environment.' },
  { id: 'driver', title: 'Driver', summary: 'Support reliable local deliveries where driver roles are available.' },
  { id: 'crew-trainer', title: 'Crew Trainer', summary: 'Help team members develop consistent service and operating skills.' },
  { id: 'till-admin', title: 'Till Admin', summary: 'Support till processes, accuracy and restaurant administration.' },
  { id: 'supervisor', title: 'Supervisor', summary: 'Support shifts, team coordination and customer service standards.' },
  { id: 'assistant-manager', title: 'Assistant Manager', summary: 'Help lead restaurant operations and support team performance.' },
  { id: 'department-manager', title: 'Department Manager', summary: 'Coordinate a key restaurant area and its operating standards.' },
  { id: 'restaurant-manager', title: 'Restaurant Manager', summary: 'Lead restaurant operations, people and customer experience.' },
] as const;

export const REFERRAL_SOURCES = [
  'Friend / Family',
  'Facebook',
  'Google / Internet Search',
  'Indeed',
  'Job Centre',
  'In Store',
  "Maeme's Website",
  'Other',
] as const;

export const AVAILABILITY_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Full Day', 'Unavailable'] as const;
export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const CAREER_CV_MAX_BYTES = 5 * 1024 * 1024;
export const CAREER_CV_ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const CAREER_CV_EXTENSIONS = ['pdf', 'doc', 'docx'] as const;

export function isAllowedCvFile(file: Pick<File, 'name' | 'size' | 'type'>): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return Boolean(
    extension
    && CAREER_CV_EXTENSIONS.includes(extension as (typeof CAREER_CV_EXTENSIONS)[number])
    && file.size > 0
    && file.size <= CAREER_CV_MAX_BYTES,
  );
}
