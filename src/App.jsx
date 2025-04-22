import React, { useState, useMemo } from "react";
import Board from "./components/Board";
import PieceReserve from "./components/PieceReserve";
import Dice1 from "./assets/Dice1.png";
import Dice2 from "./assets/Dice2.jpg";
import Dice3 from "./assets/Dice3.jpg";
import Dice4 from "./assets/Dice4.jpg";
import Dice5 from "./assets/Dice5.jpg";
import Dice6 from "./assets/Dice6.jpg";
import ClassicRules from "./rules/ClassicRules";
import Toast from "./components/Toast";
import BrokenPieceReserve from "./components/BrokenPieceReserve";

// Generate the pieces
const generatePieces = (color, count, startId) => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    color,
  }));
};

function App() {
  // -------------- Gamemode selection --------------
  const [gameMode, setGameMode] = useState(null);

  // Set up the game mode and rules once a mode is selected.
  // Also batching on gameMode selection
  const rules = useMemo(() => {
    switch (gameMode) {
      case "classic":
        return new ClassicRules();
      default:
        return null;
    }
  }, [gameMode]);

  // -------------- Variables --------------
  const [reservePieces, setReservePieces] = useState({
    white: generatePieces("white", 15, 1),
    black: generatePieces("black", 15, 16),
  });
  const [brokenReservePieces, setBrokenReservePieces] = useState({
    white: [],
    black: [],
  });
  const [points, setPoints] = useState(Array.from({ length: 24 }, () => []));
  const diceImages = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const [dice1, setDice1] = useState(Dice1);
  const [dice2, setDice2] = useState(Dice2);
  const [availableDices, setAvailableDices] = useState([]);
  const [isDiceRolled, setIsDiceRolled] = useState(false);
  const [moveCounter, setMoveCounter] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [turn, setTurn] = useState();

  // -------------- Helper functions --------------
  // To remove the piece
  const removePieceById = (points, id) =>
    points.filter((piece) => piece.id !== id);

  // After pick add to normal reserve.
  const handleReturnToReserve = (piece, fromPoint) => {
    if (!rules.isAvailableForPickup(availableDices, points, fromPoint, brokenReservePieces, piece)) return false;

    setPoints((prevPoints) =>
      prevPoints.map((point) => removePieceById(point, piece.id))
    );

    setReservePieces((prev) => {
      const updated = { ...prev };
      updated[piece.color] = [...updated[piece.color], piece];
      return updated;
    });

    // Determine correct dice value used for pickup
    const diceValueUsed = piece.color === "white"
      ? 24 - fromPoint
      : fromPoint + 1;

    consumeDiceValue(diceValueUsed);
  };


  // After hit add to broken reserve.
  const handleToBrokenReserve = (piece) => {
    setPoints((prevPoints) =>
      prevPoints.map((point) => removePieceById(point, piece.id))
    );

    setBrokenReservePieces((prev) => {
      const updated = { ...prev };
      updated[piece.color] = [...updated[piece.color], piece];
      return updated;
    });
  };

  //Get random number for dice
  const getRandomNumber = (max) => Math.ceil(Math.random() * max);

  // Show a message for 3 seconds
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Remove used dice
  const consumeDiceValue = (usedValue) => {
    setAvailableDices((prev) => {
      const newDice = [...prev];
      const index = newDice.indexOf(usedValue);
      if (index !== -1) newDice.splice(index, 1);
      return newDice;
    });
  };
  

  // -------------- Main functions --------------
  // Roll dice
  const rollDice = () => {
    // If dice already rolled and moves remain, don't allow reroll
    if (isDiceRolled && availableDices.length > 0) {
      showToast("You still have moves left.");
      return;
    }
  
    // Roll two dice
    const first = getRandomNumber(6);
    const second = getRandomNumber(6);
  
    // Set dice images
    setDice1(diceImages[first - 1]);
    setDice2(diceImages[second - 1]);
  
    // Get dice values depending on double or not
    const newDiceValues = rules.getAvailableDices(first, second);
  
    // Set them immediately
    setAvailableDices(newDiceValues);
  
    // Check for valid moves based on broken pieces
    const canMove = rules.hasMove(newDiceValues, points, brokenReservePieces, turn);
  
    if (!canMove) {
      showToast("You cannot place your broken piece. Switching turns.");
      setIsDiceRolled(false);
      setTurn(turn === "white" ? "black" : "white");
      return;
    }
  
    // If valid, proceed with turn
    setIsDiceRolled(true);
  };
  

  const rollDiceAtStart = () => {
    setTurn(getRandomNumber(2) === 1 ? "white" : "black");
  };

  // Set pieces at the start based on gamemode selection
  const positionAllPieces = () => {
    const allBoardPieces = points.flat();
    const allReservePieces = {
      white: [...reservePieces.white],
      black: [...reservePieces.black],
    };

    allBoardPieces.forEach((piece) => {
      allReservePieces[piece.color].push(piece);
    });

    const newPoints = Array.from({ length: 24 }, () => []);

    newPoints[0] = allReservePieces.white.slice(0, 2);
    newPoints[5] = allReservePieces.black.slice(0, 5);
    newPoints[7] = allReservePieces.black.slice(5, 8);
    newPoints[11] = allReservePieces.white.slice(2, 7);
    newPoints[12] = allReservePieces.black.slice(8, 13);
    newPoints[16] = allReservePieces.white.slice(7, 10);
    newPoints[18] = allReservePieces.white.slice(10, 15);
    newPoints[23] = allReservePieces.black.slice(13, 15);
    setPoints(newPoints);

    setReservePieces({
      white: allReservePieces.white.slice(15),
      black: allReservePieces.black.slice(15),
    });
  };

  const positionAllPiecesTest = () => {
    const allBoardPieces = points.flat();
    const allReservePieces = {
      white: [...reservePieces.white],
      black: [...reservePieces.black],
    };

    allBoardPieces.forEach((piece) => {
      allReservePieces[piece.color].push(piece);
    });

    const newPoints = Array.from({ length: 24 }, () => []);

    newPoints[23] = allReservePieces.white.slice(0, 3);
    newPoints[22] = allReservePieces.white.slice(3, 6);
    newPoints[21] = allReservePieces.white.slice(6, 10);
    newPoints[20] = allReservePieces.white.slice(10, 12);
    newPoints[19] = allReservePieces.white.slice(12, 15);
    setPoints(newPoints);

    setReservePieces({
      white: allReservePieces.white.slice(15),
      black: allReservePieces.black,
    });
    setBrokenReservePieces({
      white: [],
      black: allReservePieces.black.slice(2),
    })
  }

  // Handle piece movement
  const handlePieceDrop = (targetIndex, piece, from) => {
    let updatedPoints;
    let hitPiece = null;
    const targetPoint = points[targetIndex];
    const wasHit = rules.isHit(targetPoint, piece);
    const previousPoints = [...points];

    const sourceIndex = previousPoints.findIndex((point) =>
      point.some((p) => p.id === piece.id)
    );

    if (sourceIndex === targetIndex) return;

    if (brokenReservePieces[piece.color].length !== 0) {
      if (!brokenReservePieces[piece.color].some(item => item.id === piece.id)) {
        showToast("You must place the broken piece first!");
        return;
      }
    }

    console.log(availableDices);
    if (!rules.isMoveAllowed(from, targetPoint, targetIndex, piece, availableDices, turn, brokenReservePieces)) {
      showToast("Invalid move under current game rules.");
      return;
    }

    // Determine correct dice value based on direction and source
    let moveUsed;
    if (from === "brokenReserve") {
      moveUsed = piece.color === "white"
        ? targetIndex + 1
        : 24 - targetIndex;
    } else {
      moveUsed = Math.abs(targetIndex - from);
    }

    consumeDiceValue(moveUsed);

    // If last move, switch turn
    if (availableDices.length === 1) {
      setTurn(turn === "white" ? "black" : "white");
      setIsDiceRolled(false);
    }

    updatedPoints = previousPoints.map((point) =>
      removePieceById(point, piece.id)
    );
    updatedPoints[targetIndex] = [...updatedPoints[targetIndex], piece];
    setPoints(updatedPoints);

    if (wasHit) {
      hitPiece = targetPoint[0];
      if (hitPiece) handleToBrokenReserve(hitPiece);
    }

    if (from === "reserve") {
      setReservePieces((prev) => {
        const updated = { ...prev };
        updated[piece.color] = removePieceById(updated[piece.color], piece.id);
        return updated;
      });
    }

    if (from === "brokenReserve") {
      setBrokenReservePieces((prev) => {
        const updated = { ...prev };
        updated[piece.color] = removePieceById(updated[piece.color], piece.id);
        return updated;
      });
    }
  };


  // -------------- Game mode selection screen --------------
  if (!gameMode) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#2e8b57",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>Select Game Mode</h1>
        <button
          onClick={() => setGameMode("classic")}
          style={{ margin: "10px" }}
        >
          Classic Mode
        </button>
        <button onClick={() => setGameMode("mode2")} style={{ margin: "10px" }}>
          Mode 2
        </button>
        <button onClick={() => setGameMode("mdoe3")} style={{ margin: "10px" }}>
          Mode 3
        </button>
      </div>
    );
  }

  // -------------- Game screen --------------
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#2e8b57",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span>{turn ? `${turn}'s turn` : "Waiting to select starter user"}</span>
      <div
        style={{
          width: "100%",
          height: "50vh",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <PieceReserve
            color="white"
            pieces={reservePieces.white}
            onReturnToReserve={handleReturnToReserve}
          />
          <PieceReserve
            color="black"
            pieces={reservePieces.black}
            onReturnToReserve={handleReturnToReserve}
          />
        </div>

        <Board
          points={points}
          onDropBoard={handlePieceDrop}
          onReturnToReserve={handleReturnToReserve}
          onToBrokenReserve={handleToBrokenReserve}
          brokenReservePieces={brokenReservePieces}
        />

        <button className="positioning-button" onClick={positionAllPieces}>
          Click
        </button>
        <button className="positioning-button" onClick={positionAllPiecesTest}>
          Click
        </button>
      </div>

      {/* Dice Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <img
            src={dice1}
            alt="Dice 1"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "20%",
              border: "2px solid black",
              boxSizing: "border-box",
            }}
          />
          <img
            src={dice2}
            alt="Dice 2"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "20%",
              border: "2px solid black",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          onClick={rollDice}
          style={{ marginTop: "10px", padding: "10px 20px" }}
        >
          Roll Dice
        </button>{" "}
        <button
          onClick={rollDiceAtStart}
          style={{ marginTop: "10px", padding: "10px 20px" }}
        >
          Choose starter user
        </button>
      </div>
      <Toast message={toastMessage} />
    </div>
  );
}

export default App;
