import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const GerenteDashboard = ({ logout }) => {
  const [estadoDia, setEstadoDia] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerEstado = async () => {
      try {
        const response = await fetch('/api/obtener_estado_ventas/');
        const data = await response.json();
        setEstadoDia(data.estado === "abierto");
      } catch (error) {
        console.error("Error al obtener estado:", error);
      }
    };
    obtenerEstado();
  }, []);

  const abrirDia = async () => {
    try {
      const response = await fetch('/api/cambiar_estado_ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abierto: true }),
      });
      const data = await response.json();
      setEstadoDia(true);
      alert(data.mensaje);
    } catch (error) {
      console.error("Error al abrir el día:", error);
    }
  };

  const cerrarDia = async () => {
    try {
      const response = await fetch('/api/cambiar_estado_ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abierto: false }),
      });
      const data = await response.json();
      setEstadoDia(false);
      alert(data.mensaje);
    } catch (error) {
      console.error("Error al cerrar el día:", error);
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#0F1E25', minHeight: '100vh' }}>
      <Navbar logout={logout} />

      <div
        className="container"
        style={{
          marginLeft: '250px', // Ancho aproximado del Navbar
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          color: 'white',
        }}
      >
        <h1 className="my-5 text-center">Inicio - Dashboard del Gerente</h1>

        <h2 style={{ color: estadoDia ? 'green' : 'red', marginBottom: '20px' }}>
          {estadoDia ? 'Día de Ventas Abierto' : 'Día de Ventas Cerrado'}
        </h2>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <button
            onClick={() => navigate('/inventario')}
            style={buttonStyle}
          >
            Gestionar Inventario
          </button>
          <button
            onClick={() => navigate('/ventasdiarias')}
            style={buttonStyle}
          >
            Ver Ventas Diarias
          </button>
          <button
            onClick={() => navigate('/InformeVentas')}
            style={buttonStyle}
          >
            Informe De Ventas Del Día
          </button>
        </div>

        <div>
          <button
            onClick={abrirDia}
            style={{
              ...toggleButtonStyle,
              backgroundColor: '#5CB85C',
              opacity: estadoDia ? 0.5 : 1,
              pointerEvents: estadoDia ? 'none' : 'auto',
            }}
          >
            Abrir el Día
          </button>
          <button
            onClick={cerrarDia}
            style={{
              ...toggleButtonStyle,
              backgroundColor: '#D9534F',
              opacity: estadoDia ? 1 : 0.5,
              pointerEvents: estadoDia ? 'auto' : 'none',
            }}
          >
            Cerrar el Día
          </button>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  width: '250px',
  padding: '20px',
  backgroundColor: '#1D3642',
  border: 'none',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  textAlign: 'center',
};

const toggleButtonStyle = {
  padding: '15px 30px',
  margin: '10px',
  border: 'none',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
};

export default GerenteDashboard;
