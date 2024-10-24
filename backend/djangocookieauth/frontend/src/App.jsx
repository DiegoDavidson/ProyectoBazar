import React from 'react';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import VendedorDashboard from './VendedorDashboard';
import GerenteDashboard from './GerenteDashboard';

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

    // Validación de campos vacíos
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

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  }

  handleUserNameChange = (event) => {
    this.setState({ username: event.target.value });
  }

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <div className="container mt-3">
          <h1>React Cookie Auth</h1>
          <br />
          <h2>Login</h2>
          <form onSubmit={this.login}>
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={this.state.username}
                onChange={this.handleUserNameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
              <div>{this.state.error && <small className="text-danger">{this.state.error}</small>}</div>
            </div>
            <button type="submit" className="btn btn-primary">Ingresar</button>
          </form>
        </div>
      );
    }

    return (
      <Router>
        <Routes>
          {this.state.role === 'vendedor' ? (
            <Route path="*" element={<VendedorDashboard logout={this.logout} />} />
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
