import React from 'react';
import './styles.css';

interface PetRegistrationProps {
  onSubmit: (data: PetRegistrationData) => void;
}

export interface PetRegistrationData {
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  weight: number;
  observations?: string;
}

export const PetRegistration: React.FC<PetRegistrationProps> = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState<PetRegistrationData>({
    name: '',
    species: 'dog',
    breed: '',
    age: 0,
    weight: 0,
    observations: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="pet-registration" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nome do Pet</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="species">Espécie</label>
        <select
          id="species"
          name="species"
          value={formData.species}
          onChange={handleChange}
          required
        >
          <option value="dog">Cachorro</option>
          <option value="cat">Gato</option>
          <option value="other">Outro</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="breed">Raça</label>
        <input
          type="text"
          id="breed"
          name="breed"
          value={formData.breed}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age">Idade (anos)</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Peso (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="observations">Observações</label>
        <textarea
          id="observations"
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          rows={3}
        />
      </div>
    </form>
  );
};