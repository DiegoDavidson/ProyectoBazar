import React, { useState } from 'react';
import Navbar from './Navbar';

const GestionUsuario = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Pérez', role: 'Vendedor', email: 'juan@bazar.com' },
    { id: 2, name: 'Ana García', role: 'Gerente', email: 'ana@bazar.com' },
  ]);
  const [newUser, setNewUser] = useState({ name: '', role: '', email: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.role && newUser.email) {
      const newId = users.length + 1;
      setUsers((prevUsers) => [
        ...prevUsers,
        { id: newId, ...newUser },
      ]);
      setNewUser({ name: '', role: '', email: '' });
    }
  };

  const handleDeleteUser = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <div
      style={{
        backgroundColor: '#0F1E25',
        minHeight: '100vh',
        paddingLeft: '250px', // Para que no se superponga con la navbar lateral
        display: 'flex',
        justifyContent: 'center', // Centrado horizontal
        alignItems: 'center', // Centrado vertical
        position: 'relative',
      }}
    >
      <Navbar /> {/* Usar el Navbar aquí */}

      <div
        className="container"
        style={{
          color: 'white',
          maxWidth: '900px',
          minWidth: '400px', // Se puede cambiar para asegurar que sea resizable
          resize: 'both',
          overflow: 'auto',
          padding: '20px',
          backgroundColor: '#13242C',
          position: 'relative',
          borderRadius: '15px',
        }}
      >
        <h1 className="my-5 text-center">Gestión de Usuarios</h1>

        {/* Formulario para agregar nuevo usuario */}
        <div style={{ marginBottom: '30px' }}>
          <h3>Agregar nuevo usuario</h3>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={newUser.name}
            onChange={handleInputChange}
            style={{
              padding: '10px',
              marginRight: '10px',
              borderRadius: '10px',
              border: '1px solid #13242C',
              backgroundColor: 'white',
              color: '#13242C',
              outline: 'none',
            }}
          />
          <input
            type="text"
            name="role"
            placeholder="Rol"
            value={newUser.role}
            onChange={handleInputChange}
            style={{
              padding: '10px',
              marginRight: '10px',
              borderRadius: '8px',
              border: '1px solid #13242C',
              backgroundColor: 'white',
              color: '#13242C',
              outline: 'none',
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={newUser.email}
            onChange={handleInputChange}
            style={{
              padding: '10px',
              marginRight: '10px',
              borderRadius: '8px',
              border: '1px solid #13242C',
              backgroundColor: 'white',
              color: '#13242C',
              outline: 'none',
            }}
          />
          <button
            onClick={handleAddUser}
            style={{
              padding: '10px 20px',
              margin: '8px 0px',
              backgroundColor: '#1D3642',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Agregar Usuario
          </button>
        </div>

        {/* Tabla de usuarios */}
        <h3>Usuarios Existentes</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1D3642' }}>
              <th style={{ padding: '12px', color: 'white' }}>ID</th>
              <th style={{ padding: '12px', color: 'white' }}>Nombre</th>
              <th style={{ padding: '12px', color: 'white' }}>Rol</th>
              <th style={{ padding: '12px', color: 'white' }}>Correo</th>
              <th style={{ padding: '12px', color: 'white' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '10px', color: 'white' }}>{user.id}</td>
                <td style={{ padding: '10px', color: 'white' }}>{user.name}</td>
                <td style={{ padding: '10px', color: 'white' }}>{user.role}</td>
                <td style={{ padding: '10px', color: 'white' }}>{user.email}</td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{
                      backgroundColor: '#D9534F',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionUsuario;
