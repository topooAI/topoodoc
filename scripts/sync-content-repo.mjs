import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
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

function titleFromSlug(slug) {
  if (slug === "mcp") {
    return "MCP";
  }

  if (slug === "topooui") {
    return "TopooUI";
  }

  if (slug.startsWith("to")) {
    return `to${slug.slice(2).replace(/(^|-)([a-z])/g, (_, prefix, char) => `${prefix === "-" ? "" : ""}${char.toUpperCase()}`)}`;
  }

  return slug
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function parseFrontmatterTitle(raw) {
  if (raw.startsWith("---\n")) {
    const endIndex = raw.indexOf("\n---\n", 4);
    if (endIndex !== -1) {
      const frontmatter = raw.slice(4, endIndex);
      const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
      if (titleMatch?.[1]) {
        return titleMatch[1].trim().replace(/^['"]|['"]$/g, "");
      }
    }
  }

  const headingMatch = raw.match(/^#\s+(.+)$/m);
  return headingMatch?.[1]?.trim();
}

function docsUrlFromRelativePath(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  const withoutExt = normalized.replace(/\.(md|mdx)$/u, "");
  if (withoutExt === "index") {
    return "/docs";
  }

  if (withoutExt.endsWith("/index")) {
    return `/docs/${withoutExt.slice(0, -"/index".length)}`;
  }

  return `/docs/${withoutExt}`;
}

async function collectDocFiles(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectDocFiles(fullPath, relativePath)));
      continue;
    }

    if (!/\.(md|mdx)$/u.test(entry.name)) {
      continue;
    }

    files.push(relativePath);
  }

  return files;
}

async function collectAllFiles(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectAllFiles(fullPath, relativePath)));
      continue;
    }

    files.push(relativePath);
  }

  return files;
}

async function collectRootDocDirs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function docsUrlFromDir(relativeDir) {
  const normalized = relativeDir.replace(/\\/g, "/");
  return normalized ? `/docs/${normalized}` : "/docs";
}

async function buildSectionsFromMetaTree(rootName, docsDir) {
  const rootDir = path.join(docsDir, rootName);
  const rootMetaPath = path.join(rootDir, "meta.json");
  const rootMeta = await readJsonIfExists(rootMetaPath, null);

  if (!rootMeta?.pages) {
    return [];
  }

  const sections = [];
  const rootItems = [];

  for (const page of rootMeta.pages) {
    if (page === "index") {
      continue;
    }

    const sectionDir = path.join(rootDir, page);
    const sectionMeta = await readJsonIfExists(path.join(sectionDir, "meta.json"), null);

    if (sectionMeta?.pages) {
      const items = sectionMeta.pages
        .filter((entry) => entry !== "index")
        .map((entry) => {
          const href = entry === "index"
            ? docsUrlFromDir(`${rootName}/${page}`)
            : docsUrlFromDir(`${rootName}/${page}/${entry}`);
          return {
            href,
            label: titleFromSlug(entry),
          };
        });

      sections.push({
        label: sectionMeta.title ?? titleFromSlug(page),
        items: [
          {
            href: docsUrlFromDir(`${rootName}/${page}`),
            label: sectionMeta.title ?? titleFromSlug(page),
          },
          ...items,
        ],
      });
      continue;
    }

    rootItems.push({
      href: docsUrlFromDir(`${rootName}/${page}`),
      label: titleFromSlug(page),
    });
  }

  if (rootItems.length > 0) {
    sections.unshift({
      label: rootMeta.title ?? titleFromSlug(rootName),
      items: rootItems,
    });
  }

  return sections;
}

function renderDocsConfig(contentConfig, navLabelByUrl) {
  const metadataTitle = JSON.stringify(contentConfig.site?.title ?? "Docs");
  const metadataDescription = JSON.stringify(contentConfig.site?.description ?? "Documentation.");
  const githubCountLabel = JSON.stringify(contentConfig.shell?.githubCountLabel ?? "Source");
  const githubHref = JSON.stringify(contentConfig.shell?.githubHref ?? "https://github.com/your-org/your-docs");
  const homeAriaLabel = JSON.stringify(contentConfig.shell?.homeAriaLabel ?? `${contentConfig.site?.title ?? "Docs"} home`);
  const homeHref = JSON.stringify(contentConfig.shell?.homeHref ?? "/docs");
  const newHref = JSON.stringify(contentConfig.shell?.newHref ?? "/docs");
  const newLabel = JSON.stringify(contentConfig.shell?.newLabel ?? "Docs");
  const showGithubLink = contentConfig.shell?.showGithubLink ?? true;
  const showPrimaryAction = contentConfig.shell?.showPrimaryAction ?? false;
  const showSearch = contentConfig.shell?.showSearch ?? true;
  const primaryNav = JSON.stringify(contentConfig.navigation?.primary ?? [{ href: "/docs", label: "Docs" }], null, 2);
  const navMap = JSON.stringify(navLabelByUrl, null, 2);
  const sidebarSectionsByRoot = JSON.stringify(contentConfig.navigation?.sidebarSectionsByRoot ?? {}, null, 2);

  return `import type { DocsShellNavItem } from "@topoo/fumadocs-system";

export const docsSite = {
  metadata: {
    description: ${metadataDescription},
    title: ${metadataTitle},
  },
  shell: {
    githubCountLabel: ${githubCountLabel},
    githubHref: ${githubHref},
    homeAriaLabel: ${homeAriaLabel},
    homeHref: ${homeHref},
    navLabelByUrl: ${navMap},
    sidebarSectionsByRoot: ${sidebarSectionsByRoot},
    newHref: ${newHref},
    newLabel: ${newLabel},
    primaryNav: ${primaryNav} satisfies DocsShellNavItem[],
    showGithubLink: ${showGithubLink},
    showSearch: ${showSearch},
    showPrimaryAction: ${showPrimaryAction},
  },
} as const;
`;
}

