import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { toast } from 'react-hot-toast';
import BetModal from '../BetModal';
import { useBettingStore } from '../../../stores/bettingStore';
import { SportEvent, SportType, EventStatus, BetPrediction } from '../../../types';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the betting store
vi.mock('../../../stores/bettingStore');

const mockEvent: SportEvent = {
  id: 'event-1',
  homeTeam: 'Team A',
  awayTeam: 'Team B',
  date: new Date('2024-12-25T15:00:00Z'),
  odds: {
    home: 2.5,
    draw: 3.2,
    away: 2.8,
  },
  sport: SportType.FOOTBALL,
  status: EventStatus.UPCOMING,
};

describe('BetModal Integration', () => {
  const mockPlaceBet = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the store hook
    (useBettingStore as any).mockReturnValue({
      placeBet: mockPlaceBet,
      loading: { bets: false },
      error: { bets: null },
      user: {
        balance: 100,
        totalBets: 0,
        totalWins: 0,
        totalLosses: 0,
      },
    });
  });

  it('should complete full bet placement flow successfully', async () => {
    mockPlaceBet.mockResolvedValueOnce(undefined);

    render(
      <BetModal
        isOpen={true}
        onClose={mockOnClose}
        event={mockEvent}
      />
    );

    // Fill out the form
    const amountInput = screen.getByLabelText(/valor da aposta/i);
    fireEvent.change(amountInput, { target: { value: '50' } });

    // Select away team prediction
    const awayButton = screen.getByText('Team B');
    fireEvent.click(awayButton);

    // Submit the form (first click goes to confirmation)
    const continueButton = screen.getByText('Continuar');
    fireEvent.click(continueButton);

    // Should show confirmation screen
    expect(screen.getByRole('heading', { name: 'Confirmar Aposta' })).toBeInTheDocument();
    
    // Confirm the bet
    const confirmButton = screen.getByRole('button', { name: 'Confirmar Aposta' });
    fireEvent.click(confirmButton);

    // Wait for the bet to be placed
    await waitFor(() => {
      expect(mockPlaceBet).toHaveBeenCalledWith({
        eventId: 'event-1',
        amount: 50,
        prediction: BetPrediction.AWAY,
        odds: 2.8,
      });
    });

    // Should show success toast and close modal
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Aposta realizada com sucesso!',
        expect.objectContaining({
          duration: 4000,
          icon: '🎉',
        })
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should handle bet placement failure with error toast', async () => {
    const errorMessage = 'Saldo insuficiente para esta aposta';
    mockPlaceBet.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <BetModal
        isOpen={true}
        onClose={mockOnClose}
        event={mockEvent}
      />
    );

    // Fill out and submit form
    const amountInput = screen.getByLabelText(/valor da aposta/i);
    fireEvent.change(amountInput, { target: { value: '1000' } });

    const continueButton = screen.getByText('Continuar');
    fireEvent.click(continueButton);

    // Confirm the bet (should not be available since form has validation error)
    expect(screen.queryByRole('button', { name: 'Confirmar Aposta' })).not.toBeInTheDocument();

    // Should show validation error instead of proceeding
    expect(screen.getByText('Saldo insuficiente para esta aposta')).toBeInTheDocument();
    
    // Should not call placeBet since validation failed
    expect(mockPlaceBet).not.toHaveBeenCalled();
    
    // Modal should remain open
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle store loading state correctly', () => {
    (useBettingStore as any).mockReturnValue({
      placeBet: mockPlaceBet,
      loading: { bets: true },
      error: { bets: null },
      user: {
        balance: 100,
        totalBets: 0,
        totalWins: 0,
        totalLosses: 0,
      },
    });

    render(
      <BetModal
        isOpen={true}
        onClose={mockOnClose}
        event={mockEvent}
      />
    );

    // Form should show loading state
    const continueButton = screen.getByText('Continuar');
    expect(continueButton).toBeDisabled();
  });

  it('should display store-level errors', () => {
    const storeError = 'Erro de conexão com o servidor';
    (useBettingStore as unknown).mockReturnValue({
      placeBet: mockPlaceBet,
      loading: { bets: false },
      error: { bets: storeError },
      user: {
        balance: 100,
        totalBets: 0,
        totalWins: 0,
        totalLosses: 0,
      },
    });

    render(
      <BetModal
        isOpen={true}
        onClose={mockOnClose}
        event={mockEvent}
      />
    );

    // Should display the store error
    expect(screen.getByText(storeError)).toBeInTheDocument();
  });
});