import INextMoveGetter from "../src/strategies/INextMoveGetter";

export default class DummyNextMoveGetter implements INextMoveGetter {
  getNextMove(): number {
    return 0;
  }
}
