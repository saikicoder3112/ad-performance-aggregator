"use strict";

const TOP_N = 10;

function compareCampaignId(left, right) {
  if (left.campaignId < right.campaignId) {
    return -1;
  }
  if (left.campaignId > right.campaignId) {
    return 1;
  }
  return 0;
}

function selectTopByCtr(campaigns, limit = TOP_N) {
  return campaigns
    .filter((campaign) => campaign.ctr != null)
    .sort((left, right) => {
      if (right.ctr !== left.ctr) {
        return right.ctr - left.ctr;
      }
      return compareCampaignId(left, right);
    })
    .slice(0, limit);
}

function selectTopByCpa(campaigns, limit = TOP_N) {
  return campaigns
    .filter((campaign) => campaign.cpa != null)
    .sort((left, right) => {
      if (left.cpa !== right.cpa) {
        return left.cpa - right.cpa;
      }
      return compareCampaignId(left, right);
    })
    .slice(0, limit);
}

module.exports = { selectTopByCtr, selectTopByCpa, TOP_N };
