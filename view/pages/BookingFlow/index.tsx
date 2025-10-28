import React from 'react';
import { StepIndicator } from '../../components/StepIndicator';
import { Button } from '../../components/Button';
import { PetRegistration, PetRegistrationData } from '../../components/PetRegistration';
import { ServiceSelection } from '../../components/ServiceSelection';
import { DateSelection } from '../../components/DateSelection';
import { Confirmation } from '../../components/Confirmation';
import './styles.css';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

const SERVICES: Service[] = [
  {
    id: 'basic-grooming',
    name: 'Banho Básico',
    description: 'Banho com shampoo premium, secagem e escovação',
    price: 60,
    duration: '1h'
  },
  {
    id: 'premium-grooming',
    name: 'Banho Premium',
    description: 'Banho premium com hidratação, tosa higiênica e perfume',
    price: 90,
    duration: '1h30'
  },
  {
    id: 'full-grooming',
    name: 'Banho e Tosa Completa',
    description: 'Banho premium, tosa completa, hidratação e acabamento',
    price: 120,
    duration: '2h'
  }
];

interface BookingFlowProps {
  onClose: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [petData, setPetData] = React.useState<PetRegistrationData | null>(null);
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);
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

  return (
    <div className="booking-flow">
      <div className="booking-flow-header">
        <StepIndicator 
          currentStep={currentStep}
          totalSteps={steps.length}
          labels={steps}
        />
      </div>

      <div className="booking-flow-content">
        {currentStep === 1 && (
          <div className="step-content">
            <PetRegistration
              onSubmit={(data) => {
                setPetData(data);
                handleNext();
              }}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <ServiceSelection
              onSelect={(serviceId) => {
                setSelectedService(SERVICES.find(s => s.id === serviceId));
                handleNext();
              }}
              selectedService={selectedService?.id}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content">
            <DateSelection
              onSelect={(date, time) => {
                setSelectedDate(date);
                setSelectedTime(time);
                handleNext();
              }}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="step-content">
            <Confirmation
              petName={petData?.name || ''}
              serviceName={selectedService?.name || ''}
              date={selectedDate!}
              time={selectedTime!}
              price={selectedService?.price || 0}
            />
          </div>
        )}
      </div>

      <div className="booking-flow-footer">
        {currentStep > 1 && (
          <Button variant="secondary" onClick={handleBack}>
            Voltar
          </Button>
        )}
        
        <Button 
          variant="primary" 
          onClick={currentStep === steps.length ? onClose : handleNext}
        >
          {currentStep === steps.length ? 'Finalizar' : 'Próximo'}
        </Button>
      </div>
    </div>
  );
};