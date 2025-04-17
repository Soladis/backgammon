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
  const removePieceById = (array, id) =>
    array.filter((piece) => piece.id !== id);

  // After hit add to reserve
  const handleReturnToReserve = (piece) => {
    setPoints((prevPoints) =>
      prevPoints.map((point) => removePieceById(point, piece.id))
    );

    setReservePieces((prev) => {
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

  // -------------- Main functions --------------
  // Roll dice
  const rollDice = () => {
    if (isDiceRolled && rules?.hasMove(dice1, dice2, moveCounter)) {
      showToast("You still have moves left.");
      return;
    }

    if (isDiceRolled && moveCounter === 0) {
      showToast("You already rolled this turn!");
      return;
    }

    const first = getRandomNumber(6);
    const second = getRandomNumber(6);

    setDice1(diceImages[first - 1]);
    setDice2(diceImages[second - 1]);
    setAvailableDices([first, second]);
    setIsDiceRolled(true);
    setMoveCounter(0); // Reset moves for new turn
    //Check if any move available
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

  // Handle piece movement
  const handlePieceDrop = (targetIndex, piece, from) => {
    // Variables
    let movesLeft;
    let newMoveCount;
    let updatedPoints;
    let hitPiece = null;
    const targetPoint = points[targetIndex];
    const wasHit = rules.isHit(targetPoint, piece);
    const previousPoints = [...points];
    const sourceIndex = previousPoints.findIndex((point) =>
      point.some((p) => p.id === piece.id)
    );

    // If dropped on same point, skip
    if (sourceIndex === targetIndex) {
      return;
    }

    //Check rules and hit
    if (!rules.hasMove(dice1, dice2, moveCounter)) {
      showToast("You don't have any moves left!");
      return;
    }

    if (
      !rules.isMoveAllowed(
        from,
        targetPoint,
        targetIndex,
        piece,
        availableDices,
        turn
      )
    ) {
      showToast("Invalid move under current game rules.");
      return;
    }

    //Remove played numnber from available dices
    const valueToRemove = availableDices.indexOf(Math.abs(targetIndex - from));
    availableDices.splice(valueToRemove, 1);

    //Check if any move available

    //If no available moves left, switch turn
    if (availableDices.length === 0)
      setTurn(turn === "white" ? "black" : "white");

    //Remove piece from prev point, add to target point and update points
    updatedPoints = previousPoints.map((point) =>
      removePieceById(point, piece.id)
    );

    updatedPoints[targetIndex] = [...updatedPoints[targetIndex], piece];

    setPoints(updatedPoints);

    // Handle hit
    if (wasHit) {
      hitPiece = targetPoint[0];
    }
    if (hitPiece) {
      handleReturnToReserve(hitPiece);
    }

    // If piece is coming from reserve
    if (from === "reserve") {
      setReservePieces((prev) => {
        const updated = { ...prev };
        updated[piece.color] = removePieceById(updated[piece.color], piece.id);
        return updated;
      });
    }

    // Check if any move left
    newMoveCount = moveCounter + 1;
    movesLeft = rules.hasMove(dice1, dice2, newMoveCount);

    // Update move counter
    setMoveCounter(newMoveCount);

    // If no more moves, reset dice roll
    if (!movesLeft) {
      setIsDiceRolled(false); // Allow re-rolling next turn
      console.log("Turn over, dice will reset.");
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
        />

        <button className="positioning-button" onClick={positionAllPieces}>
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
