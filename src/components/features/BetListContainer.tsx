import React, { useEffect } from 'react';
import { useBettingStore } from '../../stores/bettingStore';
import { BetStatus } from '../../types';
import BetList from './BetList';

export interface BetListContainerProps {
  className?: string;
}

const BetListContainer: React.FC<BetListContainerProps> = ({ className }) => {
  const {
    bets,
    loading,
    error,
    getBetsByStatus,
    setError,
    clearErrors
  } = useBettingStore();

  // Clear bet errors when component mounts (but not other errors)
  useEffect(() => {
    setError('bets', null);
  }, [setError]);

  const handleRetry = () => {
    // Clear the error and attempt to reload data
    setError('bets', null);
    // In a real app, this might trigger a data refresh
    // For now, we just clear the error since bets are stored locally
  };

  return (
    <BetList
      bets={bets}
      loading={loading.bets}
      error={error.bets}
      onRetry={handleRetry}
      className={className}
    />
  );
};

export default BetListContainer;