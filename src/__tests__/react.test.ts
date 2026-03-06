import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import ReactTestRenderer from "react-test-renderer";
import reactEqual from "../react.js";

describe("React element (with circular references)", () => {
  class ChildWithShouldComponentUpdate extends React.Component<{
    children?: React.ReactNode;
  }> {
    shouldComponentUpdate(nextProps: this["props"]) {
      return !reactEqual(this.props, nextProps);
    }
    render() {
      return null;
    }
  }

  class Container extends React.Component<{
    title?: string;
    subtitle?: string;
  }> {
    render() {
      return React.createElement(ChildWithShouldComponentUpdate, {
        children: [
          React.createElement("h1", null, this.props.title ?? ""),
          React.createElement("h2", null, this.props.subtitle ?? ""),
        ],
      });
    }
  }

  let warnSpy: ReturnType<typeof vi.spyOn>;
  let renderSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderSpy = vi.spyOn(ChildWithShouldComponentUpdate.prototype, "render");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("compares without warnings or errors", () => {
    const r = ReactTestRenderer.create(React.createElement(Container));
    r.update(React.createElement(Container));
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("elements of same type and props are equal", () => {
    const r = ReactTestRenderer.create(React.createElement(Container));
    r.update(React.createElement(Container));
    expect(renderSpy).toHaveBeenCalledTimes(1); // no re-render
  });

  it("elements of same type with different props are not equal", () => {
    const r = ReactTestRenderer.create(React.createElement(Container));
    r.update(React.createElement(Container, { title: "New" }));
    expect(renderSpy).toHaveBeenCalledTimes(2); // did re-render
  });
});
