export function isOrderFlowRoute(pathname: string) {
  return (
    pathname === '/menu'
    || pathname === '/cart'
    || pathname === '/checkout'
    || pathname.startsWith('/order-success/')
    || pathname.startsWith('/track/')
  );
}
