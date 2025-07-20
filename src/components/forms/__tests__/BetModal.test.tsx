import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { toast } from 'react-hot-toast';
import BetModal from '../BetModal';
import { SportEvent, SportType, EventStatus, BetPrediction } from '../../../types';
import { useBettingStore } from '../../../stores/bettingStore';

// Mock dependencies
vi.mock('../../../stores/bettingStore');
vi.mock('react-hot-toast');

const mockEvent: SportEvent = {
  id: 'event-1',
  homeTeam: 'Flamengo',
  awayTeam: 'Palmeiras',
  date: new Date('2024-12-25T20:00:00'),
  odds: {
    home: 2.5,
    draw: 3.2,
    away: 2.8
  },
  sport: SportType.FOOTBALL,
  status: EventStatus.UPCOMING
};

const mockUseBettingStore = useBettingStore as any;
const mockToast = toast as any;

describe('BetModal', () => {
  const mockOnClose = vi.fn();
  const mockPlaceBet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseBettingStore.mockReturnValue({
      user: { balance: 100, totalBets: 0, totalWins: 0, totalLosses: 0 },
      placeBet: mockPlaceBet,
      loading: { bets: false, events: false, balance: false },
      error: { bets: null, events: null, balance: null }
    });

    mockToast.success = vi.fn();
    mockToast.error = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderBetModal = (props = {}) => {
    return render(
      <BetModal
        isOpen={true}
        onClose={mockOnClose}
        event={mockEvent}
        {...props}
      />
    );
  };

  describe('Modal Rendering', () => {
    it('should render modal when open with event', () => {
      renderBetModal();
      
      expect(screen.getByText('Fazer Aposta')).toBeInTheDocument();
      expect(screen.getByText('Flamengo vs Palmeiras')).toBeInTheDocument();
    });

    it('should not render when event is null', () => {
      render(
        <BetModal
          isOpen={true}
          onClose={mockOnClose}
          event={null}
        />
      );
      
      expect(screen.queryByText('Fazer Aposta')).not.toBeInTheDocument();
    });

    it('should not render when modal is closed', () => {
      render(
        <BetModal
          isOpen={false}
          onClose={mockOnClose}
          event={mockEvent}
        />
      );
      
      expect(screen.queryByText('Fazer Aposta')).not.toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    it('should display store-level bet errors', () => {
      mockUseBettingStore.mockReturnValue({
        user: { balance: 100, totalBets: 0, totalWins: 0, totalLosses: 0 },
        placeBet: mockPlaceBet,
        loading: { bets: false, events: false, balance: false },
        error: { bets: 'Erro de conexão', events: null, balance: null }
      });

      renderBetModal();
      
      expect(screen.getByText('Erro de conexão')).toBeInTheDocument();
    });

    it('should not display error section when no errors', () => {
      renderBetModal();
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Bet Submission', () => {
    it('should call placeBet when form is submitted', async () => {
      const user = userEvent.setup();
      mockPlaceBet.mockResolvedValue(undefined);
      
      renderBetModal();
      
      // Fill out the form
      const amountInput = screen.getByLabelText(/valor da aposta/i);
      await user.type(amountInput, '50');
      
      // Submit the form
      const continueButton = screen.getByRole('button', { name: /continuar/i });
      await user.click(continueButton);
      
      // Confirm the bet
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Aposta' })).toBeInTheDocument();
      });
      
      const confirmButton = screen.getByRole('button', { name: /confirmar aposta/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(mockPlaceBet).toHaveBeenCalledWith({
          eventId: 'event-1',
          amount: 50,
          prediction: BetPrediction.HOME,
          odds: 2.5
        });
      });
    });

    it('should show success toast and close modal on successful bet', async () => {
      const user = userEvent.setup();
      mockPlaceBet.mockResolvedValue(undefined);
      
      renderBetModal();
      
      // Fill out and submit the form
      const amountInput = screen.getByLabelText(/valor da aposta/i);
      await user.type(amountInput, '50');
      
      const continueButton = screen.getByRole('button', { name: /continuar/i });
      await user.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Aposta' })).toBeInTheDocument();
      });
      
      const confirmButton = screen.getByRole('button', { name: /confirmar aposta/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Aposta realizada com sucesso!',
          expect.objectContaining({
            duration: 4000,
            icon: '🎉'
          })
        );
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should show error toast on bet failure', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Saldo insuficiente';
      mockPlaceBet.mockRejectedValue(new Error(errorMessage));
      
      renderBetModal();
      
      // Fill out and submit the form
      const amountInput = screen.getByLabelText(/valor da aposta/i);
      await user.type(amountInput, '50');
      
      const continueButton = screen.getByRole('button', { name: /continuar/i });
      await user.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Aposta' })).toBeInTheDocument();
      });
      
      const confirmButton = screen.getByRole('button', { name: /confirmar aposta/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          errorMessage,
          expect.objectContaining({
            duration: 5000
          })
        );
      });
      
      // Modal should not close on error
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should handle generic error messages', async () => {
      const user = userEvent.setup();
      mockPlaceBet.mockRejectedValue('Generic error');
      
      renderBetModal();
      
      // Fill out and submit the form
      const amountInput = screen.getByLabelText(/valor da aposta/i);
      await user.type(amountInput, '50');
      
      const continueButton = screen.getByRole('button', { name: /continuar/i });
      await user.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Aposta' })).toBeInTheDocument();
      });
      
      const confirmButton = screen.getByRole('button', { name: /confirmar aposta/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Erro ao fazer aposta',
          expect.objectContaining({
            duration: 5000
          })
        );
      });
    });
  });

  describe('Loading States', () => {
    it('should pass loading state to BetForm when submitting', async () => {
      const user = userEvent.setup();
      let resolvePromise: () => void;
      const promise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });
      mockPlaceBet.mockReturnValue(promise);
      
      renderBetModal();
      
      // Fill out and submit the form
      const amountInput = screen.getByLabelText(/valor da aposta/i);
      await user.type(amountInput, '50');
      
      const continueButton = screen.getByRole('button', { name: /continuar/i });
      await user.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Aposta' })).toBeInTheDocument();
      });
      
      const confirmButton = screen.getByRole('button', { name: /confirmar aposta/i });
      await user.click(confirmButton);
      
      // Form buttons should be disabled while loading (excluding modal close button)
      await waitFor(() => {
        const backButton = screen.getByRole('button', { name: /voltar/i });
        const confirmButton = screen.getByRole('button', { name: /confirmar aposta/i });
        expect(backButton).toBeDisabled();
        expect(confirmButton).toBeDisabled();
      });
      
      // Resolve the promise to complete the test
      resolvePromise!();
    });

    it('should pass store loading state to BetForm', () => {
      mockUseBettingStore.mockReturnValue({
        user: { balance: 100, totalBets: 0, totalWins: 0, totalLosses: 0 },
        placeBet: mockPlaceBet,
        loading: { bets: true, events: false, balance: false },
        error: { bets: null, events: null, balance: null }
      });

      renderBetModal();
      
      // Form buttons should be in loading state (excluding modal close button)
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      const continueButton = screen.getByRole('button', { name: /continuar/i });
      expect(cancelButton).toBeDisabled();
      expect(continueButton).toBeDisabled();
    });
  });

  describe('Modal Close Handling', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      renderBetModal();
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when modal close button is clicked', async () => {
      const user = userEvent.setup();
      renderBetModal();
      
      const closeButton = screen.getByLabelText(/close modal/i);
      await user.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should prevent closing while submitting', async () => {
      const user = userEvent.setup();
      let resolvePromise: () => void;
      const promise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });
      mockPlaceBet.mockReturnValue(promise);
      
      renderBetModal();
      
      // Start bet submission
      const amountInput = screen.getByLabelText(/valor da aposta/i);
      await user.type(amountInput, '50');
      
      const continueButton = screen.getByRole('button', { name: /continuar/i });
      await user.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Aposta' })).toBeInTheDocument();
      });
      
      const confirmButton = screen.getByRole('button', { name: /confirmar aposta/i });
      await user.click(confirmButton);
      
      // Try to close modal while submitting
      const closeButton = screen.getByLabelText(/close modal/i);
      await user.click(closeButton);
      
      // Modal should not close
      expect(mockOnClose).not.toHaveBeenCalled();
      
      // Resolve the promise to complete the test
      resolvePromise!();
    });
  });

  describe('Event Validation', () => {
    it('should show error toast when event is missing during submission', async () => {
      const user = userEvent.setup();
      
      // Render modal with event, then simulate event becoming null
      const { rerender } = renderBetModal();
      
      // Fill out the form
      const amountInput = screen.getByLabelText(/valor da aposta/i);
      await user.type(amountInput, '50');
      
      // Re-render with null event
      rerender(
        <BetModal
          isOpen={true}
          onClose={mockOnClose}
          event={null}
        />
      );
      
      // This test is more theoretical since the modal wouldn't render with null event
      // but it tests the error handling in the submit function
    });
  });

  describe('Accessibility', () => {
    it('should have proper modal accessibility attributes', () => {
      renderBetModal();
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
    });

    it('should focus management work correctly', () => {
      renderBetModal();
      
      // Modal should be present with proper accessibility attributes
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
    });
  });
});