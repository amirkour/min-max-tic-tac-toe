import INextMoveGetter from "./strategies/INextMoveGetter";

export default class Game {
  nextMoveGetter: INextMoveGetter;

  constructor(nmg: INextMoveGetter) {
    this.nextMoveGetter = nmg;
  }

  getNextMove(): number {
    return this.nextMoveGetter.getNextMove();
  }
}
