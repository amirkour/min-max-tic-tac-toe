import RandomNextMoveGetter from "../../strategies/RandomNextMoveGetter";
describe("RandomNextMoveGetter", () => {
  it("returns random whole numbers", () => {
    const nmg = new RandomNextMoveGetter();

    const first = nmg.getNextMove();
    const second = nmg.getNextMove();
    const third = nmg.getNextMove();

    expect(first % 1).toBe(0);
    expect(second % 1).toBe(0);
    expect(third % 1).toBe(0);

    expect(first).not.toBe(second);
    expect(first).not.toBe(third);

    expect(second).not.toBe(third);
  });
});
