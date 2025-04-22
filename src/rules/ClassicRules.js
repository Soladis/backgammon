export default class ClassicRules {
  #checkDirectionAndAmount(
    fromIndex,
    targetIndex,
    availableDiceValues,
    pieceColor
  ) {
    let distance;
    if (pieceColor === "white") {
      if (fromIndex === "brokenReserve") { fromIndex = -1 };
      distance = targetIndex - Number(fromIndex);
    } else {
      if (fromIndex === "brokenReserve") { fromIndex = 24 };
      distance = Number(fromIndex) - targetIndex;
    }

    if (distance < 0) return false;
    if (!availableDiceValues.includes(distance)) return false;
    return true;
  }

  isMoveAllowed(
    initialPoint,
    targetPoint,
    targetIndex,
    piece,
    availableDiceValues,
    turn,
    brokenReserve
  ) {
    // Check if piece color mathches with turn
    if (piece.color !== turn) return false;
    // Moving forward based on dice check
    if (
      !this.#checkDirectionAndAmount(
        initialPoint,
        targetIndex,
        availableDiceValues,
        piece.color
      )
    )
      return false;

    // No piece -> allowed
    if (targetPoint.length === 0) return true;

    // Same color -> allowed
    const pointColor = targetPoint[0].color;
    if (piece.color === pointColor) return true;

    // Just one opposite color -> allowed
    if (piece.color !== pointColor && targetPoint.length <= 1) return true;

    // Every other situation -> not allowed
    return false;
  }

  isHit(targetPoint, piece) {
    if (targetPoint.length === 0) return false;

    const pointColor = targetPoint[0].color;
    if (piece.color !== pointColor && targetPoint.length === 1) return true;

    return false;
  }

  hasMove(availableDices, points, brokenReserve, turn) {
    // if there are broken pieces, must place them first
    if (brokenReserve[turn].length !== 0) {
      const pointsRange = turn === "white" ? points.slice(0, 6) : points.slice(-6).reverse();
      for(let i = 0; i < pointsRange.length; i++){
        const pointColor = pointsRange[i].length > 0 ? pointsRange[i][0].color : turn;
        if (pointColor === turn && availableDices.some(value => value === i+1)) {
          console.log("No available move.");
          return true;
        }
        return false;
      }
    };

    // check if any value is left to play 
    if (availableDices.length === 0) return false;
    return true;
  }

  getAvailableDices(dice1, dice2) {
    console.log("dice1: ", dice1);
    console.log("dice2: ", dice2);
    const isSame = dice1 === dice2;
    let array = isSame ? new Array(4) : new Array(2);
    isSame ? array.fill(dice1) : array = [dice1, dice2];
    return array;
  }

  isAvailableForPickup(availableDices, points, pickFrom, brokenReserve, piece) {
    const pieceColor = piece.color;
    console.log("available dices: ", availableDices);
    console.log("pick from: ", pickFrom);

    if (brokenReserve[pieceColor].length !== 0) {
      console.log(`${pieceColor} has broken piece!`);
      return false;
    }

    if (!availableDices.includes(pieceColor === "white" ? (24 - pickFrom) : (pickFrom + 1))) {
      return false;
    };

    return true;

    // if (pieceColor === "white") {
    //   if (!availableDices.includes(pickFrom + 1)) {
    //     return false;
    //   };
    // }
    // else if (pieceColor === "black") {
    //   if (!availableDices.includes(24 - pickFrom)) {
    //     return false;
    //   };
    // }
  }

  hasAnyMove(availableDices, points, brokenReserve, turn) {
    
  }
}
