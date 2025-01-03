import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import './App.css'; 
import Navbar from './Navbar';
import DialogoEliminarProducto from './DialogoEliminarProducto';
import { Spinner } from 'react-bootstrap'
import InventarioIcon from "./Components/assets/Inventory.png";

const CustomPagination = ({ rowsPerPage, rowCount, onChangePage, currentPage }) => {
  const totalPages = Math.ceil(rowCount / rowsPerPage);

  const handleBack = () => {
    if (currentPage > 1) onChangePage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onChangePage(currentPage + 1);
  };



  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1D3642',
        padding: '10px',
        borderRadius: '5px',
      }}
    >
      <button
        style={{
          backgroundColor: 'transparent',
          color: '#FFFFFF',
          fontSize: '18px',
          margin: '0 10px',
          cursor: 'pointer',
          border: 'none',
        }}
        onClick={handleBack}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      <span style={{ color: '#FFFFFF', fontSize: '14px', margin: '0 10px' }}>
        {currentPage} de {totalPages}
      </span>
      <button
        style={{
          backgroundColor: 'transparent',
          color: '#FFFFFF',
          fontSize: '18px',
          margin: '0 10px',
          cursor: 'pointer',
          border: 'none',
        }}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

const Inventario = ({ logout }) => {
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: '',
    codigo: '',
    cantidad: '',
    valor_unitario: '',
    categoria: '',
  });
  const [message, setMessage] = useState('');
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [loading, setLoading] = useState(true);


  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === `${name}=`) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleEliminarClick = (id) => {
    setSelectedProductId(id);
    setIsDialogVisible(true);
  };

  const eliminarProducto = () => {
    fetch(`/api/eliminar-producto/${selectedProductId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
    })
      .then((res) => {
        if (res.ok) {
          setMessage("Producto eliminado exitosamente");
          setProductos((prevProductos) => prevProductos.filter((prod) => prod.id !== selectedProductId));
          setFilteredProductos((prevFiltered) => prevFiltered.filter((prod) => prod.id !== selectedProductId));
        } else {
          res.json().then((data) => {
            setMessage(data.error || "Error al eliminar el producto");
          });
        }
      })
      .catch((err) => {
        console.error("Error al eliminar producto:", err);
        setMessage("Error al eliminar el producto");
      })
      .finally(() => {
        setIsDialogVisible(false);
        setSelectedProductId(null);
      });
  };

  const cancelarEliminarProducto = () => {
    setIsDialogVisible(false);
    setSelectedProductId(null);
  };

  const fetchProductos = () => {
    setLoading(true);
    fetch('/api/listar-productos/')
      .then((res) => res.json())
      .then((data) => {
        const productosFormateados = data.map((prod) => ({
          id: prod.id,
          nombre: prod.nombre,
          categoria: prod.categoria || 'Sin Categoría',
          fecha: new Date(prod.fecha_registro).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
          codigo: prod.codigo,
          cantidad: prod.cantidad,
          valorUnitario: prod.valor_unitario,
        }));
        setProductos(productosFormateados);
        setFilteredProductos(productosFormateados);
      })
      .catch((err) => console.error('Error al obtener productos:', err))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredRecords = productos.filter((prod) =>
      prod.nombre.toLowerCase().includes(searchValue) ||
      prod.categoria.toLowerCase().includes(searchValue) ||
      prod.codigo.toString().includes(searchValue)
    );
    setFilteredProductos(filteredRecords);
  };

  const columns = [
    { name: 'Nombre', selector: (row) => row.nombre },
    { name: 'Categoría', selector: (row) => row.categoria },
    { name: 'Fecha de Registro', selector: (row) => row.fecha },
    { name: 'Código', selector: (row) => row.codigo },
    { name: 'Cantidad', selector: (row) => row.cantidad, sortable: true },
    { name: 'Valor Unitario', selector: (row) => row.valorUnitario },
    {
      name: 'Acciones',
      cell: (row) => (
        <div>
          <button 
            className="btn btn-danger btn-sm" 
            onClick={() => handleEliminarClick(row.id)} // Cambiado aquí
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];
  

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#1D3642',
        color: '#FFFFFF',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        backgroundColor: '#13242C',
        color: '#FFFFFF',
        fontWeight: 'normal',
        fontSize: '14px',
        borderWidth: 0,
      },
    },
    rows: {
      style: {
        borderColor: '#13242C',
        borderWidth: 0,
      },
    },
    pagination: {
      style: {
        backgroundColor: '#1D3642',
        color: '#FFFFFF',
        fontSize: '14px',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  };

  return (
    <div className="d-flex">
    <div
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#13242C',
        position: 'fixed',
        top: '0',
        left: '0',
        padding: '20px',
        color: 'white',
      }}
    >
      <Navbar logout={logout} />
    </div>
    <div
      style={{
        marginLeft: '250px',
        width: 'calc(100% - 250px)',
        padding: '20px',
        backgroundColor: '#0F1E25',
        minHeight: '100vh',
      }}
    >
      <div className="container-fluid">
        <h2 className="mb-4 mt-5 text-light">Productos en Inventario</h2>
        <div className="row align-items-center mb-3">
          <div className="col-md-6 mb-3 mb-md-0">
            <input
              type="text"
              placeholder="Buscar artículo"
              className="form-control"
              onChange={handleSearch}
            />
          </div>
          <div className="col-md-6 text-md-end">
            <button className="btn btn-primary" onClick={() => navigate('/addProducto')}>
              Ingresar Nuevo Artículo
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center" style={{ marginTop: '50px' }}>
            <Spinner animation="border" variant="light" />
            <p style={{ color: 'white' }}>Cargando ...</p>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="text-center" style={{ marginTop: '50px', color: 'white' }}>
            <img
              src={InventarioIcon}
              alt="Sin productos"
              style={{ width: '150px', marginBottom: '20px' }}
            />
            <h2>No hay productos en el inventario</h2>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredProductos}
            pagination
            paginationPerPage={6}
            fixedHeader
            customStyles={customStyles}
            paginationComponent={(props) => <CustomPagination {...props} />}
          />
        )}

        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
      <DialogoEliminarProducto
        visible={isDialogVisible}
        onConfirm={eliminarProducto}
        onCancel={cancelarEliminarProducto}
      />
    </div>
  </div>
  );
};

export default Inventario;
