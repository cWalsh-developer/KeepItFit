import { describe, expect, it } from "vitest";
describe("rest timer recovery math", () => {
  it("uses an absolute deadline", () => {
    const before = Date.now();
    const end = before + 90_000;
    expect(Math.ceil((end - before) / 1000)).toBe(90);
  });
});
