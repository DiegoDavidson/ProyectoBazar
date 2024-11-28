import jsPDF from "jspdf";
import monitosLogo from "./Components/assets/MonitosDeLaNona.png"; // Ajusta la ruta según tu proyecto

const BoletaPDF = (carrito, total, boletaNumero) => {
  const generarPDF = () => {
    // Crear un documento con una página más larga (por ejemplo, 500 mm de alto)
    const doc = new jsPDF({
      unit: 'mm', // Definir unidades como milímetros
      format: [210, 500] // A4 de ancho (210 mm) y altura extendida (500 mm)
    });

    // Configuración inicial
    const imgWidth = 50;
    const imgHeight = 60;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = (pageWidth - imgWidth) / 2;
    const lineX = 20;
    const lineWidth = pageWidth - 40;

    let yPosition = 10;

    // Función para manejar desbordamientos (evitar saltos de página)
    const checkPageOverflow = (increment = 10) => {
      if (yPosition + increment > pageHeight - 20) {
        // Si se excede el tamaño de la página extendida, ajustamos la posición sin hacer un salto de página
        yPosition += increment;
      }
    };

    // Encabezado
    doc.addImage(monitosLogo, "PNG", centerX, yPosition, imgWidth, imgHeight);
    yPosition += imgHeight + 10;

    doc.setFontSize(12);
    doc.text("RUT: 20.760.036-9", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.text("BOLETA ELECTRÓNICA", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.text(`N° BOLETA: ${boletaNumero}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Línea de separación
    checkPageOverflow();
    doc.setLineWidth(0.5);
    doc.line(lineX, yPosition, lineX + lineWidth, yPosition);
    yPosition += 10;

    // Fecha, hora y sucursal
    const now = new Date();
    const fecha = now.toLocaleDateString();
    const hora = now.toLocaleTimeString();
    doc.setFontSize(10);
    doc.text(`FECHA EMISIÓN: ${fecha}`, 20, yPosition);
    doc.text(`HORA: ${hora}`, pageWidth - 20, yPosition, { align: "right" });
    yPosition += 10;

    doc.text("SUCURSAL: CALLE FALSA #1234, LONGAVÍ", 20, yPosition);
    yPosition += 10;

    // Línea de separación
    checkPageOverflow();
    doc.line(lineX, yPosition, lineX + lineWidth, yPosition);
    yPosition += 10;

    // Lista de productos
    doc.setFontSize(10);
    doc.text("DESCRIPCIÓN:", 20, yPosition);
    yPosition += 10;

    carrito.forEach((producto) => {
      const precioUnidad = producto.subtotal / producto.cantidadSeleccionada;

      // Primera línea: Nombre producto, x UNIDAD, precio por unidad
      checkPageOverflow(10);
      doc.text(`${producto.nombre} x UNIDAD`, 20, yPosition);
      doc.text(`$${precioUnidad.toFixed(2)}`, pageWidth - 20, yPosition, { align: "right" });
      yPosition += 10;

      // Segunda línea: x cantidad, total del producto
      checkPageOverflow(10);
      doc.text(`x ${producto.cantidadSeleccionada}`, 20, yPosition);
      doc.text(`$${producto.subtotal.toFixed(2)}`, pageWidth - 20, yPosition, { align: "right" });
      yPosition += 10;
    });

    // Línea de separación
    checkPageOverflow(10);
    doc.setLineWidth(0.5);
    doc.line(lineX, yPosition, lineX + lineWidth, yPosition);
    yPosition += 10;

    // Totales
    const iva = total * 0.19;
    const totalConIva = total + iva;

    checkPageOverflow(10);
    doc.text("SUBTOTAL:", 20, yPosition);
    doc.text(`$${total.toFixed(2)}`, pageWidth - 20, yPosition, { align: "right" });
    yPosition += 10;

    checkPageOverflow(10);
    doc.text("IVA (19%):", 20, yPosition);
    doc.text(`$${iva.toFixed(2)}`, pageWidth - 20, yPosition, { align: "right" });
    yPosition += 10;

    checkPageOverflow(10);
    doc.text("TOTAL:", 20, yPosition);
    doc.text(`$${totalConIva.toFixed(2)}`, pageWidth - 20, yPosition, { align: "right" });

    // Descargar PDF
    doc.save(`Boleta_${boletaNumero}.pdf`);
  };

  return { generarPDF };
};

export default BoletaPDF;
