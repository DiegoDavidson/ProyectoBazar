import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import BazarImage from './Components/assets/Bazar.png';
import LogoutImage from './Components/assets/Logout.png';
import Ventas from './Components/assets/Shop.png';
import InicioIcon from './Components/assets/Home.png';
import InventarioIcon from './Components/assets/Inventory.png';
import GestionarUsuarioIcon from './Components/assets/ManageAccound.png';
import VendedoresIcon from './Components/assets/user_icon.png';

const Navbar = ({ logout }) => {  // Recibe logout como prop
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a la función logout pasada como prop
    navigate('/'); // Redirige al login después de cerrar sesión
  };

  return (
    <>
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

      {/* Menú lateral */}
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
              <button 
                className="nav-link d-flex align-items-center btn btn-link text-decoration-none" 
                onClick={() => navigate('/gerente-dashboard')}
              >
                <img src={InicioIcon} alt="Inicio" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Inicio
              </button>
            </li>

            <li className="nav-item">
              <button 
                className="nav-link d-flex align-items-center btn btn-link text-decoration-none" 
                onClick={() => navigate('/inventario')}
              >
                <img src={InventarioIcon} alt="Inventario" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Inventario
              </button>
            </li>

            <li className="nav-item">
              <button 
                className="nav-link d-flex align-items-center btn btn-link text-decoration-none" 
                onClick={() => navigate('/ventasDiarias')}
              >
                <img src={Ventas} alt="Ventas" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Ventas del día
              </button>
            </li>

            <li className="nav-item">
              <button 
                className="nav-link d-flex align-items-center btn btn-link text-decoration-none" 
                onClick={() => navigate('/gestionUsuario')}
              >
                <img src={GestionarUsuarioIcon} alt="Gestionar Usuarios" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Gestionar Usuarios
              </button>
            </li>

            <li className="nav-item">
              <button 
                className="nav-link d-flex align-items-center btn btn-link text-decoration-none" 
                onClick={handleLogout}  // Llamada a handleLogout
              >
                <img src={LogoutImage} alt="Cerrar Sesión" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Cerrar caja
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
