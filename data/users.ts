import type { SavedAddress, SavedCard, UserSession } from '@/types';

export const users: UserSession[] = [
  {
    userId: 'user-demo-001',
    name: 'Amina Khan',
    phone: '+447700900123',
    email: 'amina@example.com',
  },
  {
    userId: 'user-demo-002',
    name: 'Daniel Brooks',
    phone: '+447700900456',
    email: 'daniel@example.com',
  },
];

export const savedAddresses: SavedAddress[] = [
  {
    id: 'address-home-001',
    label: 'Home',
    recipientName: 'Amina Khan',
    phone: '+447700900123',
    address: '24 Lancaster Road',
    city: 'Southall',
    postcode: 'UB1 1NW',
    isDefault: true,
  },
  {
    id: 'address-work-001',
    label: 'Work',
    recipientName: 'Amina Khan',
    phone: '+447700900123',
    address: '12 Station Road',
    city: 'Watford',
    postcode: 'WD17 1ET',
  },
];

export const savedCards: SavedCard[] = [
  {
    id: 'card-demo-001',
    brand: 'Visa',
    last4: '4242',
    expiry: '12/28',
    nameOnCard: 'Amina Khan',
  },
];
