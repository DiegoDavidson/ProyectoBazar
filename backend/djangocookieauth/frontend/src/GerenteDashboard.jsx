import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const GerenteDashboard = ({ logout }) => {
  const [estadoDia, setEstadoDia] = useState(null);
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

  const handleToggleEstado = async () => {
    try {
      const response = await fetch('/api/cambiar_estado_ventas/', { method: 'POST' });
      const data = await response.json();
      setEstadoDia(data.estado === "abierto");
      console.log("Estado del día después de cambiar:", data.estado);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  // Función para abrir el día
  const abrirDia = async () => {
    const response = await fetch('/api/cambiar_estado_ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ abierto: true })
    });
    const data = await response.json();
    setEstadoDia(true);
    alert(data.mensaje);
    console.log("Estado del día después de abrir:", true); // Debug: Estado después de abrir
  };

  // Función para cerrar el día
  const cerrarDia = async () => {
    const response = await fetch('/api/cambiar_estado_ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ abierto: false })
    });
    const data = await response.json();
    setEstadoDia(false);
    alert(data.mensaje);
    console.log("Estado del día después de cerrar:", false); // Debug: Estado después de cerrar
  };

  return (
    <div style={{ backgroundColor: '#0F1E25', minHeight: '100vh', padding: '10px', position: 'relative' }}>
      <Navbar />

      <div className="container" style={{ color: 'white', maxWidth: '70%', margin: 'auto', padding: '20px' }}>
        <h1 className="my-5 text-center">Inicio - Dashboard del Gerente</h1>

        {/* Estado del día con color condicional */}
        <h2 
          className="text-center"
          style={{ color: estadoDia ? 'green' : 'red', marginBottom: '20px' }}
        >
          {estadoDia ? 'Día de Ventas Abierto' : 'Día de Ventas Cerrado'}
        </h2>

        {/* Resumen de opciones principales */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <button
            onClick={() => navigate('/inventario')}
            style={{
              width: '30%',
              padding: '20px',
              backgroundColor: '#1D3642',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Gestionar Inventario
          </button>
          <button
            onClick={() => navigate('/ventasdiarias')}
            style={{
              width: '30%',
              padding: '20px',
              backgroundColor: '#1D3642',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Ver Ventas Diarias
          </button>
          <button
            onClick={() => navigate('/InformeVentas')}
            style={{
              width: '30%',
              padding: '20px',
              backgroundColor: '#1D3642',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Informe De Ventas Del Dia
          </button>
        </div>

        {/* Botones para abrir y cerrar el día */}
        <div style={{ textAlign: 'left', marginTop: '40px' }}>
          <button
            onClick={abrirDia}
            style={{
              padding: '15px 30px',
              backgroundColor: '#5CB85C',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '10px',
              opacity: estadoDia ? 0.5 : 1,  // Deshabilitar si el día ya está abierto
              pointerEvents: estadoDia ? 'none' : 'auto' // Evitar clics si el día ya está abierto
            }}
          >
            Abrir el Día
          </button>
          <button
            onClick={cerrarDia}
            style={{
              padding: '15px 30px',
              backgroundColor: '#D9534F',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: estadoDia ? 1 : 0.5, // Deshabilitar si el día ya está cerrado
              pointerEvents: estadoDia ? 'auto' : 'none' // Evitar clics si el día ya está cerrado
            }}
          >
            Cerrar el Día
          </button>
        </div>
      </div>
    </div>
  );
};

export default GerenteDashboard;
