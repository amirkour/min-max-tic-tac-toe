import INextMoveGetter from "strategies/INextMoveGetter";

export default class DummyNextMoveGetter implements INextMoveGetter {
  getNextMove(): number {
    return 0;
  }
}
