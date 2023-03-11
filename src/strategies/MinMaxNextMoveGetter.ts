import { MOVE, NON_NULL_MOVE, PLAYER_O, PLAYER_X } from "../utils";
import INextMoveGetter from "./INextMoveGetter";
import Game from "..";

export default class MinMaxNextMoveGetter implements INextMoveGetter {
  protected maxPly: number;
  static DEFAULT_PAX_PLY = 2;
  constructor({ maxPly }: { maxPly?: number }) {
    this.maxPly = maxPly || MinMaxNextMoveGetter.DEFAULT_PAX_PLY;
  }
  getNextMove(game: Game): number {
    const whosTurn = game.whosTurn();
    if (!whosTurn)
      throw `min-max nmg can't resolve next move: no more turns left in this game`;

    console.log(`min-max algorithm starting for player ${whosTurn}`);
    const { value, move } = this.recursiveMinMax(
      game,
      this.maxPly,
      0,
      whosTurn == PLAYER_X
    );

    console.log(
      `min-max algorithm results: ${JSON.stringify({
        ...{ value, move },
        ...{ player: whosTurn },
      })}`
    );

    // NOTE - move is only null at a leaf in the min-max tree ...
    //      - don't think that'll ever happen in this implementation
    if (move == null)
      throw `min-max nmg can't resolve next move: calculated a null move ..?`;

    return move;
  }

  getAvailableMoves(board: MOVE[]): number[] {
    const moves: number[] = [];
    board.forEach((move, i) => {
      if (move == null) moves.push(i);
    });
    return moves;
  }

  recursiveMinMax(
    game: Game,
    maxPly: number,
    curPly: number,
    maximize: boolean
  ): { value: number; move: number | null } {
    if (curPly >= maxPly) return { move: null, value: game.getBoardValue() };

    const remainingMoves = this.getAvailableMoves(game.getBoard());
    if (remainingMoves.length <= 0)
      return { move: null, value: game.getBoardValue() };
    
    

    return { value: 1, move: 2 };
  }
}
