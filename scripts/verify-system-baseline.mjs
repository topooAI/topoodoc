import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const rootDir = path.resolve(currentDir, "..");

const snapshotDir = path.join(
  rootDir,
  "snapshots/approved-ffb3d2ee-source/apps-docs/content/docs/topooui",
);
const systemDir = path.join(rootDir, "system-content/docs/topooui");

if (process.env.TOPOODOC_SKIP_SYSTEM_BASELINE_GUARD === "true") {
  console.warn("[system:baseline] skipped by TOPOODOC_SKIP_SYSTEM_BASELINE_GUARD=true");
  process.exit(0);
}

async function collectFiles(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, relativePath)));
      continue;
    }

    files.push(relativePath);
  }

  return files.sort();
}

function sha(input) {
  return createHash("sha256").update(input).digest("hex");
}

async function readHashes(dir, files) {
  const map = new Map();

  for (const relativePath of files) {
    const raw = await readFile(path.join(dir, relativePath), "utf8");
    map.set(relativePath, sha(raw));
  }

  return map;
}

const snapshotFiles = await collectFiles(snapshotDir);
const systemFiles = await collectFiles(systemDir);

const snapshotSet = new Set(snapshotFiles);
const systemSet = new Set(systemFiles);

const missing = snapshotFiles.filter((file) => !systemSet.has(file));
const extra = systemFiles.filter((file) => !snapshotSet.has(file));

const compared = snapshotFiles.filter((file) => systemSet.has(file));
const snapshotHashes = await readHashes(snapshotDir, compared);
const systemHashes = await readHashes(systemDir, compared);
const changed = compared.filter((file) => snapshotHashes.get(file) !== systemHashes.get(file));

if (missing.length === 0 && extra.length === 0 && changed.length === 0) {
  console.log("[system:baseline] TopooUI matches approved snapshot");
  process.exit(0);
}

console.error("[system:baseline] TopooUI diverged from approved snapshot.");

if (missing.length > 0) {
  console.error(`missing (${missing.length}):`);
  for (const file of missing) console.error(`  - ${file}`);
}

if (extra.length > 0) {
  console.error(`extra (${extra.length}):`);
  for (const file of extra) console.error(`  - ${file}`);
}

if (changed.length > 0) {
  console.error(`changed (${changed.length}):`);
  for (const file of changed) console.error(`  - ${file}`);
}

console.error(
  "Refusing to build or deploy. Restore TopooUI to the approved baseline or explicitly bypass with TOPOODOC_SKIP_SYSTEM_BASELINE_GUARD=true.",
);

process.exit(1);
