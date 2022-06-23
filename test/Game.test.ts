import Game from "../Game";
import RandomNextMoveGetter from "../strategies/RandomNextMoveGetter";

describe("Game", () => {
  describe("board property", () => {
    it("inits to falsey values of correct length", () => {
      const game = new Game(new RandomNextMoveGetter({ min: 0, max: 8 }));
      expect(game.board.length).toBe(game.boardSize);
      for (let i = 0; i < game.board.length; i++)
        expect(game.board[i]).toBeFalsy();
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
