import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Inventario = ({ logout }) => {
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: '',
    codigo: '',
    cantidad: '',
    valor_unitario: ''
  });
  const [message, setMessage] = useState('');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    fetch('/api/listar-productos/')
      .then((res) => res.json())
      .then((data) => {
        const productosFormateados = data.map((prod) => ({
          ...prod,
          fecha_registro: new Date(prod.fecha_registro).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        }));
        setProductos(productosFormateados);
      })
      .catch((err) => console.error('Error al obtener productos:', err));
  };
  

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const agregarProducto = (e) => {
    e.preventDefault();

    fetch('/api/agregar-producto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.cookie.match(/csrftoken=([\w-]+)/)[1],
      },
      body: JSON.stringify(producto),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage('Producto agregado correctamente');
          setProducto({ nombre: '', codigo: '', cantidad: '', valor_unitario: '' });
          fetchProductos(); // Refresca la lista de productos
        }
      })
      .catch((err) => console.error('Error:', err));
  };


  const eliminarProducto = async (id) => {
    // Muestra un cuadro de confirmación
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
  
    // Si el usuario cancela, no se procede con la eliminación
    if (!confirmar) return;
  
    try {
      const response = await fetch(`http://localhost:8000/api/eliminar-producto/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Asegúrate de pasar el token si es necesario para la autenticación
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
  
      console.log('Producto eliminado');
      fetchProductos(); // Actualiza la lista de productos después de eliminar
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const editarProducto = (producto) => {
    navigate('/addProducto', { state: { producto } });
  };
  
  
  

  
  

  return (
    <div style={{ backgroundColor: '#0F1E25', minHeight: '100vh', padding: '10px', position: 'relative' }}>
      <Navbar /> {/* Usar el Navbar aquí */}

      <div className="container text-center" style={{ color: 'white', width: '70%', marginTop: '80px' }}> {/* Ajuste de margen superior */}
        <h2 className="mb-4">Productos en Inventario</h2>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex" style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Buscar artículo"
              className="form-control me-2"
              style={{ maxWidth: '300px' }}
            />
            <button className="btn btn-secondary me-2">Buscar</button>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/addProducto')} // Redirige a addProducto al hacer clic
          >
            Ingresar Nuevo Artículo
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-12">
            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <table className="table table-bordered" style={{ backgroundColor: '#13242C', color: 'white' }}>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Categoría</th>
      <th>Fecha de Registro</th>
      <th>Código</th>
      <th>Cantidad</th>
      <th>Valor Unitario</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
  {productos.map((prod) => (
    <tr key={prod.id} style={{ backgroundColor: '#13242C', color: 'white' }}>
      <td>{prod.nombre}</td>
      <td>{prod.categoria}</td>
      <td>{prod.fecha_registro}</td>
      <td>{prod.codigo}</td>
      <td>{prod.cantidad}</td>
      <td>{prod.valor_unitario}</td>
      <td>
      <button
  className="btn btn-warning btn-sm me-2"
  onClick={() => editarProducto(prod)}>
  Editar
</button>

        <button className="btn btn-danger btn-sm"
          onClick={() => eliminarProducto(prod.id)} // Usamos `prod.id` en lugar de `producto.id`
        >
          Eliminar
        </button>
      </td>
    </tr>
  ))}
</tbody>

</table>


              {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventario;
