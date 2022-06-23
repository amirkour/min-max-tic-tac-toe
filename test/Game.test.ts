import Game, { PLAYER_X, PLAYER_O } from "../Game";
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

  describe("whosTurn", () => {
    describe("when its Xs turn", () => {
      it("reports next players turn correctly", () => {
        const game = new Game(new RandomNextMoveGetter({ min: 0, max: 8 }));

        // first player is always x
        expect(game.whosTurn()).toBe(PLAYER_X);

        game.board[0] = PLAYER_O;
        expect(game.whosTurn()).toBe(PLAYER_X);
      });
    });

    describe("when its Os turn", () => {
      it("reports next players turn correctly", () => {
        const game = new Game(new RandomNextMoveGetter({ min: 0, max: 8 }));
        game.board[0] = PLAYER_X;
        expect(game.whosTurn()).toBe(PLAYER_O);
      });
    });

    describe("when the game is over", () => {
      it("returns null", () => {
        const game = new Game(new RandomNextMoveGetter({ min: 0, max: 8 }));
        game.winner = "anything - just dont let it be null";
        expect(game.gameOver()).toBe(true);
        expect(game.whosTurn()).toBeNull();
      });
    });
  });
  describe("gameOver", () => {
    it("is false if a winner isnt set", () => {
      const game = new Game(new RandomNextMoveGetter({ min: 0, max: 8 }));
      expect(game.gameOver()).toBe(false);
      expect(game.winner).toBeFalsy();
    });
    it("is true if a winner is set", () => {
      const game = new Game(new RandomNextMoveGetter({ min: 0, max: 8 }));
      game.winner = "whatever - just dont let it be null";
      expect(game.gameOver()).toBe(true);
    });
  });
});
