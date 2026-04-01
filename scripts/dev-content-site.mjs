import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const rootDir = path.resolve(currentDir, "..");

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
const siteDir = path.resolve(rootDir, args.site ?? "apps/content-site");
const forwardedArgs = process.argv.slice(2);

const watchProcess = spawn(process.execPath, [path.resolve(currentDir, "./watch-content-repo.mjs"), ...forwardedArgs], {
  cwd: rootDir,
  stdio: "inherit",
});

const nextProcess = spawn("pnpm", ["exec", "next", "dev", "--webpack"], {
  cwd: siteDir,
  stdio: "inherit",
});

function shutdown(signal) {
  watchProcess.kill(signal);
  nextProcess.kill(signal);
}

watchProcess.on("exit", (code) => {
  if (code !== 0) {
    nextProcess.kill("SIGTERM");
    process.exit(code ?? 1);
  }
});

nextProcess.on("exit", (code) => {
  watchProcess.kill("SIGTERM");
  process.exit(code ?? 0);
});

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
