import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import BalanceDisplay from '../BalanceDisplay';
import { useBettingStore } from '../../../stores/bettingStore';

// Mock the store
vi.mock('../../../stores/bettingStore');

const mockUseBettingStore = useBettingStore as any;

describe('BalanceDisplay', () => {
  const mockOnDepositClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseBettingStore.mockReturnValue({
      user: {
        balance: 250.50,
        totalBets: 5,
        totalWins: 3,
        totalLosses: 2,
      },
      loading: {
        balance: false,
      },
    });
  });

  it('should render balance display with formatted currency', () => {
    render(<BalanceDisplay onDepositClick={mockOnDepositClick} />);

    expect(screen.getByText('Saldo Disponível')).toBeInTheDocument();
    expect(screen.getByText('R$ 250,50')).toBeInTheDocument();
  });

  it('should render deposit button when showDepositButton is true', () => {
    render(
      <BalanceDisplay 
        onDepositClick={mockOnDepositClick} 
        showDepositButton={true}
      />
    );

    expect(screen.getByText('+ Depositar')).toBeInTheDocument();
  });

  it('should not render deposit button when showDepositButton is false', () => {
    render(
      <BalanceDisplay 
        onDepositClick={mockOnDepositClick} 
        showDepositButton={false}
      />
    );

    expect(screen.queryByText('+ Depositar')).not.toBeInTheDocument();
  });

  it('should call onDepositClick when deposit button is clicked', () => {
    render(<BalanceDisplay onDepositClick={mockOnDepositClick} />);

    const depositButton = screen.getByText('+ Depositar');
    fireEvent.click(depositButton);

    expect(mockOnDepositClick).toHaveBeenCalled();
  });

  it('should show loading state when balance is loading', () => {
    mockUseBettingStore.mockReturnValue({
      user: {
        balance: 250.50,
        totalBets: 5,
        totalWins: 3,
        totalLosses: 2,
      },
      loading: {
        balance: true,
      },
    });

    render(<BalanceDisplay onDepositClick={mockOnDepositClick} />);

    expect(screen.getByText('Atualizando...')).toBeInTheDocument();
  });

  it('should show additional stats in large size', () => {
    render(
      <BalanceDisplay 
        onDepositClick={mockOnDepositClick} 
        size="lg"
      />
    );

    expect(screen.getByText('Total de Apostas')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Taxa de Vitória')).toBeInTheDocument();
    expect(screen.getByText('60.0%')).toBeInTheDocument();
  });
});