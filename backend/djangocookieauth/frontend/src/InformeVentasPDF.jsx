import jsPDF from "jspdf";

const InformeVentasPDF = ({ informe }) => {
  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 10;

    // Encabezado
    doc.setFontSize(14);
    doc.text("Informe de Ventas del Día", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, yPosition);
    yPosition += 10;

    // Línea de separación
    doc.setLineWidth(0.5);
    doc.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 10;

    // Datos generales
    doc.setFontSize(12);
    doc.text(`Cantidad de Ventas con Boleta: ${informe.cantidad_boletas}`, 10, yPosition);
    yPosition += 8;
    doc.text(`Total Dinero por Ventas con Boleta: $${informe.total_boletas}`, 10, yPosition);
    yPosition += 8;
    doc.text(`Cantidad de Facturas Generadas: ${informe.cantidad_facturas}`, 10, yPosition);
    yPosition += 8;
    doc.text(`Total Dinero por Ventas con Factura: $${informe.total_facturas}`, 10, yPosition);
    yPosition += 12;

    // Detalle de facturas
    doc.setFontSize(14);
    doc.text("Facturas Detalladas:", 10, yPosition);
    yPosition += 12;
    doc.setFont("courier", "normal");
    doc.setFontSize(12);
    doc.text("Número | Razón Social          | Total      | Fecha", 10, yPosition);
    yPosition += 10;

    (informe.facturas || []).forEach((factura) => {
      // Primera línea: Número, Razón Social, Total, Fecha
      doc.text(
        `${factura.numero.toString().padEnd(6)} | ${factura.razon_social.padEnd(20)} | $${parseFloat(factura.total).toFixed(2).padEnd(9)} | ${factura.fecha}`,
        10,
        yPosition
      );
      yPosition += 8;

      // Segunda línea: Giro y Dirección
      doc.text(
        `Giro: ${factura.giro} | Dirección: ${factura.direccion}`,
        10,
        yPosition
      );
      yPosition += 12; // Más espacio entre facturas

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }
    });

    // Guardar PDF
    doc.save(`Informe_Ventas_${new Date().toLocaleDateString()}.pdf`);
  };

  return { generarPDF };
};

export default InformeVentasPDF;
