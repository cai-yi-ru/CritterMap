/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

const TARGET_FILE = path.join(process.cwd(), "src", "utils", "HospitalUpdates.ts");
const LIST_DECLARATION = "export const HospitalUpdateList: HospitalUpdate[] = [";

function usage() {
  console.log(`Usage: node scripts/pruneHospitalUpdates.cjs [--write] [--today YYYY-MM-DD]

Prunes HospitalUpdates.ts to keep only this month and last month by updatedAt.
Runs as a dry-run unless --write is provided.`);
}

function parseArgs(argv) {
  const options = {
    write: false,
    today: getLocalDateString(),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }

    if (arg === "--write") {
      options.write = true;
      continue;
    }

    if (arg === "--today") {
      options.today = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith("--today=")) {
      options.today = arg.slice("--today=".length);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  assertDateString(options.today, "--today");

  return options;
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function assertDateString(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
    throw new Error(`${label} must use YYYY-MM-DD format.`);
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isValid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isValid) {
    throw new Error(`${label} is not a valid calendar date.`);
  }
}

function getCutoffDateString(today) {
  const [year, month] = today.split("-").map(Number);
  const cutoff = new Date(Date.UTC(year, month - 2, 1));
  const cutoffYear = cutoff.getUTCFullYear();
  const cutoffMonth = String(cutoff.getUTCMonth() + 1).padStart(2, "0");

  return `${cutoffYear}-${cutoffMonth}-01`;
}

function extractUpdateBlocks(content) {
  const declarationIndex = content.indexOf(LIST_DECLARATION);

  if (declarationIndex === -1) {
    throw new Error(`Could not find ${LIST_DECLARATION}`);
  }

  const bodyStart = declarationIndex + LIST_DECLARATION.length;
  const bodyEnd = content.indexOf("\n];", bodyStart);

  if (bodyEnd === -1) {
    throw new Error("Could not find the end of HospitalUpdateList.");
  }

  const body = content.slice(bodyStart, bodyEnd);
  const blocks = [];
  let depth = 0;
  let blockStart = -1;

  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];

    if (char === "{") {
      if (depth === 0) {
        blockStart = body.lastIndexOf("\n", index) + 1;
      }
      depth += 1;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0 && blockStart !== -1) {
        blocks.push(body.slice(blockStart, index + 1).trimEnd());
        blockStart = -1;
      }
    }
  }

  if (depth !== 0) {
    throw new Error("HospitalUpdateList contains unbalanced braces.");
  }

  return {
    before: content.slice(0, bodyStart),
    after: content.slice(bodyEnd),
    blocks,
  };
}

function getField(block, fieldName) {
  const pattern = new RegExp(`${fieldName}:\\s*['"\`]([^'"\`]+)['"\`]`);
  const match = block.match(pattern);
  return match ? match[1] : undefined;
}

function classifyBlocks(blocks, cutoff) {
  const keep = [];
  const prune = [];

  for (const block of blocks) {
    const id = getField(block, "id");
    const updatedAt = getField(block, "updatedAt");

    if (!id) {
      throw new Error("Every HospitalUpdate must include an id.");
    }

    if (!updatedAt) {
      throw new Error(`HospitalUpdate ${id} must include updatedAt.`);
    }

    assertDateString(updatedAt, `${id}.updatedAt`);

    const item = { block, id, updatedAt };

    if (updatedAt >= cutoff) {
      keep.push(item);
    } else {
      prune.push(item);
    }
  }

  return { keep, prune };
}

function formatList(before, after, keep) {
  const body = keep.length > 0
    ? `\n${keep.map((item) => item.block).join(",\n")},`
    : "\n";

  return `${before}${body}${after}`;
}

function logSummary({ cutoff, today, write, keep, prune }) {
  console.log(`HospitalUpdates prune ${write ? "write" : "dry-run"}`);
  console.log(`Today: ${today}`);
  console.log(`Keeping updates from: ${cutoff}`);
  console.log(`Keep: ${keep.length}`);
  console.log(`Prune: ${prune.length}`);

  if (prune.length > 0) {
    console.log("\nWill prune:");
    for (const item of prune) {
      console.log(`- ${item.updatedAt} ${item.id}`);
    }
  }

  if (keep.length > 0) {
    console.log("\nWill keep:");
    for (const item of keep) {
      console.log(`- ${item.updatedAt} ${item.id}`);
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const cutoff = getCutoffDateString(options.today);
  const content = fs.readFileSync(TARGET_FILE, "utf8");
  const parsed = extractUpdateBlocks(content);
  const classified = classifyBlocks(parsed.blocks, cutoff);

  logSummary({
    cutoff,
    today: options.today,
    write: options.write,
    keep: classified.keep,
    prune: classified.prune,
  });

  if (!options.write) {
    console.log("\nDry-run only. Pass --write to update HospitalUpdates.ts.");
    return;
  }

  if (classified.prune.length === 0) {
    console.log("\nNo expired HospitalUpdates to prune.");
    return;
  }

  fs.writeFileSync(
    TARGET_FILE,
    formatList(parsed.before, parsed.after, classified.keep),
    "utf8",
  );
  console.log("\nHospitalUpdates.ts updated.");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
