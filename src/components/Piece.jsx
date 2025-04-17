import React from "react";
import "./Piece.css";

const Piece = ({ id, color, from, onDragStart, onRightClick }) => {
  const handleDragStart = (e) => {
    console.log(from);
    e.dataTransfer.setData("id", id.toString());
    e.dataTransfer.setData("color", color);
    e.dataTransfer.setData("from", from);
    if (onDragStart) onDragStart(e);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (onRightClick) onRightClick(e);
  };

  return (
    <div
      className={`piece ${color}`}
      draggable
      data-from="board"
      onDragStart={handleDragStart}
      onContextMenu={handleContextMenu}
    />
  );
};

export default Piece;