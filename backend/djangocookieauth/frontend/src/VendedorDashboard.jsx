import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BazarImage from './Components/assets/Bazar.png';
import LogoutImage from './Components/assets/Logout.png';

const VendedorDashboard = ({ logout }) => {
  const [estadoDia, setEstadoDia] = useState(null);  // Almacenar estado del día
  const navigate = useNavigate();

  // Llama a la API para obtener el estado de ventas al cargar el componente
  useEffect(() => {
    const obtenerEstado = async () => {
      try {
        const response = await fetch('/api/obtener_estado_ventas/');
        const data = await response.json();
        setEstadoDia(data.estado === "abierto");
        console.log("Estado del día al cargar:", data.estado);
      } catch (error) {
        console.error("Error al obtener estado:", error);
      }
    };
    obtenerEstado();
  }, []);

  return (
    <div style={{ backgroundColor: '#0F1E25', minHeight: '100vh', padding: '10px', position: 'relative' }}>
      {/* Imagen para el menú */}
      <img 
        src={BazarImage} 
        alt="Bazar" 
        style={{
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          width: '100px', 
          height: 'auto', 
          margin: '10px',
          cursor: 'pointer'
        }}
        data-bs-toggle="offcanvas" 
        data-bs-target="#offcanvasMenu" 
        aria-controls="offcanvasMenu"
      />

      {/* Menú lateral izquierdo */}
      <div 
        className="offcanvas offcanvas-start text-bg-dark" 
        id="offcanvasMenu" 
        aria-labelledby="offcanvasMenuLabel"
        tabIndex="-1"
      >
        <div className="offcanvas-header d-flex flex-column align-items-center" style={{ paddingTop: '50px' }}>
          <img 
            src={BazarImage} 
            alt="Bazar" 
            style={{ width: '160px', height: '100px', marginBottom: '40px' }} 
            id="offcanvasMenuLabel" 
          />
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a 
                className="nav-link d-flex align-items-center" 
                href="#"
                onClick={logout}  // Ejecuta la función logout al hacer clic
              >
                <img src={LogoutImage} alt="Logout" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Cerrar caja
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Contenedor principal centrado */}
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <h2 
          className="text-center"
          style={{ color: estadoDia ? 'green' : 'red', marginBottom: '20px' }}
        >
          Estado del día: {estadoDia ? 'Abierto' : 'Cerrado'}
        </h2>

        <button
          onClick={() => navigate('/Venta')}
          disabled={!estadoDia}
          style={{
            backgroundColor: estadoDia ? '#007bff' : '#ccc',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            cursor: estadoDia ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            borderRadius: '5px',
          }}
        >
          Iniciar Venta
        </button>
      </div>
    </div>
  );
};

export default VendedorDashboard;
