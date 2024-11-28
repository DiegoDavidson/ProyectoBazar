import React from "react";

const DialogoEliminarProducto = ({ visible, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
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
          backgroundColor: "#1E2D3A",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
          textAlign: "center",
          color: "#FFF",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 style={{ marginBottom: "20px", fontSize: "20px" }}>
          ¿Estás seguro de que quieres eliminar este producto?
        </h3>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#D9534F",
              border: "none",
              borderRadius: "5px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#5CB85C",
              border: "none",
              borderRadius: "5px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogoEliminarProducto;
