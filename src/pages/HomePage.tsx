import React, { useState } from 'react';
import type { SportEvent, BetPrediction } from '../types';
import EventList from '../components/features/EventList';
import BetModal from '../components/forms/BetModal';

export const HomePage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);

  // Handle bet button click from EventCard
  const handleBetClick = (event: SportEvent, prediction: BetPrediction) => {
    setSelectedEvent(event);
    setIsBetModalOpen(true);
  };

  // Handle bet modal close
  const handleBetModalClose = () => {
    setIsBetModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-3 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-2">
          Apostas Esportivas
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4 sm:px-2">
          Escolha seus eventos favoritos e faça suas apostas. Acompanhe jogos ao vivo e 
          aproveite as melhores odds do mercado.
        </p>
      </div>

      {/* Events List */}
      <div className="w-full">
        <EventList onBetClick={handleBetClick} />
      </div>

      {/* Bet Modal */}
      <BetModal
        isOpen={isBetModalOpen}
        onClose={handleBetModalClose}
        event={selectedEvent}
      />
    </div>
  );
};