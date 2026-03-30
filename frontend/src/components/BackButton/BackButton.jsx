import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ to = '/Administrador' }) => {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate(to)}>
      ← Atrás
    </button>
  );
};

export default BackButton;