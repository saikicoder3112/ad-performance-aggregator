"use strict";

function createEmptyTotals() {
  return {
    totalImpressions: 0,
    totalClicks: 0,
    totalSpend: 0,
    totalConversions: 0,
  };
}

class CampaignAggregator {
  constructor() {
    this.totalsByCampaign = new Map();
    this.acceptedRows = 0;
    this.skippedRows = 0;
  }

  add(row) {
    if (!row) {
      this.skippedRows += 1;
      return;
    }

    let totals = this.totalsByCampaign.get(row.campaignId);
    if (!totals) {
      totals = createEmptyTotals();
      this.totalsByCampaign.set(row.campaignId, totals);
    }

    totals.totalImpressions += row.impressions;
    totals.totalClicks += row.clicks;
    totals.totalSpend += row.spend;
    totals.totalConversions += row.conversions;
    this.acceptedRows += 1;
  }

  skip() {
    this.skippedRows += 1;
  }

  metrics() {
    const campaigns = [];

    for (const [campaignId, totals] of this.totalsByCampaign) {
      const ctr =
        totals.totalImpressions > 0
          ? totals.totalClicks / totals.totalImpressions
          : null;
      const cpa =
        totals.totalConversions > 0
          ? totals.totalSpend / totals.totalConversions
          : null;

      campaigns.push({
        campaignId,
        totalImpressions: totals.totalImpressions,
        totalClicks: totals.totalClicks,
        totalSpend: totals.totalSpend,
        totalConversions: totals.totalConversions,
        ctr,
        cpa,
      });
    }

    return campaigns;
  }
}

module.exports = { CampaignAggregator };
