import React from "react";
import Piece from "./Piece";
import "./PieceReserve.css";

const PieceReserve = ({ color, pieces, onReturnToReserve }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("id"));
    const colorFromData = e.dataTransfer.getData("color");
    const from = e.dataTransfer.getData("from");

    if (from !== "reserve" && colorFromData === color && onReturnToReserve) {
      onReturnToReserve({ id, color });
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className="piece-reserve"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="pieces-stack">
        {pieces.map((piece) => (
          <Piece
            key={piece.id}
            id={piece.id}
            color={piece.color}
            from="reserve"
          />
        ))}
      </div>
      <span className="piece-count">x{pieces.length}</span>
    </div>
  );
};

export default PieceReserve;
