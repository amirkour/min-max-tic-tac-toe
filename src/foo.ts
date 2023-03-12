import Game, { strategies } from ".";
const { MinMaxNextMoveGetter } = strategies;
import { isDev, MOVE } from "./utils";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function printBoard(board: MOVE[]) {
  console.log(`game state:`);
  console.log(`${board[0] || "-"}${board[1] || "-"}${board[2] || "-"}`);
  console.log(`${board[3] || "-"}${board[4] || "-"}${board[5] || "-"}`);
  console.log(`${board[6] || "-"}${board[7] || "-"}${board[8] || "-"}`);
}

function doStuff(move: number) {
  console.log(`making move ${move}`);
  game.makeMove(move);
  if (game.gameOver()) {
    console.log(`game over: ${game.getWinner()} wins`);
    process.exit(0);
  }

  let computerMove = game.getNextMove();
  if (computerMove == null) {
    console.log(`game over: ${game.getWinner()} wins`);
    process.exit(0);
  } else {
    game.makeMove(computerMove);
  }

  if (game.gameOver()) {
    console.log(`game over: ${game.getWinner()} wins`);
    process.exit(0);
  }
}

function prompt() {
  printBoard(game.getBoard());
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
  }

  prompt();
});

rl.once("close", () => {
  // end of input
  console.log(`end of input`);
});

console.log(`debug mode: ${isDev()}`);
const game = new Game({ nmg: new MinMaxNextMoveGetter({ maxPly: .5 }) });
prompt();
