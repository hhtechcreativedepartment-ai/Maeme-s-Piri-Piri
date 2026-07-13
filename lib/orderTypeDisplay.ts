export type DisplayableOrderType = 'delivery' | 'pickup';

export const ORDER_TYPE_LABELS: Record<DisplayableOrderType, 'Delivery' | 'Collection'> = {
  delivery: 'Delivery',
  pickup: 'Collection',
};

export function getOrderTypeLabel(orderType: DisplayableOrderType | null | undefined) {
  return orderType ? ORDER_TYPE_LABELS[orderType] : 'Delivery or Collection';
}
