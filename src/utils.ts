export const PLAYER_X = `x`;
export const PLAYER_O = `o`;
export const DRAW = `draw`;
export type MOVE = typeof PLAYER_X | typeof PLAYER_O | null | undefined;
export type NON_NULL_MOVE = typeof PLAYER_X | typeof PLAYER_O;
