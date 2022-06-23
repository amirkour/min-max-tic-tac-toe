import Game from "../Game";
import RandomNextMoveGetter from "../strategies/RandomNextMoveGetter";
import { getTestGame } from "./utils";

describe("Game", () => {
  describe("movesMade property", () => {
    it("inits to 0", () => {
      expect(getTestGame().movesMade).toBe(0);
    });
  });

  describe("board property", () => {
    it("inits to falsey values of correct length", () => {
      const game = getTestGame();
      expect(game.board.length).toBe(game.boardSize);
      expect(game.board[0]).toBeFalsy();
    });
  });

  describe("getNextMove", () => {
    describe("on a non-empty board", () => {
      it("returns valid values", () => {
        const game = new Game(new RandomNextMoveGetter({ min: 0, max: 8 }));
        game.board[0] = `hi`;
        game.board[5] = `bye`;

        const arbitrarilyLarge = 100;
        for (let i = 0; i < arbitrarilyLarge; i++) {
          const nextMove = game.getNextMove();
          expect(game.board[nextMove]).toBeFalsy();
        }
      });
    });
  });
});
