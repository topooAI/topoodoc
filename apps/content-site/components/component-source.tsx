import { readFile } from "node:fs/promises";
import path from "node:path";
import { CodeCollapsibleWrapper, CopyButton } from "@/components/docs-mdx";
import { cn } from "@/lib/utils";

const shadcnRoot = "/tmp/shadcn-ui/apps/v4";

function getRegistrySourcePath(name: string, styleName: string) {
  const base = styleName.startsWith("base") ? "base" : "radix";
  return path.join(shadcnRoot, "registry", "bases", base, "ui", `${name}.tsx`);
}

function trimCode(code: string, maxLines?: number) {
  if (!maxLines) {
    return code;
  }

  return code.split("\n").slice(0, maxLines).join("\n");
}

export async function ComponentSource({
  className,
  collapsible = true,
  language,
  maxLines,
  name,
  src,
  styleName = "radix-nova",
  title,
}: {
  className?: string;
  collapsible?: boolean;
  language?: string;
  maxLines?: number;
  name?: string;
  src?: string;
  styleName?: string;
  title?: string;
}) {
  const filePath = src ? path.join(shadcnRoot, src) : name ? getRegistrySourcePath(name, styleName) : null;

  if (!filePath) {
    return null;
  }

  let code = "";

  try {
    code = await readFile(filePath, "utf8");
  } catch {
    return null;
  }

  const renderedCode = trimCode(code, maxLines);
  const lang = language ?? title?.split(".").pop() ?? "tsx";
  const figure = (
    <figure className="[&>pre]:max-h-96" data-rehype-pretty-code-figure="">
      {title ? <figcaption data-language={lang} data-rehype-pretty-code-title="">{title}</figcaption> : null}
      <CopyButton value={code} />
      <pre className="m-0 overflow-x-auto px-4 py-3.5">
        <code className="font-mono text-sm leading-6" data-language={lang}>
          {renderedCode}
        </code>
      </pre>
    </figure>
  );

  if (!collapsible) {
    return <div className={cn("relative", className)}>{figure}</div>;
  }

  return <CodeCollapsibleWrapper className={className}>{figure}</CodeCollapsibleWrapper>;
}
