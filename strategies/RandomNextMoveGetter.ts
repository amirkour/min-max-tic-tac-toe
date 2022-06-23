import INextMoveGetter from "./INextMoveGetter";
export default class RandomNextMoveGetter implements INextMoveGetter {
  getNextMove(): number {
    return Math.ceil(Math.random() * 100);
  }
}
