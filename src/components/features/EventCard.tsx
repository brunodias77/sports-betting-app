import React from 'react';
import { SportEvent, BetPrediction, EventStatus } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export interface EventCardProps {
  event: SportEvent;
  onBetClick: (event: SportEvent, prediction: BetPrediction) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onBetClick }) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const eventDate = new Date(date);
    
    // If event is today, show time only
    if (eventDate.toDateString() === now.toDateString()) {
      return eventDate.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    // If event is within a week, show day and time
    const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (Math.abs(diffDays) <= 7) {
      return eventDate.toLocaleDateString('pt-BR', { 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    // Otherwise show full date
    return eventDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSportDisplayName = (sport: string) => {
    const sportNames = {
      football: 'Futebol',
      basketball: 'Basquete',
      tennis: 'Tênis',
      volleyball: 'Vôlei'
    };
    return sportNames[sport as keyof typeof sportNames] || sport;
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case EventStatus.LIVE:
        return <Badge variant="live" size="sm">AO VIVO</Badge>;
      case EventStatus.UPCOMING:
        return <Badge variant="primary" size="sm">Em breve</Badge>;
      case EventStatus.FINISHED:
        return <Badge variant="default" size="sm">Finalizado</Badge>;
      default:
        return null;
    }
  };

  const isEventBettable = event.status === EventStatus.UPCOMING || event.status === EventStatus.LIVE;

  return (
    <Card 
      variant={event.status === EventStatus.LIVE ? "selected" : "hover"}
      className={`w-full ${event.status === EventStatus.LIVE ? 'ring-danger-200' : ''}`}
      padding="md"
    >
      <div className="space-y-4 sm:space-y-3">
        {/* Header with sport and status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            {getSportDisplayName(event.sport)}
          </span>
          {getStatusBadge(event.status)}
        </div>

        {/* Teams/Players */}
        <div className="text-center">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span className="flex-1 text-left">{event.homeTeam}</span>
            <span className="px-4 text-gray-400">vs</span>
            <span className="flex-1 text-right">{event.awayTeam}</span>
          </div>
        </div>

        {/* Date and Time */}
        <div className="text-center text-sm text-gray-600">
          {formatDate(event.date)}
        </div>

        {/* Odds Buttons */}
        {isEventBettable && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-2">
            {/* Home Team Odds */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBetClick(event, BetPrediction.HOME)}
              className="flex flex-col items-center py-3 min-h-[56px] touch-manipulation"
            >
              <span className="text-xs text-gray-600 mb-1">Casa</span>
              <span className="font-bold text-lg">{event.odds.home.toFixed(2)}</span>
            </Button>

            {/* Draw Odds (if available) */}
            {event.odds.draw && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onBetClick(event, BetPrediction.DRAW)}
                className="flex flex-col items-center py-3 min-h-[56px] touch-manipulation"
              >
                <span className="text-xs text-gray-600 mb-1">Empate</span>
                <span className="font-bold text-lg">{event.odds.draw.toFixed(2)}</span>
              </Button>
            )}

            {/* Away Team Odds */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBetClick(event, BetPrediction.AWAY)}
              className={`flex flex-col items-center py-3 min-h-[56px] touch-manipulation ${!event.odds.draw ? 'col-span-1' : ''}`}
            >
              <span className="text-xs text-gray-600 mb-1">Visitante</span>
              <span className="font-bold text-lg">{event.odds.away.toFixed(2)}</span>
            </Button>
          </div>
        )}

        {/* Finished Event Message */}
        {event.status === EventStatus.FINISHED && (
          <div className="text-center text-sm text-gray-500 py-2">
            Evento finalizado - Apostas não disponíveis
          </div>
        )}
      </div>
    </Card>
  );
};

export default EventCard;