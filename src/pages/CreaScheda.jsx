import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreaScheda = () => {
    const { idUtente, idRichiesta } = useParams();
    const { user } = useContext(AuthContext); // PT loggato
    const navigate = useNavigate();

    const [dataInizio, setDataInizio] = useState('');
    const [dataFine, setDataFine] = useState('');
    const [idScheda, setIdScheda] = useState(null);
    const [eserciziDisponibili, setEserciziDisponibili] = useState([]);
    const [eserciziSelezionati, setEserciziSelezionati] = useState([]);

    // Campi per un esercizio da aggiungere
    const [idEsercizio, setIdEsercizio] = useState('');
    const [peso, setPeso] = useState('');
    const [serie, setSerie] = useState('');
    const [ripetizioni, setRipetizioni] = useState('');

    // Recupera la lista degli esercizi disponibili
    useEffect(() => {
        axios.get("http://localhost:5000/api/schede/esercizi")
            .then(response => setEserciziDisponibili(response.data))
            .catch(error => console.error("Errore nel recupero degli esercizi:", error));
    }, []);

    // Funzione per creare una nuova scheda
    const handleCreaScheda = () => {
        axios.post("http://localhost:5000/api/schede/creaScheda", {
            dataInizio,
            dataFine,
            idUtente,
            idPT: user.id
        })
        .then(response => {
            setIdScheda(response.data.idScheda);
            toast.success("Scheda creata con successo!");
        })
        .catch(() => alert("Errore nella creazione della scheda"));
    };

    // Aggiungi un esercizio alla lista locale
    const handleAggiungiEsercizio = () => {
        if (!idEsercizio || !serie || !ripetizioni) {
            toast.error("Compila tutti i campi dell'esercizio!");
            return;
        }

        const esercizioSelezionato = eserciziDisponibili.find(e => e.idEsercizio === parseInt(idEsercizio));

        setEserciziSelezionati([...eserciziSelezionati, {
            idEsercizio,
            nome: esercizioSelezionato?.nome,
            peso,
            serie,
            ripetizioni
        }]);

        // Resetta i campi
        setIdEsercizio('');
        setPeso('');
        setSerie('');
        setRipetizioni('');
    };

    // Invia tutti gli esercizi selezionati al backend
    const handleSalvaScheda = () => {
        if (!idScheda) {
            toast.error("Crea prima la scheda!");
            return;
        }

        axios.post("http://localhost:5000/api/schede/aggiungiEsercizio", {
            idScheda,
            esercizi: eserciziSelezionati,
        })
        .then(() => {
            // Dopo aver salvato gli esercizi, aggiorna lo stato della richiesta
        return axios.put(`http://localhost:5000/api/richiesta/update/${idRichiesta}`, {
            stato: "completata"
        });
        
        })
        .then(() =>{
            navigate('/gestione-richieste', { state: { message: "Scheda completata con successo!" } }); // Torna alla gestione richieste

        })
        .catch(() => alert("Errore nel salvataggio degli esercizi"));

    };

    return (
        <div>
            <NavBar />
            <h2>Creazione Scheda per Utente {idUtente}</h2>

            {!idScheda ? (
                <div>
                    <label>Data Inizio:</label>
                    <input type="date" value={dataInizio} onChange={(e) => setDataInizio(e.target.value)} />

                    <label>Data Fine:</label>
                    <input type="date" value={dataFine} onChange={(e) => setDataFine(e.target.value)} />

                    <button onClick={handleCreaScheda}>Crea Scheda</button>
                </div>
            ) : (
                <div>
                    <h3>Aggiungi Esercizi alla Scheda</h3>

                    <label>Seleziona Esercizio:</label>
                    <select value={idEsercizio} onChange={(e) => setIdEsercizio(e.target.value)}>
                        <option value="">-- Seleziona un esercizio --</option>
                        {eserciziDisponibili.map(ex => (
                            <option key={ex.idEsercizio} value={ex.idEsercizio}>
                                {ex.nome}
                            </option>
                        ))}
                    </select>

                    <label>Peso:</label>
                    <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} />

                    <label>Serie:</label>
                    <input type="number" value={serie} onChange={(e) => setSerie(e.target.value)} />

                    <label>Ripetizioni:</label>
                    <input type="number" value={ripetizioni} onChange={(e) => setRipetizioni(e.target.value)} />

                    <button onClick={handleAggiungiEsercizio}>Aggiungi Esercizio</button>

                    <h4>Esercizi Selezionati:</h4>
                    <ul>
                        {eserciziSelezionati.map((ex, index) => (
                            <li key={index}>
                                {ex.nome} - {ex.peso} kg - {ex.serie} serie - {ex.ripetizioni} ripetizioni
                            </li>
                        ))}
                    </ul>

                    <button onClick={handleSalvaScheda}>Salva Scheda</button>
                </div>
            )}
             <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default CreaScheda;
