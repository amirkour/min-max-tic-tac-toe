import { MOVE } from "../utils";
export default interface INextMoveGetter {
  getNextMove(board: MOVE[]): number;
}
