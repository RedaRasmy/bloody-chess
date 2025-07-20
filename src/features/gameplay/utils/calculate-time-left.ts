
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
      white: Math.max(0, gameState.whiteTimeLeft - timeSinceLastMove),
      black: gameState.blackTimeLeft
    }
  } else {
    return {
      white: gameState.whiteTimeLeft,
      black: Math.max(0, gameState.blackTimeLeft - timeSinceLastMove)
    }
  }
}