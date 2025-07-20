import React, { useState } from 'react';
import type { SportEvent } from '../../types';
import type { BetFormData } from '../../schemas';
import { useBettingStore } from '../../stores/bettingStore';
import { useToast } from '../../hooks/useToast';
import Modal from '../ui/Modal';
import BetForm from './BetForm';

export interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: SportEvent | null;
}

const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, event }) => {
  const { placeBet, loading, error } = useBettingStore();
  const { showBetSuccess, showBetError, TOAST_MESSAGES } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle bet submission
  const handleBetSubmit = async (betData: BetFormData) => {
    if (!event) {
      showBetError(TOAST_MESSAGES.BET.EVENT_NOT_FOUND);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Place the bet using the store action
      await placeBet(betData);
      
      // Calculate potential win for success message
      const potentialWin = betData.amount * betData.odds;
      
      // Show success message with bet details
      showBetSuccess(betData.amount, potentialWin);
      
      // Close the modal
      onClose();
      
    } catch (error) {
      // Show error message with proper formatting
      showBetError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (isSubmitting) {
      return; // Prevent closing while submitting
    }
    onClose();
  };

  // Don't render if no event is provided
  if (!event) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Fazer Aposta"
      size="lg"
    >
      <div className="space-y-4">
        {/* Display any store-level errors */}
        {error.bets && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-danger-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-danger-800 text-sm font-medium">
                {error.bets}
              </p>
            </div>
          </div>
        )}

        {/* Bet Form */}
        <BetForm
          event={event}
          onSubmit={handleBetSubmit}
          onCancel={handleClose}
          isLoading={isSubmitting || loading.bets}
        />
      </div>
    </Modal>
  );
};

export default BetModal;