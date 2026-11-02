"use strict";

const fs = require("fs");
const path = require("path");

const HEADER = [
  "campaign_id",
  "total_impressions",
  "total_clicks",
  "total_spend",
  "total_conversions",
  "CTR",
  "CPA",
].join(",");

function formatRatio(value, digits) {
  if (value == null) {
    return "";
  }
  return value.toFixed(digits);
}

function formatCampaignRow(campaign) {
  return [
    campaign.campaignId,
    campaign.totalImpressions,
    campaign.totalClicks,
    campaign.totalSpend.toFixed(2),
    campaign.totalConversions,
    formatRatio(campaign.ctr, 4),
    formatRatio(campaign.cpa, 2),
  ].join(",");
}

function writeCsv(filePath, campaigns) {
  const lines = [HEADER, ...campaigns.map(formatCampaignRow)];
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

module.exports = { writeCsv, formatCampaignRow, HEADER };
