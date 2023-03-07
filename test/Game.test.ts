import INextMoveGetter from "../src/strategies/INextMoveGetter";
import Game, { PLAYER_X, PLAYER_O, DRAW, MOVE, strategies } from "../src";
const { RandomNextMoveGetter, MAX } = strategies;

function getTestGame(): Game {
  const nmg: INextMoveGetter = new RandomNextMoveGetter({ min: 0, max: 8 });
  return new Game({ nmg });
}

function getTestGameWithWinner(
  winner: typeof PLAYER_O | typeof PLAYER_X
): Game {
  if (winner === PLAYER_X) {
    return getTestGame()
      .makeMove(0)
      .makeMove(1)
      .makeMove(3)
      .makeMove(4)
      .makeMove(6);
  } else {
    return getTestGame()
      .makeMove(0)
      .makeMove(1)
      .makeMove(3)
      .makeMove(4)
      .makeMove(5)
      .makeMove(7);
  }
}

function getTestGameWithDraw(): Game {
  return getTestGame()
    .makeMove(0)
    .makeMove(4)
    .makeMove(8)
    .makeMove(5)
    .makeMove(3)
    .makeMove(6)
    .makeMove(2)
    .makeMove(1)
    .makeMove(7);
}

describe("Game", () => {
  describe("getBoard()", () => {
    it("inits to falsey values of correct length", () => {
      const game = getTestGame();
      const board = game.getBoard();
      for (let i = 0; i < board.length; i++) expect(board[i]).toBeFalsy();
    });

    // i'm putting this one here cuz if the board size changes,
    // a lot of the logic and tests are gonna be broken, so i wanna
    // know about it
    it("has length 9", () => {
      expect(getTestGame().getBoard().length).toBe(9);
    });
  });

  describe("getNextMove()", () => {
    describe("on a non-empty board", () => {
      it("returns valid values", () => {
        const game = getTestGame();
        game.makeMove(0).makeMove(5);
        const board = game.getBoard();
        const arbitrarilyLarge = 100;
        for (let i = 0; i < arbitrarilyLarge; i++) {
          const nextMove = game.getNextMove();
          if (nextMove != null) expect(board[nextMove]).toBeFalsy();
        }
      });
    });
    describe("for a game with a winner", () => {
      it("returns null", () => {
        expect(getTestGameWithWinner(PLAYER_X).getNextMove()).toBeNull();
        expect(getTestGameWithWinner(PLAYER_O).getNextMove()).toBeNull();
      });
    });
    describe("for a game w/ a tie", () => {
      it("returns null", () => {
        expect(getTestGameWithDraw().getNextMove()).toBeNull();
      });
    });
  });

  describe("whosTurn()", () => {
    it("reports next players turn correctly", () => {
      const game = getTestGame();

      // first player is always x
      expect(game.whosTurn()).toBe(PLAYER_X);

      game.makeMove(0);
      expect(game.whosTurn()).toBe(PLAYER_O);
    });

    describe("when the game has a winner", () => {
      it("returns null", () => {
        expect(getTestGameWithWinner(PLAYER_O).whosTurn()).toBeNull();
        expect(getTestGameWithWinner(PLAYER_X).whosTurn()).toBeNull();
      });
    });
    describe("when the game has a draw", () => {
      it("returns null", () => {
        expect(getTestGameWithDraw().whosTurn()).toBeNull();
      });
    });
  });

  describe("gameOver()", () => {
    it("is false at init time", () => {
      expect(getTestGame().gameOver()).toBe(false);
    });
    it("is true if there's a winner", () => {
      expect(getTestGameWithWinner(PLAYER_X).gameOver()).toBe(true);
      expect(getTestGameWithWinner(PLAYER_O).gameOver()).toBe(true);
    });
    it("is true if there's a draw", () => {
      expect(getTestGameWithDraw().gameOver()).toBe(true);
    });
  });

  describe("makeMove()", () => {
    it("throws when the game has a winner", () => {
      expect(() => {
        getTestGameWithWinner(PLAYER_X).makeMove(0);
      }).toThrowError(/game is over/gi);

      expect(() => {
        getTestGameWithWinner(PLAYER_O).makeMove(0);
      }).toThrowError(/game is over/gi);
    });
    it("throws for invalid indices", () => {
      expect(() => {
        getTestGame().makeMove(-1);
      }).toThrowError(/invalid/gi);

      expect(() => {
        getTestGame().makeMove(MAX + 1);
      }).toThrowError(/invalid/gi);
    });
    it("throws when the game is a draw", () => {
      expect(() => {
        getTestGameWithDraw().makeMove(0);
      }).toThrowError(/draw/gi);
    });
    it("makes move for valid indices", () => {
      const game = getTestGame();
      expect(game.makeMove(0).getBoard()[0]).toBe(PLAYER_X);
      expect(game.makeMove(1).getBoard()[1]).toBe(PLAYER_O);
    });
    it("throws for an occupied index", () => {
      expect(() => {
        getTestGame().makeMove(0).makeMove(0);
      }).toThrowError(/has taken that spot/gi);
    });
  });

  describe("getWinner()", () => {
    it("returns the right player when they've won", () => {
      expect(getTestGameWithWinner(PLAYER_X).getWinner()).toBe(PLAYER_X);
      expect(getTestGameWithWinner(PLAYER_O).getWinner()).toBe(PLAYER_O);
    });
    it("returns null when there isn't a winner yet", () => {
      expect(getTestGame().getWinner()).toBeNull();
    });
    it("returns DRAW when the game is a draw", () => {
      expect(getTestGameWithDraw().getWinner()).toBe(DRAW);
    });
  });

  describe("constructor", () => {
    describe("w/ a board param", () => {
      let nmg: INextMoveGetter;

      beforeEach(() => {
        nmg = new RandomNextMoveGetter({ min: 0, max: 8 });
      });

      it("throws if board passed in doesnt have the right length", () => {
        const board = new Array(10);
        expect(() => {
          new Game({ nmg, board });
        }).toThrowError(/Can currently only support boards of length/);
      });

      it("throws if board passed in has an invalid player", () => {
        const board = new Array(9);
        board[2] = "hi world";
        expect(() => {
          new Game({ nmg, board });
        }).toThrowError(/player/);
      });

      it("throws if an invalid board is passed in", () => {
        const board = new Array(9);
        board[0] = PLAYER_X;
        board[1] = PLAYER_X;
        expect(() => {
          new Game({ nmg, board });
        }).toThrow(/invalid/i);
      });

      it("sets the winner when a valid board w/ a winner is passed in", () => {
        const board = new Array(9);
        board[0] = PLAYER_X;
        board[3] = PLAYER_O;
        board[1] = PLAYER_X;
        board[4] = PLAYER_O;
        board[2] = PLAYER_X;
        const game = new Game({ nmg, board });
        expect(game.getWinner()).not.toBeNull();
      });
    });
  });

  describe(`#twoInARowValue`, () => {
    describe(`first row`, () => {
      it(`[x,x,-] -> value of 1`, () => {
        const game = new Game({
          board: [PLAYER_X, PLAYER_X, , PLAYER_O, , , , , ,],
        });
        expect(game.twoInARowValue(PLAYER_X)).toBe(1);
      });
      it(`[x,-,x] -> value of 1`, () => {
        const game = new Game({
          board: [PLAYER_X, , PLAYER_X, PLAYER_O, , , , , ,],
        });
        expect(game.twoInARowValue(PLAYER_X)).toBe(1);
      });
      it(`[-,x,x] -> value of 1`, () => {
        const game = new Game({
          board: [, PLAYER_X, PLAYER_X, PLAYER_O, , , , , ,],
        });
        expect(game.twoInARowValue(PLAYER_X)).toBe(1);
      });
      it(`negative value for PLAYER_O`, () => {
        const game = new Game({
          board: [, PLAYER_O, PLAYER_O, PLAYER_X, PLAYER_X, , , , ,],
        });
        expect(game.twoInARowValue(PLAYER_O)).toBe(-1);
      });
    });
    describe(`second row`, () => {
      it(`[-,-,-,x,x,-] -> value of 1`, () => {
        const game = new Game({
          board: [, , , PLAYER_X, PLAYER_X, , PLAYER_O, , ,],
        });
        expect(game.twoInARowValue(PLAYER_X)).toBe(1);
      });
      it(`[-,-,-,x,-,x] -> value of 1`, () => {
        const game = new Game({
          board: [, , , PLAYER_X, , PLAYER_X, PLAYER_O, , ,],
        });
        expect(game.twoInARowValue(PLAYER_X)).toBe(1);
      });
      it(`[-,-,-,-,x,x] -> value of 1`, () => {
        const game = new Game({
          board: [, , , , PLAYER_X, PLAYER_X, PLAYER_O, , ,],
        });
        expect(game.twoInARowValue(PLAYER_X)).toBe(1);
      });
      it(`negative value for PLAYER_O`, () => {
        const game = new Game({
          board: [, , , , PLAYER_O, PLAYER_O, PLAYER_X, PLAYER_X, null],
        });
        expect(game.twoInARowValue(PLAYER_O)).toBe(-1);
      });
    });
    describe(`third row`, () => {
      it(`[-,-,-,-,-,-,x,x,-] -> value of 1`, () => {
        const game = new Game({
          board: [PLAYER_O, , , , , , PLAYER_X, PLAYER_X, null],
        });
        expect(game.twoInARowValue(PLAYER_X)).toBe(1);
      });
      it(`[-,-,-,-,-,-,x,-,x] -> value of 1`, () => {
        const game = new Game({
          board: [PLAYER_O, , , , , , PLAYER_X, , PLAYER_X],
        });
        expect(game.twoInARowValue(PLAYER_X)).toBe(1);
      });
      it(`[-,-,-,-,-,-,-,x,x] -> value of 1`, () => {
        const game = new Game({
          board: [PLAYER_O, , , , , , null, PLAYER_X, PLAYER_X],
        });
        expect(game.twoInARowValue(PLAYER_X)).toBe(1);
      });
      it(`negative value for PLAYER_O`, () => {
        const game = new Game({
          board: [PLAYER_X, PLAYER_X, , , , , null, PLAYER_O, PLAYER_O],
        });
        expect(game.twoInARowValue(PLAYER_O)).toBe(-1);
      });
    });
  });
  describe("#twoInAColumnValue", () => {
    describe(`first column`, () => {
      it("[x,-,-,x,-,-,-,-,o] -> value of 1", () => {
        const game = new Game({
          board: [PLAYER_X, , , PLAYER_X, , , , , PLAYER_O],
        });
        expect(game.twoInAColumnValue(PLAYER_X)).toBe(1);
      });
      it("[x,-,-,-,-,-,x,-,o] -> value of 1", () => {
        const game = new Game({
          board: [PLAYER_X, , , , , , PLAYER_X, , PLAYER_O],
        });
        expect(game.twoInAColumnValue(PLAYER_X)).toBe(1);
      });
      it("[-,-,-,x,-,-,x,-,o] -> value of 1", () => {
        const game = new Game({
          board: [, , , PLAYER_X, , , PLAYER_X, , PLAYER_O],
        });
        expect(game.twoInAColumnValue(PLAYER_X)).toBe(1);
      });
      it("returns negative for player O", () => {
        const game = new Game({
          board: [, , , PLAYER_O, , , PLAYER_O, PLAYER_X, PLAYER_X],
        });
        expect(game.twoInAColumnValue(PLAYER_O)).toBe(-1);
      });
    });

    describe(`second column`, () => {
      it("[-,x,-,-,x,-,-,-,o] -> value of 1", () => {
        const game = new Game({
          board: [, PLAYER_X, , , PLAYER_X, , , , PLAYER_O],
        });
        expect(game.twoInAColumnValue(PLAYER_X)).toBe(1);
      });
      it("[-,x,-,-,-,-,-,x,o] -> value of 1", () => {
        const game = new Game({
          board: [, PLAYER_X, , , , , , PLAYER_X, PLAYER_O],
        });
        expect(game.twoInAColumnValue(PLAYER_X)).toBe(1);
      });
      it("[-,-,-,-,x,-,-,x,o] -> value of 1", () => {
        const game = new Game({
          board: [, , , , PLAYER_X, , , PLAYER_X, PLAYER_O],
        });
        expect(game.twoInAColumnValue(PLAYER_X)).toBe(1);
      });
      it("returns negative for player O", () => {
        const game = new Game({
          board: [, , , , PLAYER_O, , PLAYER_X, PLAYER_O, PLAYER_X],
        });
        expect(game.twoInAColumnValue(PLAYER_O)).toBe(-1);
      });
    });

    describe(`third column`, () => {
      it("[-,-,x,-,-,x,-,o,-] -> value of 1", () => {
        const game = new Game({
          board: [, , PLAYER_X, , , PLAYER_X, , PLAYER_O, null],
        });
        expect(game.twoInAColumnValue(PLAYER_X)).toBe(1);
      });
      it("[-,-,x,-,-,-,-,o,x] -> value of 1", () => {
        const game = new Game({
          board: [, , PLAYER_X, , , , , PLAYER_O, PLAYER_X],
        });
        expect(game.twoInAColumnValue(PLAYER_X)).toBe(1);
      });
      it("[-,-,-,-,-,x,-,o,x] -> value of 1", () => {
        const game = new Game({
          board: [, , , , , PLAYER_X, , PLAYER_O, PLAYER_X],
        });
        expect(game.twoInAColumnValue(PLAYER_X)).toBe(1);
      });
      it("returns negative for player O", () => {
        const game = new Game({
          board: [, , , , , PLAYER_O, PLAYER_X, PLAYER_X, PLAYER_O],
        });
        expect(game.twoInAColumnValue(PLAYER_O)).toBe(-1);
      });
    });
  });
});
