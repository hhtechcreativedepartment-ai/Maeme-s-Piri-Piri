import LegalPageContent from '@/components/legal/LegalPageContent';
import { privacyPolicyContent } from '@/lib/legalContent';

export default function PrivacyPolicyPage() {
  return <LegalPageContent {...privacyPolicyContent} />;
}
