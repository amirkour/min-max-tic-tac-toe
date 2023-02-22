import RandomNextMoveGetter from "./strategies/RandomNextMoveGetter";
import INextMoveGetter from "./strategies/INextMoveGetter";
import { PLAYER_X, PLAYER_O, DRAW, MOVE } from "./utils";

interface GameProps {
  nmg?: INextMoveGetter;
  board?: MOVE[] | null;
}

export default class Game {
  protected nextMoveGetter: INextMoveGetter;
  protected boardSize: number = 9; // default to 9 for now ... could be configurable later
  protected board: MOVE[];
  protected winner: typeof PLAYER_X | typeof PLAYER_O | typeof DRAW | null;

  constructor({ nmg, board }: GameProps) {
    this.nextMoveGetter = nmg || new RandomNextMoveGetter({ min: 0, max: 8 });
    this.board = new Array(this.boardSize);

    if (board) {
      if (board.length !== this.boardSize)
        throw `Can currently only support boards of length ${board.length}`;

      for (let i = 0; i < board.length; i++) {
        let nextSpace = board[i];
        if (!nextSpace) continue;

        nextSpace = nextSpace.toLowerCase() as MOVE
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
    let next = this.nextMoveGetter.getNextMove(this.board);
    
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

  protected columnWin(
    player: typeof PLAYER_X | typeof PLAYER_O,
    index: number
  ): boolean {
    if (index < 0 || index > 2) return false;

    let isWin = false;
    switch (index) {
      case 0:
        isWin =
          this.board[0] === this.board[3] &&
          this.board[3] === this.board[6] &&
          this.board[6] === player;
        break;
      case 1:
        isWin =
          this.board[1] === this.board[4] &&
          this.board[4] === this.board[7] &&
          this.board[7] === player;
        break;
      case 2:
        isWin =
          this.board[2] === this.board[5] &&
          this.board[5] === this.board[8] &&
          this.board[8] === player;
        break;
      default:
        isWin = false;
        break;
    }

    return isWin;
  }

  protected rowWin(
    player: typeof PLAYER_X | typeof PLAYER_O,
    index: number
  ): boolean {
    if (index < 0 || index > 2) return false;

    let isWin = false;
    switch (index) {
      case 0:
        isWin =
          this.board[0] === this.board[1] &&
          this.board[1] === this.board[2] &&
          this.board[2] === player;
        break;
      case 1:
        isWin =
          this.board[3] === this.board[4] &&
          this.board[4] === this.board[5] &&
          this.board[5] === player;
        break;
      case 2:
        isWin =
          this.board[6] === this.board[7] &&
          this.board[7] === this.board[8] &&
          this.board[8] === player;
        break;
      default:
        isWin = false;
        break;
    }

    return isWin;
  }

  protected diagonalWin(player: typeof PLAYER_O | typeof PLAYER_X): boolean {
    return (
      (this.board[0] === this.board[4] &&
        this.board[4] === this.board[8] &&
        this.board[8] === player) ||
      (this.board[2] === this.board[4] &&
        this.board[4] === this.board[6] &&
        this.board[6] === player)
    );
  }

  protected threeInARow(player: typeof PLAYER_X | typeof PLAYER_O): boolean {
    for (let i = 0; i < 3; i++) {
      if (this.columnWin(player, i) || this.rowWin(player, i)) return true;
    }

    return this.diagonalWin(player);
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
}
