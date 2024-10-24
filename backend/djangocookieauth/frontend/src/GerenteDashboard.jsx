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

  return (
    <div>
      <h1>Bienvenido, gerente</h1>
      
      {/* Formulario para agregar productos */}
      <form onSubmit={agregarProducto}>
        <div>
          <label>Nombre del producto:</label>
          <input type="text" name="nombre" value={producto.nombre} onChange={handleChange} />
        </div>
        <div>
          <label>Código del producto:</label>
          <input type="text" name="codigo" value={producto.codigo} onChange={handleChange} />
        </div>
        <div>
          <label>Cantidad:</label>
          <input type="number" name="cantidad" value={producto.cantidad} onChange={handleChange} />
        </div>
        <div>
          <label>Valor unitario:</label>
          <input type="number" step="0.01" name="valor_unitario" value={producto.valor_unitario} onChange={handleChange} />
        </div>
        <button type="submit">Agregar Producto</button>
      </form>
      {message && <p>{message}</p>}
      
      {/* Tabla para mostrar productos agregados */}
      <h2>Productos en Inventario</h2>
      <table>
        <thead>
          <tr>
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
              <td>{prod.nombre}</td>
              <td>{prod.codigo}</td>
              <td>{prod.cantidad}</td>
              <td>{prod.valor_unitario}</td>
              <td>{(prod.cantidad * prod.valor_unitario).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-danger" onClick={logout}>LOG OUT</button>
    </div>
  );
};

export default GerenteDashboard;
