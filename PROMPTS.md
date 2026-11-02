# PROMPTS.md

```text
Act as a senior software engineer. Analyze and implement the
Ad Performance Aggregator according to the requirements in CHALLENGE.md.

Requirements:
- Process CSV files (~1GB) using memory-efficient streaming.
- Aggregate impressions, clicks, spend, and conversions by campaign_id.
- Calculate CTR and CPA.
- Generate top10_ctr.csv (highest CTR) and top10_cpa.csv (lowest CPA).
- Handle invalid data, empty values, and division-by-zero cases.

Use Node.js Streams and appropriate data structures.
Keep the implementation clean, modular, efficient, and dependency-light.

After implementation, review and optimize correctness, performance,
memory usage, and edge cases.

Create a project README.md containing:
- Setup instructions.
- How to run the program.
- Libraries used and their purposes.
- Actual processing time for a 1GB CSV file.
- Peak memory usage, if measured.

Do not invent benchmark results. If benchmarks have not been run,
provide instructions for measuring them and clearly mark the results
as pending.
```
