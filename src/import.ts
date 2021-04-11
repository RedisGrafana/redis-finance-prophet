/**
 * Readline and File System
 */
const { join } = require("path");
const { createReadStream, path, readdirSync } = require("fs");
const { createInterface } = require("readline");

/**
 * A robust, performance-focused and full-featured Redis client for Node.js.
 *
 * @see https://github.com/luin/ioredis
 */
const Redis = require("ioredis");

/**
 * You can also specify connection options as a redis:// URL or rediss:// URL when using TLS encryption
 */
const redis = new Redis("redis://localhost:6379");

/**
 * CSV file columns
 */
const CSV = {
  OPEN: 1,
  HIGH: 2,
  LOW: 3,
  CLOSE: 4,
  ADJ: 5,
  VOLUME: 6,
};

/**
 * Add Sample
 *
 * @async
 */
async function addSample(symbol, date, sample) {
  /**
   * Import data
   */
  await Promise.all(
    Object.keys(CSV).map(async (ts) => {
      const value = sample[CSV[ts]];

      if (!value || value === "null") {
        return console.log(`Wrong value ${value} in sample ${sample}`);
      }

      await redis
        .send_command(
          "TS.ADD",
          `{${symbol}:${ts}}`,
          date,
          value,
          "LABELS",
          "symbol",
          symbol,
          "type",
          ts
        )
        .catch((err) => console.log(err));
    })
  );
}

/**
 * Get all symbols
 *
 * @async
 */
async function main(dir) {
  /**
   * Scan folder
   */
  const filenames = readdirSync(dir);
  for (const file of filenames) {
    const symbol = file.split(".");

    /**
     * Wrong filename
     */
    if (!symbol.length) {
      console.log(`Wrong filename: ${file}`);
      continue;
    }

    console.log(`Processing ${file}...`);

    /**
     * Add Symbol to Set
     */
    await redis
      .send_command("SADD", `symbols`, symbol[0])
      .catch((err) => console.log(err));

    /**
     * Stream reader
     */
    const rl = createInterface({
      input: createReadStream(join(dir, file)),
      crlfDelay: Infinity,
    });

    /**
     * Process line by line
     */
    for await (const line of rl) {
      const sample = line.split(",");
      const date = Date.parse(sample[0]);

      if (!date) {
        console.log(`Incorrect line or header: ${line}`);
        continue;
      }

      await addSample(symbol[0], date, sample);
    }
  }

  /**
   * Close Redis connection
   */
  await redis.quit();
}

/**
 * Start
 */
main("./import");
