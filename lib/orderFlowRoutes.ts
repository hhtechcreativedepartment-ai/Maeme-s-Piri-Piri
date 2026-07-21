export function isOrderFlowRoute(pathname: string) {
  return (
    pathname === '/order'
    || pathname === '/order/menu'
    || pathname === '/menu'
    || pathname === '/cart'
    || pathname === '/checkout'
    || pathname.startsWith('/order-success/')
    || pathname.startsWith('/track/')
  );
}
