import INextMoveGetter from "./strategies/INextMoveGetter";

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
    return this.nextMoveGetter.getNextMove();
  }
}
