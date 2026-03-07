"use strict";

export function reactEqual<Expected>(a: any, b: Expected): a is Expected {
  if (a === b) return true;

  if (a && b && typeof a == "object" && typeof b == "object") {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;

    if (aObj.constructor !== bObj.constructor) return false;

    if (Array.isArray(a)) {
      const length = a.length;
      if (length != (b as unknown[]).length) return false;
      for (let i = length; i-- !== 0; )
        if (!reactEqual(a[i], (b as unknown[])[i])) return false;
      return true;
    }

    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (const [key, val] of a) {
        if (!b.has(key) || !reactEqual(val, b.get(key))) return false;
      }
      return true;
    }

    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      for (const key of a) if (!b.has(key)) return false;
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      const av = a as unknown as ArrayLike<number>;
      const bv = b as unknown as ArrayLike<number>;
      const length = av.length;
      if (length != bv.length) return false;
      for (let i = length; i-- !== 0; ) if (av[i] !== bv[i]) return false;
      return true;
    }

    if (aObj.constructor === RegExp)
      return (
        (a as RegExp).source === (b as unknown as RegExp).source &&
        (a as RegExp).flags === (b as unknown as RegExp).flags
      );
    if (aObj.valueOf !== Object.prototype.valueOf) {
      const aVal = (a as any).valueOf();
      const bVal = (b as any).valueOf();
      return Object.is(aVal, bVal);
    }
    if (aObj.toString !== Object.prototype.toString)
      return (a as object).toString() === (b as object).toString();

    const keys = Object.keys(a);
    const length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (let i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (let i = length; i-- !== 0; ) {
      const key = keys[i];
      // React-specific: avoid traversing React elements' _owner.
      // _owner contains circular references and is not needed when comparing elements.
      if (key === "_owner" && aObj.$$typeof) continue;
      if (!reactEqual(aObj[key], bObj[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
}
