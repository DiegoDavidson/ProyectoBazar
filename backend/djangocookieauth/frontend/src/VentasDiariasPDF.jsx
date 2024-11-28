import jsPDF from "jspdf";

const VentasDiariasPDF = ({ ventas }) => {
  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 10;

    // Encabezado
    doc.setFontSize(14);
    doc.text("Reporte de Ventas Diarias", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, yPosition);
    yPosition += 10;

    // Línea de separación
    doc.setLineWidth(0.5);
    doc.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 10;

    // Tabla de ventas
    (ventas || []).forEach((venta, index) => {
      const { id, vendedor__username, total, tipo_documento, fecha_venta, detalles } = venta;

      // Información de la venta
      doc.text(`Venta #${id}`, 10, yPosition);
      doc.text(`Vendedor: ${vendedor__username || "Desconocido"}`, 60, yPosition);
      doc.text(`Total: $${parseFloat(total).toFixed(2)}`, 140, yPosition);
      yPosition += 7;

      doc.text(`Tipo de Documento: ${tipo_documento}`, 10, yPosition);
      doc.text(`Fecha: ${fecha_venta}`, 60, yPosition);
      yPosition += 10;

      // Encabezado de productos
      doc.setFontSize(9);
      doc.text("Productos:", 10, yPosition);
      yPosition += 5;

      doc.setFont("courier", "normal");
      doc.setFontSize(8);
      doc.text("Producto            | Cantidad | Precio Unitario | Subtotal", 10, yPosition);
      yPosition += 5;

      (detalles || []).forEach((detalle) => {
        const { producto, cantidad, precio_unitario } = detalle;
        const subtotal = cantidad * precio_unitario;
      
        const productoNombre = producto.length > 20 ? producto.slice(0, 17) + "..." : producto;
      
        doc.text(
          `${productoNombre.padEnd(20)} | ${cantidad.toString().padEnd(8)} | $${parseFloat(precio_unitario).toFixed(2).padEnd(14)} | $${parseFloat(subtotal).toFixed(2)}`,
          10,
          yPosition
        );
        yPosition += 5;
      
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 10;
        }
      });
      
      // Línea de separación
      if (index < ventas.length - 1) {
        doc.setLineWidth(0.2);
        doc.line(10, yPosition, pageWidth - 10, yPosition);
        yPosition += 5;
      }

      // Control de salto de página
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }
    });

    // Guardar el PDF
    doc.save(`Reporte_Ventas_Diarias_${new Date().toLocaleDateString()}.pdf`);
  };

  return { generarPDF };
};

export default VentasDiariasPDF;
