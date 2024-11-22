import jsPDF from "jspdf";
import monitosLogo from "./Components/assets/MonitosDeLaNona.png"; // Ajusta la ruta según tu proyecto

const FacturaPDF = (carrito, total, facturaNumero, facturaData) => {
  const generarPDF = () => {
    const doc = new jsPDF();

    // Cargar imagen
    const imgWidth = 50; // Ancho deseado de la imagen
    const imgHeight = 60; // Altura deseada de la imagen
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = (pageWidth - imgWidth) / 2; // Posición X para centrar

    doc.addImage(monitosLogo, "PNG", centerX, 10, imgWidth, imgHeight);

    // Primera sección (RUT, FACTURA, NUMERO)
    doc.setFontSize(12);
    doc.text("RUT: 20.760.036-9", pageWidth / 2, 90, { align: "center" });
    doc.text("FACTURA ELECTRÓNICA", pageWidth / 2, 100, { align: "center" });
    doc.text(`N° FACTURA: ${facturaNumero}`, pageWidth / 2, 110, { align: "center" });

    // Datos del cliente
    doc.setFontSize(10);
    doc.text(`Razón Social: ${facturaData.razonSocial}`, 20, 125);
    doc.text(`RUT: ${facturaData.rut}`, 20, 135);
    doc.text(`Giro: ${facturaData.giro}`, 20, 145);
    doc.text(`Dirección: ${facturaData.direccion}`, 20, 155);

    // Línea de separación
    const lineX = 20;
    const lineWidth = pageWidth - 40;
    const clientInfoLineY = 160;
    doc.setLineWidth(0.5);
    doc.line(lineX, clientInfoLineY, lineX + lineWidth, clientInfoLineY);

    // Fecha y hora de emisión
    const now = new Date();
    const fecha = now.toLocaleDateString();
    const hora = now.toLocaleTimeString();
    doc.text(`FECHA EMISIÓN: ${fecha}`, 20, 170);
    doc.text(`HORA: ${hora}`, pageWidth - 20, 170, { align: "right" });

    doc.text("SUCURSAL: CALLE FALSA #1234, LONGAVÍ", 20, 180);

    // Línea de separación
    const sucursalLineY = 185;
    doc.line(lineX, sucursalLineY, lineX + lineWidth, sucursalLineY);

    // Lista de productos
    let yPosition = 190;
    doc.text("DESCRIPCIÓN:", 20, yPosition);
    yPosition += 10;

    const rightAlignX = pageWidth - 20; 

    carrito.forEach((producto) => {
      // Nombre producto, x UNIDAD, precio por unidad
      const precioUnidad = producto.subtotal / producto.cantidadSeleccionada;
      doc.text(`${producto.nombre} x UNIDAD`, 20, yPosition);
      doc.text(`$${precioUnidad.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
      yPosition += 10;

      // Total producto 
      doc.text(`x ${producto.cantidadSeleccionada}`, 20, yPosition);
      doc.text(`$${producto.subtotal.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
      yPosition += 10;

      // Calcular precio sin IVA
      const precioSinIva = precioUnidad / 1.19; 

      
      doc.text("SIN IVA X UNI", 20, yPosition);
      doc.text(`$${precioSinIva.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
      yPosition += 10;  // Ajusta el espacio después de "SIN IVA"
    });

    // Línea de separación
    yPosition += 5;
    doc.setLineWidth(0.5);
    doc.line(lineX, yPosition, lineX + lineWidth, yPosition);
    yPosition += 5;

    // Total e IVA
    const iva = total * 0.19;
    const totalConIva = total + iva;

    const leftAlignX = 20; // Alineación izquierda

    // Mostrar subtotal, IVA y total correctamente
    doc.text("SUBTOTAL:", leftAlignX, yPosition);
    doc.text(`$${total.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
    yPosition += 10;

    doc.text("IVA (19%):", leftAlignX, yPosition);
    doc.text(`$${iva.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });
    yPosition += 10;

    doc.text("TOTAL:", leftAlignX, yPosition);
    doc.text(`$${totalConIva.toFixed(2)}`, rightAlignX, yPosition, { align: "right" });

    doc.save(`Factura_${facturaNumero}.pdf`);
  };

  return { generarPDF };
};

export default FacturaPDF;
