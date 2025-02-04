import React from "react";

const AllenamentoCard = ({ allenamento, handlePrenotazione }) => {
  return (
    <>
      <p className="allenamento-info">
        <strong>Data:</strong> {allenamento.dataAllenamento}
      </p>
      <p className="allenamento-info">
        <strong>Ora:</strong> {allenamento.oraInizio}
      </p>
      <p className="allenamento-info">
        <strong>Posti Disponibili:</strong> {allenamento.numPosti}
      </p>
      <button
        className="btn-prenota"
        onClick={() => handlePrenotazione(allenamento.idAllenamento)}
      >
        Prenota
      </button>
    </>
  );
};

export default AllenamentoCard;

