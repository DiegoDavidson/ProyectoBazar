import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const VentasDiarias = () => {
    const [sales, setSales] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/obtener_ventas/', { credentials: 'include' });
            if (!res.ok) {
                throw new Error('Error al obtener las ventas');
            }
            const data = await res.json();
            const ventasFormateadas = data.ventas.map((venta) => ({
                ...venta,
                total: parseFloat(venta.total).toFixed(2),
                fecha_venta: new Date(venta.fecha_venta).toLocaleString('es-ES') // Formatear la fecha y hora
            }));
            setSales(ventasFormateadas);
        } catch (err) {
            console.error('Error al obtener las ventas:', err);
            setMessage('Error al obtener las ventas');
        }
    };

    return (
        <div style={{ backgroundColor: '#0F1E25', minHeight: '100vh', padding: '10px', position: 'relative' }}>
            <Navbar />
            <div className="container" style={{ color: 'white', maxWidth: '70%', margin: 'auto', padding: '20px' }}>
                <h1 className="my-5 text-center">Ventas del Día</h1>
                {message && <div className="alert alert-info mt-3">{message}</div>}
                {sales.length === 0 && !message && (
                    <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
                        <i>No hay ventas registradas para hoy.</i>
                    </div>
                )}
                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #1D3642' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#1D3642' }}>
                                <th style={{ padding: '12px', color: 'white' }}>ID</th>
                                <th style={{ padding: '12px', color: 'white' }}>Vendedor</th>
                                <th style={{ padding: '12px', color: 'white' }}>Total</th>
                                <th style={{ padding: '12px', color: 'white' }}>Tipo de Documento</th>
                                <th style={{ padding: '12px', color: 'white' }}>Fecha y Hora</th> {/* Nueva columna */}
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale) => (
                                <tr key={sale.id} style={{ backgroundColor: '#13242C', color: 'white' }}>
                                    <td style={{ padding: '10px', color: 'white' }}>{sale.id}</td>
                                    <td style={{ padding: '10px', color: 'white' }}>{sale.vendedor__username || "Sin nombre"}</td>
                                    <td style={{ padding: '10px', color: 'white' }}>${sale.total}</td>
                                    <td style={{ padding: '10px', color: 'white' }}>{sale.tipo_documento}</td>
                                    <td style={{ padding: '10px', color: 'white' }}>{sale.fecha_venta}</td> {/* Mostrar fecha y hora */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VentasDiarias;
