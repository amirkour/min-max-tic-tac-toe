import INextMoveGetter from "./INextMoveGetter";
export default class NextAvailableMoveGetter implements INextMoveGetter {
  getNextMove(): number {
    return Math.random();
  }
}
