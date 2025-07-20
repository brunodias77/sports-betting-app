import React, { useState } from 'react';
import type { Bet, BetStatus } from '../../types';
import BetCard from './BetCard';
import Button from '../ui/Button';
import AsyncHandler from '../ui/AsyncHandler';
import ErrorFallback from '../ui/ErrorFallback';
import { BetCardSkeleton } from '../ui/skeletons';
import { useToast } from '../../hooks/useToast';

export interface BetListProps {
  bets: Bet[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

type FilterStatus = 'all' | BetStatus;

const BetList: React.FC<BetListProps> = ({
  bets,
  loading = false,
  error = null,
  onRetry,
  className = ''
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const { showSuccess, TOAST_MESSAGES } = useToast();

  // Enhanced retry function with toast feedback
  const handleRetryWithFeedback = async () => {
    if (onRetry) {
      try {
        await onRetry();
        showSuccess('Apostas carregadas com sucesso!');
      } catch (error) {
        // Error will be handled by the parent component
      }
    }
  };

  const getFilteredBets = (): Bet[] => {
    if (activeFilter === 'all') {
      return bets;
    }
    return bets.filter(bet => bet.status === activeFilter);
  };

  const getFilterLabel = (filter: FilterStatus): string => {
    switch (filter) {
      case 'all':
        return 'Todas';
      case BetStatus.ACTIVE:
        return 'Ativas';
      case BetStatus.WON:
        return 'Ganhas';
      case BetStatus.LOST:
        return 'Perdidas';
      default:
        return filter;
    }
  };

  const getEmptyMessage = (filter: FilterStatus): string => {
    switch (filter) {
      case 'all':
        return 'Você ainda não fez nenhuma aposta. Que tal começar agora?';
      case BetStatus.ACTIVE:
        return 'Você não tem apostas ativas no momento.';
      case BetStatus.WON:
        return 'Você ainda não ganhou nenhuma aposta. Continue tentando!';
      case BetStatus.LOST:
        return 'Você ainda não perdeu nenhuma aposta. Boa sorte!';
      default:
        return 'Nenhuma aposta encontrada para este filtro.';
    }
  };

  const getBetCount = (filter: FilterStatus): number => {
    if (filter === 'all') {
      return bets.length;
    }
    return bets.filter(bet => bet.status === filter).length;
  };

  const filteredBets = getFilteredBets();
  const filters: FilterStatus[] = ['all', BetStatus.ACTIVE, BetStatus.WON, BetStatus.LOST];

  // Custom loading component with skeleton
  const loadingComponent = (
    <div className="space-y-6">
      {/* Filter buttons skeleton */}
      <div className="flex flex-wrap gap-3 sm:gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
        ))}
      </div>
      
      {/* Bet cards skeleton */}
      <div className="space-y-4 sm:space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <BetCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );

  // Custom error component
  const errorComponent = (
    <ErrorFallback
      error={error}
      title="Erro ao carregar apostas"
      onRetry={handleRetryWithFeedback}
      className="py-12"
    />
  );

  // Empty state for filtered results
  const emptyState = (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-lg font-medium text-gray-600">
          {getEmptyMessage(activeFilter)}
        </p>
      </div>
    </div>
  );

  return (
    <div className={className}>
      <AsyncHandler
        loading={loading}
        error={error}
        loadingComponent={loadingComponent}
        errorComponent={errorComponent}
      >
        {/* Filter buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 sm:gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className="flex items-center gap-2 touch-manipulation"
              >
                {getFilterLabel(filter)}
                <span className="bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full text-xs">
                  {getBetCount(filter)}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Bet list */}
        {filteredBets.length === 0 ? (
          emptyState
        ) : (
          <div className="space-y-4 sm:space-y-3">
            {filteredBets.map((bet) => (
              <BetCard
                key={bet.id}
                bet={bet}
                showEvent={true}
              />
            ))}
          </div>
        )}
      </AsyncHandler>
    </div>
  );
};

export default BetList;