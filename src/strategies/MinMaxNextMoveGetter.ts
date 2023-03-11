import { MOVE, NON_NULL_MOVE, PLAYER_O } from "../utils";
import INextMoveGetter from "./INextMoveGetter";

export default class MinMaxNextMoveGetter implements INextMoveGetter {
  protected maxPly: number;
  static DEFAULT_PAX_PLY = 2;
  constructor({ maxPly }: { maxPly?: number }) {
    this.maxPly = maxPly || MinMaxNextMoveGetter.DEFAULT_PAX_PLY;
  }
  getNextMove(board: MOVE[]): number {
    return 0;
  }

  getAvailableMoves(board: MOVE[]): number[] {
    const moves: number[] = [];
    board.forEach((move, i) => {
      if (move == null) moves.push(i);
    });
    return moves;
  }

  recursiveMinMax(
    board: MOVE[],
    maxPly: number,
    curPly: number,
    maximize: boolean
  ): { value: number; player: NON_NULL_MOVE; move: number } {

    // if(curPly >= maxPly)


    return { value: 1, player: PLAYER_O, move: 2 };
  }
}
