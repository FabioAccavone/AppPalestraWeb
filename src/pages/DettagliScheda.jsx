import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../style/DettagliScheda.css"; // Stili CSS

const DettagliScheda = () => {
  const { idScheda } = useParams();
  const [dettagli, setDettagli] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/schede/dettagliScheda/${idScheda}`)
      .then((response) => setDettagli(response.data))
      .catch((error) =>
        console.error("Errore nel recupero dei dettagli:", error)
      );
  }, [idScheda]);

  if (!dettagli) return <p className="loading">Caricamento in corso...</p>;

  return (
    <div className="dettagli-container">
      <NavBar />
      <h2>Dettagli della Scheda</h2>
      <p className="utente-info">
        <strong>Utente:</strong> {dettagli.nomeUtente} {dettagli.cognomeUtente} - <strong>Peso:</strong> {dettagli.pesoUtente} kg
      </p>
      <p className="pt-info">
        <strong>Personal Trainer:</strong> {dettagli.nomePT} {dettagli.cognomePT}
      </p>
      <p className="date-info">
        <strong>Data Inizio:</strong> {dettagli.dataInizio} - <strong>Data Fine:</strong> {dettagli.dataFine}
      </p>

      <h3>Esercizi</h3>
      <ul className="esercizi-list">
        {dettagli.esercizi.map((esercizio, index) => (
          <li key={index} className="esercizio-card">
            <p className="esercizio-nome">
              <strong>{esercizio.nomeEsercizio}</strong>
            </p>
            <p className="esercizio-info">
              Peso: {esercizio.pesoEsercizio} kg - Serie: {esercizio.serie} - Ripetizioni: {esercizio.ripetizioni}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DettagliScheda;
