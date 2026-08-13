import LegalPageContent from '@/components/legal/LegalPageContent';
import OrderingHeader from '@/components/ordering/OrderingHeader';
import OrderingFooter from '@/components/ordering/OrderingFooter';
import { termsContent } from '@/lib/legalContent';

export default function OrderingTermsPage() {
  return (
    <>
      <OrderingHeader />
      <LegalPageContent {...termsContent} backHref="/order/menu" />
      <OrderingFooter />
    </>
  );
}
