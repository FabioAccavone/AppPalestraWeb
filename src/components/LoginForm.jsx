import React, { useState } from "react";

const LoginForm = ({ onSubmit }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password || !credentials.role) {
      setError("Tutti i campi sono obbligatori");
      return;
    }
    setError("");
    onSubmit(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input type="text" name="username" value={credentials.username} onChange={handleChange} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
      </div>
      <div>
        <label>Ruolo:</label>
        <select name="role" value={credentials.role} onChange={handleChange} required>
          <option value="">Seleziona un ruolo</option>
          <option value="utente">Utente</option>
          <option value="pt">Personal Trainer</option>
        </select>
      </div>
      <button type="submit">Login</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default LoginForm;
