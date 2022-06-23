import INextMoveGetter from "./INextMoveGetter";

interface MaxConstructorProps {
  min: number;
  max: number;
}

export const MAX = 100;
export const MIN = 0;
export default class RandomNextMoveGetter implements INextMoveGetter {
  min: number = MIN;
  max: number = MAX;

  constructor(
    { min = MIN, max = MAX }: MaxConstructorProps = { min: MIN, max: MAX }
  ) {
    this.min = min >= MIN ? min : MIN;
    this.max = max <= MAX && max > this.min ? max : MAX;

    if (this.min === this.max) this.max++;
  }
  getNextMove(): number {
    // ripped this logic off from here:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#examples
    return Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
  }
}
