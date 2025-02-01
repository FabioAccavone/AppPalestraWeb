import React, { useState, useContext } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Importa della notifica
import { AuthContext } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css'; // Stili


const Login = () => {
  const { login } = useContext(AuthContext); // Prendi la funzione login dal context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
        role,
      });

      login(response.data.token, response.data.role, response.data.idUtente); //  Salva nel context
        if (response.data.role === 'utente') {
          navigate('/AreaRiservata', { state: { message: 'Login successful Utente!' } });
        } else {
          navigate('/AreaRiservata', { state: { message: 'Login successful PT!' } });
          }
    } catch (error) {
      setError('Invalid credentials');
    }

  };

  return (
    <>
    <NavBar></NavBar>
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
            <label>Ruolo:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value=""></option>
              <option value="utente">Utente</option>
              <option value="pt">Personal Trainer</option>
            </select>
          </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
    </>
  );
};

export default Login;


