
export const calculateTimeLeft = (
  gameState: {
    whiteTimeLeft: number
    blackTimeLeft: number
    currentTurn: 'w' | 'b'
    lastMoveAt: Date
  }
) => {
  const now = Date.now()
  const timeSinceLastMove = now - gameState.lastMoveAt.getTime()
  
  if (gameState.currentTurn === 'w') {
    return {
      whiteTimeLeft: Math.max(0, gameState.whiteTimeLeft - timeSinceLastMove),
      blackTimeLeft: gameState.blackTimeLeft
    }
  } else {
    return {
      whiteTimeLeft: gameState.whiteTimeLeft,
      blackTimeLeft: Math.max(0, gameState.blackTimeLeft - timeSinceLastMove)
    }
  }
}