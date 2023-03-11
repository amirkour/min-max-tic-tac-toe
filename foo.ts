import Game, { strategies } from "./src";
const { MinMaxNextMoveGetter } = strategies;
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function doStuff(move: number) {
  console.log(`making move ${move}`);
  game.makeMove(move);

  let computerMove = game.getNextMove();
  if (computerMove == null) {
    console.log(`game is over!?`);
  } else {
    game.makeMove(computerMove);
  }

  console.log(`got this game: ${game.getBoard()}`);
}

const game = new Game({ nmg: new MinMaxNextMoveGetter({ maxPly: 4 }) });
prompt();

function prompt() {
  console.log(`\n`);
  console.log(`enter a move: `);
}

rl.on("line", (line) => {
  if (game.gameOver()) {
    console.log(`game is over!?`);
    console.log(`the winner is ${game.getWinner()}`);
    process.exit(0);
  }

  const input = parseInt(line);
  if (isNaN(input)) {
    console.log(`NAN!`);
    prompt();
  } else {
    doStuff(input);
    
    prompt();
  }

  prompt();
});

rl.once("close", () => {
  // end of input
  console.log(`end of input`);
});
