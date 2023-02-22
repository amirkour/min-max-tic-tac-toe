import INextMoveGetter from "./INextMoveGetter";
import { MOVE } from "../utils";

interface ConstructorProps {
  min?: number;
  max?: number;
}

export const MAX = 100;
export const MIN = 0;

// the maximum number of times that getNextMove
// should attempt to generate a valid next-move
// before throwing an exception and giving up
export const MAX_TIMES_TO_GENERATE_MOVE = 25;

/**
 * Sometimes, you wanna play a really dumb tic-tac-toe opponent
 * whom makes move completely randomly - the following class will
 * generate such moves, between a min and max that you provide
 * at construction time.
 */
export default class RandomNextMoveGetter implements INextMoveGetter {
  // the smallest (aka "min") random move this class will generate
  min: number;

  // the largest (aka "max") random move this class will generate
  max: number;

  constructor(
    { min = MIN, max = MAX }: ConstructorProps = { min: MIN, max: MAX }
  ) {
    this.min = min >= MIN ? min : MIN;
    this.max = max <= MAX && max > this.min ? max : MAX;

    if (this.min === this.max) this.max++;
  }

  /**
   * @returns a random integer between this.min and this.max, inclusive
   */
  protected generateRandomMove(): number {
    // ripped this logic off from here:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#examples
    return Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
  }

  /**
   * Will make MAX_TIMES_TO_GENERATE_MOVE attempts to generate a random
   * move on the passed-in board.  If all of the randomly generated moves
   * are occupied, this method will simply give up and throw an error.
   *
   * @param board totally ignored - this class relies only on this.min and this.max
   * @returns a number between this.min and this.max that is unoccpied on
   * the passed-in board
   * @throws if no move could be generated in MAX_TIMES_TO_GENERATE_MOVE attempts
   */
  getNextMove(board: MOVE[]): number {
    let i = 0;
    let randomMove = this.generateRandomMove();
    for (; i < MAX_TIMES_TO_GENERATE_MOVE && board[randomMove]; i++)
      randomMove = this.generateRandomMove();

    if (i === MAX_TIMES_TO_GENERATE_MOVE)
      throw `Maximum number of attempts to generate a move have been exceeded (${MAX_TIMES_TO_GENERATE_MOVE})`;

    return randomMove;
  }
}
