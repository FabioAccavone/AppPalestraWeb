import React from 'react'
import './style/App.css'
import NavBar from './components/NavBar'
import { useLocation } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';  // Importa
import 'react-toastify/dist/ReactToastify.css'; // Stili

function App() {

  const location = useLocation(); // Ottieni la posizione attuale

  const [messageShown, setMessageShown] = useState(false); // Stato per controllare se il messaggio è stato mostrato

  useEffect(() => {
    if (location.state && location.state.message && !messageShown) {
      toast.success(location.state.message); // Mostra il toast con il messaggio di successo
      setMessageShown(true); // Imposta che il messaggio è stato mostrato
    }
  }, [location, messageShown]); // Esegui quando cambia la posizione, ma solo se il messaggio non è già stato mostrato

  return (
    <>
    {/* Posizione globale del ToastContainer */}
      <NavBar/>
      <h1>Benvenuto nella HomePage</h1>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default App
