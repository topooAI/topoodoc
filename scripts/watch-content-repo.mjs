import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const rootDir = path.resolve(currentDir, "..");
const syncScriptPath = path.resolve(currentDir, "./sync-content-repo.mjs");
const scanIntervalMs = 700;

function parseArgs(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (!arg.startsWith("--")) {
      continue;
    }

    options[arg.slice(2)] = next && !next.startsWith("--") ? next : "true";
    if (next && !next.startsWith("--")) {
      index += 1;
    }
  }

  return options;
}

const args = parseArgs(process.argv.slice(2));
const contentRepoDir = path.resolve(rootDir, args.content ?? process.env.TOPOODOC_CONTENT_REPO ?? "../topoo-docs");
const watchRoots = [path.join(contentRepoDir, "content/docs"), path.join(contentRepoDir, "topoodoc.content.json")];
const watchExtensions = new Set([".md", ".mdx", ".json"]);

let running = false;
let pending = false;
let scanning = false;
let previousSnapshot = new Map();
let debounceTimer = null;
let scanTimer = null;

function log(message) {
  console.log(`[content:watch] ${message}`);
}

function runSync() {
  if (running) {
    pending = true;
    return;
  }

  running = true;
  const child = spawn(process.execPath, [syncScriptPath, ...process.argv.slice(2)], {
    cwd: rootDir,
    stdio: "inherit",
  });

  child.on("exit", (code) => {
    running = false;
    if (code !== 0) {
      log(`sync failed with exit code ${code}`);
    } else {
      log("sync complete");
    }

    if (pending) {
      pending = false;
      runSync();
    }
  });
}

function scheduleSync(reason) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    log(`change detected in ${reason}`);
    runSync();
  }, 180);
}

async function collectFiles(target) {
  const fileStat = await stat(target);
  if (!fileStat.isDirectory()) {
    return [target];
  }

  const entries = await readdir(target, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    if (!watchExtensions.has(path.extname(entry.name))) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

async function buildSnapshot() {
  const snapshot = new Map();

  for (const target of watchRoots) {
    const files = await collectFiles(target);
    for (const filePath of files) {
      const info = await stat(filePath);
      snapshot.set(filePath, `${info.mtimeMs}:${info.size}`);
    }
  }

  return snapshot;
}

function firstChangedPath(currentSnapshot) {
  for (const [filePath, signature] of currentSnapshot) {
    if (previousSnapshot.get(filePath) !== signature) {
      return path.relative(contentRepoDir, filePath);
    }
  }

  for (const filePath of previousSnapshot.keys()) {
    if (!currentSnapshot.has(filePath)) {
      return path.relative(contentRepoDir, filePath);
    }
  }

  return null;
}

async function scanForChanges() {
  if (scanning) {
    return;
  }

  scanning = true;

  try {
    const currentSnapshot = await buildSnapshot();
    const changedPath = firstChangedPath(currentSnapshot);
    previousSnapshot = currentSnapshot;

    if (changedPath) {
      scheduleSync(changedPath);
    }
  } finally {
    scanning = false;
  }
}

runSync();
previousSnapshot = await buildSnapshot();
scanTimer = setInterval(() => {
  void scanForChanges();
}, scanIntervalMs);
log(`polling ${contentRepoDir} every ${scanIntervalMs}ms`);

function shutdown() {
  if (scanTimer) {
    clearInterval(scanTimer);
    scanTimer = null;
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
