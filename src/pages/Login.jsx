import React, { useState, useContext } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Importa della notifica
import { AuthContext } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css'; // Stili


const Login = () => {
  const { login } = useContext(AuthContext); // Prendi la funzione login dal context
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", credentials);

      login(response.data.token, response.data.role, response.data.id); //  Salva nel context
        if (response.data.role === 'utente') {
          navigate('/AreaRiservata', { state: { message: 'Login successful Utente!' } });
        }
        if (response.data.role === 'pt') {
          navigate('/AreaRiservata', { state: { message: 'Login successful PT!' } }); 
        }
        if(response.data.role === 'admin'){
          navigate('/AreaRiservata', { state: { message: 'Login successful Admin!' } });
        }
          
    } catch (error) {
      setError('Invalid credentials');
    }

  };

  return (
    <>
    <NavBar></NavBar>
    <div>
      <LoginForm onSubmit={handleLogin} /> 
      {error && <p className="error-message">{error}</p>}
    </div>
    </>
  );
};

export default Login;


