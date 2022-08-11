import * as TicTacToe from "./index.js";
import readline from "readline";
console.log(`Play tic tac toe!?`);

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readLineAsync = async (message: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    read.question(message, (answer) => {
      resolve(answer);
    });
  });
};

const printBoard = (game: TicTacToe.Game): void => {
  const helper = (thing: any) => (thing == null ? "_" : thing);

  console.log(`Game Board:`);
  const board = game.getBoard();
  console.log(
    `[ ${helper(board[0])} ${helper(board[1])} ${helper(board[2])} ]`
  );
  console.log(
    `[ ${helper(board[3])} ${helper(board[4])} ${helper(board[5])} ]`
  );
  console.log(
    `[ ${helper(board[6])} ${helper(board[7])} ${helper(board[8])} ]`
  );
};

const main = async (): Promise<void> => {
  let input = "whatever";

  const game = new TicTacToe.Game({
    nmg: new TicTacToe.strategies.RandomNextMoveGetter({ min: 0, max: 8 }),
  });

  while (input[0] != "q" && !game.gameOver()) {
    printBoard(game);
    console.log(``);
    console.log(`[q] to quit`);
    console.log(`0-8 to make a move`);
    console.log(``);
    input = await readLineAsync("Make a selection: ");

    if (input == null || input.length <= 0 || input[0] == "q") break;

    console.log(``);
    try {
      game.makeMove(parseInt(input));
      if (!game.gameOver()) {
        let nextMove = null;
        let i = 0;
        for (; i < 25; i++) {
          nextMove = game.getNextMove();
          if (nextMove != null) {
            game.makeMove(nextMove);
            break;
          }
        }

        if (i >= 25) throw "couldnt calculate a next move for opponent ..?!";
      }
    } catch (e) {
      console.log(`got this error: ${e}`);
    }
  }

  console.log(`Game over!?  The winner is: ${game.getWinner()}`);
  printBoard(game);
};

main().finally(() => console.log(`done`));
