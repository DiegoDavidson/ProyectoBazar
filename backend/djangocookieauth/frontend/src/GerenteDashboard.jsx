import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import EstadoDiaDialog from './EstadoDialogo';

const GerenteDashboard = ({ logout }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [estadoDia, setEstadoDia] = useState(null);
const [inicioDia, setInicioDia] = useState(null);
const [tiempoAbierto, setTiempoAbierto] = useState("");
const navigate = useNavigate();

useEffect(() => {
  const obtenerEstado = async () => {
    try {
      const response = await fetch('/api/obtener_estado_ventas/');
      const data = await response.json();
      setEstadoDia(data.estado === "abierto");
      setInicioDia(data.inicio_dia); // Guardamos la hora de inicio del día
      console.log("Estado del día:", data.estado);
    } catch (error) {
      console.error("Error al obtener estado:", error);
    }
  };
  obtenerEstado();
}, []);

useEffect(() => {
  if (estadoDia && inicioDia) {
    // Solo ejecutamos el temporizador si el día está abierto
    const interval = setInterval(() => {
      const tiempo = calcularTiempoAbierto(inicioDia);
      setTiempoAbierto(tiempo);
    }, 1000);

    return () => clearInterval(interval); // Limpia el temporizador cuando el componente se desmonta o el estado cambia
  }
}, [estadoDia, inicioDia]);

const calcularTiempoAbierto = (inicio) => {
  const inicioDate = new Date(inicio);
  const ahora = new Date();
  const diferencia = Math.floor((ahora - inicioDate) / 1000); // Diferencia en segundos
  const horas = Math.floor(diferencia / 3600);
  const minutos = Math.floor((diferencia % 3600) / 60);
  const segundos = diferencia % 60;

  return `${horas}h ${minutos}m ${segundos}s`;
};

const cambiarEstadoDia = async () => {
  setDialogVisible(true);
};

const handleConfirmarEstado = async () => {
  setDialogVisible(false);

  try {
    const response = await fetch ("/api/cambiar_estado_ventas", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
    });

    if (!response.ok) {
      throw new Error ("Eerror al cambiar el estado del día")
    }

    const data = await response.json();
    if (data && data.estado){
      setEstadoDia(data.estado === "abierto");
      setInicioDia(data.inicio_dia || null);
      alert(data.mensaje);
    }
    
  } catch (error) {
    console.error("Error al cambiar el estado del día:", error);
  }
};

return (
  <div style={{ display: 'flex', backgroundColor: '#0F1E25', minHeight: '100vh' }}>
    <Navbar logout={logout} />

    <div
      className="container"
      style={{
        marginLeft: '250px', // Ajuste para compensar el ancho del Navbar
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centrar horizontalmente
        justifyContent: 'center', // Centrar verticalmente
        height: '100vh', // Asegura que ocupe toda la altura de la pantalla
        color: 'white',
      }}
    >
      <h1 className="my-5 text-center">Inicio - Dashboard del Gerente</h1>

      <h2 style={{ color: estadoDia ? 'green' : 'red', marginBottom: '20px' }}>
        {estadoDia ? 'Día de Ventas Abierto' : 'Día de Ventas Cerrado'}
      </h2>

      {estadoDia && (
        <h3 style={{ color: 'white', marginBottom: '20px' }}>
          Tiempo Abierto: {tiempoAbierto}
        </h3>
      )}

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
          onClick={cambiarEstadoDia}
          style={{
            ...toggleButtonStyle,
            backgroundColor: estadoDia ? '#D9534F' : '#5CB85C',
          }}
        >
          {estadoDia ? 'Cerrar el Día' : 'Abrir el Día'}
        </button>

        <EstadoDiaDialog
          visible={dialogVisible}
          estadoDia={estadoDia}
          onConfirm={handleConfirmarEstado}
          onCancel={() => setDialogVisible(false)}
        />

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
