import React, { useEffect, useRef } from 'react';
import Navbar from './Navbar'; // Importa el nuevo componente Navbar

const VendedorDashboard = ({ logout }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.setProperty('--placeholder-color', 'white');
    }
  }, []);

  return (
    <div>
      {/* Usa el componente Navbar y pasa la función de logout */}
      <Navbar onLogout={logout} />
      
      <div className="container mt-5 pt-5">
        {/* Contenido principal del dashboard aquí */}
        <h1>Bienvenido al Dashboard del Vendedor</h1>
        {/* Otros elementos o componentes del dashboard */}
      </div>
    </div>
  );
};

export default VendedorDashboard;
