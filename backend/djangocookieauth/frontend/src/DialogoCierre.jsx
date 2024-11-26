import React from 'react';

const DialogoCierre = ({ visible, onConfirmar, onCancelar }) => {
  if (!visible) return null; 

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <h3 style={headerStyle}>¿Estás seguro de que quieres cerrar sesión?</h3>
        <div style={buttonsContainerStyle}>
          <button onClick={onCancelar} style={buttonCancelStyle}>Cancelar</button>
          <button onClick={onConfirmar} style={buttonConfirmStyle}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

// Estilos para el overlay (fondo transparente)
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

// Estilos para el cuadro de diálogo
const dialogStyle = {
  backgroundColor: '#1E2D3A',
  padding: '20px',
  borderRadius: '10px',
  width: '400px',
  textAlign: 'center',
  color: '#FFF',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

// Estilos para el encabezado del diálogo
const headerStyle = {
  marginBottom: '20px',
  fontSize: '20px',
};

// Contenedor de los botones
const buttonsContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '10px',
};

// Estilo para el botón de Cancelar
const buttonCancelStyle = {
  flex: 1,
  padding: '10px',
  backgroundColor: '#D9534F',
  border: 'none',
  borderRadius: '5px',
  color: 'white',
  cursor: 'pointer',
};

// Estilo para el botón de Confirmar
const buttonConfirmStyle = {
  flex: 1,
  padding: '10px',
  backgroundColor: '#5CB85C',
  border: 'none',
  borderRadius: '5px',
  color: 'white',
  cursor: 'pointer',
};

export default DialogoCierre;
