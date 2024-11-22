import React from 'react';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Venta from './Venta'; // Importa Venta directamente
import GerenteDashboard from './GerenteDashboard';
import Inventario from './Inventario';
import VentasDiarias from './VentasDiarias';
import Vendedores from './Vendedores';
import GestionUsuario from './GestionUsuario';
import Navbar from './Navbar';
import AddProducto from './AddProducto';
import InformeVentas from './InformeVentas';

import 'bootstrap/dist/css/bootstrap.min.css';
import userIcon from './Components/assets/user_icon.png';
import passwordIcon from './Components/assets/password_icon.png';
import monitosNonaImage from './Components/assets/MonitosNonaWhite.png';

const cookies = new Cookies();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      isAuthenticated: false,
      role: null,
    };
  }

  componentDidMount = () => {
    this.getSession();
  };

  getSession = () => {
    fetch('/api/session/', {
      credentials: 'same-origin',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          this.setState({ isAuthenticated: true, role: data.role });
        } else {
          this.setState({ isAuthenticated: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  login = (event) => {
    event.preventDefault();
  
    if (this.state.username === '' || this.state.password === '') {
      this.setState({ error: 'Por favor ingrese ambos campos' });
      return;
    }
  
    fetch('/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.get('csrftoken'),
      },
      credentials: 'include',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((res) => {
        if (res.status === 403) {
          this.setState({ error: 'El sistema está cerrado. No puede iniciar sesión en este momento.' });
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.detail === 'Credenciales incorrectas') {
          this.setState({ error: 'Credenciales incorrectas' });
        } else if (data) {
          this.setState({
            isAuthenticated: true,
            role: data.role,
            username: '',
            password: '',
            error: '',
          });
          console.log('El rol del usuario es:', data.role);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: 'Error en la solicitud' });
      });
  };
  

  logout = () => {
    fetch("/api/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ isAuthenticated: false, role: null });
        window.location.href = "/"; // Redirige a la página de inicio de sesión
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <div
          className="container-fluid d-flex justify-content-center align-items-center vh-100"
          style={{ margin: 0, padding: 0, background: '#111C22' }}
        >
          <div className="p-5 rounded" style={{ width: '40%', background: '#13242C' }}>
            <form onSubmit={this.login}>
              <div className="form-group mb-4">
                <h3 className="text-center mb-5">
                  <img src={monitosNonaImage} alt="Los Monitos de la Nona" style={{ width: '200px', height: '200px' }} />
                </h3>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text" style={{ backgroundColor: 'transparent', border: 'none' }}>
                      <img src={userIcon} alt="User Icon" style={{ width: '30px', height: '30px' }} />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    placeholder="Ingrese su nombre de usuario"
                    value={this.state.username}
                    onChange={(e) => this.setState({ username: e.target.value })}
                    style={{
                      height: '50px',
                      borderRadius: '25px',
                      paddingLeft: '40px',
                      backgroundColor: '#2F2F2F',
                      color: 'white',
                    }}
                  />
                </div>
              </div>

              <div className="form-group mb-4">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text" style={{ backgroundColor: 'transparent', border: 'none' }}>
                      <img src={passwordIcon} alt="Password Icon" style={{ width: '30px', height: '30px' }} />
                    </span>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Contraseña"
                    value={this.state.password}
                    onChange={(e) => this.setState({ password: e.target.value })}
                    style={{
                      height: '50px',
                      borderRadius: '25px',
                      paddingLeft: '40px',
                      backgroundColor: '#2F2F2F',
                      color: 'white',
                    }}
                  />
                </div>
                <div>{this.state.error && <small className="text-danger">{this.state.error}</small>}</div>
              </div>

              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: '#1D3642',
                  color: 'white',
                  borderRadius: '25px',
                }}
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <Router>
        <Routes>
          {this.state.role === 'vendedor' ? (
            <>
              <Route path="/venta" element={<Venta logout={this.logout} />} />
              <Route path="*" element={<Navigate to="/venta" />} />
            </>
          ) : this.state.role === 'gerente' ? (
            <>
              <Route path="/gerente-dashboard" element={<GerenteDashboard logout={this.logout} />} />
              <Route path="/inventario" element={<Inventario logout={this.logout} />} />
              <Route path="/ventasDiarias" element={<VentasDiarias logout={this.logout} />} />
              <Route path="/vendedores" element={<Vendedores />} />
              <Route path="/gestionUsuario" element={<GestionUsuario />} />
              <Route path="/addProducto" element={<AddProducto />} />
              <Route path="/InformeVentas" element={<InformeVentas logout={this.logout}/>} />
              <Route path="*" element={<Navigate to="/gerente-dashboard" />} />
            </>
          ) : (
            <Route path="/" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    );
  }
}

export default App;
