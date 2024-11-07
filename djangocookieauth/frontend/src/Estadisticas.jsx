import React from 'react';
import Navbar from './Navbar';

const Estadisticas = ({ logout }) => {
  return (
    <div>
      <Navbar logout={logout} />
      {/* Contenido relacionado con las estadísticas */}
      <h1>Estadísticas</h1>
      <p>Contenido relacionado con las estadísticas aquí.</p>
    </div>
  );
};

export default Estadisticas;
