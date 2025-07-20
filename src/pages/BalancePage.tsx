import React, { useState } from 'react';
import BalanceDisplay from '../components/features/BalanceDisplay';
import DepositModal from '../components/forms/DepositModal';
import { useBettingStore } from '../stores/bettingStore';

export const BalancePage: React.FC = () => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const { user, getBettingStats } = useBettingStore();
  const stats = getBettingStats();

  const handleDepositClick = () => {
    setIsDepositModalOpen(true);
  };

  const handleDepositModalClose = () => {
    setIsDepositModalOpen(false);
  };

  // Calculate financial summary
  const totalInvested = stats.totalWinnings + stats.totalLosses + 
    stats.activeBets * (stats.totalBets > 0 ? (stats.totalWinnings + stats.totalLosses) / (stats.wonBets + stats.lostBets || 1) : 0);
  const netResult = stats.totalWinnings - stats.totalLosses;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-3 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-2">
          Gerenciar Saldo
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4 sm:px-2">
          Controle seu saldo, faça depósitos e acompanhe seu histórico financeiro.
        </p>
      </div>

      {/* Main Balance Display */}
      <div className="w-full">
        <BalanceDisplay
          onDepositClick={handleDepositClick}
          showDepositButton={true}
          size="lg"
        />
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Winnings */}
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-success-800">
                Total Ganho
              </p>
              <p className="text-2xl font-bold text-success-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats.totalWinnings)}
              </p>
              <p className="text-xs text-success-600">
                {stats.wonBets} apostas ganhas
              </p>
            </div>
          </div>
        </div>

        {/* Total Losses */}
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-danger-800">
                Total Perdido
              </p>
              <p className="text-2xl font-bold text-danger-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats.totalLosses)}
              </p>
              <p className="text-xs text-danger-600">
                {stats.lostBets} apostas perdidas
              </p>
            </div>
          </div>
        </div>

        {/* Net Result */}
        <div className={`${netResult >= 0 ? 'bg-success-50 border-success-200' : 'bg-danger-50 border-danger-200'} border rounded-lg p-4`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className={`w-8 h-8 ${netResult >= 0 ? 'text-success-600' : 'text-danger-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${netResult >= 0 ? 'text-success-800' : 'text-danger-800'}`}>
                Resultado Líquido
              </p>
              <p className={`text-2xl font-bold ${netResult >= 0 ? 'text-success-900' : 'text-danger-900'}`}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(netResult)}
              </p>
              <p className={`text-xs ${netResult >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {netResult >= 0 ? 'Lucro total' : 'Prejuízo total'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <button
            onClick={handleDepositClick}
            className="flex items-center justify-center px-4 py-4 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[56px] sm:min-h-[48px] touch-manipulation"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Fazer Depósito
          </button>
          
          <button
            className="flex items-center justify-center px-4 py-4 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-h-[56px] sm:min-h-[48px] touch-manipulation"
            disabled
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Histórico (Em breve)
          </button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">
          💡 Dicas de Gerenciamento
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
            Defina um orçamento mensal para apostas e não ultrapasse esse limite
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
            Mantenha sempre uma reserva de emergência separada das apostas
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
            Acompanhe regularmente suas estatísticas para tomar decisões informadas
          </li>
        </ul>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={handleDepositModalClose}
      />
    </div>
  );
};