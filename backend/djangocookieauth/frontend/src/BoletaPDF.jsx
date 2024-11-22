import jsPDF from "jspdf";
import monitosLogo from "./Components/assets/MonitosDeLaNona.png"; // Ajusta la ruta según tu proyecto

const BoletaPDF = (carrito, total, boletaNumero) => {
  const generarPDF = () => {
    const doc = new jsPDF();

    // Cargar imagen
    const imgWidth = 50; // Ancho deseado de la imagen
    const imgHeight = 60; // Altura deseada de la imagen
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = (pageWidth - imgWidth) / 2; // Posición X para centrar

    doc.addImage(monitosLogo, "PNG", centerX, 10, imgWidth, imgHeight);

    // Primera sección (RUT, BOLETA, NUMERO)
    doc.setFontSize(12);
    doc.text("RUT: 20.760.036-9", pageWidth / 2, 90, { align: "center" });
    doc.text("BOLETA ELECTRÓNICA", pageWidth / 2, 100, { align: "center" });
    doc.text(`N° BOLETA: ${boletaNumero}`, pageWidth / 2, 110, { align: "center" });

    // Línea de separación
    const lineX = 20;
    const lineWidth = pageWidth - 40;
    doc.setLineWidth(0.5);
    doc.line(lineX, 115, lineX + lineWidth, 115);

    // Fecha y hora de emisión
    const now = new Date();
    const fecha = now.toLocaleDateString();
    const hora = now.toLocaleTimeString();
    doc.setFontSize(10);
    doc.text(`FECHA EMISIÓN: ${fecha}`, 20, 125);
    doc.text(`HORA: ${hora}`, pageWidth - 20, 125, { align: "right" });

    doc.text("SUCURSAL: CALLE FALSA #1234, LONGAVÍ", 20, 135);

    // Línea de separación
    const sucursalLineY = 140;
    doc.setLineWidth(0.5);
    doc.line(lineX, sucursalLineY, lineX + lineWidth, sucursalLineY);

    // Agregar lista de productos
    let yPosition = 145;
    doc.text("DESCRIPCIÓN:", 20, yPosition);
    yPosition += 10;

    const rightAlignX = pageWidth - 20; //alineación derecha

    carrito.forEach((producto) => {
      // Primera línea: Nombre producto, x UNIDAD, precio por unidad
      const precioUnidad = producto.subtotal / producto.cantidadSeleccionada;
      doc.text(`${producto.nombre} x UNIDAD`, 20, yPosition);
      doc.text(`$${precioUnidad.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
      yPosition += 10;

      // Segunda línea: x cantidad, total del producto
      doc.text(`x ${producto.cantidadSeleccionada}`, 20, yPosition);
      doc.text(`$${producto.subtotal.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
      yPosition += 10;
    });

    // Línea de separación
    yPosition += 5;
    doc.setLineWidth(0.5);
    doc.line(lineX, yPosition, lineX + lineWidth, yPosition);
    yPosition += 5;

    // Total e IVA
    const iva = total * 0.19;
    const totalConIva = total + iva;

    const leftAlignX = 20; // alineados a la izquierda

    doc.text("SUBTOTAL:", leftAlignX, yPosition);
    doc.text(`$${total.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
    yPosition += 10;

    doc.text("IVA (19%):", leftAlignX, yPosition);
    doc.text(`$${iva.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
    yPosition += 10;

    doc.text("TOTAL:", leftAlignX, yPosition);
    doc.text(`$${totalConIva.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });

    doc.save(`Boleta_${boletaNumero}.pdf`);
  };

  return { generarPDF };
};

export default BoletaPDF;
