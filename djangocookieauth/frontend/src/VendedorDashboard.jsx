import React from 'react';

const buttonStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1000
};

const VendedorDashboard = ({ logout }) => {
    return (
      <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
        <div class="navbar bg-body-tertiary">
          <div class="container-fluid">
            <a class='navbar-brand'>Los monitos de la Nona</a>
            <form class='d-flex' role='search'>
              <input class='form-control me-2' type='search' placeholder='Ingresar artículo' aria-label='Search'></input>
              <button class='btn btn-outline-success' type='submit'>Buscar</button>
            </form>
          </div>
        </div>

        <button type="button" style={buttonStyle} className="btn btn-success btn-lg">
          Pagar
        </button>

        <div>
          <button 
            className="btn btn-danger" 
            onClick={logout}>
            LOG OUT
          </button>
        </div>
        </div>
      );
    };

export default VendedorDashboard;
