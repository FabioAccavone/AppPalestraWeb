import React from "react";

const PrenotazioneCard = ({ prenotazione, handleEdit, handleDelete }) => {
  return (
    <div className="prenotazione-card">
      <p><strong>Data:</strong> {prenotazione.dataAllenamento}</p>
      <p><strong>Ora:</strong> {prenotazione.oraInizio}</p>

        <div className="button-container">
          <button className="btn-edit" onClick={() => handleEdit(prenotazione.idPrenotazione)}>Modifica</button>
          <button className="btn-delete" onClick={() => handleDelete(prenotazione.idPrenotazione)}>Cancella</button>
        </div>
    </div>
  );
};

export default PrenotazioneCard;
