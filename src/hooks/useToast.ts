import { toast } from 'react-hot-toast';

export interface ToastOptions {
  duration?: number;
  icon?: string;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export const useToast = () => {
  // Success notifications
  const showSuccess = (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      duration: options?.duration || 3000,
      icon: options?.icon || '✅',
      position: options?.position || 'top-right',
    });
  };

  // Error notifications
  const showError = (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      duration: options?.duration || 5000,
      icon: options?.icon || '❌',
      position: options?.position || 'top-right',
    });
  };

  // Info notifications
  const showInfo = (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration || 4000,
      icon: options?.icon || 'ℹ️',
      position: options?.position || 'top-right',
    });
  };

  // Loading notifications
  const showLoading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      position: options?.position || 'top-right',
    });
  };

  // Betting-specific success messages
  const showBetSuccess = (amount: number, potentialWin: number) => {
    return showSuccess(
      `Aposta de ${formatCurrency(amount)} realizada! Ganho potencial: ${formatCurrency(potentialWin)}`,
      { icon: '🎉', duration: 4000 }
    );
  };

  // Deposit-specific success messages
  const showDepositSuccess = (amount: number, newBalance: number) => {
    return showSuccess(
      `Depósito de ${formatCurrency(amount)} realizado! Novo saldo: ${formatCurrency(newBalance)}`,
      { icon: '💰', duration: 4000 }
    );
  };

  // Betting-specific error messages
  const showBetError = (error: string | Error) => {
    const message = error instanceof Error ? error.message : error;
    return showError(message, { icon: '🚫' });
  };

  // Balance-specific error messages
  const showBalanceError = (error: string | Error) => {
    const message = error instanceof Error ? error.message : error;
    return showError(message, { icon: '💳' });
  };

  // Network/loading error messages
  const showNetworkError = () => {
    return showError(
      'Erro de conexão. Verifique sua internet e tente novamente.',
      { icon: '🌐', duration: 6000 }
    );
  };

  // Validation error messages
  const showValidationError = (field: string, message: string) => {
    return showError(`${field}: ${message}`, { icon: '⚠️' });
  };

  // Dismiss all toasts
  const dismissAll = () => {
    toast.dismiss();
  };

  // Dismiss specific toast
  const dismiss = (toastId: string) => {
    toast.dismiss(toastId);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showLoading,
    showBetSuccess,
    showDepositSuccess,
    showBetError,
    showBalanceError,
    showNetworkError,
    showValidationError,
    dismissAll,
    dismiss,
  };
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

// Pre-defined toast messages for common scenarios
export const TOAST_MESSAGES = {
  BET: {
    SUCCESS: 'Aposta realizada com sucesso!',
    ERROR: 'Erro ao fazer aposta',
    INSUFFICIENT_BALANCE: 'Saldo insuficiente para esta aposta',
    INVALID_AMOUNT: 'Valor da aposta inválido',
    EVENT_NOT_FOUND: 'Evento não encontrado',
  },
  DEPOSIT: {
    SUCCESS: 'Depósito realizado com sucesso!',
    ERROR: 'Erro ao fazer depósito',
    INVALID_AMOUNT: 'Valor de depósito inválido',
    MIN_AMOUNT: 'Valor mínimo de depósito: R$ 10,00',
    MAX_AMOUNT: 'Valor máximo de depósito: R$ 5.000,00',
  },
  EVENTS: {
    LOAD_ERROR: 'Erro ao carregar eventos esportivos',
    NO_EVENTS: 'Nenhum evento disponível no momento',
    RETRY_SUCCESS: 'Eventos carregados com sucesso!',
  },
  BETS: {
    LOAD_ERROR: 'Erro ao carregar suas apostas',
    NO_BETS: 'Você ainda não fez nenhuma aposta',
  },
  NETWORK: {
    ERROR: 'Erro de conexão. Verifique sua internet.',
    TIMEOUT: 'Operação demorou muito. Tente novamente.',
    OFFLINE: 'Você está offline. Conecte-se à internet.',
  },
  VALIDATION: {
    REQUIRED: 'Este campo é obrigatório',
    MIN_VALUE: 'Valor muito baixo',
    MAX_VALUE: 'Valor muito alto',
    INVALID_FORMAT: 'Formato inválido',
  },
} as const;