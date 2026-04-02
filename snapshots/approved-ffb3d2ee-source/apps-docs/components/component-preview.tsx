import { readFile } from "node:fs/promises";
import path from "node:path";
import { ComponentPreviewClient } from "@/components/component-preview-client";

const shadcnRoot = "/tmp/shadcn-ui/apps/v4";

function previewSourcePath(name: string, styleName: string) {
  if (name.startsWith("accordion") && name !== "accordion-demo") {
    const base = styleName.startsWith("base") ? "base" : "radix";
    return path.join(shadcnRoot, "registry", "bases", base, "examples", "accordion-example.tsx");
  }

  if (name === "card-rtl") {
    const base = styleName.startsWith("base") ? "base" : "radix";
    return path.join(shadcnRoot, "examples", base, "card-rtl.tsx");
  }

  return path.join(shadcnRoot, "app", "(internal)", "sink", "components", `${name}.tsx`);
}

export async function ComponentPreview({
  align = "center",
  caption,
  chromeLessOnMobile: _chromeLessOnMobile,
  className,
  description: _description,
  direction = "ltr",
  hideCode = false,
  name,
  previewClassName,
  styleName: _styleName,
  type: _type,
}: {
  align?: "center" | "start" | "end";
  caption?: string;
  chromeLessOnMobile?: boolean;
  className?: string;
  description?: string;
  direction?: "ltr" | "rtl";
  hideCode?: boolean;
  name: string;
  previewClassName?: string;
  styleName?: string;
  type?: "block" | "component" | "example";
}) {
  const styleName = _styleName ?? "radix-nova";
  let sourceCode = "";

  try {
    sourceCode = await readFile(previewSourcePath(name, styleName), "utf8");
  } catch {
    sourceCode = `// Preview source for ${name} is not available yet.`;
  }

  const previewSource = sourceCode.split("\n").slice(0, 3).join("\n");

  return (
    <ComponentPreviewClient
      align={align}
      caption={caption}
      className={className}
      direction={direction}
      hideCode={hideCode}
      name={name}
      previewClassName={previewClassName}
      previewSource={previewSource}
      sourceCode={sourceCode}
    />
  );
}
