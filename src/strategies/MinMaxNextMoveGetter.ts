import { MOVE, NON_NULL_MOVE, PLAYER_O, PLAYER_X } from "../utils";
import INextMoveGetter from "./INextMoveGetter";
import Game from "..";
import { threeInARow } from "../utils";

export default class MinMaxNextMoveGetter implements INextMoveGetter {
  static MAX_BOARD_VALUE = 100;
  protected maxPly: number;
  static DEFAULT_PAX_PLY = 2;
  constructor({ maxPly }: { maxPly?: number } = {}) {
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
    const board = game.getBoard();
    if (curPly >= maxPly)
      return { move: null, value: this.evaluateBoardValue(board) };

    const remainingMoves = this.getAvailableMoves(game.getBoard());
    if (remainingMoves.length <= 0)
      return { move: null, value: this.evaluateBoardValue(board) };

    return { value: 1, move: 2 };
  }

  twoInARowValue(board: MOVE[], player: NON_NULL_MOVE): number {
    let value = 0;
    for (let i = 0; i < 3; i++) {
      const row = i * 3;
      if (
        player == board[row] &&
        board[row] == board[row + 1] &&
        board[row + 2] == null
      )
        value++;

      if (
        player == board[row + 2] &&
        board[row + 2] == board[row] &&
        board[row + 1] == null
      )
        value++;

      if (
        player == board[row + 1] &&
        board[row + 1] == board[row + 2] &&
        board[row] == null
      )
        value++;
    }

    return player == PLAYER_X ? value : value * -1;
  }

  twoInAColumnValue(board: MOVE[], player: NON_NULL_MOVE) {
    let value = 0;
    for (let i = 0; i < 3; i++) {
      let col = i;
      if (
        player == board[col] &&
        board[col] == board[col + 3] &&
        board[col + 6] == null
      )
        value++;

      if (
        player == board[col + 3] &&
        board[col + 3] == board[col + 6] &&
        board[col] == null
      )
        value++;

      if (
        player == board[col] &&
        board[col] == board[col + 6] &&
        board[col + 3] == null
      )
        value++;
    }

    return player == PLAYER_X ? value : value * -1;
  }

  twoInADiagonalValue(board: MOVE[], player: NON_NULL_MOVE) {
    let value = 0;
    if (player == board[0] && board[0] == board[4] && board[8] == null) value++;
    if (player == board[0] && board[0] == board[8] && board[4] == null) value++;
    if (player == board[4] && board[4] == board[8] && board[0] == null) value++;
    if (player == board[2] && board[2] == board[4] && board[6] == null) value++;
    if (player == board[2] && board[2] == board[6] && board[4] == null) value++;
    if (player == board[4] && board[4] == board[6] && board[2] == null) value++;

    return player == PLAYER_X ? value : value * -1;
  }

  evaluateBoardValue(board: MOVE[]): number {
    if (threeInARow(board, PLAYER_X))
      return MinMaxNextMoveGetter.MAX_BOARD_VALUE;
    if (threeInARow(board, PLAYER_O))
      return MinMaxNextMoveGetter.MAX_BOARD_VALUE * -1;
    return this.oneWayWinValue(board);
  }

  /**
   * Evaluate and return the value of all one-way winning opportunities
   * on the given board
   * @returns positive if X has more winning opportutinies,
   *          negative if O has more winning opportunities,
   *          zero if there are equal or non-existing winning opportunities
   *          for either/both players
   */
  oneWayWinValue(board: MOVE[]): number {
    const twoInARowEvaluators = [
      this.twoInARowValue,
      this.twoInAColumnValue,
      this.twoInADiagonalValue,
    ];

    let value = 0,
      self = this;
    value = twoInARowEvaluators.reduce(
      (runningTotal, evaluator) => runningTotal + evaluator.call(self, board, PLAYER_X),
      value
    );
    value = twoInARowEvaluators.reduce(
      (runningTotal, evaluator) => runningTotal + evaluator.call(self, board, PLAYER_O),
      value
    );
    return value;
  }
}
