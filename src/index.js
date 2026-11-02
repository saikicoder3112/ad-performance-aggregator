"use strict";

const fs = require("fs");
const path = require("path");
const { parseArgs, printUsage } = require("./parseArgs");
const { processCsv } = require("./processCsv");
const { selectTopByCtr, selectTopByCpa } = require("./rank");
const { writeCsv } = require("./writeCsv");

async function main(argv = process.argv) {
  const args = parseArgs(argv);

  if (args.help) {
    console.log(printUsage());
    return 0;
  }

  const inputPath = path.resolve(args.input);
  const outputDir = path.resolve(args.output);

  fs.mkdirSync(outputDir, { recursive: true });

  const startedAt = process.hrtime.bigint();
  const aggregator = await processCsv(inputPath);
  const campaigns = aggregator.metrics();

  writeCsv(path.join(outputDir, "top10_ctr.csv"), selectTopByCtr(campaigns));
  writeCsv(path.join(outputDir, "top10_cpa.csv"), selectTopByCpa(campaigns));

  const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
  const memory = process.memoryUsage();

  console.log(
    [
      `Campaigns: ${campaigns.length}`,
      `Accepted rows: ${aggregator.acceptedRows}`,
      `Skipped rows: ${aggregator.skippedRows}`,
      `Elapsed: ${(elapsedMs / 1000).toFixed(2)}s`,
      `RSS: ${(memory.rss / 1024 / 1024).toFixed(1)} MB`,
      `Heap used: ${(memory.heapUsed / 1024 / 1024).toFixed(1)} MB`,
      `Wrote: ${path.join(outputDir, "top10_ctr.csv")}`,
      `Wrote: ${path.join(outputDir, "top10_cpa.csv")}`,
    ].join("\n")
  );

  return 0;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { main };
