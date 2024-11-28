import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import BazarImage from './Components/assets/Bazar.png';
import LogoutImage from './Components/assets/Logout.png';
import Ventas from './Components/assets/Shop.png';
import InicioIcon from './Components/assets/Home.png';
import InventarioIcon from './Components/assets/Inventory.png';
import GestionarUsuarioIcon from './Components/assets/ManageAccound.png';
import DialogoCierre from './DialogoCierre'; // Importamos el nuevo componente

const Navbar = ({ logout }) => {
  const navigate = useNavigate();
  const [dialogVisible, setDialogVisible] = useState(false); 

  const handleCerrarSesion = () => {
    setDialogVisible(true); 
  };


  const handleConfirmarCerrarSesion = async () => {
    setDialogVisible(false); 
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };


  const handleCancelarCerrarSesion = () => {
    setDialogVisible(false); 
  };

  return (
    <div 
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#13242C',
        position: 'fixed',
        top: 0,
        left: 0,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
      }}
    >
      {/* Logo */}
      <img 
        src={BazarImage} 
        alt="Bazar" 
        style={{ width: '160px', height: '100px', marginBottom: '40px' }} 
      />

      {/* Menú */}
      <ul style={{ listStyleType: 'none', padding: 0, width: '100%' }}>
        <li style={{ marginBottom: '20px' }}>
          <button 
            className="btn btn-link text-decoration-none text-white w-100 text-start"
            onClick={() => navigate('/gerente-dashboard')}
          >
            <img src={InicioIcon} alt="Inicio" style={{ width: '20px', marginRight: '10px' }} />
            Inicio
          </button>
        </li>
        <li style={{ marginBottom: '20px' }}>
          <button 
            className="btn btn-link text-decoration-none text-white w-100 text-start"
            onClick={() => navigate('/inventario')}
          >
            <img src={InventarioIcon} alt="Inventario" style={{ width: '20px', marginRight: '10px' }} />
            Inventario
          </button>
        </li>
        <li style={{ marginBottom: '20px' }}>
          <button 
            className="btn btn-link text-decoration-none text-white w-100 text-start"
            onClick={() => navigate('/ventasDiarias')}
          >
            <img src={Ventas} alt="Ventas" style={{ width: '20px', marginRight: '10px' }} />
            Ventas del día
          </button>
        </li>
        <li>
          <button 
            className="btn btn-link text-decoration-none text-white w-100 text-start"
            onClick={handleCerrarSesion} // Mostramos el diálogo de confirmación
          >
            <img src={LogoutImage} alt="Cerrar Sesión" style={{ width: '20px', marginRight: '10px' }} />
            Cerrar caja
          </button>
        </li>
      </ul>


      <DialogoCierre
        visible={dialogVisible}
        onConfirmar={handleConfirmarCerrarSesion}
        onCancelar={handleCancelarCerrarSesion}
      />
    </div>
  );
};

export default Navbar;
