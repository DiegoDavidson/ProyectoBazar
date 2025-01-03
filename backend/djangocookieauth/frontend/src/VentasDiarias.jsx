import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import './App.css'; 
import Navbar from './Navbar';
import { Spinner } from 'react-bootstrap'; // Importar Spinner
import { useContext } from 'react';
import { Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import folder from "./Components/assets/folder.png";
import refresh from "./Components/assets/refresh.png";
import VentasDiariasPDF from "./VentasDiariasPDF";

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

const VentasDiarias = ({ ventas }) => {
  const [sales, setSales] = useState(ventas || []);
  const [message, setMessage] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const estadoDia = location.state?.estadoDia;


  const handleDownloadPDF = () => {
    console.log("Ventas cargadas en sales para PDF:", sales); // Verificar estructura
    const pdfGenerator = VentasDiariasPDF({ ventas: sales });
    pdfGenerator.generarPDF();
  };

  useEffect(() => {
    console.log('Estado del día:', estadoDia);
    fetchSales(); // Cargar ventas siempre, independientemente del estado del día.
  }, [estadoDia]); // Ejecutar cada vez que cambie estadoDia.

  const fetchSales = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/obtener_ventas/', { credentials: 'include' });
      if (!res.ok) throw new Error('Error al obtener las ventas');
  
      const data = await res.json();
      console.log("Ventas con detalles obtenidas desde la API:", data);
  
      const ventasFormateadas = data.ventas.map((venta) => ({
        ...venta,
        total: parseFloat(venta.total).toFixed(2),
        fecha_venta: new Date(venta.fecha_venta).toLocaleString('es-ES'),
      }));
  
      setSales(ventasFormateadas);
    } catch (err) {
      console.error("Error al obtener ventas:", err);
    } finally {
      setLoading(false);
    }
  };
  


  const columns = [
    { name: 'ID', selector: (row) => row.id },
    { name: 'Vendedor', selector: (row) => row.vendedor__username || "Sin nombre" },
    { name: 'Total', selector: (row) => `$${row.total}` },
    { name: 'Tipo de Documento', selector: (row) => row.tipo_documento },
    { name: 'Fecha y Hora', selector: (row) => row.fecha_venta, sortable: true }
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

  const handleFilterChange = (event) => {
    setFilterType(event.target.value); // Cambiar el tipo de filtro seleccionado
  };

  // Filtrar las ventas según el filtro seleccionado
  const filteredSales = filterType ? sales.filter(sale => sale.tipo_documento === filterType) : sales;

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
        <Navbar />
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
          <h2 className="mb-4 mt-5 text-light">Ventas del Día</h2>



          {message && <div className="alert alert-info mt-3">{message}</div>}

          {/* Filtro permanente */}
          <div style={{ marginBottom: '20px', backgroundColor: '#13242C', padding: '10px', borderRadius: '5px', position:'relative' }}>
            <label style={{ color: '#FFFFFF', marginRight: '10px' }}>Tipo de Documento:</label>
            <select
              value={filterType}
              onChange={handleFilterChange}
              style={{
                fontFamily: 'Quicksand', // Asegura la fuente
                fontWeight: 400,
                color: '#FFFFFF',
                backgroundColor: '#1D3642',
                border: 'none',
                borderRadius: '5px',
                padding: '5px',
              }}
            >
              <option value="">Todos</option>
              <option value="boleta">Boleta</option>
              <option value="factura">Factura</option>
            </select>

            <img
              src={refresh}
              alt="Refresh"
              onClick={() => {
                setLoading(true);
                setFilterType('');
                fetchSales();
              }}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '20px',
                height: '20px',
                cursor: 'pointer', 
              }}
            />

            

            


          </div>
          

          



          {loading ? ( 
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Spinner animation="border" variant="light" />
          </div>
        ) : filteredSales.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <img
              src={folder}  // Usando la imagen importada
              alt="No hay ventas"
              style={{ width: '100px', height: '100px', marginBottom: '20px' }} // Ajusta el tamaño según lo necesites
            />
            <h2 style={{ color: 'white' }}>No se han emitido boletas o facturas</h2>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredSales} // Mostrar solo las ventas filtradas
            pagination
            paginationPerPage={6}
            fixedHeader
            customStyles={customStyles}
            paginationComponent={(paginationProps) => <CustomPagination {...paginationProps} />} // Pasa correctamente las props a CustomPagination
            responsive
            striped
          />
          
        )}

          <button
            onClick={handleDownloadPDF}
            style={{
              marginTop: "20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            Descargar PDF
          </button>

        </div>
      </div>
    </div>
  );
};

export default VentasDiarias;