async function readJsonIfExists(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function buildSidebarSectionsByRoot({ boards, blocks, topics, docsDir }) {
  const topicsByBlock = new Map();
  for (const topic of topics) {
    const list = topicsByBlock.get(topic.blockId) ?? [];
    list.push(topic);
    topicsByBlock.set(topic.blockId, list);
  }

  const blocksByBoard = new Map();
  for (const block of blocks) {
    const list = blocksByBoard.get(block.boardId) ?? [];
    list.push(block);
    blocksByBoard.set(block.boardId, list);
  }

  const result = {};

  for (const board of boards) {
    if (!board?.id) {
      continue;
    }

    if (board.id === "topooui") {
      result[board.id] = await buildSectionsFromMetaTree(board.id, docsDir);
      continue;
    }

    const boardBlocks = blocksByBoard.get(board.id) ?? [];
    const sections = boardBlocks
      .map((block) => {
        const blockTopics = [...(topicsByBlock.get(block.id) ?? [])].sort(
          (left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER),
        );
        const items = blockTopics.map((topic) => ({
          href: topic.href,
          label: topic.label,
        }));

        if (items.length === 0) {
          return null;
        }

        return {
          label: block.label,
          items,
        };
      })
      .filter(Boolean);

    if (sections.length > 0) {
      result[board.id] = sections;
    }
  }

  if (!result.topooui) {
    const topoouiSections = await buildSectionsFromMetaTree("topooui", docsDir);
    if (topoouiSections.length > 0) {
      result.topooui = topoouiSections;
    }
  }

  return result;
}

const args = parseArgs(process.argv.slice(2));
const contentRepoDir = path.resolve(rootDir, args.content ?? process.env.TOPOODOC_CONTENT_REPO ?? "../topoo-docs");
const siteDir = path.resolve(rootDir, args.site ?? "apps/content-site");
const contentSourceDir = path.join(contentRepoDir, "content/docs");
const contentTargetDir = path.join(siteDir, "content/docs");
const systemContentDir = path.join(rootDir, "system-content/docs");
const systemOwnedRoots = ["topooui"];
const contentConfigPath = path.join(contentRepoDir, "topoodoc.content.json");
const docsConfigPath = path.join(siteDir, "docs.config.ts");
const contentModelDir = path.join(contentRepoDir, "content-model");

await rm(contentTargetDir, { recursive: true, force: true });
await mkdir(path.dirname(contentTargetDir), { recursive: true });
await cp(contentSourceDir, contentTargetDir, { recursive: true });

for (const rootName of systemOwnedRoots) {
  await rm(path.join(contentTargetDir, rootName), { recursive: true, force: true });
}

try {
  const systemFiles = await collectAllFiles(systemContentDir);

  for (const relativePath of systemFiles) {
    const sourcePath = path.join(systemContentDir, relativePath);
    const targetPath = path.join(contentTargetDir, relativePath);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await cp(sourcePath, targetPath);
  }
} catch {
  // no system baseline content yet
}

const rootMetaPath = path.join(contentTargetDir, "meta.json");
const rootMeta = JSON.parse(await readFile(rootMetaPath, "utf8"));
const rootDirs = await collectRootDocDirs(contentTargetDir);
const rootPages = rootDirs.filter((name) => name !== "index");
rootMeta.pages = ["index", ...rootPages];
await writeFile(rootMetaPath, `${JSON.stringify(rootMeta, null, 2)}\n`, "utf8");

const contentConfig = JSON.parse(await readFile(contentConfigPath, "utf8"));
const boards = await readJsonIfExists(path.join(contentModelDir, "boards.json"), []);
const blocks = await readJsonIfExists(path.join(contentModelDir, "blocks.json"), []);
const topics = await readJsonIfExists(path.join(contentModelDir, "topics.json"), []);
contentConfig.navigation = contentConfig.navigation ?? {};
contentConfig.navigation.sidebarSectionsByRoot = await buildSidebarSectionsByRoot({
  boards,
  blocks,
  topics,
  docsDir: contentTargetDir,
});
const docFiles = await collectDocFiles(contentTargetDir);
const navLabelByUrl = {};

for (const item of contentConfig.navigation?.primary ?? []) {
  navLabelByUrl[item.href] = item.label;
}

for (const relativePath of docFiles) {
  const filePath = path.join(contentTargetDir, relativePath);
  const raw = await readFile(filePath, "utf8");
  const url = docsUrlFromRelativePath(relativePath);
  const fallback = titleFromSlug(path.basename(relativePath, path.extname(relativePath)));
  navLabelByUrl[url] = parseFrontmatterTitle(raw) ?? fallback;
}

await writeFile(docsConfigPath, renderDocsConfig(contentConfig, navLabelByUrl), "utf8");

console.log(`[content:sync] Synced ${contentRepoDir} into ${siteDir}`);
