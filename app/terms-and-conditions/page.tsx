import LegalPageContent from '@/components/legal/LegalPageContent';
import { termsContent } from '@/lib/legalContent';

export default function TermsPage() {
  return <LegalPageContent {...termsContent} />;
}
