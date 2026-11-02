"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { processCsv } = require("../src/processCsv");
const { main } = require("../src/index");
const { selectTopByCtr, selectTopByCpa } = require("../src/rank");

describe("processCsv and CLI", () => {
  it("streams a sample file, skips bad rows, and writes ranked CSVs", async () => {
    const fixture = path.join(__dirname, "fixtures", "sample.csv");
    const aggregator = await processCsv(fixture);
    const campaigns = aggregator.metrics();
    const byId = Object.fromEntries(
      campaigns.map((campaign) => [campaign.campaignId, campaign])
    );

    assert.equal(aggregator.acceptedRows, 8);
    assert.ok(aggregator.skippedRows >= 6);
    assert.equal(byId.CMP001.totalImpressions, 26000);
    assert.equal(byId.CMP001.totalClicks, 640);
    assert.equal(byId.CMP004.cpa, null);
    assert.equal(byId.CMP005.ctr, null);

    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "ad-agg-"));
    const exitCode = await main([
      "node",
      "src/index.js",
      "--input",
      fixture,
      "--output",
      outputDir,
    ]);

    assert.equal(exitCode, 0);

    const ctrCsv = fs.readFileSync(path.join(outputDir, "top10_ctr.csv"), "utf8");
    const cpaCsv = fs.readFileSync(path.join(outputDir, "top10_cpa.csv"), "utf8");
    const topCtr = selectTopByCtr(campaigns);
    const topCpa = selectTopByCpa(campaigns);

    assert.match(ctrCsv, /^campaign_id,total_impressions,total_clicks,total_spend,total_conversions,CTR,CPA\n/);
    assert.match(ctrCsv, new RegExp(`^${topCtr[0].campaignId},`, "m"));
    assert.equal(cpaCsv.split("\n").filter(Boolean).length, topCpa.length + 1);
    assert.doesNotMatch(cpaCsv, /CMP004/);
  });

  it("fails when the input file is missing", async () => {
    await assert.rejects(
      () => processCsv(path.join(__dirname, "missing.csv")),
      /Input file not found/
    );
  });
});
