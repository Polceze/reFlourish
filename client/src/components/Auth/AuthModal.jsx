import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthModal = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState('login');

  if (!isOpen) return null;

  const handleSwitchToRegister = () => setCurrentView('register');
  const handleSwitchToLogin = () => setCurrentView('login');

  return (
    <div className="modal-overlay auth-overlay" onClick={onClose}>
      <div className="modal-content auth-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-button" onClick={onClose}>
          ×
        </button>
        
        {currentView === 'login' ? (
          <Login 
            onSwitchToRegister={handleSwitchToRegister}
            onClose={onClose}
          />
        ) : (
          <Register 
            onSwitchToLogin={handleSwitchToLogin}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;