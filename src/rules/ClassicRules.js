export default class ClassicRules {
  #checkDirectionAndAmount(
    fromIndex,
    targetIndex,
    availableDiceValues,
    pieceColor
  ) {
    console.log(pieceColor);
    let distance;
    if (pieceColor === "white") {
      distance = targetIndex - fromIndex;
    } else {
      distance = fromIndex - targetIndex;
    }
    console.log(availableDiceValues.includes(distance));
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
    turn
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

  hasMove(dice1, dice2, moveCount) {
    const allowedMoveCount = dice1 === dice2 ? 4 : 2;
    if (moveCount < allowedMoveCount) return true;
    return false;
  }
}
