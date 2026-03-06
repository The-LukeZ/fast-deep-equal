import { describe, it, expect } from "vitest";
import { equal } from "../index.js";
import { reactEqual } from "../react.js";
import tests from "./fixtures/tests.js";
import es6tests from "./fixtures/es6tests.js";

type EqualFn = (a: unknown, b: unknown) => boolean;

function testCases(
  equalFunc: EqualFn,
  suiteName: string,
  suiteTests: typeof tests,
) {
  describe(suiteName, () => {
    for (const suite of suiteTests) {
      describe(suite.description, () => {
        for (const test of suite.tests) {
          const run = test.skip ? it.skip : it;
          run(test.description, () => {
            expect(equalFunc(test.value1, test.value2)).toBe(test.equal);
          });
          run(`${test.description} (reverse arguments)`, () => {
            expect(equalFunc(test.value2, test.value1)).toBe(test.equal);
          });
        }
      });
    }
  });
}

// equal already includes all ES6 support (Map, Set, TypedArrays, BigInt)
testCases(equal, "equal - standard tests", tests);
testCases(equal, "equal - es6 tests", es6tests);
testCases(reactEqual, "react equal - standard tests", tests);
testCases(reactEqual, "react equal - es6 tests", es6tests);
