import React, { useState, useEffect } from 'react';

const GerenteDashboard = ({ logout }) => {
  const [producto, setProducto] = useState({
    nombre: '',
    codigo: '',
    cantidad: '',
    valor_unitario: ''
  });
  const [message, setMessage] = useState('');
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    fetch('/api/listar-productos/')
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
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

  const handleSelectProducto = (id) => {
    if (productosSeleccionados.includes(id)) {
      setProductosSeleccionados(productosSeleccionados.filter((prodId) => prodId !== id));
    } else {
      setProductosSeleccionados([...productosSeleccionados, id]);
    }
  };

  const eliminarProductos = () => {
    console.log('Productos seleccionados para eliminar:', productosSeleccionados);
    if (productosSeleccionados.length === 0) {
      setMessage('No has seleccionado ningún producto para eliminar');
      return;
    }

    fetch('/api/eliminar-productos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.cookie.match(/csrftoken=([\w-]+)/)[1],
      },
      body: JSON.stringify({ ids: productosSeleccionados }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Respuesta de la eliminación:', data);
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage('Productos eliminados correctamente');
          setProductosSeleccionados([]); // Limpiar selección
          fetchProductos(); // Refresca la lista de productos
        }
      })
      .catch((err) => {
        console.error('Error al eliminar productos:', err);
        setMessage('Hubo un error al eliminar los productos.');
      });
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
      {/* Navbar Bootstrap */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
        <div className="container-fluid">
          <a className="navbar-brand ms-5" href="#">Los monitos de la Nona</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">Vendedores</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Ventas</a>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn btn-danger me-5" onClick={logout}>
                  LOG OUT
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="row align-items-start">
          <div className="col-md-6">
            <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <h2 className="AgregarProductoTx mb-5">Agregar un producto</h2>
              {/* Formulario para agregar productos */}
              <form onSubmit={agregarProducto}>
                <div className="form-group">
                  <label>Nombre del producto:</label>
                  <input 
                    type="text" 
                    name="nombre" 
                    value={producto.nombre} 
                    onChange={handleChange} 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Código del producto:</label>
                  <input 
                    type="text" 
                    name="codigo" 
                    value={producto.codigo} 
                    onChange={handleChange} 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Cantidad:</label>
                  <input 
                    type="number" 
                    name="cantidad" 
                    value={producto.cantidad} 
                    onChange={handleChange} 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Valor unitario:</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="valor_unitario" 
                    value={producto.valor_unitario} 
                    onChange={handleChange} 
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Agregar Producto
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-6">
            <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h2>Productos en Inventario</h2>
              </div>

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Seleccionar</th>
                    <th>Nombre</th>
                    <th>Código</th>
                    <th>Cantidad</th>
                    <th>Valor Unitario</th>
                    <th>Total por Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={productosSeleccionados.includes(prod.id)} 
                          onChange={() => handleSelectProducto(prod.id)}
                        />
                      </td>
                      <td>{prod.nombre}</td>
                      <td>{prod.codigo}</td>
                      <td>{prod.cantidad}</td>
                      <td>{prod.valor_unitario}</td>
                      <td>{(prod.cantidad * prod.valor_unitario).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className='botonesEdicion pt-3'>
                <button className="btn btn-danger" onClick={eliminarProductos}>
                  Eliminar Producto
                </button>
                <button className='btn btn-success ms-2'>
                  Editar
                </button>
              </div>

              {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GerenteDashboard;
