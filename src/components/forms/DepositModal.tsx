import React, { useState } from 'react';
import Modal from '../ui/Modal';
import DepositForm from './DepositForm';
import { useBettingStore } from '../../stores/bettingStore';
import { useToast } from '../../hooks/useToast';
import type { DepositFormData } from '../../schemas';

export interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { depositBalance, loading, user } = useBettingStore();
  const { showDepositSuccess, showBalanceError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDepositSubmit = async (depositData: DepositFormData) => {
    try {
      setIsSubmitting(true);
      
      // Call the store action to deposit balance
      depositBalance(depositData.amount);
      
      // Calculate new balance for success message
      const newBalance = user.balance + depositData.amount;
      
      // Show success message with deposit details
      showDepositSuccess(depositData.amount, newBalance);
      
      // Close modal after successful deposit
      onClose();
      
    } catch (error) {
      // Show error message with proper formatting
      showBalanceError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fazer Depósito"
      size="md"
    >
      <DepositForm
        onSubmit={handleDepositSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting || loading.balance}
      />
    </Modal>
  );
};

export default DepositModal;