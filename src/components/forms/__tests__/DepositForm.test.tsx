import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DepositForm from '../DepositForm';
import { useBettingStore } from '../../../stores/bettingStore';

// Mock the store
vi.mock('../../../stores/bettingStore');

const mockUseBettingStore = useBettingStore as any;

describe('DepositForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseBettingStore.mockReturnValue({
      user: {
        balance: 100,
        totalBets: 0,
        totalWins: 0,
        totalLosses: 0,
      },
    });
  });

  it('should render deposit form with current balance', () => {
    render(
      <DepositForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Saldo Atual')).toBeInTheDocument();
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor do depósito')).toBeInTheDocument();
  });

  it('should render quick amount buttons', () => {
    render(
      <DepositForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('R$ 50,00')).toBeInTheDocument();
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
    expect(screen.getByText('R$ 200,00')).toBeInTheDocument();
    expect(screen.getByText('R$ 500,00')).toBeInTheDocument();
  });

  it('should handle quick amount selection', async () => {
    const user = userEvent.setup();
    
    render(
      <DepositForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const quickButton = screen.getByText('R$ 100,00');
    await user.click(quickButton);

    const input = screen.getByLabelText('Valor do depósito') as HTMLInputElement;
    expect(input.value).toBe('100');
  });

  it('should show new balance preview when amount is entered', async () => {
    const user = userEvent.setup();
    
    render(
      <DepositForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByLabelText('Valor do depósito');
    await user.type(input, '50');

    await waitFor(() => {
      expect(screen.getByText('Novo saldo:')).toBeInTheDocument();
      expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid amount', async () => {
    const user = userEvent.setup();
    
    render(
      <DepositForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByLabelText('Valor do depósito');
    await user.type(input, '5'); // Below minimum

    const submitButton = screen.getByText('Continuar');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Depósito mínimo é R$ 10,00')).toBeInTheDocument();
    });
  });

  it('should show confirmation step before submitting', async () => {
    const user = userEvent.setup();
    
    render(
      <DepositForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByLabelText('Valor do depósito');
    await user.type(input, '100');

    const submitButton = screen.getByText('Continuar');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Confirmar Depósito')).toBeInTheDocument();
      expect(screen.getByText('+ R$ 100,00')).toBeInTheDocument();
    });
  });

  it('should call onSubmit when confirmed', async () => {
    const user = userEvent.setup();
    
    render(
      <DepositForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByLabelText('Valor do depósito');
    await user.type(input, '100');

    const continueButton = screen.getByText('Continuar');
    await user.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText('Confirmar Depósito')).toBeInTheDocument();
    });

    const confirmButton = screen.getByText('Confirmar Depósito');
    await user.click(confirmButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({ amount: 100 });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <DepositForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});