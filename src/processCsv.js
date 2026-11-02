"use strict";

const fs = require("fs");
const { parseRow } = require("./parseRow");
const { CampaignAggregator } = require("./aggregator");

const HEADER = "campaign_id,date,impressions,clicks,spend,conversions";

function consumeLine(aggregator, line, isHeader) {
  if (isHeader) {
    const header = line.charCodeAt(0) === 0xfeff ? line.slice(1) : line;
    if (header === HEADER) {
      return;
    }
    aggregator.add(parseRow(header));
    return;
  }

  if (line.length === 0) {
    return;
  }

  aggregator.add(parseRow(line));
}

async function processCsv(inputPath) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const stats = fs.statSync(inputPath);
  if (!stats.isFile()) {
    throw new Error(`Input path is not a file: ${inputPath}`);
  }

  const aggregator = new CampaignAggregator();
  const stream = fs.createReadStream(inputPath, {
    encoding: "utf8",
    highWaterMark: 4 * 1024 * 1024,
  });

  let leftover = "";
  let isHeader = true;

  for await (const chunk of stream) {
    leftover += chunk;
    let start = 0;
    let newline = leftover.indexOf("\n");

    while (newline !== -1) {
      let line = leftover.slice(start, newline);
      if (line.charCodeAt(line.length - 1) === 13) {
        line = line.slice(0, -1);
      }

      consumeLine(aggregator, line, isHeader);
      isHeader = false;
      start = newline + 1;
      newline = leftover.indexOf("\n", start);
    }

    leftover = leftover.slice(start);
  }

  if (leftover.length > 0) {
    consumeLine(aggregator, leftover, isHeader);
  }

  return aggregator;
}

module.exports = { processCsv };
