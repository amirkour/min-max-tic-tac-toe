import { assert } from "console";
import INextMoveGetter from "strategies/INextMoveGetter";
import Game, { PLAYER_X, PLAYER_O } from "../Game";
import RandomNextMoveGetter, { MAX } from "../strategies/RandomNextMoveGetter";

function getTestGame(): Game {
  const nmg: INextMoveGetter = new RandomNextMoveGetter({ min: 0, max: 8 });
  return new Game({ nmg });
}

describe("Game", () => {
  describe("board property", () => {
    it("inits to falsey values of correct length", () => {
      const game = getTestGame();
      expect(game.board.length).toBe(game.boardSize);
      for (let i = 0; i < game.board.length; i++)
        expect(game.board[i]).toBeFalsy();
    });
  });

  describe("getNextMove", () => {
    describe("on a non-empty board", () => {
      it("returns valid values", () => {
        const game = getTestGame();
        game.board[0] = `hi`;
        game.board[5] = `bye`;

        const arbitrarilyLarge = 100;
        for (let i = 0; i < arbitrarilyLarge; i++) {
          const nextMove = game.getNextMove();
          assert(nextMove != null);
          if (nextMove != null) expect(game.board[nextMove]).toBeFalsy();
        }
      });
    });
    describe("for a game thats over", () => {
      it("returns null", () => {
        const game = getTestGame();
        game.winner = "anything - just dont let it be null";
        expect(game.gameOver()).toBe(true);
        expect(game.getNextMove()).toBeNull();
      });
    });
  });

  describe("whosTurn", () => {
    describe("when its Xs turn", () => {
      it("reports next players turn correctly", () => {
        const game = getTestGame();

        // first player is always x
        expect(game.whosTurn()).toBe(PLAYER_X);

        game.board[0] = PLAYER_O;
        expect(game.whosTurn()).toBe(PLAYER_X);
      });
    });

    describe("when its Os turn", () => {
      it("reports next players turn correctly", () => {
        const game = getTestGame();
        game.board[0] = PLAYER_X;
        expect(game.whosTurn()).toBe(PLAYER_O);
      });
    });

    describe("when the game is over", () => {
      it("returns null", () => {
        const game = getTestGame();
        game.winner = "anything - just dont let it be null";
        expect(game.gameOver()).toBe(true);
        expect(game.whosTurn()).toBeNull();
      });
    });
  });
  describe("gameOver", () => {
    it("is false if a winner isnt set", () => {
      const game = getTestGame();
      expect(game.gameOver()).toBe(false);
      expect(game.winner).toBeFalsy();
    });
    it("is true if a winner is set", () => {
      const game = getTestGame();
      game.winner = "whatever - just dont let it be null";
      expect(game.gameOver()).toBe(true);
    });
  });
  describe("makeMove", () => {
    describe("when the game is over", () => {
      it("throws", () => {
        const game = getTestGame();
        game.winner = "anything - just dont let it be null";
        expect(game.gameOver()).toBeTruthy();
        expect(() => {
          game.makeMove(0, PLAYER_X);
        }).toThrowError(/game is over/gi);
      });
    });
    it("throws for invalid indices", () => {
      const game = getTestGame();
      expect(() => {
        game.makeMove(-1, PLAYER_X);
      }).toThrowError(/invalid/gi);

      expect(() => {
        game.makeMove(MAX + 1, PLAYER_X);
      }).toThrowError(/invalid/gi);
    });
    it("throws for invalid player", () => {
      const game = getTestGame();
      expect(() => {
        game.makeMove(0, "foo bar");
      }).toThrowError(/invalid/gi);
    });
    it("barfs if you try to move for the wrong player", () => {
      throw "todo";
    });
    it("sets the winner", () => {
      throw `todo`;
    });
    it("makes the given move when conditions are valid", () => {
      throw `todo`;
    });
  });
});
