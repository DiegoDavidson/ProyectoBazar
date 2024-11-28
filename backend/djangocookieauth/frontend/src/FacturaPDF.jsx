import jsPDF from "jspdf";
import monitosLogo from "./Components/assets/MonitosDeLaNona.png"; // Ajusta la ruta según tu proyecto

const FacturaPDF = (carrito, total, facturaNumero, facturaData) => {
  const generarPDF = () => {
    // Crear un documento con una página más larga (por ejemplo, 500 mm de alto)
    const doc = new jsPDF({
      unit: 'mm', // Definir unidades como milímetros
      format: [210, 500] // A4 de ancho (210 mm) y altura extendida (500 mm)
    });

    // Cargar imagen
    const imgWidth = 50; // Ancho deseado de la imagen
    const imgHeight = 60; // Altura deseada de la imagen
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = (pageWidth - imgWidth) / 2; // Posición X para centrar

    let yPosition = 10;

    // Función para manejar la posición y sin necesidad de saltos de página
    const checkPageOverflow = (increment = 10) => {
      if (yPosition + increment > doc.internal.pageSize.height - 20) {
        // Si se excede el tamaño de la página extendida, ajustamos la posición (pero no saltamos de página)
        yPosition += increment; 
      }
    };

    doc.addImage(monitosLogo, "PNG", centerX, yPosition, imgWidth, imgHeight);
    yPosition += imgHeight + 10;

    // Primera sección (RUT, FACTURA, NUMERO)
    doc.setFontSize(12);
    doc.text("RUT: 20.760.036-9", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.text("FACTURA ELECTRÓNICA", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.text(`N° FACTURA: ${facturaNumero}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Datos del cliente
    doc.setFontSize(10);
    doc.text(`Razón Social: ${facturaData.razonSocial}`, 20, yPosition);
    yPosition += 10;
    doc.text(`RUT: ${facturaData.rut}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Giro: ${facturaData.giro}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Dirección: ${facturaData.direccion}`, 20, yPosition);
    yPosition += 15;

    // Línea de separación
    checkPageOverflow();
    const lineX = 20;
    const lineWidth = pageWidth - 40;
    doc.setLineWidth(0.5);
    doc.line(lineX, yPosition, lineX + lineWidth, yPosition);
    yPosition += 10;

    // Fecha y hora de emisión
    const now = new Date();
    const fecha = now.toLocaleDateString();
    const hora = now.toLocaleTimeString();
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
    doc.text("DESCRIPCIÓN:", 20, yPosition);
    yPosition += 10;

    const rightAlignX = pageWidth - 20; 

    carrito.forEach((producto) => {
      // Nombre producto, x UNIDAD, precio por unidad
      checkPageOverflow(10);
      const precioUnidad = producto.subtotal / producto.cantidadSeleccionada;
      doc.text(`${producto.nombre} x UNIDAD`, 20, yPosition);
      doc.text(`$${precioUnidad.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
      yPosition += 10;

      // Total producto 
      checkPageOverflow(10);
      doc.text(`x ${producto.cantidadSeleccionada}`, 20, yPosition);
      doc.text(`$${producto.subtotal.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
      yPosition += 10;

      // Calcular precio sin IVA
      checkPageOverflow(10);
      const precioSinIva = precioUnidad / 1.19; 
      doc.text("SIN IVA X UNI", 20, yPosition);
      doc.text(`$${precioSinIva.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
      yPosition += 10;  // Ajusta el espacio después de "SIN IVA"
    });

    // Línea de separación
    yPosition += 5;
    checkPageOverflow(10);
    doc.setLineWidth(0.5);
    doc.line(lineX, yPosition, lineX + lineWidth, yPosition);
    yPosition += 10;

    // Total e IVA
    const iva = total * 0.19;
    const totalConIva = total + iva;

    const leftAlignX = 20; // Alineación izquierda

    // Mostrar subtotal, IVA y total correctamente
    checkPageOverflow(10);
    doc.text("SUBTOTAL:", leftAlignX, yPosition);
    doc.text(`$${total.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
    yPosition += 10;

    checkPageOverflow(10);
    doc.text("IVA (19%):", leftAlignX, yPosition);
    doc.text(`$${iva.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
    yPosition += 10;

    checkPageOverflow(10);
    doc.text("TOTAL:", leftAlignX, yPosition);
    doc.text(`$${totalConIva.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });

    // Descargar PDF
    doc.save(`Factura_${facturaNumero}.pdf`);
  };

  return { generarPDF };
};

export default FacturaPDF;
