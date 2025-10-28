import React from 'react';
import './styles.css';

// Temporary components until we create the real ones
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number; labels: string[] }> = ({ 
  currentStep, labels 
}) => (
  <div className="step-indicator">
    {labels.map((label, index) => (
      <div key={index} className={`step ${index + 1 <= currentStep ? 'active' : ''}`}>
        <span>{label}</span>
      </div>
    ))}
  </div>
);

interface PetRegistrationData {
  name: string;
  breed: string;
  age: number;
}

const PetRegistration: React.FC<{ onSubmit: (data: PetRegistrationData) => void }> = ({ onSubmit }) => (
  <div>
    <h2>Cadastro do Pet</h2>
    <button onClick={() => onSubmit({ name: 'Max', breed: 'Golden', age: 3 })}>
      Próximo
    </button>
  </div>
);

const ServiceSelection: React.FC<{ onSelect: (service: any) => void; selectedService: any }> = ({ onSelect }) => (
  <div>
    <h2>Selecione o Serviço</h2>
    <button onClick={() => onSelect({ id: 1, name: 'Banho e Tosa', price: 80 })}>
      Banho e Tosa - R$ 80,00
    </button>
  </div>
);

const DateSelection: React.FC<{ 
  onSelect: (date: Date, time: string) => void; 
  selectedDate: Date | null;
  selectedTime: string | null;
}> = ({ onSelect }) => (
  <div>
    <h2>Selecione a Data e Horário</h2>
    <button onClick={() => onSelect(new Date(), '14:00')}>
      Hoje às 14h
    </button>
  </div>
);

const Confirmation: React.FC<{
  petName: string;
  serviceName: string;
  date: Date;
  time: string;
  price: number;
}> = ({ petName, serviceName, date, time, price }) => (
  <div>
    <h2>Confirmação</h2>
    <p>Pet: {petName}</p>
    <p>Serviço: {serviceName}</p>
    <p>Data: {date.toLocaleDateString()}</p>
    <p>Horário: {time}</p>
    <p>Valor: R$ {price.toFixed(2)}</p>
  </div>
);

interface BookingFlowProps {
  onClose: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [petData, setPetData] = React.useState<PetRegistrationData | null>(null);
  const [selectedService, setSelectedService] = React.useState<any>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  
  const steps = ['Cadastro', 'Serviço', 'Data', 'Confirmação'];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Aqui você pode adicionar a lógica para salvar o agendamento
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-flow-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="booking-flow-header">
          <StepIndicator 
            currentStep={currentStep}
            totalSteps={steps.length}
            labels={steps}
          />
        </div>

        <div className="booking-flow-content">
          {currentStep === 1 && (
            <PetRegistration
              onSubmit={(data) => {
                setPetData(data);
                handleNext();
              }}
            />
          )}

          {currentStep === 2 && (
            <ServiceSelection
              onSelect={(serviceId) => {
                setSelectedService(serviceId);
                handleNext();
              }}
              selectedService={selectedService}
            />
          )}

          {currentStep === 3 && (
            <DateSelection
              onSelect={(date, time) => {
                setSelectedDate(date);
                setSelectedTime(time);
                handleNext();
              }}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          )}

          {currentStep === 4 && (
            <Confirmation
              petName={petData?.name || ''}
              serviceName={selectedService?.name || ''}
              date={selectedDate!}
              time={selectedTime!}
              price={selectedService?.price || 0}
            />
          )}
        </div>

        <div className="booking-flow-footer">
          {currentStep > 1 && (
            <button 
              className="secondary-button"
              onClick={handleBack}
            >
              Voltar
            </button>
          )}
          
          <button 
            className="primary-button"
            onClick={currentStep === steps.length ? handleComplete : handleNext}
          >
            {currentStep === steps.length ? 'Confirmar Agendamento' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
};