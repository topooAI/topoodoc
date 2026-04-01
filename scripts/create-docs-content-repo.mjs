import { cp, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const rootDir = path.resolve(currentDir, "..");
const templateDir = path.resolve(rootDir, "templates/docs-content-repo");

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

async function replacePlaceholders(dir, replacements) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await replacePlaceholders(entryPath, replacements);
      continue;
    }

    const raw = await readFile(entryPath, "utf8");
    const replaced = Object.entries(replacements).reduce(
      (content, [key, value]) => content.replaceAll(key, value),
      raw,
    );
    await writeFile(entryPath, replaced, "utf8");
  }
}

const args = parseArgs(process.argv.slice(2));
const siteName = args.name ?? "Acme Docs";
const siteDescription = args.description ?? `${siteName} documentation.`;
const domain = args.domain ?? "docs.example.com";
const githubUrl = args.github ?? "https://github.com/your-org/your-docs";
const target = args.target ?? `${slugify(siteName)}-docs`;
const absoluteTarget = path.resolve(rootDir, target);

try {
  await stat(absoluteTarget);
  throw new Error(`Target already exists: ${absoluteTarget}`);
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code !== "ENOENT") {
    throw error;
  }
}

await mkdir(path.dirname(absoluteTarget), { recursive: true });
await cp(templateDir, absoluteTarget, { recursive: true });
await replacePlaceholders(absoluteTarget, {
  "__DOMAIN__": domain,
  "__GITHUB_URL__": githubUrl,
  "__SITE_DESCRIPTION__": siteDescription,
  "__SITE_NAME__": siteName,
});

console.log(`[docs-content] Created pure content repo at ${absoluteTarget}`);
console.log(`[docs-content] This repo holds only content/docs/** and top-level docs metadata.`);
