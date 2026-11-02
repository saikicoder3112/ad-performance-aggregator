# Ad Performance Aggregator

CLI that streams a large advertising CSV, aggregates metrics by `campaign_id`, and writes:

- `top10_ctr.csv` — 10 campaigns with the highest CTR
- `top10_cpa.csv` — 10 campaigns with the lowest CPA (zero-conversion campaigns excluded)

## Setup

Requires [Node.js](https://nodejs.org/) 18 or newer. There are no npm dependencies.

```bash
unzip ad_data.csv.zip
```

## How to run

```bash
node src/index.js --input ad_data.csv --output results
```

Short flags:

```bash
node src/index.js -i ad_data.csv -o results
```

Or:

```bash
npm start
```

### Docker

```bash
docker build -t ad-performance-aggregator .
docker run --rm -v "$PWD:/app" ad-performance-aggregator --input ad_data.csv --output results
```

### Tests

```bash
npm test
```

## Libraries

None. The tool uses Node.js built-ins only:

| Module | Purpose |
|--------|---------|
| `fs` / `path` | Read the CSV and write result files |
| async iteration over `fs.createReadStream` | Stream the file in chunks without loading it |
| `node:test` / `node:assert` | Unit and integration tests |

## Design choices

- **Stream the file.** Aggregation memory is `O(unique campaign_id)`, not `O(file size)`. This dataset has ~26.8 million rows and 50 campaigns.
- **Chunked line splitting.** Lines are parsed from 4 MiB UTF-8 chunks instead of buffering the whole CSV.
- **Skip bad rows.** Empty IDs, invalid dates, non-numeric or negative metrics, and wrong column counts are counted as skipped and ignored.
- **Division by zero.** CTR is `null` when `total_impressions` is 0. CPA is `null` when `total_conversions` is 0. Those campaigns are omitted from the matching top-10 list.
- **Ties.** Equal CTR or CPA is broken by `campaign_id` ascending. Ranking uses full-precision ratios, then values are formatted (CTR 4 decimals, spend/CPA 2 decimals) to match the challenge examples.

## Benchmark (1GB `ad_data.csv`)

Measured on this machine with Node v24.19.0:

| Metric | Value |
|--------|--------|
| Wall time (`/usr/bin/time` real) | 112.22 s |
| CLI elapsed | 110.88 s |
| Peak RSS (`maximum resident set size`) | 244 MB (255,754,240 bytes) |
| Heap used at exit | 3.6 MB |
| Campaigns | 50 |
| Accepted rows | 26,843,544 |
| Skipped rows | 0 |

Raw `time -l` output is in `benchmarks/macos-time.txt`.

### How to re-measure

```bash
/usr/bin/time -l node src/index.js --input ad_data.csv --output results
```

On macOS, `maximum resident set size` is peak RSS in bytes. Divide by `1024 * 1024` for MiB.

## Output files

After a successful run, `results/` contains `top10_ctr.csv` and `top10_cpa.csv`.
