import React from 'react';
import './styles.css';

interface ServiceSelectionProps {
  onSelect: (serviceId: string) => void;
  selectedService?: string;
}

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

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  onSelect,
  selectedService
}) => {
  return (
    <div className="service-selection">
      <h3>Escolha o Serviço</h3>
      
      <div className="services-grid">
        {SERVICES.map(service => (
          <div
            key={service.id}
            className={`service-card ${selectedService === service.id ? 'selected' : ''}`}
            onClick={() => onSelect(service.id)}
          >
            <div className="service-header">
              <h4>{service.name}</h4>
              <span className="duration">{service.duration}</span>
            </div>
            
            <p className="description">{service.description}</p>
            
            <div className="service-footer">
              <span className="price">
                R$ {service.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};