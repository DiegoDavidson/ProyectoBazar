import React from 'react';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import VendedorDashboard from './VendedorDashboard';
import GerenteDashboard from './GerenteDashboard';
import Perfil from './Perfil';
import Ventas from './Ventas';
import Estadisticas from './Estadisticas';  // Importa la vista de Estadísticas
import 'bootstrap/dist/css/bootstrap.min.css';
import userIcon from './Components/assets/user_icon.png';
import passwordIcon from './Components/assets/password_icon.png';
import monitosNonaImage from './Components/assets/MonitosNonaWhite.png';

const cookies = new Cookies();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: "",
      isAuthenticated: false,
      role: null,
    };
  }

  componentDidMount = () => {
    this.getSession();
  }

  getSession = () => {
    fetch("/api/session/", {
      credentials: "same-origin",
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
  }

  login = (event) => {
    event.preventDefault();

    if (this.state.username === "" || this.state.password === "") {
      this.setState({ error: "Por favor ingrese ambos campos" });
      return;
    }

    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.details === "invalid credentials") {
        this.setState({ error: "Credenciales incorrectas" });
      } else {
        this.setState({ isAuthenticated: true, role: data.role, username: "", password: "", error: "" });
      }
    })
    .catch((err) => {
      console.log(err);
      this.setState({ error: "Error en la solicitud" });
    });
  }

  logout = () => {
    fetch("/api/logout/", {
      credentials: "same-origin",
    })
    .then((res) => res.json())
    .then((data) => {
      this.setState({ isAuthenticated: false, role: null });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <div className='container-fluid d-flex justify-content-center align-items-center vh-100' style={{ margin: 0, padding: 0, background: '#212121' }}>
          <div className='p-5 rounded' style={{ width: '40%', background: '#303030' }}>
            <form onSubmit={this.login}>
              <div className='form-group mb-4'>
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
                    type='text'
                    className='form-control'
                    id='username'
                    name='username'
                    placeholder='Ingrese su nombre de usuario'
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

              <div className='form-group mb-4'>
                <div className='input-group'>
                  <div className="input-group-prepend">
                    <span className="input-group-text" style={{ backgroundColor: 'transparent', border: 'none' }}>
                      <img src={passwordIcon} alt="Password Icon" style={{ width: '30px', height: '30px' }} />
                    </span>
                  </div>
                  <input
                    type='password'
                    className='form-control'
                    id='password'
                    name='password'
                    placeholder='Contraseña'
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
                  backgroundColor: '#676767',
                  color: 'white',
                  borderRadius: '25px'
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
            <Route path="/vendedor-dashboard" element={<VendedorDashboard logout={this.logout} />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/ventas" element={<Ventas logout={this.logout} />} />
            <Route path="/estadisticas" element={<Estadisticas logout={this.logout} />} /> {/* Nueva ruta para Estadísticas */}
            <Route path="*" element={<Navigate to="/vendedor-dashboard" />} />
          </>
        ) : this.state.role === 'gerente' ? (
          <Route path="*" element={<GerenteDashboard logout={this.logout} />} />
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )}
      </Routes>

      </Router>
    );
  }
}

export default App;
