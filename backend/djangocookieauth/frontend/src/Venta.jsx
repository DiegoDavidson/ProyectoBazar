import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import monitoIcon from "./Components/assets/Monito.png";
import "./App.css";

const Venta = ({ logout }) => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad del menú
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

  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // Alternar visibilidad del menú
  };

  const handleLogout = () => {
    logout(); // Lógica de logout
    navigate("/login"); // Redirigir al usuario a la página de login tras cerrar sesión
  };

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

  const columnas = [
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Cantidad", selector: (row) => row.cantidad, sortable: true },
    { name: "Valor Unitario", selector: (row) => `$${row.valor_unitario}`, sortable: true },
    {
      name: "Cantidad",
      cell: (row) => (
        <input
          type="number"
          min="1"
          max={row.cantidad}
          value={row.cantidadSeleccionada}
          onChange={(e) => actualizarCantidad(row.id, parseInt(e.target.value) || 1)}
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
        backgroundColor: "#1D3642",
        color: "#FFFFFF",
      },
    },
  };

  const calcularIVA = (total) => {
    return total * 0.19; // Calcula el 19% de IVA
  };

  const iva = calcularIVA(total); // Calcula el IVA
  const totalConIva = total + iva; // Suma el IVA al total

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
                top: "50px", // Desplazamos el menú hacia abajo
                left: "0", // Colocamos el menú a la izquierda
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
                <li style={{ padding: "10px 0", borderBottom: "1px solid #ccc", cursor: "pointer" }}>
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
        {/* Tabla de inventario */}
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
              producto.nombre.toLowerCase().includes(searchText.toLowerCase())
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "20px",
            maxHeight: "100%",
          }}
        >
          <div style={{ flex: 1, overflowY: "auto" }}>
            <h2 style={{ textAlign: "center" }}>Ticket de Compra</h2>
            <ul style={{ listStyleType: "none", padding: "0" }}>
              {carrito.map((item) => (
                <li key={item.id} style={{ marginBottom: "10px" }}>
                  {item.nombre} - {item.cantidadSeleccionada} x ${item.valor_unitario} = $
                  {item.cantidadSeleccionada * item.valor_unitario}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ fontSize: "25px",textAlign: "center" }}>
            <div style={{ marginBottom: "10px" }}>
              <strong>Total:</strong> ${total.toFixed(2)}
            </div>
            <div style={{ fontSize: "14px", color: "#ccc", marginBottom: "20px" }}>
              <strong>Con IVA (19%):</strong> ${totalConIva.toFixed(2)}
            </div>
            <button
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                cursor: "pointer",
                borderRadius: "5px",
              }}
              onClick={() => alert("Compra realizada con éxito")}
            >
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venta;
