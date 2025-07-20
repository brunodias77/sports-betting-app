import React, { useState } from 'react';
import EventList from '../components/features/EventList';
import Modal from '../components/ui/Modal';
import { SportEvent, BetPrediction } from '../types';

/**
 * Example component demonstrating the integrated EventList usage
 * This shows how EventList now works with the store automatically
 */
const EventListExample: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<BetPrediction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBetClick = (event: SportEvent, prediction: BetPrediction) => {
    setSelectedEvent(event);
    setSelectedPrediction(prediction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedPrediction(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Eventos Esportivos
        </h1>
        <p className="text-gray-600">
          Esta lista carrega automaticamente os eventos do store e se atualiza em tempo real.
        </p>
      </div>

      {/* EventList now handles all store integration internally */}
      <EventList onBetClick={handleBetClick} />

      {/* Modal for bet confirmation */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Confirmar Aposta"
      >
        {selectedEvent && selectedPrediction && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                {selectedEvent.homeTeam} vs {selectedEvent.awayTeam}
              </h3>
              <p className="text-gray-600 mb-2">
                Esporte: {selectedEvent.sport}
              </p>
              <p className="text-gray-600 mb-2">
                Data: {selectedEvent.date.toLocaleDateString('pt-BR')}
              </p>
              <p className="text-gray-600">
                Predição: {selectedPrediction === 'home' ? 'Casa' : 
                          selectedPrediction === 'away' ? 'Visitante' : 'Empate'}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Here you would integrate with the betting store to place the bet
                  console.log('Placing bet:', { event: selectedEvent, prediction: selectedPrediction });
                  handleCloseModal();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirmar Aposta
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventListExample;