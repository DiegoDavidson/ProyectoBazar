import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useLocation } from 'react-router-dom';

const AddProducto = () => {
  const location = useLocation();
  const productoParaEditar = location.state ? location.state.producto : null;

  const [producto, setProducto] = useState({
    nombre: '',
    categoria: '',
    codigo: '',
    cantidad: '',
    valor_unitario: '',
  });

  const [message, setMessage] = useState('');

 useEffect(() => {
    if (productoParaEditar) {
      setProducto(productoParaEditar);
    }
  }, [productoParaEditar]);

  const categorias = [
    'Papelería y Escritura', 
    'Cuadernos y Agendas', 
    'Material Escolar', 
    'Arte y Manualidades', 
    'Tecnología y Accesorios', 
    'Oficina y Negocios', 
    'Libros y Lectura', 
    'Regalos y Decoración'
  ];

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Asegúrate de apuntar a la URL correcta del backend
    const url = producto.id 
      ? `http://localhost:8000/api/editar-producto/${producto.id}/` 
      : 'http://localhost:8000/api/agregar-producto/';
    const method = producto.id ? 'PUT' : 'POST';

    fetch(url, {
      method,
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
          setMessage(producto.id ? 'Producto actualizado correctamente' : 'Producto guardado correctamente');
          setProducto({ nombre: '', categoria: '', codigo: '', cantidad: '', valor_unitario: '' });
        }
      })
      .catch((err) => {
        setMessage('Ocurrió un error al intentar guardar el producto');
      });
  };

  return (
    <div style={{ backgroundColor: '#0F1E25', minHeight: '100vh', padding: '20px', position: 'relative' }}>
      <Navbar />
  
      <div className="container" style={{ maxWidth: '900px', color: 'white' }}>
        <h1 className="text-center my-5">Agregar Producto</h1>
  
        <form onSubmit={handleSave}>
          {/* Fila para nombre y categoría */}
          <div className="row mb-4">
            <div className="col-7">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nombre del Producto" 
                name="nombre" 
                value={producto.nombre} 
                onChange={handleChange} 
                style={{ 
                  height: '50px', 
                  borderRadius: '25px', 
                  backgroundColor: '#2F2F2F', 
                  color: 'white', 
                  '::placeholder': { color: 'white' } 
                }} 
                required 
              />
            </div>
            <div className="col-5">
              <select 
                className="form-select" 
                name="categoria" 
                value={producto.categoria} 
                onChange={handleChange} 
                style={{ 
                  height: '50px', 
                  borderRadius: '25px', 
                  backgroundColor: '#2F2F2F', 
                  color: 'white', 
                  '::placeholder': { color: 'white' } 
                }} 
                required
              >
                <option value="">Categoría</option>
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
          </div>
  
          {/* Fila para código del producto */}
          <div className="mb-4">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Código del Producto" 
              name="codigo" 
              value={producto.codigo} 
              onChange={handleChange} 
              style={{ 
                height: '50px', 
                borderRadius: '25px', 
                backgroundColor: '#2F2F2F', 
                color: 'white', 
                '::placeholder': { color: 'white' } 
              }} 
              required 
            />
          </div>
  
          {/* Fila para cantidad y valor unitario */}
          <div className="row mb-4">
            <div className="col-6">
              <input 
                type="number" 
                className="form-control" 
                placeholder="Cantidad" 
                name="cantidad" 
                value={producto.cantidad} 
                onChange={handleChange} 
                style={{ 
                  height: '50px', 
                  borderRadius: '25px', 
                  backgroundColor: '#2F2F2F', 
                  color: 'white', 
                  '::placeholder': { color: 'white' } 
                }} 
                required 
              />
            </div>
            <div className="col-6">
              <input 
                type="number" 
                step="0.01" 
                className="form-control" 
                placeholder="Valor Unitario" 
                name="valor_unitario" 
                value={producto.valor_unitario} 
                onChange={handleChange} 
                style={{ 
                  height: '50px', 
                  borderRadius: '25px', 
                  backgroundColor: '#2F2F2F', 
                  color: 'white', 
                  '::placeholder': { color: 'white' } 
                }} 
                required 
              />
            </div>
          </div>
  
          {/* Botón de guardar */}
          <div className="text-center">
            <button 
              type="submit" 
              className="btn" 
              style={{
                backgroundColor: '#1D3642',
                color: 'white',
                borderRadius: '25px',
                padding: '10px 20px',
                width: '200px'
              }}
            >
              Guardar
            </button>
          </div>
  
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </form>
      </div>
    </div>
  );
  
  
};

export default AddProducto;
