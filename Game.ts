import INextMoveGetter from "./strategies/INextMoveGetter";

// the maximum number of times that getNextMove
// should attempt to generate a valid next-move
// before throwing an exception and giving up
export const MAX_TIMES_TO_GENERATE_MOVE = 25;

export default class Game {
  nextMoveGetter: INextMoveGetter;
  movesMade: number;
  boardSize: number = 9; // default to 9 for now ... could be configurable later
  board: string[];

  constructor(nmg: INextMoveGetter) {
    this.nextMoveGetter = nmg;
    this.movesMade = 0;
    this.board = new Array(this.boardSize);
  }

  getNextMove(): number {
    let next = this.nextMoveGetter.getNextMove();
    let i = 0;
    for (; i < MAX_TIMES_TO_GENERATE_MOVE && this.board[next]; i++)
      next = this.nextMoveGetter.getNextMove();

    if (i === MAX_TIMES_TO_GENERATE_MOVE)
      throw `Maximum number of attempts to generate a move have been exceeded (${MAX_TIMES_TO_GENERATE_MOVE})`;

    return next;
  }
}
