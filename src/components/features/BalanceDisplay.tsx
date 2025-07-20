import React from 'react';
import { useBettingStore } from '../../stores/bettingStore';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

export interface BalanceDisplayProps {
  onDepositClick?: () => void;
  showDepositButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ 
  onDepositClick,
  showDepositButton = true,
  size = 'md',
  className = ''
}) => {
  const { user, loading } = useBettingStore();

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  // Size-based styling
  const sizeClasses = {
    sm: {
      container: 'p-3',
      label: 'text-xs',
      balance: 'text-lg font-bold',
      button: 'text-xs px-2 py-1'
    },
    md: {
      container: 'p-4',
      label: 'text-sm',
      balance: 'text-2xl font-bold',
      button: 'text-sm px-3 py-1.5'
    },
    lg: {
      container: 'p-6',
      label: 'text-base',
      balance: 'text-3xl font-bold',
      button: 'text-base px-4 py-2'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${classes.container} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-gray-600 ${classes.label} mb-1`}>
            Saldo Disponível
          </p>
          
          <div className="flex items-center space-x-2">
            {loading.balance ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span className={`text-gray-400 ${classes.balance}`}>
                  Atualizando...
                </span>
              </div>
            ) : (
              <span className={`text-gray-900 ${classes.balance}`}>
                {formatCurrency(user.balance)}
              </span>
            )}
          </div>
        </div>

        {showDepositButton && onDepositClick && (
          <div className="ml-4">
            <Button
              variant="primary"
              size={size === 'lg' ? 'md' : 'sm'}
              onClick={onDepositClick}
              disabled={loading.balance}
              className={`${classes.button} touch-manipulation`}
            >
              + Depositar
            </Button>
          </div>
        )}
      </div>

      {/* Additional balance info for larger sizes */}
      {size === 'lg' && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total de Apostas</p>
              <p className="font-semibold text-gray-900">{user.totalBets}</p>
            </div>
            <div>
              <p className="text-gray-500">Taxa de Vitória</p>
              <p className="font-semibold text-gray-900">
                {user.totalBets > 0 
                  ? `${((user.totalWins / (user.totalWins + user.totalLosses)) * 100 || 0).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceDisplay;