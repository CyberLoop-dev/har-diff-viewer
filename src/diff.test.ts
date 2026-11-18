import { describe, expect, it } from "vitest";
import { compareHar } from "./diff";

const entry = (status: number) => ({
  request: { method: "GET", url: "https://example.test/api" },
  response: { status, content: { size: 12, mimeType: "application/json" }, headers: [] },
  time: 20
});

describe("compareHar", () => {
  it("detects changed response status", () => {
    const rows = compareHar({ log: { entries: [entry(200)] } }, { log: { entries: [entry(500)] } });
    expect(rows[0].kind).toBe("changed");
  });
  it("detects added and removed requests", () => {
    const rows = compareHar({ log: { entries: [entry(200)] } }, { log: { entries: [] } });
    expect(rows[0].kind).toBe("removed");
  });
});
