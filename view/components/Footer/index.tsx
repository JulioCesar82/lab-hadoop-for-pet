import React from 'react';
import './styles.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Contato</h4>
          <p>Email: contato@petbooking.com</p>
          <p>Tel: (11) 9999-9999</p>
        </div>
        <div className="footer-section">
          <h4>Links Úteis</h4>
          <ul>
            <li><a href="/sobre">Sobre Nós</a></li>
            <li><a href="/termos">Termos de Uso</a></li>
            <li><a href="/privacidade">Política de Privacidade</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2023 Pet Booking. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};