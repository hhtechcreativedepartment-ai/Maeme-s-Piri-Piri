import type { Metadata } from 'next';
import CareerPage from '@/components/career/CareerPage';

export const metadata: Metadata = {
  title: "Career at Maeme's | Join Our Team",
  description: "Explore roles at Maeme's and submit an application to join our restaurant team.",
};

export default function CareerRoute() {
  return <CareerPage />;
}
