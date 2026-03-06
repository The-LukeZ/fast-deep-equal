import { describe, it, expect } from "vitest";
import { reactEqual } from "../react.js";

describe("reactEqual - _owner skipping", () => {
  it("equal React-like elements (with circular _owner) are equal", () => {
    const owner = {} as any;
    const a = {
      $$typeof: Symbol.for("react.element"),
      type: "div",
      props: { className: "foo" },
      _owner: owner,
    };
    const b = {
      $$typeof: Symbol.for("react.element"),
      type: "div",
      props: { className: "foo" },
      _owner: owner,
    };
    // _owner is the same ref but even if it weren't, it should be skipped
    expect(reactEqual(a, b)).toBe(true);
  });

  it("different _owner does not affect equality", () => {
    const a = {
      $$typeof: Symbol.for("react.element"),
      type: "div",
      props: {},
      _owner: { id: 1 },
    };
    const b = {
      $$typeof: Symbol.for("react.element"),
      type: "div",
      props: {},
      _owner: { id: 999 },
    };
    expect(reactEqual(a, b)).toBe(true);
  });

  it("different props are not equal regardless of _owner", () => {
    const a = {
      $$typeof: Symbol.for("react.element"),
      type: "div",
      props: { className: "foo" },
      _owner: {},
    };
    const b = {
      $$typeof: Symbol.for("react.element"),
      type: "div",
      props: { className: "bar" },
      _owner: {},
    };
    expect(reactEqual(a, b)).toBe(false);
  });

  it("circular reference via _owner does not throw", () => {
    const element: any = {
      $$typeof: Symbol.for("react.element"),
      type: "div",
      props: {},
      _owner: null,
    };
    element._owner = element; // circular
    expect(() => reactEqual(element, element)).not.toThrow();
  });
});
