import { MOVE, NON_NULL_MOVE, PLAYER_O, PLAYER_X } from "../utils";
import INextMoveGetter from "./INextMoveGetter";
import Game from "..";
import { threeInARow, debugging } from "../utils";

export default class MinMaxNextMoveGetter implements INextMoveGetter {
  static MAX_BOARD_VALUE = 100;
  protected maxPly: number;
  static DEFAULT_MAX_PLY = 2;
  constructor({ maxPly }: { maxPly?: number } = {}) {
    this.maxPly = maxPly || MinMaxNextMoveGetter.DEFAULT_MAX_PLY;
  }

  private debug(str: string, ply: number = 0) {
    if (!debugging) return;

    let spaces = "";
    for (let i = 0; i < ply; i += 0.5) spaces = `${spaces} `;
    console.log(`${spaces}${str}`);
  }

  getNextMove(game: Game): number {
    const whosTurn = game.whosTurn();
    if (!whosTurn)
      throw `min-max nmg can't resolve next move: no more turns left in this game`;

    this.debug(`min-max algorithm starting for player ${whosTurn}`);
    const { value, move } = this.recursiveMinMax(
      game.getBoard(),
      this.maxPly,
      0,
      whosTurn,
      whosTurn == PLAYER_X
    );

    this.debug(
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
    for (let i = 0; i < board.length; i++) {
      if (board[i] == null) moves.push(i);
    }

    return moves;
  }

  recursiveMinMax(
    board: MOVE[],
    maxPly: number,
    curPly: number,
    nextPlayerToMove: NON_NULL_MOVE,
    maximize: boolean
  ): { value: number | null; move: number | null } {
    this.debug(
      `recursive call ${JSON.stringify({
        board,
        maxPly,
        curPly,
        nextPlayerToMove,
        maximize,
      })}`,
      curPly
    );

    if (threeInARow(board, PLAYER_X) || threeInARow(board, PLAYER_O)) {
      const boardValue = this.evaluateBoardValue(board);
      this.debug(
        `three in a row detected - returning value ${boardValue}`,
        curPly
      );
      return { move: null, value: boardValue };
    }

    if (curPly >= maxPly) {
      const boardValue = this.evaluateBoardValue(board);
      this.debug(`curPly >= maxPly - value is ${boardValue}`, curPly);
      return { move: null, value: boardValue };
    }

    const remainingMoves = this.getAvailableMoves(board);
    this.debug(`remaining moves: ${remainingMoves}`, curPly);
    if (remainingMoves.length <= 0) {
      const boardValue = this.evaluateBoardValue(board);
      this.debug(`no moves left - value is ${boardValue}`, curPly);
      return { move: null, value: boardValue };
    }

    let value: number | null = null,
      move: number | null = null;
    for (let i = 0; i < remainingMoves.length; i++) {
      const nextMove = remainingMoves[i];
      this.debug(`making move: ${nextPlayerToMove} takes ${nextMove}`, curPly);

      board[nextMove] = nextPlayerToMove;
      const { value: nextValue } = this.recursiveMinMax(
        board,
        maxPly,
        curPly + 0.5,
        nextPlayerToMove == PLAYER_X ? PLAYER_O : PLAYER_X,
        maximize
      );

      if (nextValue == null) {
        this.debug(`got a null nextValue from recursive call ... 🤔`, curPly);
        board[nextMove] = null;
        continue;
      }

      if (maximize) {
        if (value == null || nextValue > value) {
          value = nextValue;
          move = nextMove;
        }
      } else {
        if (value == null || nextValue < value) {
          value = nextValue;
          move = nextMove;
        }
      }
      board[nextMove] = null;
    }

    return { value, move };
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

  twoInARowBlockedValue(board: MOVE[], player: NON_NULL_MOVE): number {
    let value = 0;
    const opponent = player == PLAYER_X ? PLAYER_O : PLAYER_X;
    for (let i = 0; i < 3; i++) {
      const row = i * 3;
      if (
        player == board[row] &&
        board[row] == board[row + 1] &&
        board[row + 2] == opponent
      )
        value++;

      if (
        player == board[row + 2] &&
        board[row + 2] == board[row] &&
        board[row + 1] == opponent
      )
        value++;

      if (
        player == board[row + 1] &&
        board[row + 1] == board[row + 2] &&
        board[row] == opponent
      )
        value++;
    }

    return player == PLAYER_X ? value * -1 : value;
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

  twoInAColumnBlockedValue(board: MOVE[], player: NON_NULL_MOVE) {
    let value = 0;
    const opponent = player == PLAYER_X ? PLAYER_O : PLAYER_X;
    for (let i = 0; i < 3; i++) {
      let col = i;
      if (
        player == board[col] &&
        board[col] == board[col + 3] &&
        board[col + 6] == opponent
      )
        value++;

      if (
        player == board[col + 3] &&
        board[col + 3] == board[col + 6] &&
        board[col] == opponent
      )
        value++;

      if (
        player == board[col] &&
        board[col] == board[col + 6] &&
        board[col + 3] == opponent
      )
        value++;
    }

    return player == PLAYER_X ? value * -1 : value;
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

  twoInADiagonalBlockedValue(board: MOVE[], player: NON_NULL_MOVE) {
    let value = 0;
    const opponent = player == PLAYER_X ? PLAYER_O : PLAYER_X;
    if (player == board[0] && board[0] == board[4] && board[8] == opponent)
      value++;
    if (player == board[0] && board[0] == board[8] && board[4] == opponent)
      value++;
    if (player == board[4] && board[4] == board[8] && board[0] == opponent)
      value++;
    if (player == board[2] && board[2] == board[4] && board[6] == opponent)
      value++;
    if (player == board[2] && board[2] == board[6] && board[4] == opponent)
      value++;
    if (player == board[4] && board[4] == board[6] && board[2] == opponent)
      value++;

    return player == PLAYER_X ? value * -1 : value;
  }

  evaluateBoardValue(board: MOVE[]): number {
    if (threeInARow(board, PLAYER_X))
      return MinMaxNextMoveGetter.MAX_BOARD_VALUE;
    if (threeInARow(board, PLAYER_O))
      return MinMaxNextMoveGetter.MAX_BOARD_VALUE * -1;

    return this.oneWayWinValue(board) + this.oneWayWinBlockedValue(board);
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
      (runningTotal, evaluator) =>
        runningTotal + evaluator.call(self, board, PLAYER_X),
      value
    );
    value = twoInARowEvaluators.reduce(
      (runningTotal, evaluator) =>
        runningTotal + evaluator.call(self, board, PLAYER_O),
      value
    );

    return value;
  }

  /**
   * Evaluate and return the value of every blocked winning opportunity.
   *
   * X is trying to maximize value, so any blocked win for X should return
   * negative value (because that board would be worth LESS to X.)
   *
   * O is trying to minimize value, so any blocked win for O should return
   * positive value (because that board would be more positive, which is NOT what
   * O wants!)
   * @returns negative if X has more blocked wins
   *          positive if O has more blocked wins
   *          zero if there are equal or non-existing blocked wins
   */
  oneWayWinBlockedValue(board: MOVE[]): number {
    const winBlockedEvaluators = [
      this.twoInARowBlockedValue,
      this.twoInAColumnBlockedValue,
      this.twoInADiagonalBlockedValue,
    ];

    let value = 0,
      self = this;
    value = winBlockedEvaluators.reduce(
      (runningTotal, evaluator) =>
        runningTotal + evaluator.call(self, board, PLAYER_X),
      value
    );
    value = winBlockedEvaluators.reduce(
      (runningTotal, evaluator) =>
        runningTotal + evaluator.call(self, board, PLAYER_O),
      value
    );

    return value * 2;
  }
}
