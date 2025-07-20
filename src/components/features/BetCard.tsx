import React from 'react';
import { Bet, BetStatus, BetPrediction } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export interface BetCardProps {
  bet: Bet;
  showEvent?: boolean;
  className?: string;
}

const BetCard: React.FC<BetCardProps> = ({ 
  bet, 
  showEvent = true, 
  className = '' 
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getPredictionLabel = (prediction: BetPrediction): string => {
    switch (prediction) {
      case 'home':
        return 'Casa';
      case 'draw':
        return 'Empate';
      case 'away':
        return 'Visitante';
      default:
        return prediction;
    }
  };

  const getStatusBadge = (status: BetStatus) => {
    switch (status) {
      case BetStatus.ACTIVE:
        return <Badge variant="primary">Ativa</Badge>;
      case BetStatus.WON:
        return <Badge variant="success">Ganha</Badge>;
      case BetStatus.LOST:
        return <Badge variant="danger">Perdida</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getWinningsDisplay = () => {
    switch (bet.status) {
      case BetStatus.ACTIVE:
        return (
          <div className="text-sm text-gray-600">
            <span>Ganho potencial: </span>
            <span className="font-semibold text-primary-600">
              {formatCurrency(bet.potentialWin)}
            </span>
          </div>
        );
      case BetStatus.WON:
        return (
          <div className="text-sm">
            <span className="text-gray-600">Ganho: </span>
            <span className="font-semibold text-success-600">
              {formatCurrency(bet.potentialWin)}
            </span>
          </div>
        );
      case BetStatus.LOST:
        return (
          <div className="text-sm">
            <span className="text-gray-600">Perda: </span>
            <span className="font-semibold text-danger-600">
              {formatCurrency(bet.amount)}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`${className}`} variant="default" padding="md">
      <div className="space-y-4 sm:space-y-3">
        {/* Header with status and date */}
        <div className="flex items-center justify-between">
          {getStatusBadge(bet.status)}
          <span className="text-xs text-gray-500">
            {formatDate(bet.createdAt)}
          </span>
        </div>

        {/* Event information */}
        {showEvent && (
          <div className="border-l-4 border-gray-200 pl-3">
            <div className="font-medium text-gray-900">
              {bet.event.homeTeam} vs {bet.event.awayTeam}
            </div>
            <div className="text-sm text-gray-600">
              {bet.event.sport.charAt(0).toUpperCase() + bet.event.sport.slice(1)}
            </div>
          </div>
        )}

        {/* Bet details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div>
            <span className="text-gray-600">Aposta: </span>
            <span className="font-semibold">
              {formatCurrency(bet.amount)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Odds: </span>
            <span className="font-semibold">
              {bet.odds.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Prediction */}
        <div className="text-sm">
          <span className="text-gray-600">Previsão: </span>
          <span className="font-semibold">
            {getPredictionLabel(bet.prediction)}
          </span>
        </div>

        {/* Winnings display */}
        {getWinningsDisplay()}
      </div>
    </Card>
  );
};

export default BetCard;