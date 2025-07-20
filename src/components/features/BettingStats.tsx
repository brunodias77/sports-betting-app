import React from 'react';
import { useBettingStore } from '../../stores/bettingStore';
import StatsCard from './StatsCard';

const BettingStats: React.FC = () => {
  const { getBettingStats, getBetsByStatus, loading } = useBettingStore();
  
  const stats = getBettingStats();
  const activeBets = getBetsByStatus('active');
  
  // Calculate active bets value and potential winnings
  const activeBetsValue = activeBets.reduce((sum, bet) => sum + bet.amount, 0);
  const potentialWinnings = activeBets.reduce((sum, bet) => sum + bet.potentialWin, 0);
  
  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };
  
  // Handle edge cases for win rate calculation
  const getWinRateDisplay = (): string => {
    if (stats.totalBets === 0) {
      return '0.0%';
    }
    
    const completedBets = stats.wonBets + stats.lostBets;
    if (completedBets === 0) {
      return 'N/A';
    }
    
    return formatPercentage(stats.winRate);
  };
  
  // Get subtitle for stats with no data
  const getStatsSubtitle = (hasData: boolean, defaultText: string): string => {
    return hasData ? defaultText : 'Nenhuma aposta ainda';
  };

  return (
    <div className="space-y-8">
      {/* Main Statistics Grid */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Estatísticas Gerais
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total de Apostas"
          value={stats.totalBets}
          subtitle={getStatsSubtitle(stats.totalBets > 0, 'Apostas realizadas')}
          isLoading={loading.bets}
        />
        
        <StatsCard
          title="Taxa de Vitória"
          value={getWinRateDisplay()}
          subtitle={getStatsSubtitle(
            stats.wonBets + stats.lostBets > 0, 
            `${stats.wonBets} vitórias de ${stats.wonBets + stats.lostBets} finalizadas`
          )}
          variant={stats.winRate > 50 ? 'success' : stats.winRate > 0 ? 'warning' : 'default'}
          isLoading={loading.bets}
        />
        
        <StatsCard
          title="Total Ganho"
          value={formatCurrency(stats.totalWinnings)}
          subtitle={getStatsSubtitle(stats.totalWinnings > 0, `${stats.wonBets} apostas ganhas`)}
          variant="success"
          isLoading={loading.bets}
        />
        
        <StatsCard
          title="Total Perdido"
          value={formatCurrency(stats.totalLosses)}
          subtitle={getStatsSubtitle(stats.totalLosses > 0, `${stats.lostBets} apostas perdidas`)}
          variant="danger"
          isLoading={loading.bets}
        />
        </div>
      </section>
      
      {/* Active Bets Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Apostas Ativas
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatsCard
            title="Apostas Ativas"
            value={stats.activeBets}
            subtitle={getStatsSubtitle(stats.activeBets > 0, 'Aguardando resultado')}
            variant="warning"
            isLoading={loading.bets}
          />
          
          <StatsCard
            title="Valor Apostado"
            value={formatCurrency(activeBetsValue)}
            subtitle={getStatsSubtitle(activeBetsValue > 0, 'Em apostas ativas')}
            variant="warning"
            isLoading={loading.bets}
          />
          
          <StatsCard
            title="Ganho Potencial"
            value={formatCurrency(potentialWinnings)}
            subtitle={getStatsSubtitle(potentialWinnings > 0, 'Se todas ganharem')}
            variant="success"
            isLoading={loading.bets}
          />
        </div>
      </section>
      
      {/* Performance Summary */}
      {stats.totalBets > 0 && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Resumo de Performance
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <StatsCard
              title="Saldo Líquido"
              value={formatCurrency(stats.totalWinnings - stats.totalLosses)}
              subtitle={
                stats.totalWinnings > stats.totalLosses 
                  ? 'Lucro total' 
                  : stats.totalWinnings < stats.totalLosses 
                    ? 'Prejuízo total' 
                    : 'Equilibrado'
              }
              variant={
                stats.totalWinnings > stats.totalLosses 
                  ? 'success' 
                  : stats.totalWinnings < stats.totalLosses 
                    ? 'danger' 
                    : 'default'
              }
              isLoading={loading.bets}
            />
            
            <StatsCard
              title="Valor Médio por Aposta"
              value={formatCurrency((stats.totalWinnings + stats.totalLosses + activeBetsValue) / stats.totalBets)}
              subtitle="Baseado em todas as apostas"
              isLoading={loading.bets}
            />
          </div>
        </section>
      )}
      
      {/* Empty State */}
      {stats.totalBets === 0 && !loading.bets && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📊</div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              Nenhuma estatística ainda
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Faça sua primeira aposta para ver suas estatísticas aqui.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default BettingStats;