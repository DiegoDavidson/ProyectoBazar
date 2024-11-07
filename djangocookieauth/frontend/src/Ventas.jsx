import React from 'react';
import Navbar from './Navbar';

const Ventas = ({ logout }) => {
  return (
    <div>
      <Navbar onLogout={() => console.log("Logout from Perfil")} />
      {/* Contenido del perfil */}
      <div className="container mt-5 pt-5">
        {/* Contenido principal del dashboard aquí */}
        <h1>Bienvenido al Dashboard de ventas</h1>
        {/* Otros elementos o componentes del dashboard */}
      </div>
    </div>
  );
};

export default Ventas;
