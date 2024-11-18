import React from "react";
import Navbar from "./Navbar";

const Vendedores = () => {
    return (
        <div style={{ backgroundColor: '#0F1E25', minHeight: '100vh', padding: '10px', position: 'relative' }}>
            <Navbar />

            <div className="container text-center" style={{ color: 'white' }}>
                <h1 className="my-5">Vendedores</h1>
            </div>

        </div>    
    )
};

export default Vendedores;
