import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../style/CreaScheda.css'; 

const CreaScheda = () => {
    // Estrae i parametri della URL (idUtente, idRichiesta)
    const { idUtente, idRichiesta } = useParams();
    const { user } = useContext(AuthContext); // Ottieni i dati del PT loggato
    const navigate = useNavigate(); // Funzione di navigazione

    // Stati per gestire i vari dati nel form
    const [dataInizio, setDataInizio] = useState('');
    const [dataFine, setDataFine] = useState('');
    const [idScheda, setIdScheda] = useState(null);
    const [eserciziDisponibili, setEserciziDisponibili] = useState([]);
    const [eserciziSelezionati, setEserciziSelezionati] = useState([]);

    // Stati per la gestione del form dell'esercizio
    const [idEsercizio, setIdEsercizio] = useState('');
    const [peso, setPeso] = useState('');
    const [serie, setSerie] = useState('');
    const [ripetizioni, setRipetizioni] = useState('');
    const [editingIndex, setEditingIndex] = useState(null); // Indice dell'esercizio da modificare

    // Recupera la lista degli esercizi disponibili
    useEffect(() => {
        axios.get("http://localhost:5000/api/schede/esercizi")
            .then(response => setEserciziDisponibili(response.data))
            .catch(error => console.error("Errore nel recupero degli esercizi:", error));
    }, []);

    // Funzione per creare la scheda
    const handleCreaScheda = () => {
        axios.post("http://localhost:5000/api/schede/creaScheda", {
            dataInizio,
            dataFine,
            idUtente,
            idPT: user.id
        })
        .then(response => {
            setIdScheda(response.data.idScheda); // Imposta l'id della scheda creata
            toast.success("Scheda creata con successo!"); // Mostra un messaggio di successo
        })
        .catch(() => toast.error("Errore nella creazione della scheda")); // Mostra un errore in caso di fallimento
    };

    // Funzione per aggiungere o modificare un esercizio
    const handleAggiungiOmodificaEsercizio = () => {
        if (!idEsercizio || !serie || !ripetizioni) {
            toast.error("Compila tutti i campi dell'esercizio!"); // Errore se i campi non sono compilati
            return;
        }

        const esercizioSelezionato = eserciziDisponibili.find(e => e.idEsercizio === parseInt(idEsercizio));
        const nuovoEsercizio = {
            idEsercizio,
            nome: esercizioSelezionato?.nome,
            peso,
            serie,
            ripetizioni
        };

        if (editingIndex !== null) {
            // Modifica un esercizio esistente
            const nuovaLista = [...eserciziSelezionati];
            nuovaLista[editingIndex] = nuovoEsercizio;
            setEserciziSelezionati(nuovaLista);
            toast.success("Esercizio modificato con successo!");
        } else {
            // Aggiungi un nuovo esercizio
            setEserciziSelezionati([...eserciziSelezionati, nuovoEsercizio]);
            toast.success("Esercizio aggiunto!");
        }

        // Resetta i campi
        resetForm();
    };

    // Funzione per modificare un esercizio
    const handleModificaEsercizio = (index) => {
        const esercizio = eserciziSelezionati[index];
        setIdEsercizio(esercizio.idEsercizio);
        setPeso(esercizio.peso);
        setSerie(esercizio.serie);
        setRipetizioni(esercizio.ripetizioni);
        setEditingIndex(index);
    };

    // Funzione per eliminare un esercizio
    const handleEliminaEsercizio = (index) => {
        const nuovaLista = eserciziSelezionati.filter((_, i) => i !== index);
        setEserciziSelezionati(nuovaLista);
        toast.info("Esercizio rimosso");
    };

    // Funzione per salvare la scheda con gli esercizi
    const handleSalvaScheda = () => {
        if (!idScheda) {
            toast.error("Crea prima la scheda!");
            return;
        }

        axios.post("http://localhost:5000/api/schede/aggiungiEsercizio", {
            idScheda,
            esercizi: eserciziSelezionati,
        })
        .then(() => axios.put(`http://localhost:5000/api/richiesta/update/${idRichiesta}`, { stato: "completata" }))
        .then(() => {
            navigate('/gestione-richieste', { state: { message: "Scheda completata con successo!" } });
        })
        .catch(() => toast.error("Errore nel salvataggio degli esercizi"));
    };

    // Funzione per resettare i campi del form
    const resetForm = () => {
        setIdEsercizio('');
        setPeso('');
        setSerie('');
        setRipetizioni('');
        setEditingIndex(null);
    };

    return (
        <div className="crea-scheda-container">
            <NavBar />
            <h2>Creazione Scheda per Utente {idUtente}</h2>

            {/* Se la scheda non è ancora stata creata */}
            {!idScheda ? (
                <div>
                    <label>Data Inizio:</label>
                    <input type="date" value={dataInizio} onChange={(e) => setDataInizio(e.target.value)} />

                    <label>Data Fine:</label>
                    <input type="date" value={dataFine} onChange={(e) => setDataFine(e.target.value)} />

                    <button className="button-crea" onClick={handleCreaScheda}>Crea Scheda</button>
                </div>
            ) : (
                <div>
                    <h3>Aggiungi o Modifica Esercizi</h3>

                    {/* Selezione dell'esercizio */}
                    <label>Seleziona Esercizio:</label>
                    <select value={idEsercizio} onChange={(e) => setIdEsercizio(e.target.value)}>
                        <option value="">-- Seleziona un esercizio --</option>
                        {eserciziDisponibili.map(ex => (
                            <option key={ex.idEsercizio} value={ex.idEsercizio}>
                                {ex.nome}
                            </option>
                        ))}
                    </select>

                    {/* Altri campi dell'esercizio */}
                    <label>Peso:</label>
                    <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} />

                    <label>Serie:</label>
                    <input type="number" value={serie} onChange={(e) => setSerie(e.target.value)} />

                    <label>Ripetizioni:</label>
                    <input type="number" value={ripetizioni} onChange={(e) => setRipetizioni(e.target.value)} />

                    {/* Bottone per aggiungere o modificare un esercizio */}
                    <button className="button-aggiungi" onClick={handleAggiungiOmodificaEsercizio}>
                        {editingIndex !== null ? "Salva Modifica" : "Aggiungi Esercizio"}
                    </button>

                    <h4>Esercizi Selezionati:</h4>
                    <ul className="esercizi-list">
                        {eserciziSelezionati.map((ex, index) => (
                            <li key={index}>
                                {ex.nome} - {ex.peso} kg - {ex.serie} serie - {ex.ripetizioni} ripetizioni
                                <button onClick={() => handleModificaEsercizio(index)}>Modifica</button>
                                <button onClick={() => handleEliminaEsercizio(index)}>Elimina</button>
                            </li>
                        ))}
                    </ul>

                    <button className="button-salva" onClick={handleSalvaScheda}>Salva Scheda</button>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default CreaScheda;
