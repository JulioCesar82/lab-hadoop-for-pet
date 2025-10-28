import React from 'react';
import './styles.css';

interface ConfirmationProps {
  petName: string;
  serviceName: string;
  date: Date;
  time: string;
  price: number;
}

export const Confirmation: React.FC<ConfirmationProps> = ({
  petName,
  serviceName,
  date,
  time,
  price
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="confirmation">
      <h3>Confirmação do Agendamento</h3>
      
      <div className="confirmation-details">
        <div className="detail-group">
          <label>Pet</label>
          <p>{petName}</p>
        </div>

        <div className="detail-group">
          <label>Serviço</label>
          <p>{serviceName}</p>
        </div>

        <div className="detail-group">
          <label>Data</label>
          <p>{formatDate(date)}</p>
        </div>

        <div className="detail-group">
          <label>Horário</label>
          <p>{time}</p>
        </div>

        <div className="detail-group">
          <label>Valor</label>
          <p className="price">R$ {price.toFixed(2)}</p>
        </div>
      </div>

      <div className="confirmation-note">
        <p>
          Ao confirmar o agendamento, você concorda com nossos termos de serviço
          e política de cancelamento.
        </p>
      </div>
    </div>
  );
};