"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { CampaignAggregator } = require("../src/aggregator");

describe("CampaignAggregator", () => {
  it("sums metrics by campaign_id", () => {
    const aggregator = new CampaignAggregator();
    aggregator.add({
      campaignId: "CMP001",
      impressions: 12000,
      clicks: 300,
      spend: 45.5,
      conversions: 12,
    });
    aggregator.add({
      campaignId: "CMP001",
      impressions: 14000,
      clicks: 340,
      spend: 48.2,
      conversions: 15,
    });

    const [campaign] = aggregator.metrics();
    assert.equal(campaign.totalImpressions, 26000);
    assert.equal(campaign.totalClicks, 640);
    assert.equal(campaign.totalSpend, 93.7);
    assert.equal(campaign.totalConversions, 27);
    assert.equal(campaign.ctr, 640 / 26000);
    assert.equal(campaign.cpa, 93.7 / 27);
  });

  it("returns null CTR and CPA when the divisor is zero", () => {
    const aggregator = new CampaignAggregator();
    aggregator.add({
      campaignId: "CMP000",
      impressions: 0,
      clicks: 0,
      spend: 5,
      conversions: 0,
    });

    const [campaign] = aggregator.metrics();
    assert.equal(campaign.ctr, null);
    assert.equal(campaign.cpa, null);
  });

  it("counts skipped invalid rows", () => {
    const aggregator = new CampaignAggregator();
    aggregator.add(null);
    aggregator.add({
      campaignId: "CMP001",
      impressions: 1,
      clicks: 1,
      spend: 1,
      conversions: 1,
    });

    assert.equal(aggregator.skippedRows, 1);
    assert.equal(aggregator.acceptedRows, 1);
  });
});
