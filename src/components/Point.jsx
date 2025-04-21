import React from "react";
import Piece from "./Piece";
import "./Point.css";

const Point = ({ index, pieces, onDropPoint, onReturnToReserve }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("id"));
    const color = e.dataTransfer.getData("color");
    const from = e.dataTransfer.getData("from");
    if (!id || !color) return;
    const piece = { id, color };
    onDropPoint(index, piece, from);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRightClick = (e, piece) => {
    e.preventDefault();
    console.log(e.dataTransfer)
    onReturnToReserve(piece, index);
  };

  return (
    <div
      className={`point ${index < 12 ?
        "top" : "bottom"}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="pieces">
        {pieces.map((piece) => (
          <Piece
            key={piece.id}
            id={piece.id}
            color={piece.color}
            from={index}
            onRightClick={(e) => handleRightClick(e, piece)}
          />
        ))}
      </div>
      {/* <span>{index}</span> */}
    </div>
  );
};

export default Point;
