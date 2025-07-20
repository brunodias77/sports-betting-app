import React, { useState, useEffect } from 'react';
import type { BetSchema, BetFormData } from '../../schemas';
import type { SportEvent, BetPrediction } from '../../types';
import { useBettingStore } from '../../stores/bettingStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import FormLoadingOverlay from '../ui/FormLoadingOverlay';

export interface BetFormProps {
  event: SportEvent;
  onSubmit: (betData: BetFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const BetForm: React.FC<BetFormProps> = ({ 
  event, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const { user } = useBettingStore();
  
  // Form state
  const [formData, setFormData] = useState<BetFormData>({
    eventId: event.id,
    amount: 0,
    prediction: BetPrediction.HOME,
    odds: event.odds.home
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [potentialWin, setPotentialWin] = useState(0);

  // Calculate potential winnings in real-time
  useEffect(() => {
    if (formData.amount > 0 && formData.odds > 0) {
      setPotentialWin(formData.amount * formData.odds);
    } else {
      setPotentialWin(0);
    }
  }, [formData.amount, formData.odds]);

  // Handle prediction selection
  const handlePredictionChange = (prediction: BetPrediction) => {
    let odds: number;
    
    switch (prediction) {
      case BetPrediction.HOME:
        odds = event.odds.home;
        break;
      case BetPrediction.DRAW:
        odds = event.odds.draw || 0;
        break;
      case BetPrediction.AWAY:
        odds = event.odds.away;
        break;
      default:
        odds = event.odds.home;
    }

    setFormData(prev => ({
      ...prev,
      prediction,
      odds
    }));
    
    // Clear prediction-related errors
    if (errors.prediction) {
      setErrors(prev => ({ ...prev, prediction: '' }));
    }
  };

  // Handle amount input change
  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      amount: numericValue
    }));
    
    // Clear amount-related errors
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    try {
      BetSchema.parse(formData);
      
      // Additional validation for balance
      if (formData.amount > user.balance) {
        setErrors({ amount: 'Saldo insuficiente para esta aposta' });
        return false;
      }
      
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0];
          newErrors[field] = err.message;
        });
      }
      
      setErrors(newErrors);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in the parent component
      setShowConfirmation(false);
    }
  };

  // Handle back to form from confirmation
  const handleBackToForm = () => {
    setShowConfirmation(false);
  };

  // Get prediction label
  const getPredictionLabel = (prediction: BetPrediction): string => {
    switch (prediction) {
      case BetPrediction.HOME:
        return event.homeTeam;
      case BetPrediction.DRAW:
        return 'Empate';
      case BetPrediction.AWAY:
        return event.awayTeam;
      default:
        return '';
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (showConfirmation) {
    return (
      <FormLoadingOverlay isLoading={isLoading} message="Processando aposta...">
        <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Confirmar Aposta
          </h3>
        </div>

        {/* Event Information */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-gray-900">Evento</h4>
          <p className="text-sm text-gray-600">
            {event.homeTeam} vs {event.awayTeam}
          </p>
          <p className="text-xs text-gray-500">
            {formatDate(event.date)}
          </p>
        </div>

        {/* Bet Details */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Predição:</span>
            <span className="font-medium">{getPredictionLabel(formData.prediction)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Odd:</span>
            <span className="font-medium">{formData.odds.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Valor da aposta:</span>
            <span className="font-medium">{formatCurrency(formData.amount)}</span>
          </div>
          
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600">Ganho potencial:</span>
            <span className="font-semibold text-success-600">
              {formatCurrency(potentialWin)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Saldo após aposta:</span>
            <span className="font-medium">
              {formatCurrency(user.balance - formData.amount)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleBackToForm}
            disabled={isLoading}
            className="flex-1 order-2 sm:order-1"
          >
            Voltar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
            className="flex-1 order-1 sm:order-2"
          >
            Confirmar Aposta
          </Button>
        </div>
        </div>
      </FormLoadingOverlay>
    );
  }

  return (
    <FormLoadingOverlay isLoading={isLoading} message="Processando aposta...">
      <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Information */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-gray-900">Evento</h4>
        <p className="text-sm text-gray-600">
          {event.homeTeam} vs {event.awayTeam}
        </p>
        <p className="text-xs text-gray-500">
          {formatDate(event.date)}
        </p>
      </div>

      {/* Prediction Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Escolha sua predição *
        </label>
        
        <div className="grid grid-cols-1 gap-3 sm:gap-2">
          {/* Home Team */}
          <button
            type="button"
            onClick={() => handlePredictionChange(BetPrediction.HOME)}
            className={`p-4 sm:p-3 rounded-lg border-2 transition-colors duration-200 text-left min-h-[56px] touch-manipulation ${
              formData.prediction === BetPrediction.HOME
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{event.homeTeam}</span>
              <span className="text-sm font-semibold text-primary-600">
                {event.odds.home.toFixed(2)}
              </span>
            </div>
          </button>

          {/* Draw (if available) */}
          {event.odds.draw && (
            <button
              type="button"
              onClick={() => handlePredictionChange(BetPrediction.DRAW)}
              className={`p-4 sm:p-3 rounded-lg border-2 transition-colors duration-200 text-left min-h-[56px] touch-manipulation ${
                formData.prediction === BetPrediction.DRAW
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Empate</span>
                <span className="text-sm font-semibold text-primary-600">
                  {event.odds.draw.toFixed(2)}
                </span>
              </div>
            </button>
          )}

          {/* Away Team */}
          <button
            type="button"
            onClick={() => handlePredictionChange(BetPrediction.AWAY)}
            className={`p-4 sm:p-3 rounded-lg border-2 transition-colors duration-200 text-left min-h-[56px] touch-manipulation ${
              formData.prediction === BetPrediction.AWAY
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{event.awayTeam}</span>
              <span className="text-sm font-semibold text-primary-600">
                {event.odds.away.toFixed(2)}
              </span>
            </div>
          </button>
        </div>
        
        {errors.prediction && (
          <p className="text-sm text-danger-600" role="alert">
            {errors.prediction}
          </p>
        )}
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Input
          label="Valor da aposta"
          type="number"
          value={formData.amount || ''}
          onChange={(e) => handleAmountChange(e.target.value)}
          error={errors.amount}
          placeholder="0,00"
          min="1"
          max="1000"
          step="0.01"
          required
          helperText={`Saldo disponível: ${formatCurrency(user.balance)}`}
        />
      </div>

      {/* Potential Win Display */}
      {potentialWin > 0 && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-success-800 font-medium">Ganho potencial:</span>
            <span className="text-success-900 font-bold text-lg">
              {formatCurrency(potentialWin)}
            </span>
          </div>
          <p className="text-xs text-success-700 mt-1">
            Retorno total: {formatCurrency(potentialWin)} (incluindo sua aposta)
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 order-2 sm:order-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || formData.amount <= 0}
          className="flex-1 order-1 sm:order-2"
        >
          Continuar
        </Button>
      </div>
      </form>
    </FormLoadingOverlay>
  );
};

export default BetForm;