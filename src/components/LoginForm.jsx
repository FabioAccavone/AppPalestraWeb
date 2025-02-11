import React, { useState } from "react";
import "./LoginForm.css"; // Importa il CSS

const LoginForm = ({ onSubmit }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(credentials);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Accedi</h2>
      
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Ruolo</label>
        <select
          id="role"
          name="role"
          value={credentials.role}
          onChange={handleChange}
          required
        >
          <option value="">Seleziona un ruolo</option>
          <option value="utente">Utente</option>
          <option value="pt">Personal Trainer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
