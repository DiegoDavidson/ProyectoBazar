import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BazarImage from './Components/assets/Bazar.png';
import LogoutImage from './Components/assets/Logout.png';

const Venta = ({ logout }) => {
  const [estadoDia, setEstadoDia] = useState(null);  
  const [productos, setProductos] = useState([]);    
  const [carrito, setCarrito] = useState([]);        
  const [total, setTotal] = useState(0);             
  const [tipoDocumento, setTipoDocumento] = useState("boleta"); // Estado para boleta/factura
  const [tipoDocumento2, setTipoDocumento2] = useState('boleta');
  const navigate = useNavigate();


  

  useEffect(() => {
    
    const obtenerEstado = async () => {
      try {
        const response = await fetch('/api/obtener_estado_ventas/');
        const data = await response.json();
        setEstadoDia(data.estado === "abierto");
        console.log("Estado del día al cargar:", data.estado);
      } catch (error) {
        console.error("Error al obtener estado:", error);
      }
    };

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
            }),
            cantidadSeleccionada: 1
          }));
          setProductos(productosFormateados);
        })
        .catch((err) => console.error('Error al obtener productos:', err));
    };

    obtenerEstado();
    fetchProductos();
  }, []);

  function agregarAlCarrito(producto) {
    if (!producto.cantidadSeleccionada || producto.cantidadSeleccionada < 1) {
      alert("Por favor, selecciona una cantidad válida.");
      return;
    }

    const productoEnCarrito = carrito.find((item) => item.codigo === producto.codigo);
    let nuevoCarrito;
    if (productoEnCarrito) {
      nuevoCarrito = carrito.map((item) =>
        item.codigo === producto.codigo
          ? {
              ...item,
              cantidadSeleccionada: producto.cantidadSeleccionada,
              subtotal: producto.cantidadSeleccionada * producto.valor_unitario,
            }
          : item
      );
    } else {
      nuevoCarrito = [
        ...carrito,
        {
          ...producto,
          cantidadSeleccionada: producto.cantidadSeleccionada,
          subtotal: producto.cantidadSeleccionada * producto.valor_unitario,
        },
      ];
    }

    setCarrito(nuevoCarrito);
    const nuevoTotal = nuevoCarrito.reduce((acc, item) => acc + item.subtotal, 0);
    setTotal(nuevoTotal);
  }

  function actualizarCantidad(codigo, cantidad) {
    setProductos((prevProductos) =>
      prevProductos.map((prod) =>
        prod.codigo === codigo ? { ...prod, cantidadSeleccionada: cantidad } : prod
      )
    );
  }

  const realizarVenta = async () => {
    const data = {
      total: total,
      tipo_documento: tipoDocumento, // Usa `tipoDocumento`
    };
  
    try {
      const response = await fetch('/api/registrar-venta/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
  
      if (result.status === "success") {
        console.log("Venta registrada con ID:", result.venta_id);
        alert(`Venta realizada con éxito. ID de Venta: ${result.venta_id}, Vendedor: ${result.vendedor_nombre}`);
        setCarrito([]);
        setTotal(0);
        setTipoDocumento('boleta'); // Reiniciar el tipo de documento a 'boleta'
      } else {
        console.error('Error en la respuesta de registrar venta:', result);
        alert('Error al registrar la venta');
      }
    } catch (error) {
      console.error("Error al realizar la venta:", error);
      alert('Error al registrar la venta');
    }
  };
  

  
  



  return (
    <div style={{ backgroundColor: '#0F1E25', minHeight: '100vh', padding: '10px', position: 'relative', color: '#fff' }}>
      
      {/* Imagen para el menú */}
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
  
      {/* Menú lateral izquierdo */}
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
              <a 
                className="nav-link d-flex align-items-center" 
                href="#"
                onClick={logout}
              >
                <img src={LogoutImage} alt="Logout" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Cerrar caja
              </a>
            </li>
          </ul>
        </div>
      </div>
  
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
        <h2>Estado del día: {estadoDia ? 'Abierto' : 'Cerrado'}</h2>
        <h3>Venta en proceso</h3>
  
        {/* Selección de tipo de documento */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#fff', fontSize: '18px', marginRight: '10px' }}>Tipo de Documento:</label>
          <div className="btn-group" role="group" aria-label="Tipo de Documento">
            <input 
              type="radio" 
              className="btn-check" 
              name="tipoDocumento" 
              id="boleta" 
              value="boleta" 
              checked={tipoDocumento === "boleta"}
              onChange={(e) => setTipoDocumento(e.target.value)}
            />
            <label className="btn btn-outline-light" htmlFor="boleta">Boleta</label>
  
            <input 
              type="radio" 
              className="btn-check" 
              name="tipoDocumento" 
              id="factura" 
              value="factura" 
              checked={tipoDocumento === "factura"}
              onChange={(e) => setTipoDocumento(e.target.value)}
            />
            <label className="btn btn-outline-light" htmlFor="factura">Factura</label>
          </div>
        </div>
  
        {/* Sección de inventario y ticket */}
        <div style={{ display: 'flex', padding: '20px' }}>
          {/* Sección de inventario */}
          <div style={{ flex: 2, marginRight: '20px' }}>
            <h2>Inventario</h2>
            <table style={{ width: '100%', marginBottom: '20px', color: '#fff', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #fff' }}>Nombre</th>
                  <th style={{ padding: '10px', border: '1px solid #fff' }}>Código</th>
                  <th style={{ padding: '10px', border: '1px solid #fff' }}>Cantidad en Stock</th>
                  <th style={{ padding: '10px', border: '1px solid #fff' }}>Valor Unitario</th>
                  <th style={{ padding: '10px', border: '1px solid #fff' }}>Cantidad</th>
                  <th style={{ padding: '10px', border: '1px solid #fff' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.codigo}>
                    <td style={{ padding: '10px', border: '1px solid #fff' }}>{prod.nombre}</td>
                    <td style={{ padding: '10px', border: '1px solid #fff' }}>{prod.codigo}</td>
                    <td style={{ padding: '10px', border: '1px solid #fff' }}>{prod.cantidad}</td>
                    <td style={{ padding: '10px', border: '1px solid #fff' }}>${prod.valor_unitario}</td>
                    <td style={{ padding: '10px', border: '1px solid #fff' }}>
                      <input
                        type="number"
                        min="1"
                        max={prod.cantidad}
                        value={prod.cantidadSeleccionada}
                        onChange={(e) => actualizarCantidad(prod.codigo, Math.min(e.target.value, prod.cantidad))}
                        style={{
                          width: '50px',
                          padding: '5px',
                          textAlign: 'center',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #fff' }}>
                      <button 
                        onClick={() => agregarAlCarrito(prod)} 
                        style={{ 
                          backgroundColor: '#007bff', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '5px 10px', 
                          cursor: 'pointer', 
                          fontSize: '14px',
                          borderRadius: '5px'
                        }}
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Sección del ticket */}
          <div style={{ flex: 1, padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Ticket de Compra</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {carrito.map((item, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  {item.nombre} - ${item.valor_unitario} x {item.cantidadSeleccionada} = ${item.subtotal}
                </li>
              ))}
            </ul>
            <h3>Total: ${total}</h3>
            <button 
              onClick={realizarVenta} 
              style={{ 
                backgroundColor: '#28a745', 
                color: '#fff', 
                border: 'none', 
                padding: '10px 20px', 
                cursor: 'pointer', 
                fontSize: '16px',
                borderRadius: '5px',
                marginTop: '10px'
              }}
            >
              Finalizar Venta
            </button>
          </div>
        </div>
  
        {/* Botón para regresar al dashboard */}
        <button 
          onClick={() => navigate('/vendedor-dashboard')} 
          style={{ 
            backgroundColor: '#28a745', 
            color: '#fff', 
            border: 'none', 
            padding: '10px 20px', 
            cursor: 'pointer', 
            fontSize: '16px',
            borderRadius: '5px',
            marginTop: '20px'
          }}
        >
          Regresar al Dashboard
        </button>
      </div>
    </div>
  );
  
  
  
};

export default Venta;
