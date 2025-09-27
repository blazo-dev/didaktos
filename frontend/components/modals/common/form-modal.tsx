'use client';

import { useModalStore } from '@/stores/ui-store';
import { Modal } from '../../ui/modal';

interface FormModalProps {
  modalId: string;
  children: (handlers: {
    handleSuccess: () => void;
    handleCancel: () => void;
  }) => React.ReactNode;
}

export function FormModal({ modalId, children }: FormModalProps) {
  const { closeModal } = useModalStore();
  
  const handlers = {
    handleSuccess: () => closeModal(modalId),
    handleCancel: () => closeModal(modalId)
  };

  return (
    <Modal 
      id={modalId}
      onClose={() => closeModal(modalId)}
    >
      {children(handlers)}
    </Modal>
  );
}