import React from 'react';
import BetListContainer from '../components/features/BetListContainer';
import { useBettingStore } from '../stores/bettingStore';

export const BetsPage: React.FC = () => {
  const { bets, getBettingStats } = useBettingStore();
  const stats = getBettingStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-3 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-2">
          Minhas Apostas
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4 sm:px-2">
          Acompanhe todas as suas apostas, filtre por status e veja seu histórico completo.
        </p>
      </div>

      {/* Betting Summary */}
      {bets.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 sm:p-5 lg:p-6 border border-primary-200">
          <h2 className="text-lg sm:text-xl font-semibold text-primary-900 mb-4 sm:mb-3">
            Resumo das Apostas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600">
                {stats.totalBets}
              </div>
              <div className="text-xs sm:text-sm text-primary-700 mt-1">
                Total de Apostas
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-success-600">
                {stats.wonBets}
              </div>
              <div className="text-xs sm:text-sm text-primary-700 mt-1">
                Apostas Ganhas
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-danger-600">
                {stats.lostBets}
              </div>
              <div className="text-xs sm:text-sm text-primary-700 mt-1">
                Apostas Perdidas
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600">
                {stats.activeBets}
              </div>
              <div className="text-xs sm:text-sm text-primary-700 mt-1">
                Apostas Ativas
              </div>
            </div>
          </div>
          
          {/* Win Rate */}
          {stats.totalBets > 0 && (
            <div className="mt-4 pt-4 border-t border-primary-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-700">
                  Taxa de Vitória
                </span>
                <span className="text-lg font-bold text-primary-600">
                  {stats.winRate.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 bg-primary-200 rounded-full h-2">
                <div
                  className="bg-success-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(stats.winRate, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bet List with Filtering */}
      <div className="w-full">
        <BetListContainer />
      </div>
    </div>
  );
};