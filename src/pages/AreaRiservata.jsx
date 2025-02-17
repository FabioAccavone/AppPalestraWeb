import React from 'react';
import NavBar from '../components/NavBar';
import { useLocation } from 'react-router-dom'; 
import { useEffect, useState } from 'react'; 
import { ToastContainer, toast } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';

const AreaRiservata = () => {

  // Ottiene la posizione corrente dalla navigazione, utile per accedere allo stato passato
  const location = useLocation();

  // Stato per gestire la visualizzazione del messaggio di successo
  const [messageShown, setMessageShown] = useState(false);

  // Effetto che viene eseguito quando la posizione cambia o il messaggio non è stato ancora mostrato
  useEffect(() => {
    // Verifica se la posizione ha un messaggio e se non è già stato mostrato
    if (location.state && location.state.message && !messageShown) {
      toast.success(location.state.message); // Mostra un toast con il messaggio di successo
      setMessageShown(true); // Imposta che il messaggio è stato mostrato per non farlo ripetere
    }
  }, [location, messageShown]); // L'effetto si attiva ogni volta che cambia la posizione o il messaggio non è stato ancora mostrato

  return (
    <div>
      <NavBar></NavBar> {/* Barra di navigazione */}
      <h2>Benvenuto nella tua area riservata!</h2> {/* Titolo della pagina */}
      <p>Qui puoi accedere ai tuoi dati e gestire il tuo account.</p> {/* Descrizione dell'area riservata */}
      {/* Container per le notifiche toast */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default AreaRiservata; 
