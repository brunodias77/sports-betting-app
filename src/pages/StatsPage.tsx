import React from 'react';
import BettingStats from '../components/features/BettingStats';

export const StatsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-3 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-2">
          Estatísticas de Apostas
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4 sm:px-2">
          Acompanhe seu desempenho e analise suas apostas esportivas. 
          Veja suas estatísticas detalhadas e performance ao longo do tempo.
        </p>
      </div>

      {/* Statistics Content */}
      <div className="w-full">
        <BettingStats />
      </div>
    </div>
  );
};