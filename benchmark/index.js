"use strict";

import assert from "assert";
import Benchmark from "benchmark";

// keep spec/tests.js as a CommonJS data file — or convert it to tests.mjs
import tests from "../spec/tests.js";

import equal from "../dist/index.mjs";
import { deepEqual as fastEqualsDeep } from "fast-equals";
import { isEqual as _isEqual } from "lodash-es";
import * as R from "ramda";
import { isDeepStrictEqual } from "util";

const suite = new Benchmark.Suite();

const equalPackages = {
  "fast-deep-equal": equal,
  "fast-equals": fastEqualsDeep,
  "lodash.isEqual": _isEqual,
  "ramda.equals": R.equals,
  "util.isDeepStrictEqual": isDeepStrictEqual,
  "assert.deepStrictEqual": (a, b) => {
    try {
      assert.deepStrictEqual(a, b);
      return true;
    } catch (e) {
      return false;
    }
  },
};

for (const [equalName, equalFunc] of Object.entries(equalPackages)) {
  for (const testSuite of tests) {
    for (const test of testSuite.tests) {
      try {
        if (equalFunc(test.value1, test.value2) !== test.equal)
          console.error(
            "different result",
            equalName,
            testSuite.description,
            test.description,
          );
      } catch (e) {
        console.error(equalName, testSuite.description, test.description, e);
      }
    }
  }

  suite.add(equalName, () => {
    for (const testSuite of tests)
      for (const test of testSuite.tests)
        if (
          test.description !== "pseudo array and equivalent array are not equal"
        )
          equalFunc(test.value1, test.value2);
  });
}

console.log("Running benchmark...");

suite
  .on("cycle", (e) => console.log(String(e.target)))
  .on("complete", function () {
    console.log("The fastest is " + this.filter("fastest").map("name"));
  })
  .run({ async: true });
