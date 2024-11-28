import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom"; // Importa el hook para la navegación
import InformeVentasPDF from "./InformeVentasPDF";

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

const InformeVentas = () => {
  const navigate = useNavigate(); // Inicializa el hook de navegación
  const [informe, setInforme] = useState({
    cantidad_boletas: 0,
    total_boletas: 0,
    cantidad_facturas: 0,
    total_facturas: 0,
    facturas: [],
  });

  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleDownloadPDF = () => {
    const pdfGenerator = InformeVentasPDF({ informe });
    pdfGenerator.generarPDF();
  };

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
        setInforme(data);
        setFilteredFacturas(data.facturas);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    setFilteredFacturas(
      informe.facturas.filter(
        (factura) =>
          factura.razon_social.toLowerCase().includes(value) ||
          factura.rut.toLowerCase().includes(value)
      )
    );
  };

  const columns = [
    { name: "Número", selector: (row) => row.numero },
    { name: "Razón Social", selector: (row) => row.razon_social },
    { name: "RUT", selector: (row) => row.rut },
    { name: "Giro", selector: (row) => row.giro },
    { name: "Dirección", selector: (row) => row.direccion },
    { name: "Total", selector: (row) => `$${row.total}` },
    { name: "Fecha", selector: (row) => row.fecha },
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
        <div className="mb-3">
          <input
            type="text"
            placeholder="Buscar por Razón Social o RUT"
            className="form-control"
            value={searchValue}
            onChange={handleSearch}
          />
        </div>
        <DataTable
          columns={columns}
          data={filteredFacturas}
          pagination
          paginationPerPage={6}
          customStyles={customStyles}
          paginationComponent={(props) => <CustomPagination {...props} />}
        />
      </div>

      <div className="mt-4">

      <button
          onClick={handleDownloadPDF}
          className="btn btn-primary"
          style={{
            backgroundColor: "#1D3642",
            color: "#FFFFFF",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          Descargar PDF
        </button>
        <button
          onClick={() => navigate("/GerenteDashboard")} // Cambia la ruta al dashboard
          className="btn btn-primary"
          style={{
            backgroundColor: "#1D3642",
            color: "#FFFFFF",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default InformeVentas;
