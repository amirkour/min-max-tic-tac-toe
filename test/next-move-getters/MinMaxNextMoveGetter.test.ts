import Game, { strategies, PLAYER_O, PLAYER_X, MOVE } from "../../src";
const { MinMaxNextMoveGetter } = strategies;

describe("#evaluateBoardValue", () => {
  describe("three in a row present", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it(`xxxoo---- -> depends on oneWayWinValue`, () => {
      const nmg = new MinMaxNextMoveGetter();
      const board: MOVE[] = [
        PLAYER_X,
        PLAYER_X,
        PLAYER_X,
        PLAYER_O,
        PLAYER_O,
        ,
        ,
        ,
        ,
      ];

      const mockOneWayWin = jest.spyOn(nmg, "oneWayWinValue");
      nmg.evaluateBoardValue(board);
      expect(mockOneWayWin).not.toHaveBeenCalled();
    });
    it(`oooxx-x-- -> depends on oneWayWinValue`, () => {
      const board: MOVE[] = [
        PLAYER_O,
        PLAYER_O,
        PLAYER_O,
        PLAYER_X,
        PLAYER_X,
        ,
        PLAYER_X,
        ,
        ,
      ];

      const nmg = new MinMaxNextMoveGetter();
      const mockOneWayWin = jest.spyOn(nmg, "oneWayWinValue");
      nmg.evaluateBoardValue(board);
      expect(mockOneWayWin).not.toHaveBeenCalled();
    });
    it(`xxxoo---- -> returns max board value`, () => {
      const board: MOVE[] = [
        PLAYER_X,
        PLAYER_X,
        PLAYER_X,
        PLAYER_O,
        PLAYER_O,
        ,
        ,
        ,
        ,
      ];
      const nmg = new MinMaxNextMoveGetter();

      expect(nmg.evaluateBoardValue(board)).toBe(
        MinMaxNextMoveGetter.MAX_BOARD_VALUE
      );
    });
    it(`oooxx-x-- -> negative max board value`, () => {
      const board: MOVE[] = [
        PLAYER_O,
        PLAYER_O,
        PLAYER_O,
        PLAYER_X,
        PLAYER_X,
        ,
        PLAYER_X,
        ,
        ,
      ];
      const nmg = new MinMaxNextMoveGetter();
      expect(nmg.evaluateBoardValue(board)).toBe(
        MinMaxNextMoveGetter.MAX_BOARD_VALUE * -1
      );
    });
  });

  describe("three in a row NOT present", () => {
    afterEach(() => jest.resetAllMocks());
    it(`xoxo----- -> NOT max board value`, () => {
      const board: MOVE[] = [PLAYER_X, PLAYER_O, PLAYER_X, PLAYER_O, , , , , ,];
      const nmg = new MinMaxNextMoveGetter();
      expect(nmg.evaluateBoardValue(board)).not.toBe(
        MinMaxNextMoveGetter.MAX_BOARD_VALUE
      );
      expect(nmg.evaluateBoardValue(board)).not.toBe(
        MinMaxNextMoveGetter.MAX_BOARD_VALUE * -1
      );
    });
    it(`xoxo----- -> depends on oneWayWinValue `, () => {
      const board: MOVE[] = [PLAYER_X, PLAYER_O, PLAYER_X, PLAYER_O, , , , , ,];
      const nmg = new MinMaxNextMoveGetter();
      const mockOneWayWin = jest.spyOn(nmg, "oneWayWinValue");

      expect(mockOneWayWin).not.toHaveBeenCalled();
      nmg.evaluateBoardValue(board);
      expect(mockOneWayWin).toHaveBeenCalled();
    });
  });

  describe(`#twoInARowValue`, () => {
    describe(`first row`, () => {
      it(`[x,x,-] -> value of 1`, () => {
        const board: MOVE[] = [PLAYER_X, PLAYER_X, , PLAYER_O, , , , , ,];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_X)).toBe(1);
      });
      it(`[x,-,x] -> value of 1`, () => {
        const board: MOVE[] = [PLAYER_X, , PLAYER_X, PLAYER_O, , , , , ,];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_X)).toBe(1);
      });
      it(`[-,x,x] -> value of 1`, () => {
        const board: MOVE[] = [, PLAYER_X, PLAYER_X, PLAYER_O, , , , , ,];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_X)).toBe(1);
      });
      it(`negative value for PLAYER_O`, () => {
        const board: MOVE[] = [
          ,
          PLAYER_O,
          PLAYER_O,
          PLAYER_X,
          PLAYER_X,
          ,
          ,
          ,
          ,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_O)).toBe(-1);
      });
    });
    describe(`second row`, () => {
      it(`[-,-,-,x,x,-] -> value of 1`, () => {
        const board: MOVE[] = [, , , PLAYER_X, PLAYER_X, , PLAYER_O, , ,];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_X)).toBe(1);
      });
      it(`[-,-,-,x,-,x] -> value of 1`, () => {
        const board: MOVE[] = [, , , PLAYER_X, , PLAYER_X, PLAYER_O, , ,];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_X)).toBe(1);
      });
      it(`[-,-,-,-,x,x] -> value of 1`, () => {
        const board: MOVE[] = [, , , , PLAYER_X, PLAYER_X, PLAYER_O, , ,];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_X)).toBe(1);
      });
      it(`negative value for PLAYER_O`, () => {
        const board: MOVE[] = [
          ,
          ,
          ,
          ,
          PLAYER_O,
          PLAYER_O,
          PLAYER_X,
          PLAYER_X,
          null,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_O)).toBe(-1);
      });
    });
    describe(`third row`, () => {
      it(`[-,-,-,-,-,-,x,x,-] -> value of 1`, () => {
        const board: MOVE[] = [PLAYER_O, , , , , , PLAYER_X, PLAYER_X, null];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_X)).toBe(1);
      });
      it(`[-,-,-,-,-,-,x,-,x] -> value of 1`, () => {
        const board: MOVE[] = [PLAYER_O, , , , , , PLAYER_X, , PLAYER_X];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_X)).toBe(1);
      });
      it(`[-,-,-,-,-,-,-,x,x] -> value of 1`, () => {
        const board: MOVE[] = [PLAYER_O, , , , , , null, PLAYER_X, PLAYER_X];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_X)).toBe(1);
      });
      it(`negative value for PLAYER_O`, () => {
        const board: MOVE[] = [
          PLAYER_X,
          PLAYER_X,
          ,
          ,
          ,
          ,
          null,
          PLAYER_O,
          PLAYER_O,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInARowValue(board, PLAYER_O)).toBe(-1);
      });
    });
  });
  describe("#twoInAColumnValue", () => {
    describe(`first column`, () => {
      it("[x,-,-,x,-,-,-,-,o] -> value of 1", () => {
        const board: MOVE[] = [PLAYER_X, , , PLAYER_X, , , , , PLAYER_O];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_X)).toBe(1);
      });
      it("[x,-,-,-,-,-,x,-,o] -> value of 1", () => {
        const board: MOVE[] = [PLAYER_X, , , , , , PLAYER_X, , PLAYER_O];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_X)).toBe(1);
      });
      it("[-,-,-,x,-,-,x,-,o] -> value of 1", () => {
        const board: MOVE[] = [, , , PLAYER_X, , , PLAYER_X, , PLAYER_O];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_X)).toBe(1);
      });
      it("returns negative for player O", () => {
        const board: MOVE[] = [
          ,
          ,
          ,
          PLAYER_O,
          ,
          ,
          PLAYER_O,
          PLAYER_X,
          PLAYER_X,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_O)).toBe(-1);
      });
    });

    describe(`second column`, () => {
      it("[-,x,-,-,x,-,-,-,o] -> value of 1", () => {
        const board: MOVE[] = [, PLAYER_X, , , PLAYER_X, , , , PLAYER_O];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_X)).toBe(1);
      });
      it("[-,x,-,-,-,-,-,x,o] -> value of 1", () => {
        const board: MOVE[] = [, PLAYER_X, , , , , , PLAYER_X, PLAYER_O];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_X)).toBe(1);
      });
      it("[-,-,-,-,x,-,-,x,o] -> value of 1", () => {
        const board: MOVE[] = [, , , , PLAYER_X, , , PLAYER_X, PLAYER_O];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_X)).toBe(1);
      });
      it("returns negative for player O", () => {
        const board: MOVE[] = [
          ,
          ,
          ,
          ,
          PLAYER_O,
          ,
          PLAYER_X,
          PLAYER_O,
          PLAYER_X,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_O)).toBe(-1);
      });
    });

    describe(`third column`, () => {
      it("[-,-,x,-,-,x,-,o,-] -> value of 1", () => {
        const board: MOVE[] = [, , PLAYER_X, , , PLAYER_X, , PLAYER_O, null];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_X)).toBe(1);
      });
      it("[-,-,x,-,-,-,-,o,x] -> value of 1", () => {
        const board: MOVE[] = [, , PLAYER_X, , , , , PLAYER_O, PLAYER_X];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_X)).toBe(1);
      });
      it("[-,-,-,-,-,x,-,o,x] -> value of 1", () => {
        const board: MOVE[] = [, , , , , PLAYER_X, , PLAYER_O, PLAYER_X];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_X)).toBe(1);
      });
      it("returns negative for player O", () => {
        const board: MOVE[] = [
          ,
          ,
          ,
          ,
          ,
          PLAYER_O,
          PLAYER_X,
          PLAYER_X,
          PLAYER_O,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInAColumnValue(board, PLAYER_O)).toBe(-1);
      });
    });
  });
  describe("#twoInADiagonalValue", () => {
    describe("top-left to bottom-right", () => {
      it("xo--x---- -> value of 1", () => {
        const board: MOVE[] = [PLAYER_X, PLAYER_O, , , PLAYER_X, , , , null];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInADiagonalValue(board, PLAYER_X)).toBe(1);
      });
      it("xo------x -> value of 1", () => {
        const board: MOVE[] = [PLAYER_X, PLAYER_O, , , , , , , PLAYER_X];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInADiagonalValue(board, PLAYER_X)).toBe(1);
      });
      it("-o--x---x -> value of 1", () => {
        const board: MOVE[] = [, PLAYER_O, , , PLAYER_X, , , , PLAYER_X];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInADiagonalValue(board, PLAYER_X)).toBe(1);
      });
      it("returns negative for o", () => {
        const board: MOVE[] = [
          PLAYER_O,
          PLAYER_X,
          PLAYER_X,
          ,
          PLAYER_O,
          ,
          ,
          ,
          null,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInADiagonalValue(board, PLAYER_O)).toBe(-1);
      });
    });

    describe("top-right to bottom-left", () => {
      it("-ox-x---- -> value of 1", () => {
        const board: MOVE[] = [, PLAYER_O, PLAYER_X, , PLAYER_X, , , , null];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInADiagonalValue(board, PLAYER_X)).toBe(1);
      });
      it("-o--x-x-- -> value of 1", () => {
        const board: MOVE[] = [, PLAYER_O, , , PLAYER_X, , PLAYER_X, , null];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInADiagonalValue(board, PLAYER_X)).toBe(1);
      });
      it("-ox---x-- -> value of 1", () => {
        const board: MOVE[] = [PLAYER_O, , , , PLAYER_X, , PLAYER_X, , null];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInADiagonalValue(board, PLAYER_X)).toBe(1);
      });
      it("returns negative for o", () => {
        const board: MOVE[] = [
          PLAYER_X,
          PLAYER_X,
          PLAYER_O,
          ,
          PLAYER_O,
          ,
          ,
          ,
          null,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.twoInADiagonalValue(board, PLAYER_O)).toBe(-1);
      });
    });
  });
  describe("#oneWayWinValue", () => {
    describe("x scenarios", () => {
      it("xo-xo--- -> 0 value", () => {
        const board: MOVE[] = [
          PLAYER_X,
          PLAYER_O,
          ,
          PLAYER_X,
          PLAYER_O,
          ,
          ,
          ,
          null,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.oneWayWinValue(board)).toBe(0);
      });
      it("xo-x---- -> 1 value", () => {
        const board: MOVE[] = [PLAYER_X, PLAYER_O, , PLAYER_X, , , , , null];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.oneWayWinValue(board)).toBe(1);
      });
      it("xox-xo-- -> 2 value", () => {
        const board: MOVE[] = [
          PLAYER_X,
          PLAYER_O,
          PLAYER_X,
          ,
          PLAYER_X,
          PLAYER_O,
          ,
          ,
          null,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.oneWayWinValue(board)).toBe(2);
      });
    });
    describe("o scenarios", () => {
      it("-x-oo-oxx -> -3 value", () => {
        /*
        -x-
        oo-
        oxx
        */
        const board: MOVE[] = [
          ,
          PLAYER_X,
          ,
          PLAYER_O,
          PLAYER_O,
          ,
          PLAYER_O,
          PLAYER_X,
          PLAYER_X,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.oneWayWinValue(board)).toBe(-3);
      });
      it("-xoo--oxx -> -1 value", () => {
        const board: MOVE[] = [
          ,
          PLAYER_X,
          PLAYER_O,
          PLAYER_O,
          ,
          ,
          PLAYER_O,
          PLAYER_X,
          PLAYER_X,
        ];
        const nmg = new MinMaxNextMoveGetter();
        expect(nmg.oneWayWinValue(board)).toBe(-1);
      });
    });
  });
});
