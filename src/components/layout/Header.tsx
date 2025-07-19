import React from 'react';
import { useBetting } from '../../hooks/useBetting';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

interface HeaderProps {
  onDepositClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onDepositClick }) => {
  const { user, loading, isLoading } = useBetting();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            SportsBet
          </h1>
        </div>

        {/* Balance and Deposit */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 hidden sm:inline">
              Saldo:
            </span>
            <div className="flex items-center space-x-2">
              {loading.balance ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span className="text-lg font-semibold text-green-600">
                  {formatCurrency(user.balance)}
                </span>
              )}
            </div>
          </div>
          
          <Button
            variant="primary"
            size="sm"
            onClick={onDepositClick}
            disabled={loading.balance}
          >
            <span className="hidden sm:inline">Depositar</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </div>
    </header>
  );
};