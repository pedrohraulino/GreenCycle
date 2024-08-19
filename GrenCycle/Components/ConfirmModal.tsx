import React from 'react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: ReactNode;
}

const ConfirmModal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title = "Confirmação", message = "Você tem certeza?" }) => {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal modal-delete">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
          <button className="submit-button" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
