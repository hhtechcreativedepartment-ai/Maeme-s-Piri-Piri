import LegalPageContent from '@/components/legal/LegalPageContent';
import OrderingHeader from '@/components/ordering/OrderingHeader';
import OrderingFooter from '@/components/ordering/OrderingFooter';
import { privacyPolicyContent } from '@/lib/legalContent';

export default function OrderingPrivacyPolicyPage() {
  return (
    <>
      <OrderingHeader />
      <LegalPageContent {...privacyPolicyContent} backHref="/order/menu" />
      <OrderingFooter />
    </>
  );
}
