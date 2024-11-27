import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import monitoIcon from "./Components/assets/Monito.png";
import "./App.css";
import BoletaPDF from './BoletaPDF'; // Asegúrate de que la ruta sea correcta
import FacturaPDF from './FacturaPDF';




const Venta = ({ logout }) => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState(""); // Estado para el tipo de documento
  const [dialogVisible, setDialogVisible] = useState(false); // Estado para mostrar el cuadro de diálogo
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/listar-productos/")
      .then((res) => res.json())
      .then((data) => {
        const productosFormateados = data.map((prod) => ({
          id: prod.codigo,
          nombre: prod.nombre,
          cantidad: prod.cantidad,
          valor_unitario: prod.valor_unitario,
          cantidadSeleccionada: 1,
        }));
        setProductos(productosFormateados);
      })
      .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const confirmLogout = () => setDialogVisible(true)

  const agregarAlCarrito = (producto) => {
    if (!producto.cantidadSeleccionada || producto.cantidadSeleccionada < 1) {
      alert("Por favor, selecciona una cantidad válida.");
      return;
    }

    const productoEnCarrito = carrito.find((item) => item.id === producto.id);
    let nuevoCarrito;
    if (productoEnCarrito) {
      nuevoCarrito = carrito.map((item) =>
        item.id === producto.id
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
  };

  const actualizarCantidad = (id, cantidad) => {
    setProductos((prevProductos) =>
      prevProductos.map((prod) =>
        prod.id === id ? { ...prod, cantidadSeleccionada: cantidad } : prod
      )
    );
  };

  const nuevaVenta = () => {
    setCarrito([]);         
    setTotal(0);            
    setTipoDocumento("");   
    setSearchText("");      
    setDialogVisible(false); 
  };


  const columnas = [
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Código", selector: (row) => row.id },
    { name: "Valor Unitario", selector: (row) => `$${row.valor_unitario}`},
    {
      name: "Cantidad",
      cell: (row) => (
        <input
          type="number"
          value={row.cantidadSeleccionada}
          onChange={(e) => actualizarCantidad(row.id, parseInt(e.target.value) || 1)} // Si no es un número válido, se pone 1
          style={{
            width: "60px",
            padding: "5px",
            textAlign: "center",
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      name: "Acción",
      cell: (row) => (
        <button
          onClick={() => agregarAlCarrito(row)}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Agregar
        </button>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#1D3642",
        color: "#FFFFFF",
        fontWeight: "normal",
        fontSize: "14px",
      },
    },
    cells: {
      style: {
        backgroundColor: "#13242C",
        color: "#FFFFFF",
        fontSize: "14px",
      },
    },
    rows: {
      style: {
        borderColor: "#13242C",
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

  const [facturaData, setFacturaData] = useState({
    razonSocial: "",
    rut: "",
    giro: "",
    direccion: "",
  });
  

  const calcularIVA = (total) => total * 0.19;

  const [ventas, setVentas] = useState([]);


  const iva = calcularIVA(total);
  const totalConIva = total + iva;

  const finalizarCompra = () => {
    setDialogVisible(true); // Mostrar cuadro de diálogo para seleccionar documento
  };

  async function guardarVenta(data) {
    const csrftoken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken"))
      ?.split("=")[1];
  
    try {
      const response = await fetch("/api/registrar-venta/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar la venta.");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error al guardar la venta:", error);
      throw error;
    }
  }
  






    const confirmarDocumento = async () => {
      if (!tipoDocumento) {
        alert("Por favor, selecciona un tipo de documento.");
        return;
      }
    
      // Validación adicional para facturas
      if (tipoDocumento === "factura") {
        const { razonSocial, rut, giro, direccion } = facturaData;
        if (!razonSocial.trim() || !rut.trim() || !giro.trim() || !direccion.trim()) {
          alert("Por favor, completa todos los campos para la factura.");
          return;
        }
      }
    
      try {
        // Preparar los datos para el backend
        const ventaData = {
          carrito,
          total: totalConIva,
          tipoDocumento,
          fechaVenta: new Date().toISOString(),
          ...(tipoDocumento === "factura" ? { facturaData } : {}),
        };
    
        // Guardar la venta
        const ventaGuardada = await guardarVenta(ventaData);
        console.log("Venta guardada con éxito:", ventaGuardada);
    
        // Generar PDF del documento
        if (tipoDocumento === "factura") {
          const facturaNumero = ventaGuardada.numeroFactura || Date.now();
          FacturaPDF(carrito, total, facturaNumero, facturaData).generarPDF();
        } else if (tipoDocumento === "boleta") {
          const boletaNumero = ventaGuardada.numeroBoleta || Date.now();
          BoletaPDF(carrito, total, boletaNumero).generarPDF();
        }
    
        // Reiniciar los datos para una nueva venta
        nuevaVenta();
        setDialogVisible(false);
      } catch (error) {
        console.error("Error al guardar la venta:", error);
        alert("Hubo un problema al registrar la venta. Inténtalo nuevamente.");
      }
    };



  // Eliminar un producto del carrito
  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);

    const nuevoTotal = nuevoCarrito.reduce((acc, item) => acc + item.subtotal, 0);
    setTotal(nuevoTotal);
  };

    
  
  
  

  return (
    <div style={{ backgroundColor: "#0F1E25", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: "#1D3642",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#FFFFFF",
          position: "relative",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={monitoIcon}
            alt="Logo"
            onClick={toggleMenu}
            style={{
              width: "55px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          />
          {menuVisible && (
            <div
              style={{
                position: "absolute",
                top: "50px",
                left: "0",
                backgroundColor: "#1D3642",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                color: "#fff",
                zIndex: 1000,
                padding: "10px",
                width: "200px",
              }}
            >
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                <li 
                onClick={nuevaVenta}
                style={{ padding: "10px 0", borderBottom: "1px solid #ccc", cursor: "pointer" }}>
                  Nueva venta
                </li>
                <li
                  onClick={handleLogout}
                  style={{
                    padding: "10px 0",
                    cursor: "pointer",
                    color: "#dc3545",
                    fontWeight: "bold",
                  }}
                >
                  Cerrar sesión
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Contenido principal */}
<div style={{ display: "flex", height: "calc(100vh - 60px)", padding: "20px" }}>
  <div style={{ flex: 2, marginRight: "20px" }}>
    <h2 style={{ color: "#fff", marginBottom: "10px" }}>Inventario</h2>
    <input
      type="text"
      placeholder="Buscar producto"
      onChange={(e) => setSearchText(e.target.value)}
      style={{
        marginBottom: "10px",
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        width: "100%",
      }}
    />
    <DataTable
      columns={columnas}
      data={productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        producto.id.toString().includes(searchText)
      )}
      customStyles={customStyles}
      pagination
    />
  </div>

  {/* Cuadro lateral */}
  <div
    style={{
      flex: 1,
      backgroundColor: "#1D3642",
      borderRadius: "8px",
      color: "#fff",
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxHeight: "100%",
    }}
  >
    <h2 style={{ marginBottom: "10px", color: "#FFFFFF" }}>Ticket de Compra</h2>
<div
  style={{
    flex: 1,
    width: "100%",
    overflowY: "auto",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#13242C",
    borderRadius: "5px",
  }}
>
  <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
    {carrito.map((item) => (
      <li key={item.id} style={{ marginBottom: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{item.nombre}</span>
          <span>
            {item.cantidadSeleccionada} x ${item.valor_unitario} = $
            {item.subtotal}
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => eliminarDelCarrito(item.id)}
              style={{
                backgroundColor: "#dc3545",
                color: "#fff",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
                border: "none",
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>
<div
  style={{
    width: "100%",
    padding: "10px",
    backgroundColor: "#0F1E25",
    borderRadius: "5px",
  }}
>
  <p style={{ margin: "5px 0" }}>Total antes de IVA: ${total.toFixed(2)}</p>
  <p style={{ margin: "5px 0" }}>IVA (19%): ${iva.toFixed(2)}</p>
  <p style={{ margin: "5px 0", fontWeight: "bold" }}>
    Total: ${totalConIva.toFixed(2)}
  </p>
</div>
<button
  onClick={finalizarCompra}
  style={{
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
  }}
>
  Finalizar Compra
</button>

  </div>
</div> {/* Cierre del div principal */}

{/* Diálogo para tipo de documento */}
{dialogVisible && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        backgroundColor: "#13242C",
        padding: "20px",
        borderRadius: "10px",
        width: "400px",
        textAlign: "center",
        color: "#fff",
      }}
    >
      <h3 style={{ marginBottom: "20px", fontSize: "20px" }}>
        Selecciona el tipo de documento
      </h3>
      <select
        value={tipoDocumento}
        onChange={(e) => setTipoDocumento(e.target.value)}
        style={{
          margin: "10px 0",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "100%",
          backgroundColor: "#1D3642",
          color: "#FFFFFF",
        }}
      >
        <option value="" disabled>
          Selecciona
        </option>
        <option value="boleta">Boleta</option>
        <option value="factura">Factura</option>
      </select>

      {tipoDocumento === "factura" && (
        <div>
          <input
            type="text"
            placeholder="Razón Social"
            value={facturaData.razonSocial}
            onChange={(e) =>
              setFacturaData({ ...facturaData, razonSocial: e.target.value })
            }
            style={{
              margin: "10px 0",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
              backgroundColor: "#1D3642",
              color: "#FFFFFF",
            }}
          />
          <input
            type="text"
            placeholder="RUT"
            value={facturaData.rut}
            onChange={(e) =>
              setFacturaData({ ...facturaData, rut: e.target.value })
            }
            style={{
              margin: "10px 0",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
              backgroundColor: "#1D3642",
              color: "#FFFFFF",
            }}
          />
          <input
            type="text"
            placeholder="Giro"
            value={facturaData.giro}
            onChange={(e) =>
              setFacturaData({ ...facturaData, giro: e.target.value })
            }
            style={{
              margin: "10px 0",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
              backgroundColor: "#1D3642",
              color: "#FFFFFF",
            }}
          />
          <input
            type="text"
            placeholder="Dirección"
            value={facturaData.direccion}
            onChange={(e) =>
              setFacturaData({ ...facturaData, direccion: e.target.value })
            }
            style={{
              margin: "10px 0",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
              backgroundColor: "#1D3642",
              color: "#FFFFFF",
            }}
          />
        </div>
      )}

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => setDialogVisible(false)}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            flex: 1,
            marginRight: "10px",
            cursor: "pointer",
            border: "none",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={confirmarDocumento}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            flex: 1,
            cursor: "pointer",
            border: "none",
          }}
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
)}

      {/* Diálogo para tipo de documento */}
      {dialogVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3>Selecciona el tipo de documento</h3>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              style={{
                margin: "10px 0",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            >
              <option value="">Selecciona</option>
              <option value="boleta">Boleta</option>
              <option value="factura">Factura</option>
            </select>
            <button
              onClick={confirmarDocumento}
              style={{
                marginTop: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                border: "none",
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Venta;
