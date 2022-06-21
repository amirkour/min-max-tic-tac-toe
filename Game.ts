import INextMoveGetter from "./strategies/INextMoveGetter";

export default class Game {
  nextMoveGetter: INextMoveGetter;
  movesMade: number;

  constructor(nmg: INextMoveGetter) {
    this.nextMoveGetter = nmg;
    this.movesMade = 0;
  }

  getNextMove(): number {
    return this.nextMoveGetter.getNextMove();
  }
}
