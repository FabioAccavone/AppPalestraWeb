import React from "react";

const PrenotazioneCard = ({ prenotazione, handleEdit, handleDelete }) => {
  return (
    <div className="prenotazione-card">
      <p><strong>Data:</strong> {prenotazione.dataAllenamento}</p>
      <p><strong>Ora:</strong> {prenotazione.oraInizio}</p>
    </div>
  );
};

export default PrenotazioneCard;
