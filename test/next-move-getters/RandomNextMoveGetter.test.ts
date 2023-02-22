import RandomNextMoveGetter, {
  MIN,
  MAX,
} from "../../src/strategies/RandomNextMoveGetter";

describe("RandomNextMoveGetter", () => {
  it("returns random whole numbers", () => {
    const nmg = new RandomNextMoveGetter();

    const first = nmg.getNextMove([]);
    const second = nmg.getNextMove([]);
    const third = nmg.getNextMove([]);

    expect(first % 1).toBe(0);
    expect(second % 1).toBe(0);
    expect(third % 1).toBe(0);

    expect(first).not.toBe(second);
    expect(first).not.toBe(third);

    expect(second).not.toBe(third);
  });

  it("inits min and max to defaults", () => {
    const nmg = new RandomNextMoveGetter();
    expect(nmg.min).toBe(MIN);
    expect(nmg.max).toBe(MAX);
  });

  it("obeys min and max restrictions", () => {
    // these are just arbitrary test numbers to validate
    // that the RNG stays within the bounds specificed
    const min = 0;
    const max = 12;
    const nmg = new RandomNextMoveGetter({ min, max });

    const arbitrarilyLarge = 100;
    for (let i = 0; i < arbitrarilyLarge; i++) {
      const next = nmg.getNextMove([]);
      expect(next).toBeGreaterThanOrEqual(min);
      expect(next).toBeLessThanOrEqual(max);
    }
  });
});
