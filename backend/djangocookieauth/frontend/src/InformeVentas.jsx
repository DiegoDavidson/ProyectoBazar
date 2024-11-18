import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const InformeVentas = () => {
  const [informe, setInforme] = useState({
    cantidad_boletas: 0,
    total_boletas: 0,
    cantidad_facturas: 0,
    total_facturas: 0
  });

  useEffect(() => {
    fetch('/api/informe-ventas-dia', {
      method: 'GET',
      credentials: 'include'  // Esto permite que se incluyan las cookies de sesión
    })
      .then(response => {
        if (response.redirected) {
          // Si es redirigido, probablemente significa que necesita iniciar sesión
          window.location.href = response.url;
        }
        return response.json();
      })
      .then(data => {
        console.log('Datos recibidos:', data);
        setInforme(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div style={{ backgroundColor: '#0F1E25', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="container" style={{ backgroundColor: '#0F1E25', color: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '800px' }}>
        <h3 className="text-center mb-4">Informe de Ventas del Día</h3>
        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th scope="col">Detalle</th>
              <th scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cantidad de Ventas con Boleta</td>
              <td>{informe.cantidad_boletas}</td>
            </tr>
            <tr>
              <td>Total Dinero por Ventas con Boleta</td>
              <td>${informe.total_boletas}</td>
            </tr>
            <tr>
              <td>Cantidad de Facturas Generadas</td>
              <td>{informe.cantidad_facturas}</td>
            </tr>
            <tr>
              <td>Total Dinero por Ventas con Factura</td>
              <td>${informe.total_facturas}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InformeVentas;
