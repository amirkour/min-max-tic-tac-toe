import { getTestGame } from "./utils";

describe("Game", () => {
  describe("movesMade", () => {
    it("inits to 0", () => {
      expect(getTestGame().movesMade).toBe(0);
    });
  });
});
