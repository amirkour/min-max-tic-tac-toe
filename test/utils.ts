import DummyNextMoveGetter from "./DummyNextMoveGetter";
import Game from "../Game";

export function getTestGame() {
  return new Game(new DummyNextMoveGetter());
}
