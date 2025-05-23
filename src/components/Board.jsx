import React from "react";
import Point from "./Point";
import BrokenPieceReserve from "./BrokenPieceReserve";
import "./Board.css";

const Board = ({ points, onDropBoard, onReturnToReserve, onToBrokenReserve, brokenReservePieces }) => {
  return (
    <div className="board">
      {/* Top points left side */}
      {points.slice(0, 6).map((pieces, i) => (
        <div
          key={`top-left-${i}`}
          style={{ gridColumn: i + 1, gridRow: 1, position: "relative" }}
        >
          <Point
            index={i}
            pieces={pieces}
            onDropPoint={onDropBoard}
            onReturnToReserve={onReturnToReserve}
          />
          <div className={`arrow-down ${i % 2 === 0 ? "light" : "dark"}`} />
        </div>
      ))}

      {/* Top points right side */}
      {points.slice(6, 12).map((pieces, i) => (
        <div
          key={`top-right-${i}`}
          style={{ gridColumn: i + 8, gridRow: 1, position: "relative" }}
        >
          <Point
            index={i + 6}
            pieces={pieces}
            onDropPoint={onDropBoard}
            onReturnToReserve={onReturnToReserve}
          />
          <div className={`arrow-down ${(i + 6) % 2 === 0 ? "light" : "dark"}`} />
        </div>
      ))}

      {/* Center bar with broken reserve */}
      <div className="center-bar">
        <div className="broken-reserves">
          <BrokenPieceReserve
            color="white"
            pieces={brokenReservePieces.white}
            onReturnToReserve={onReturnToReserve}
          />
          <BrokenPieceReserve
            color="black"
            pieces={brokenReservePieces.black}
            onReturnToReserve={onReturnToReserve}
          />
        </div>
      </div>

      {/* Bottom points left side */}
      {points.slice(18, 24).reverse().map((pieces, i) => (
        <div
          key={`bottom-left-${i}`}
          style={{ gridColumn: i + 1, gridRow: 2, position: "relative" }}
        >
          <Point
            index={23 - i}
            pieces={pieces}
            onDropPoint={onDropBoard}
            onReturnToReserve={onReturnToReserve}
          />
          <div className={`arrow-up ${(23 - i) % 2 === 0 ? "light" : "dark"}`} />
        </div>
      ))}

      {/* Bottom points right side */}
      {points.slice(12, 18).reverse().map((pieces, i) => (
        <div
          key={`bottom-right-${i}`}
          style={{ gridColumn: i + 8, gridRow: 2, position: "relative" }}
        >
          <Point
            index={17 - i}
            pieces={pieces}
            onDropPoint={onDropBoard}
            onReturnToReserve={onReturnToReserve}
          />
          <div className={`arrow-up ${(17 - i) % 2 === 0 ? "light" : "dark"}`} />
        </div>
      ))}
    </div>
  );
};

export default Board;
