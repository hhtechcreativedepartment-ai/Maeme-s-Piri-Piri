export interface Branch {
  branchId: string;
  branchName: string;
  address: string;
  postcode: string;
  phone?: string;
  deliveryTime?: string;
  pickupTime?: string;
  isOpen?: boolean;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  minDeliveryAmount: number;
  deliveryFee: number;
}

export const BRANCHES: Branch[] = [
  {
    branchId: 'maemes-southall',
    branchName: "Maeme's Southall",
    address: '78 The Broadway, Southall, London',
    postcode: 'UB1 1QD',
    phone: '020 3000 1101',
    deliveryTime: '35-45 min',
    pickupTime: '15-20 min',
    isOpen: true,
    openingHours: {
      monday: '11:00 AM - 11:00 PM',
      tuesday: '11:00 AM - 11:00 PM',
      wednesday: '11:00 AM - 11:00 PM',
      thursday: '11:00 AM - 11:00 PM',
      friday: '11:00 AM - 12:00 AM',
      saturday: '11:00 AM - 12:00 AM',
      sunday: '11:00 AM - 11:00 PM',
    },
    deliveryAvailable: true,
    pickupAvailable: true,
    minDeliveryAmount: 14,
    deliveryFee: 2.49,
  },
  {
    branchId: 'maemes-watford',
    branchName: "Maeme's Watford",
    address: '42 High Street, Watford',
    postcode: 'WD17 2BS',
    phone: '01923 300 202',
    deliveryTime: '30-40 min',
    pickupTime: '12-18 min',
    isOpen: true,
    openingHours: {
      monday: '11:00 AM - 11:00 PM',
      tuesday: '11:00 AM - 11:00 PM',
      wednesday: '11:00 AM - 11:00 PM',
      thursday: '11:00 AM - 11:00 PM',
      friday: '11:00 AM - 12:00 AM',
      saturday: '10:00 AM - 12:00 AM',
      sunday: '11:00 AM - 11:00 PM',
    },
    deliveryAvailable: true,
    pickupAvailable: true,
    minDeliveryAmount: 15,
    deliveryFee: 2.99,
  },
  {
    branchId: 'maemes-dalston',
    branchName: "Maeme's Dalston",
    address: '18 Kingsland High Street, London',
    postcode: 'E8 2JP',
    phone: '020 3000 3303',
    deliveryTime: '40-50 min',
    pickupTime: '15-20 min',
    isOpen: true,
    openingHours: {
      monday: '11:00 AM - 10:30 PM',
      tuesday: '11:00 AM - 10:30 PM',
      wednesday: '11:00 AM - 10:30 PM',
      thursday: '11:00 AM - 10:30 PM',
      friday: '11:00 AM - 11:30 PM',
      saturday: '10:00 AM - 11:30 PM',
      sunday: '11:00 AM - 10:00 PM',
    },
    deliveryAvailable: true,
    pickupAvailable: true,
    minDeliveryAmount: 15,
    deliveryFee: 2.99,
  },
  {
    branchId: 'maemes-eastcote',
    branchName: "Maeme's Eastcote",
    address: '211 Field End Road, Eastcote',
    postcode: 'HA5 1QZ',
    phone: '020 3000 4404',
    deliveryTime: '30-45 min',
    pickupTime: '12-18 min',
    isOpen: true,
    openingHours: {
      monday: '10:00 AM - 11:00 PM',
      tuesday: '10:00 AM - 11:00 PM',
      wednesday: '10:00 AM - 11:00 PM',
      thursday: '10:00 AM - 11:00 PM',
      friday: '10:00 AM - 12:00 AM',
      saturday: '10:00 AM - 12:00 AM',
      sunday: '10:00 AM - 10:30 PM',
    },
    deliveryAvailable: true,
    pickupAvailable: true,
    minDeliveryAmount: 12,
    deliveryFee: 2.49,
  },
  {
    branchId: 'maemes-croydon',
    branchName: "Maeme's Croydon",
    address: '103 North End, Croydon',
    postcode: 'CR0 1TY',
    phone: '020 3000 5505',
    deliveryTime: '35-45 min',
    pickupTime: '15-20 min',
    isOpen: true,
    openingHours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 10:00 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '10:00 AM - 11:00 PM',
      sunday: '11:00 AM - 9:30 PM',
    },
    deliveryAvailable: true,
    pickupAvailable: true,
    minDeliveryAmount: 12,
    deliveryFee: 2.49,
  },
  {
    branchId: 'maemes-aldershot',
    branchName: "Maeme's Aldershot",
    address: '27 Union Street, Aldershot',
    postcode: 'GU11 1EP',
    phone: '01252 300 606',
    deliveryTime: '30-40 min',
    pickupTime: '12-18 min',
    isOpen: false,
    openingHours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 10:00 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '11:00 AM - 11:00 PM',
      sunday: '12:00 PM - 10:00 PM',
    },
    deliveryAvailable: true,
    pickupAvailable: true,
    minDeliveryAmount: 12,
    deliveryFee: 2.49,
  },
];

export function findNearestBranch(postcode: string): Branch {
  // Simple postcode matching - in production, use postal code API
  const normalized = postcode.replace(/\s/g, '').toUpperCase();

  // Check for exact postcode matches
  const exactMatch = BRANCHES.find(b => b.postcode.replace(/\s/g, '').toUpperCase() === normalized);
  if (exactMatch) return exactMatch;

  // Check for postcode prefix matches (first 2-3 characters)
  const prefixMatch = BRANCHES.find(b =>
    b.postcode.substring(0, 2).toUpperCase() === normalized.substring(0, 2)
  );
  if (prefixMatch) return prefixMatch;

  // Default to first branch if no match found
  return BRANCHES[0];
}

export function formatBranchDisplay(branch: Branch): string {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return `Open: 11:00 AM - 11:00 PM`;
  }
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const today = new Date().getDay();
  const dayName = days[today];
  const timings = branch.openingHours[dayName];
  return `Open: ${timings}`;
}
