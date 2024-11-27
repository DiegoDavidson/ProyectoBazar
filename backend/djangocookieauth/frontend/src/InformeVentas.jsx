import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const InformeVentas = () => {
  const [informe, setInforme] = useState({
    cantidad_boletas: 0,
    total_boletas: 0,
    cantidad_facturas: 0,
    total_facturas: 0,
    facturas: [],
  });

  useEffect(() => {
    fetch("/api/informe-ventas-dia", {
      method: "GET",
      credentials: "include", // Para incluir cookies
    })
      .then((response) => {
        if (response.redirected) {
          window.location.href = response.url;
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos recibidos:", data);
        setInforme(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#0F1E25",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        className="container"
        style={{
          backgroundColor: "#0F1E25",
          color: "#fff",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "800px",
          marginBottom: "20px",
        }}
      >
        <h3 className="text-center mb-4">Informe de Ventas del Día</h3>
        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>Detalle</th>
              <th>Valor</th>
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

      <div
        className="container"
        style={{
          backgroundColor: "#0F1E25",
          color: "#fff",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "800px",
        }}
      >
        <h4 className="text-center mb-4">Facturas Detalladas</h4>
        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>Número</th>
              <th>Razón Social</th>
              <th>RUT</th>
              <th>Giro</th>
              <th>Dirección</th>
              <th>Total</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {informe.facturas.length > 0 ? (
              informe.facturas.map((factura, index) => (
                <tr key={index}>
                  <td>{factura.numero}</td>
                  <td>{factura.razon_social}</td>
                  <td>{factura.rut}</td>
                  <td>{factura.giro}</td>
                  <td>{factura.direccion}</td>
                  <td>${factura.total}</td>
                  <td>{factura.fecha}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay facturas para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InformeVentas;
