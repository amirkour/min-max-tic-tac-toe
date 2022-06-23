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
});
