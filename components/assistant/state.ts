import type { AssistantAction, AssistantMessage, AssistantState } from './types';

export const ASSISTANT_STORAGE_KEY = 'maemes.assistant.prototype.v1';

export function message(role: AssistantMessage['role'], text: string, card?: AssistantMessage['card']): AssistantMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    card,
    createdAt: Date.now(),
  };
}

export const initialAssistantState: AssistantState = {
  step: 'welcome',
  messages: [
    message(
      'assistant',
      "Hi, I’m the Maeme’s Ordering Assistant. I can help you find food, customise your meal and prepare your order. You can type or speak to me."
    ),
  ],
  history: [],
  selectedProduct: null,
  productMatches: [],
  selectedAddress: null,
  payment: null,
  discount: 0,
  lastOrder: null,
  pendingPrivateIntent: null,
  submissionId: null,
  isProcessing: false,
  error: null,
};

export function assistantReducer(state: AssistantState, action: AssistantAction): AssistantState {
  switch (action.type) {
    case 'hydrate':
      return { ...initialAssistantState, ...action.state, isProcessing: false, submissionId: null };
    case 'message':
      return { ...state, messages: [...state.messages, action.message] };
    case 'navigate':
      return {
        ...state,
        history: state.step === action.step ? state.history : [...state.history, state.step],
        step: action.step,
        error: null,
      };
    case 'back': {
      const previous = state.history.at(-1) || 'welcome';
      return { ...state, step: previous, history: state.history.slice(0, -1), error: null };
    }
    case 'selectProduct':
      return { ...state, selectedProduct: action.product };
    case 'matches':
      return { ...state, productMatches: action.products };
    case 'address':
      return { ...state, selectedAddress: action.address };
    case 'payment':
      return { ...state, payment: action.payment };
    case 'privateIntent':
      return { ...state, pendingPrivateIntent: action.intent };
    case 'processing':
      return { ...state, isProcessing: true, submissionId: action.submissionId, step: 'orderProcessing' };
    case 'receipt':
      return { ...state, isProcessing: false, submissionId: null, lastOrder: action.order, step: 'receipt' };
    case 'error':
      return { ...state, isProcessing: false, submissionId: null, error: action.error, step: 'error' };
    case 'reset':
      return { ...initialAssistantState, messages: [...initialAssistantState.messages] };
    default:
      return state;
  }
}

export function loadAssistantState(): AssistantState | null {
  try {
    const stored = localStorage.getItem(ASSISTANT_STORAGE_KEY);
    return stored ? JSON.parse(stored) as AssistantState : null;
  } catch {
    return null;
  }
}

export function saveAssistantState(state: AssistantState) {
  try {
    const safeState = { ...state, isProcessing: false, submissionId: null };
    localStorage.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(safeState));
  } catch {
    // Persistence is an enhancement; the ordering UI remains usable without it.
  }
}

export function clearAssistantState() {
  localStorage.removeItem(ASSISTANT_STORAGE_KEY);
}
