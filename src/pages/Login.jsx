import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Importa
import 'react-toastify/dist/ReactToastify.css'; // Stili


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      // Salva il token JWT ricevuto nella risposta
      localStorage.setItem('token', response.data.token);
      setError('');
      navigate('/AreaRiservata', { state: { message: 'Login successful!' } }); // Usa navigate per reindirizzare
      
    } catch (error) {
      setError('Invalid username or password');
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
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
    </>
  );
};

export default Login;
