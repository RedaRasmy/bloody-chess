// import { Modifier } from '@dnd-kit/core'

// export const restrictToChessBoard: Modifier = ({ activeNodeRect, containerNodeRect , transform}) => {
//   if (!containerNodeRect || !activeNodeRect) return transform;

//   const maxX = containerNodeRect.width - activeNodeRect.width;
//   const maxY = containerNodeRect.height - activeNodeRect.height;


//   return {
//     ...transform,
//     x: Math.min(Math.max(0, transform.x), maxX),
//     y: Math.min(Math.max(0, transform.y), maxY)
//   };
// };
