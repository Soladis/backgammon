import React from "react";
import Piece from "./Piece";
import "./PieceReserve.css";

const BrokenPieceReserve = ({ color, pieces, toBrokenReserve }) => {
  return (
    <div
      className="broken-piece-reserve"
    >
      <div className="broken-pieces-stack">
        {pieces.map((piece) => (
          <Piece
            key={piece.id}
            id={piece.id}
            color={piece.color}
            from="brokenReserve"
          />
        ))}
      </div>
      <span className="piece-count">x{pieces.length}</span>
    </div>
  );
};

export default BrokenPieceReserve;
