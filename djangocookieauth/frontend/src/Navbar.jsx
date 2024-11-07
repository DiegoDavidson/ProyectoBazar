import React from 'react';
import { useNavigate } from 'react-router-dom';
import monitoImage from './Components/assets/MonitoWhite.png';
import Inicio from './Components/assets/Home.png';
import Perfil from './Components/assets/user_icon.png';
import Ventas from './Components/assets/Shop.png';
import Estadisticas from './Components/assets/Statistics.png';
import CerrarSesion from './Components/assets/Logout.png';

const Navbar = ({ logout }) => {
  const navigate = useNavigate();

  const goToInicio = () => {
    navigate('/vendedor-dashboard'); // Redirige a VendedorDashboard
  };

  const goToPerfil = () => {
    navigate('/perfil');
  };

  const goToVentas = () => {
    navigate('/ventas'); // Redirige a Ventas
  };

  const goToEstadisticas = () => {
    navigate('/estadisticas'); // Redirige a Estadísticas
  };

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            padding: 0,
          }}
        >
          <img
            src={monitoImage}
            alt="Monito"
            style={{
              width: '50px',
              height: 'auto',
            }}
          />
        </button>

        <div
          className="offcanvas offcanvas-start text-bg-dark"
          tabIndex="-1"
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body d-flex flex-column">
            <ul className="navbar-nav pe-3">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="#"
                  onClick={goToInicio}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <img
                    src={Inicio}
                    alt="Inicio"
                    style={{ width: '20px', height: 'auto', marginRight: '10px' }}
                  />
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="#"
                  onClick={goToPerfil}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <img
                    src={Perfil}
                    alt="Perfil"
                    style={{ width: '20px', height: 'auto', marginRight: '10px' }}
                  />
                  Perfil
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="#"
                  onClick={goToVentas}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <img
                    src={Ventas}
                    alt="Ventas"
                    style={{ width: '20px', height: 'auto', marginRight: '10px' }}
                  />
                  Ventas
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="#"
                  onClick={goToEstadisticas}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <img
                    src={Estadisticas}
                    alt="Estadísticas"
                    style={{ width: '20px', height: 'auto', marginRight: '10px' }}
                  />
                  Estadísticas
                </a>
              </li>
            </ul>

            <ul className="navbar-nav mt-auto">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="#"
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <img
                    src={CerrarSesion}
                    alt="Cerrar sesión"
                    style={{ width: '20px', height: 'auto', marginRight: '10px' }}
                  />
                  Cerrar sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
