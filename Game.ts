import INextMoveGetter from "./strategies/INextMoveGetter";

// the maximum number of times that getNextMove
// should attempt to generate a valid next-move
// before throwing an exception and giving up
export const MAX_TIMES_TO_GENERATE_MOVE = 25;

export const PLAYER_X = `x`;
export const PLAYER_O = `o`;
export const DRAW = `draw`;

interface GameProps {
  nmg: INextMoveGetter;
}

export default class Game {
  nextMoveGetter: INextMoveGetter;
  boardSize: number = 9; // default to 9 for now ... could be configurable later
  board: string[];
  winner: string | null;

  constructor({ nmg }: GameProps) {
    this.nextMoveGetter = nmg;
    this.board = new Array(this.boardSize);
    this.winner = null;
  }

  getNextMove(): number | null {
    if (this.winner) return null;
    let next = this.nextMoveGetter.getNextMove();
    let i = 0;
    for (; i < MAX_TIMES_TO_GENERATE_MOVE && this.board[next]; i++)
      next = this.nextMoveGetter.getNextMove();

    if (i === MAX_TIMES_TO_GENERATE_MOVE)
      throw `Maximum number of attempts to generate a move have been exceeded (${MAX_TIMES_TO_GENERATE_MOVE})`;

    return next;
  }

  // first player will always be X
  whosTurn(): string | null {
    if (this.winner) return null;
    let xCount = 0;
    let yCount = 0;
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === PLAYER_O) yCount++;
      else if (this.board[i] === PLAYER_X) xCount++;
    }

    return xCount <= yCount ? PLAYER_X : PLAYER_O;
  }

  gameOver(): boolean {
    return this.winner != null;
  }

  makeMove(index: number, player: string): undefined {
    if (this.winner) {
      let error = `This game is over!`;
      error +=
        this.winner === DRAW ? ` it was a draw!` : ` ${this.winner} won!`;

      throw error;
    }
    if (index < 0 || index > this.board.length)
      throw `Cannot make a move on space ${index} - invalid index`;
    if (player !== PLAYER_O && player !== PLAYER_X)
      throw `Cannot make a move for player ${player} - invalid player`;

    throw "nope";
  }
}
