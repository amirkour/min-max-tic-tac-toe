export const PLAYER_X = `x`;
export const PLAYER_O = `o`;
export const DRAW = `draw`;
export type MOVE = typeof PLAYER_X | typeof PLAYER_O | null | undefined;
export type NON_NULL_MOVE = typeof PLAYER_X | typeof PLAYER_O;
export const WINNING_CONFIGS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
export const threeInARow = (board: MOVE[], player: NON_NULL_MOVE): boolean => {
  const winningConfig = WINNING_CONFIGS.find(
    (cfg) =>
      board[cfg[0]] == board[cfg[1]] &&
      board[cfg[1]] == board[cfg[2]] &&
      board[cfg[2]] == player
  );

  return winningConfig != null;
};
export const debugging = process.env.NODE_DEBUGGING === "true";
