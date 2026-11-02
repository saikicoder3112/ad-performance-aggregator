"use strict";

function printUsage() {
  return [
    "Usage:",
    "  node src/index.js --input <csv-file> --output <directory>",
    "",
    "Options:",
    "  --input,  -i   Path to the advertising CSV file",
    "  --output, -o   Directory for top10_ctr.csv and top10_cpa.csv",
    "  --help,   -h   Show this message",
  ].join("\n");
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = { input: null, output: null, help: false };

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    const next = args[i + 1];

    if (token === "--help" || token === "-h") {
      parsed.help = true;
      continue;
    }

    if ((token === "--input" || token === "-i") && next) {
      parsed.input = next;
      i += 1;
      continue;
    }

    if ((token === "--output" || token === "-o") && next) {
      parsed.output = next;
      i += 1;
      continue;
    }

    throw new Error(`Unknown or incomplete argument: ${token}\n\n${printUsage()}`);
  }

  if (parsed.help) {
    return parsed;
  }

  if (!parsed.input || !parsed.output) {
    throw new Error(`Missing required arguments.\n\n${printUsage()}`);
  }

  return parsed;
}

module.exports = { parseArgs, printUsage };
