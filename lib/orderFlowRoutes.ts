export function isOrderFlowRoute(pathname: string) {
  return (
    pathname === '/order'
    || pathname === '/order/menu'
    || pathname === '/order/privacy-policy'
    || pathname === '/order/terms-and-conditions'
    || pathname === '/cart'
    || pathname === '/checkout'
    || pathname.startsWith('/order-success/')
    || pathname.startsWith('/track/')
  );
}
