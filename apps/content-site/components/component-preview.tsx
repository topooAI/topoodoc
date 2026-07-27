import { readFile } from "node:fs/promises";
import path from "node:path";
import type { CSSProperties, ReactNode } from "react";
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
  codeClassName,
  children,
  description: _description,
  direction = "ltr",
  hideCode = false,
  name,
  previewWrapperClassName,
  previewWrapperStyle,
  previewClassName,
  rawPreview = false,
  previewSource: explicitPreviewSource,
  sourceCode: explicitSourceCode,
  styleName: _styleName,
  type: _type,
}: {
  align?: "center" | "start" | "end";
  caption?: string;
  chromeLessOnMobile?: boolean;
  className?: string;
  codeClassName?: string;
  children?: ReactNode;
  description?: string;
  direction?: "ltr" | "rtl";
  hideCode?: boolean;
  name?: string;
  previewWrapperClassName?: string;
  previewWrapperStyle?: CSSProperties;
  previewClassName?: string;
  rawPreview?: boolean;
  previewSource?: string;
  sourceCode?: string;
  styleName?: string;
  type?: "block" | "component" | "example";
}) {
  const styleName = _styleName ?? "radix-nova";
  let sourceCode = explicitSourceCode ?? "";

  if (!sourceCode && name) {
    try {
      sourceCode = await readFile(previewSourcePath(name, styleName), "utf8");
    } catch {
      sourceCode = `// Preview source for ${name} is not available yet.`;
    }
  }

  const previewSource = explicitPreviewSource ?? sourceCode.split("\n").slice(0, 3).join("\n");

  return (
    <ComponentPreviewClient
      align={align}
      caption={caption}
      className={className}
      codeClassName={codeClassName}
      customPreview={children}
      direction={direction}
      hideCode={hideCode}
      name={name ?? "custom-preview"}
      previewWrapperClassName={previewWrapperClassName}
      previewWrapperStyle={previewWrapperStyle}
      previewClassName={previewClassName}
      rawPreview={rawPreview}
      previewSource={previewSource}
      sourceCode={sourceCode}
    />
  );
}
