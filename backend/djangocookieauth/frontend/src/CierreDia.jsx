import React, { useState } from 'react';

const CierreDia = () => {
  const [isClosed, setIsClosed] = useState(false);

  const handleCierre = () => {
    // Simula el cierre del día
    setIsClosed(true);
    alert('El día ha sido cerrado. No se pueden realizar más ventas.');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
      {isClosed ? (
        <p style={{ color: 'red' }}>El día ya está cerrado. No se pueden generar más ventas.</p>
      ) : (
        <button
          onClick={handleCierre}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1D3642',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Cerrar el Día
        </button>
      )}
    </div>
  );
};

export default CierreDia;
