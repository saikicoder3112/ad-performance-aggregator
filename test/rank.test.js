"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { selectTopByCtr, selectTopByCpa } = require("../src/rank");

describe("rank", () => {
  const campaigns = [
    {
      campaignId: "CMP_LOW_CTR",
      ctr: 0.01,
      cpa: 5,
    },
    {
      campaignId: "CMP_HIGH_CTR",
      ctr: 0.05,
      cpa: 20,
    },
    {
      campaignId: "CMP_TIE_A",
      ctr: 0.03,
      cpa: 10,
    },
    {
      campaignId: "CMP_TIE_B",
      ctr: 0.03,
      cpa: 10,
    },
    {
      campaignId: "CMP_NO_IMPRESSIONS",
      ctr: null,
      cpa: 8,
    },
    {
      campaignId: "CMP_NO_CONVERSIONS",
      ctr: 0.04,
      cpa: null,
    },
  ];

  it("selects highest CTR and skips campaigns without CTR", () => {
    const ranked = selectTopByCtr(campaigns, 3).map((item) => item.campaignId);
    assert.deepEqual(ranked, ["CMP_HIGH_CTR", "CMP_NO_CONVERSIONS", "CMP_TIE_A"]);
  });

  it("selects lowest CPA and skips campaigns without CPA", () => {
    const ranked = selectTopByCpa(campaigns, 3).map((item) => item.campaignId);
    assert.deepEqual(ranked, ["CMP_LOW_CTR", "CMP_NO_IMPRESSIONS", "CMP_TIE_A"]);
  });
});
