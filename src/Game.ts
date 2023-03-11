import RandomNextMoveGetter from "./strategies/RandomNextMoveGetter";
import INextMoveGetter from "./strategies/INextMoveGetter";
import { PLAYER_X, PLAYER_O, DRAW, MOVE, NON_NULL_MOVE } from "./utils";

interface GameProps {
  nmg?: INextMoveGetter;
  board?: MOVE[] | null;
}

export default class Game {
  protected nextMoveGetter: INextMoveGetter;
  protected boardSize: number = 9; // default to 9 for now ... could be configurable later
  protected board: MOVE[];
  protected winner: typeof PLAYER_X | typeof PLAYER_O | typeof DRAW | null;
  static WINNING_CONFIGS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  static MAX_BOARD_VALUE = 100;

  constructor({ nmg, board }: GameProps) {
    this.nextMoveGetter = nmg || new RandomNextMoveGetter({ min: 0, max: 8 });
    this.board = new Array(this.boardSize);

    if (board) {
      if (board.length !== this.boardSize)
        throw `Can currently only support boards of length ${this.boardSize}`;

      for (let i = 0; i < board.length; i++) {
        let nextSpace = board[i];
        if (!nextSpace) continue;

        nextSpace = nextSpace.toLowerCase() as MOVE;
        if (nextSpace === PLAYER_X) this.board[i] = PLAYER_X;
        else if (nextSpace === PLAYER_O) this.board[i] = PLAYER_O;
        else
          throw `Cannot construct board w/ player ${board[i]} - only player ${PLAYER_X} or player ${PLAYER_O}`;
      }

      // calling this will throw an error if the board passed in
      // has an invalid number/configuration of moves
      this.whosTurn();
    }

    this.winner = this.getWinner();
  }

  public getBoard(): MOVE[] {
    return this.board.map((x) => x);
  }

  getNextMove(): number | null {
    if (this.winner) return null;
    let next = this.nextMoveGetter.getNextMove(this);

    return next;
  }

  // first player will always be X
  whosTurn(): MOVE {
    if (this.winner) return null;
    let xCount = 0;
    let oCount = 0;
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === PLAYER_O) oCount++;
      else if (this.board[i] === PLAYER_X) xCount++;
    }

    // if x always goes first, then X will always be ahead
    // by 1, or tied for number of moves (on a valid board.)
    const diff = xCount - oCount;
    if (diff !== 0 && diff !== 1)
      throw `Invalid board detected: there cannot be ${xCount} '${PLAYER_X}' moves and ${oCount} '${PLAYER_O}' moves on a valid board!`;

    return diff === 0 ? PLAYER_X : PLAYER_O;
  }

  gameOver(): boolean {
    return this.winner != null;
  }

  threeInARow(player: NON_NULL_MOVE): boolean {
    const winningConfig = Game.WINNING_CONFIGS.find(
      (cfg) =>
        this.board[cfg[0]] == this.board[cfg[1]] &&
        this.board[cfg[1]] == this.board[cfg[2]] &&
        this.board[cfg[2]] == player
    );

    return winningConfig != null;
  }

  public getWinner(): typeof PLAYER_X | typeof PLAYER_O | typeof DRAW | null {
    if (this.winner) return this.winner;
    if (this.threeInARow(PLAYER_X)) return PLAYER_X;
    else if (this.threeInARow(PLAYER_O)) return PLAYER_O;

    // if there are more moves available on the board,
    // then there isn't a winner yet
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] == null) return null;
    }

    // all spots are taken and neither player has three in
    // a row - it's a draw!
    return DRAW;
  }

  makeMove(index: number): Game {
    if (this.winner) {
      let error = `This game is over!`;
      error +=
        this.winner === DRAW ? ` it was a draw!` : ` ${this.winner} won!`;

      throw error;
    }
    if (index < 0 || index >= this.board.length)
      throw `Cannot make a move on space ${index} - invalid index`;
    if (this.board[index])
      throw `Cannot make a move on space ${index} - player ${this.board[index]} has taken that spot`;

    this.board[index] = this.whosTurn();
    this.winner = this.getWinner();

    return this;
  }

  /**
   * Evaluate and return the value of all one-way winning opportunities
   * on this game's current board.
   * @returns positive if X has more winning opportutinies,
   *          negative if O has more winning opportunities,
   *          zero if there are equal or non-existing winning opportunities
   *          for either/both players
   */
  oneWayWinValue(): number {
    const twoInARowEvaluators = [
      this.twoInARowValue,
      this.twoInAColumnValue,
      this.twoInADiagonalValue,
    ];

    let value = 0,
      self = this;
    value = twoInARowEvaluators.reduce(
      (total, cb) => total + cb.call(self, PLAYER_X),
      value
    );
    value = twoInARowEvaluators.reduce(
      (total, cb) => total + cb.call(self, PLAYER_O),
      value
    );
    return value;
  }

  twoInARowValue(player: NON_NULL_MOVE): number {
    let value = 0;
    for (let i = 0; i < 3; i++) {
      const row = i * 3;
      if (
        player == this.board[row] &&
        this.board[row] == this.board[row + 1] &&
        this.board[row + 2] == null
      )
        value++;

      if (
        player == this.board[row + 2] &&
        this.board[row + 2] == this.board[row] &&
        this.board[row + 1] == null
      )
        value++;

      if (
        player == this.board[row + 1] &&
        this.board[row + 1] == this.board[row + 2] &&
        this.board[row] == null
      )
        value++;
    }

    return player == PLAYER_X ? value : value * -1;
  }

  twoInAColumnValue(player: NON_NULL_MOVE) {
    let value = 0;
    for (let i = 0; i < 3; i++) {
      let col = i;
      if (
        player == this.board[col] &&
        this.board[col] == this.board[col + 3] &&
        this.board[col + 6] == null
      )
        value++;

      if (
        player == this.board[col + 3] &&
        this.board[col + 3] == this.board[col + 6] &&
        this.board[col] == null
      )
        value++;

      if (
        player == this.board[col] &&
        this.board[col] == this.board[col + 6] &&
        this.board[col + 3] == null
      )
        value++;
    }

    return player == PLAYER_X ? value : value * -1;
  }

  twoInADiagonalValue(player: NON_NULL_MOVE) {
    let value = 0;
    if (
      player == this.board[0] &&
      this.board[0] == this.board[4] &&
      this.board[8] == null
    )
      value++;

    if (
      player == this.board[0] &&
      this.board[0] == this.board[8] &&
      this.board[4] == null
    )
      value++;

    if (
      player == this.board[4] &&
      this.board[4] == this.board[8] &&
      this.board[0] == null
    )
      value++;

    if (
      player == this.board[2] &&
      this.board[2] == this.board[4] &&
      this.board[6] == null
    )
      value++;

    if (
      player == this.board[2] &&
      this.board[2] == this.board[6] &&
      this.board[4] == null
    )
      value++;

    if (
      player == this.board[4] &&
      this.board[4] == this.board[6] &&
      this.board[2] == null
    )
      value++;

    return player == PLAYER_X ? value : value * -1;
  }

  getBoardValue(): number {
    if (this.threeInARow(PLAYER_X)) return Game.MAX_BOARD_VALUE;
    if (this.threeInARow(PLAYER_O)) return Game.MAX_BOARD_VALUE * -1;
    return this.oneWayWinValue();
  }
}
