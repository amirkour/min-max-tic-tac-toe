import { Game } from "./index.js";
import RandomNextMoveGetter from "./strategies/RandomNextMoveGetter.js";

console.log(`hi world`);
const game = new Game(new RandomNextMoveGetter());
console.log(`got this: ${game.getNextMove()}`);
console.log(`got this: ${game.getNextMove()}`);
console.log(`got this: ${game.getNextMove()}`);
