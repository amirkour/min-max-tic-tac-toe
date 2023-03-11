import Game from "..";
export default interface INextMoveGetter {
  getNextMove(game: Game): number;
}
