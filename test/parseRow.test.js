"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { parseRow } = require("../src/parseRow");

describe("parseRow", () => {
  it("parses a valid row", () => {
    assert.deepEqual(parseRow("CMP001,2025-01-01,12000,300,45.50,12"), {
      campaignId: "CMP001",
      impressions: 12000,
      clicks: 300,
      spend: 45.5,
      conversions: 12,
    });
  });

  it("rejects empty, malformed, and invalid numeric values", () => {
    assert.equal(parseRow(""), null);
    assert.equal(parseRow("CMP001,2025-01-01,12000,300,45.50"), null);
    assert.equal(parseRow(",2025-01-01,12000,300,45.50,12"), null);
    assert.equal(parseRow("CMP001,01-01-2025,12000,300,45.50,12"), null);
    assert.equal(parseRow("CMP001,2025-01-01,-1,300,45.50,12"), null);
    assert.equal(parseRow("CMP001,2025-01-01,12000,abc,45.50,12"), null);
    assert.equal(parseRow("CMP001,2025-01-01,12000,300,,12"), null);
    assert.equal(parseRow("CMP001,2025-01-01,12000,300,-1,12"), null);
  });
});
