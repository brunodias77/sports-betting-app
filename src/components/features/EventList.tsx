import React, { useEffect } from 'react';
import type { SportEvent, BetPrediction } from '../../types';
import EventCard from './EventCard';
import AsyncHandler from '../ui/AsyncHandler';
import ErrorFallback from '../ui/ErrorFallback';
import { EventCardSkeleton } from '../ui/skeletons';
import { useEvents } from '../../hooks/useEvents';
import { useToast } from '../../hooks/useToast';

export interface EventListProps {
  onBetClick: (event: SportEvent, prediction: BetPrediction) => void;
}

const EventList: React.FC<EventListProps> = ({ onBetClick }) => {
  const { 
    events, 
    loading, 
    error, 
    retryLoadEvents,
    clearErrors
  } = useEvents();
  
  const { showSuccess, showError, TOAST_MESSAGES } = useToast();

  // Clear errors when component mounts
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Enhanced retry function with toast feedback
  const handleRetryWithFeedback = async () => {
    try {
      await retryLoadEvents();
      if (events && events.length > 0) {
        showSuccess(TOAST_MESSAGES.EVENTS.RETRY_SUCCESS);
      }
    } catch (error) {
      showError(TOAST_MESSAGES.EVENTS.LOAD_ERROR);
    }
  };

  // Empty state component
  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum evento disponível
        </h3>
        <p className="text-gray-600">
          Não há eventos esportivos disponíveis no momento. Volte mais tarde para ver novos jogos.
        </p>
      </div>
    </div>
  );

  // Custom loading component with skeleton
  const loadingComponent = (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="grid gap-4 sm:gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );

  // Custom error component
  const errorComponent = (
    <ErrorFallback
      error={error}
      title="Erro ao carregar eventos"
      onRetry={handleRetryWithFeedback}
      className="py-12"
    />
  );

  return (
    <AsyncHandler
      loading={loading}
      error={error}
      isEmpty={!events || events.length === 0}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
      emptyState={emptyState}
    >
      <EventListContent events={events} onBetClick={onBetClick} />
    </AsyncHandler>
  );
};

// Separate component for the actual event list content
const EventListContent: React.FC<{ events: SportEvent[]; onBetClick: (event: SportEvent, prediction: BetPrediction) => void }> = ({ 
  events, 
  onBetClick 
}) => {
  // Group events by status for better organization
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const liveEvents = events.filter(event => event.status === 'live');
  const finishedEvents = events.filter(event => event.status === 'finished');

  const renderEventSection = (title: string, sectionEvents: SportEvent[], showTitle: boolean = true) => {
    if (sectionEvents.length === 0) return null;

    return (
      <div className="space-y-4">
        {showTitle && (
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            {title}
          </h3>
        )}
        <div className="grid gap-4 sm:gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sectionEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onBetClick={onBetClick}
            />
          ))}
        </div>
      </div>
    );
  };

  // Determine if we should show section headers
  const showSectionHeaders = (liveEvents.length > 0 ? 1 : 0) + 
                            (upcomingEvents.length > 0 ? 1 : 0) + 
                            (finishedEvents.length > 0 ? 1 : 0) > 1;

  return (
    <div className="space-y-8">
      {/* Live Events - Highest priority */}
      {renderEventSection('🔴 Ao Vivo', liveEvents, showSectionHeaders)}
      
      {/* Upcoming Events */}
      {renderEventSection('📅 Próximos Jogos', upcomingEvents, showSectionHeaders)}
      
      {/* Finished Events - Lowest priority */}
      {renderEventSection('✅ Finalizados', finishedEvents, showSectionHeaders)}
    </div>
  );
};

export default EventList;