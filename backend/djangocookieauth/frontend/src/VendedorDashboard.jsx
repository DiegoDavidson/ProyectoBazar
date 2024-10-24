import React from 'react';

const VendedorDashboard = ({ logout }) => {
    return (
        <div>
          <h1>Bienvenido, vendedor</h1>
          <button 
            className="btn btn-danger" 
            onClick={logout}>
            LOG OUT
          </button>
        </div>
      );
    };

export default VendedorDashboard;
