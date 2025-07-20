import React, { useState, useEffect } from 'react';
import type { DepositSchema, DepositFormData } from '../../schemas';
import { useBettingStore } from '../../stores/bettingStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import FormLoadingOverlay from '../ui/FormLoadingOverlay';

export interface DepositFormProps {
  onSubmit: (depositData: DepositFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const DepositForm: React.FC<DepositFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const { user } = useBettingStore();
  
  // Form state
  const [formData, setFormData] = useState<DepositFormData>({
    amount: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newBalance, setNewBalance] = useState(0);

  // Calculate new balance in real-time
  useEffect(() => {
    if (formData.amount > 0) {
      setNewBalance(user.balance + formData.amount);
    } else {
      setNewBalance(user.balance);
    }
  }, [formData.amount, user.balance]);

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
      DepositSchema.parse(formData);
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

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  // Quick amount buttons
  const quickAmounts = [50, 100, 200, 500];

  const handleQuickAmount = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      amount
    }));
    
    // Clear errors
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  if (showConfirmation) {
    return (
      <FormLoadingOverlay isLoading={isLoading} message="Processando depósito...">
        <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Confirmar Depósito
          </h3>
        </div>

        {/* Current Balance */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-gray-900">Saldo Atual</h4>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(user.balance)}
          </p>
        </div>

        {/* Deposit Details */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Valor do depósito:</span>
            <span className="font-medium text-success-600">
              + {formatCurrency(formData.amount)}
            </span>
          </div>
          
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600">Novo saldo:</span>
            <span className="font-bold text-xl text-success-600">
              {formatCurrency(newBalance)}
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
            Confirmar Depósito
          </Button>
        </div>
        </div>
      </FormLoadingOverlay>
    );
  }

  return (
    <FormLoadingOverlay isLoading={isLoading} message="Processando depósito...">
      <form onSubmit={handleSubmit} className="space-y-6">
      {/* Current Balance Display */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-gray-900">Saldo Atual</h4>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(user.balance)}
        </p>
      </div>

      {/* Quick Amount Buttons */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Valores rápidos
        </label>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-2">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleQuickAmount(amount)}
              className={`p-4 sm:p-3 rounded-lg border-2 transition-colors duration-200 text-center min-h-[56px] touch-manipulation ${
                formData.amount === amount
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 active:bg-gray-50'
              }`}
            >
              <span className="font-medium">{formatCurrency(amount)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Input
          label="Valor do depósito"
          type="number"
          value={formData.amount || ''}
          onChange={(e) => handleAmountChange(e.target.value)}
          error={errors.amount}
          placeholder="0,00"
          min="10"
          max="5000"
          step="0.01"
          required
          helperText="Depósito mínimo: R$ 10,00 | Máximo: R$ 5.000,00"
        />
      </div>

      {/* New Balance Preview */}
      {formData.amount > 0 && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-success-800 font-medium">Novo saldo:</span>
            <span className="text-success-900 font-bold text-xl">
              {formatCurrency(newBalance)}
            </span>
          </div>
          <p className="text-xs text-success-700 mt-1">
            Aumento de {formatCurrency(formData.amount)} no seu saldo
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

export default DepositForm;