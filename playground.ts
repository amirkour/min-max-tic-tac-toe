import { Game } from "./index.js";
import NextAvailableMoveGetter from "./strategies/NextAvailableMoveGetter.js";

console.log(`hi world`);
const game = new Game(new NextAvailableMoveGetter());
console.log(`got this: ${game.getNextMove()}`);
console.log(`got this: ${game.getNextMove()}`);
console.log(`got this: ${game.getNextMove()}`);
