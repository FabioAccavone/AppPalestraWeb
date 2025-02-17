import React, { useState, useContext } from 'react'; 
import axios from 'axios'; 
import NavBar from '../components/NavBar';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import { AuthContext } from '../context/AuthContext'; 
import 'react-toastify/dist/ReactToastify.css'; 

const Login = () => {
  // Recupera la funzione login dal contesto di autenticazione
  const { login } = useContext(AuthContext); // Prendi la funzione login dal context
  const [error, setError] = useState(""); // Stato per gestire gli errori di login
  const navigate = useNavigate(); // Hook per la navigazione tra le pagine

  // Funzione per gestire il login
  const handleLogin = async (credentials) => {
    try {
      // Effettua una richiesta POST per autenticare l'utente
      const response = await axios.post("http://localhost:5000/api/auth/login", credentials);

      // Salva il token e le informazioni dell'utente nel contesto per mantenere l'autenticazione
      login(response.data.token, response.data.role, response.data.id); //  Salva nel context

      // Naviga verso l'area riservata in base al ruolo dell'utente
      if (response.data.role === 'utente') {
        navigate('/AreaRiservata', { state: { message: 'Login successful Utente!' } }); // Naviga all'area utente
      }
      if (response.data.role === 'pt') {
        navigate('/AreaRiservata', { state: { message: 'Login successful PT!' } }); // Naviga all'area PT
      }
      if(response.data.role === 'admin'){
        navigate('/AreaRiservata', { state: { message: 'Login successful Admin!' } }); // Naviga all'area admin
      }
          
    } catch (error) {
      // Se c'è un errore, mostra un messaggio di errore
      toast.error('Invalid credentials'); // Mostra il toast con l'errore
    }

  };

  return (
    <>
      <NavBar /> {/* Barra di navigazione */}
      <div>
        <LoginForm onSubmit={handleLogin} /> {/* Modulo di login che riceve la funzione handleLogin */}
        {error && <p className="error-message">{error}</p>} {/* Mostra un messaggio di errore se presente */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> {/* Container per le notifiche */}
      </div>
    </>
  );
};

export default Login; 
