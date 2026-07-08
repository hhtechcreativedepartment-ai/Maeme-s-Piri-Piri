import type { Branch, OrderType } from '@/types';
import { branches } from '@/data/branches';
import { readStorage, removeStorage, writeStorage } from '@/utils/storage';

const BRANCH_KEY = 'maemes.selectedBranch';
const ORDER_TYPE_KEY = 'maemes.selectedOrderType';

export const branchStore = {
  get selectedBranch() {
    return readStorage<Branch | null>(BRANCH_KEY, null);
  },

  get selectedOrderType() {
    return readStorage<OrderType | null>(ORDER_TYPE_KEY, null);
  },

  setBranch(branchId: string, orderType?: OrderType) {
    const branch = branches.find(item => item.id === branchId) || null;
    if (branch) {
      writeStorage(BRANCH_KEY, branch);
      if (orderType) writeStorage(ORDER_TYPE_KEY, orderType);
    }
    return branch;
  },

  setOrderType(orderType: OrderType) {
    writeStorage(ORDER_TYPE_KEY, orderType);
    return orderType;
  },

  clearBranch() {
    removeStorage(BRANCH_KEY);
    removeStorage(ORDER_TYPE_KEY);
  },
};
