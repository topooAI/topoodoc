"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Children, isValidElement } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./docs-tabs";

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <rect x="9" y="9" width="10" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        d="M5 12.5l4.2 4.2L19 7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function Callout({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "not-prose relative mt-6 grid w-auto grid-cols-[0_1fr] items-start gap-y-0.5 rounded-xl border border-surface bg-surface px-4 py-3 text-sm leading-6 text-surface-foreground md:-mx-1 [&_p]:m-0 [&_strong]:font-medium **:[code]:border",
        className,
      )}
      data-slot="alert"
      role="alert"
      {...props}
    >
      <div
        data-slot="alert-description"
        className="col-start-2 grid justify-items-start gap-1 text-sm text-card-foreground/80 [&_p]:leading-relaxed"
      >
        {children}
      </div>
    </div>
  );
}

export function LinkedCard({
  children,
  className,
  href,
  style,
  ...props
}: HTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const isFrameworkCard =
    href.startsWith("/docs/installation/") ||
    href.startsWith("/docs/rtl/") ||
    href.startsWith("/docs/topooui/installation/") ||
    href.startsWith("/docs/topooui/rtl/");

  return (
    <Link
      href={href}
      className={cn(
        isFrameworkCard
          ? "not-prose flex w-full flex-col items-center rounded-xl bg-surface p-6 text-surface-foreground no-underline transition-colors hover:bg-surface/80 sm:p-10 [&_p]:mt-2 [&_p]:font-medium"
          : "not-prose flex h-full min-h-[132px] flex-col justify-start rounded-xl border bg-background p-6 no-underline transition-colors hover:bg-accent/30",
        className,
      )}
      style={{
        fontSize: "var(--topoo-docs-body-font-size)",
        lineHeight: "var(--topoo-docs-compact-line-height)",
        ...style,
      }}
      {...props}
    >
      {children}
    </Link>
  );
}

export function Steps({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("steps mb-12 pl-8 md:pl-12", className)}>{children}</div>;
}

export function Step({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("topoo-docs-subsection-title step scroll-m-24 font-medium tracking-[-0.35px]", className)}>
      {children}
    </h3>
  );
}

export function Accordion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("not-prose mt-6", className)}>{children}</div>;
}

export function AccordionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <details className={cn("group rounded-xl border bg-background px-4 py-1", className)}>{children}</details>;
}

export function AccordionTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <summary
      className={cn(
        "flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-sm font-medium marker:hidden [&::-webkit-details-marker]:hidden",
        className,
      )}
    >
      <span>{children}</span>
      <ChevronDownIcon />
    </summary>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("pb-4 text-sm text-foreground/80 [&_p+p]:mt-4", className)}>{children}</div>;
}

export function ExpandableFigure({
  children,
  className,
  modalClassName,
  title = "Expanded view",
}: {
  children: ReactNode;
  className?: string;
  modalClassName?: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modal =
    open && mounted
      ? createPortal(
          <div
            aria-label={title}
            aria-modal="true"
            className="fixed inset-0 isolate flex items-center justify-center bg-black/55 p-6"
            onClick={() => setOpen(false)}
            role="dialog"
            style={{ zIndex: 2147483647 }}
          >
            <div
              className={cn(
                "relative max-h-[90vh] w-full max-w-[1400px] overflow-auto rounded-2xl border bg-background p-6 shadow-2xl",
                modalClassName,
              )}
              onClick={(event) => event.stopPropagation()}
              style={{ zIndex: 2147483647 }}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="text-sm font-medium text-foreground">{title}</div>
                <Button onClick={() => setOpen(false)} size="sm" type="button" variant="outline">
                  Close
                </Button>
              </div>
              {children}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className={cn("relative", className)}>
        {children}
        <Button
          className="absolute z-10 rounded-lg bg-background/95 text-foreground shadow-none backdrop-blur hover:bg-muted"
          onClick={() => setOpen(true)}
          size="sm"
          type="button"
          variant="outline"
          style={{ top: "16px", right: "16px" }}
        >
          Expand
        </Button>
      </div>
      {modal}
    </>
  );
}

type ArchitectureMapData = {
  board: {
    title: string;
    subtitle?: string;
  };
  blocks: {
    title: string;
    items: string[];
  };
  chain: {
    title: string;
    subtitle?: string;
    items: string[];
    emphasis?: string;
  };
  sections: Array<{
    kind?: "block-strip" | "spine" | "column-group" | "governance-row";
    type?: "grid" | "stack";
    layout?: "full-width" | "two-column";
    emphasis?: "primary" | "secondary" | "supporting";
    density?: "compact" | "normal";
    title: string;
    subtitle?: string;
    rows: string[][];
  }>;
  governance: {
    title: string;
    items: string[];
  };
};

function MapPill({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex min-h-8 items-center justify-center rounded-xl border px-4 py-1.5 text-center text-[12px] leading-5",
        active
          ? "border-transparent bg-accent font-medium text-accent-foreground"
          : "border-border bg-background text-foreground",
      )}
    >
      {label}
    </div>
  );
}

function MapLayer({
  title,
  subtitle,
  children,
  dense = false,
  emphasis = "secondary",
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  dense?: boolean;
  emphasis?: "primary" | "secondary" | "supporting";
  className?: string;
}) {
  const backgroundColor =
    emphasis === "primary" ? "#ffffff" : emphasis === "secondary" ? "#fafaf9" : "#f5f5f4";

  return (
    <section
      className={cn(
        "rounded-[22px] bg-background shadow-[0_12px_32px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.05)]",
        dense ? "px-5 py-4" : "px-6 py-5",
        className,
      )}
      style={{ backgroundColor }}
    >
      <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1", dense ? "mb-2.5" : "mb-3")}>
        <h3 className="text-[12px] leading-5 font-semibold tracking-tight text-foreground">{title}</h3>
        {subtitle ? <p className="text-[12px] leading-5 text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function ArchitectureMap({
  data,
  className,
}: {
  data: ArchitectureMapData;
  className?: string;
}) {
  return (
    <div
      className={cn("not-prose rounded-[28px] p-6 md:p-7", className)}
      style={{ backgroundColor: "#f5f5f4" }}
    >
      <div className="space-y-6">
        <div
          className="rounded-[22px] px-6 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
          style={{ backgroundColor: "#e7e5e4" }}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="text-[12px] leading-5 font-semibold tracking-tight text-foreground">{data.board.title}</div>
            {data.board.subtitle ? (
              <div className="text-[12px] leading-5 text-muted-foreground">{data.board.subtitle}</div>
            ) : null}
          </div>
        </div>

        <MapLayer dense emphasis="secondary" title={data.blocks.title}>
          <div className="flex flex-wrap gap-2.5">
            {data.blocks.items.map((item) => (
              <MapPill key={item} label={item} />
            ))}
          </div>
        </MapLayer>

        <MapLayer emphasis="primary" title={data.chain.title}>
          {data.chain.subtitle ? (
            <p className="mb-3 text-[12px] leading-5 text-muted-foreground">{data.chain.subtitle}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2.5">
            {data.chain.items.map((item, index) => (
              <div className="flex items-center gap-2" key={item}>
                <MapPill active={item === data.chain.emphasis} label={item} />
                {index < data.chain.items.length - 1 ? (
                  <span className="text-[12px] leading-5 text-muted-foreground">→</span>
                ) : null}
              </div>
            ))}
          </div>
        </MapLayer>

        <div className="grid gap-5 lg:grid-cols-2">
          {data.sections
            .filter((section) => section.layout !== "full-width")
            .map((section) => (
              <MapLayer
                className="h-full"
                dense={section.density === "compact"}
                emphasis={section.emphasis ?? "secondary"}
                key={section.title}
                subtitle={section.subtitle}
                title={section.title}
              >
                <div className={cn("space-y-2.5", section.type === "stack" && "max-w-[28rem]")}>
                  {section.rows.map((row, rowIndex) => (
                    <div
                      className={cn(
                        "flex flex-wrap gap-2.5",
                        section.kind === "governance-row" && "gap-2",
                      )}
                      key={`${section.title}-${rowIndex}`}
                    >
                      {row.map((item) => (
                        <MapPill key={item} label={item} />
                      ))}
                    </div>
                  ))}
                </div>
              </MapLayer>
            ))}
        </div>

        <MapLayer dense emphasis="supporting" title={data.governance.title}>
          <div className="flex flex-wrap gap-2">
            {data.governance.items.map((item) => (
              <MapPill key={item} label={item} />
            ))}
          </div>
        </MapLayer>
      </div>
    </div>
  );
}

export function CodeCollapsibleWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("not-prose mt-6", className)}>{children}</div>;
}

export function PackageTabs({
  commands,
}: {
  commands: Record<string, string>;
}) {
  const entries = Object.entries(commands);
  const [activeCommand, setActiveCommand] = useState(entries[0]?.[0] ?? "pnpm");
  const activeValue = commands[activeCommand] ?? entries[0]?.[1] ?? "";

  return (
    <div className="not-prose relative block overflow-x-auto" data-slot="tabs">
      <div className="flex items-center gap-2 border-b border-border/50 px-3 py-1" data-slot="tabs-header">
        <div className="flex size-4 items-center justify-center rounded-[1px] bg-foreground opacity-70">
          <span className="text-[10px] leading-none text-code">&gt;_</span>
        </div>
        <div
          aria-label="Package manager"
          className="flex items-center gap-0 font-mono"
          data-slot="tabs-list"
          role="radiogroup"
        >
          {entries.map(([name]) => {
            const isActive = activeCommand === name;

            return (
              <button
                key={name}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex h-7 items-center rounded-md border border-transparent px-2 pt-0.5 font-mono text-[14px] font-medium leading-[21px] text-muted-foreground transition-colors shadow-none",
                  isActive && "border-input bg-background text-foreground",
                )}
                onClick={() => setActiveCommand(name)}
                type="button"
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="no-scrollbar block overflow-x-auto" data-slot="tabs-panels">
        <pre className="m-0 px-4 py-3.5">
          <code className="relative font-mono text-sm leading-none" data-language="bash">
            {activeValue}
          </code>
        </pre>
      </div>
      <CopyButton label="Copy command" value={activeValue} className="top-2 right-2" />
    </div>
  );
}

export function CopyButton({
  className,
  label = "Copy code",
  value,
}: {
  className?: string;
  label?: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      aria-label={label}
      className={cn(
        "absolute top-3 right-2 z-10 inline-flex size-7 items-center justify-center rounded-md bg-transparent text-muted-foreground opacity-70 transition-colors hover:text-foreground hover:opacity-100 focus-visible:opacity-100",
        className,
      )}
      data-copied={copied}
      data-slot="copy-button"
      onClick={onCopy}
      type="button"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

function toJsonKey(label: string) {
  const normalized = label
    .trim()
    .replace(/[%/()]+/g, " ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim();

  if (!normalized) return "value";

  const [first, ...rest] = normalized.split(/\s+/);
  return [first.toLowerCase(), ...rest.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())].join("");
}

function renderJsonCode(value: string) {
  const lines = value.split("\n");

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (trimmed === "{" || trimmed === "}") {
      return (
        <span className="block text-muted-foreground" key={`${index}-${line}`}>
          {line}
        </span>
      );
    }

    const match = line.match(/^(\s*)"([^"]+)":\s"([^"]+)"(,?)$/);
    if (!match) {
      return (
        <span className="block text-foreground" key={`${index}-${line}`}>
          {line}
        </span>
      );
    }

    const [, indent, key, stringValue, comma] = match;

    return (
      <span className="block" key={`${index}-${line}`}>
        <span className="text-foreground/60">{indent}</span>
        <span className="text-muted-foreground">"</span>
        <span style={{ color: "var(--json-key, #cf222e)" }}>{key}</span>
        <span className="text-muted-foreground">"</span>
        <span className="text-foreground/70">: </span>
        <span style={{ color: "var(--json-string, #0a3069)" }}>"</span>
        <span style={{ color: "var(--json-string, #0a3069)" }}>{stringValue}</span>
        <span style={{ color: "var(--json-string, #0a3069)" }}>"</span>
        {comma ? <span className="text-foreground/70">{comma}</span> : null}
      </span>
    );
  });
}

function isComponentElement(
  child: ReactNode,
  component: (props: any) => ReactNode,
) {
  return isValidElement(child) && child.type === component;
}

export function SpecPreview({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const childList = Children.toArray(children).filter((child) => {
    if (typeof child === "string") {
      return child.trim().length > 0;
    }

    return child !== null && child !== undefined;
  });
  const elementChildren = childList.filter(isValidElement);
  const preview =
    elementChildren.find((child) => isComponentElement(child, SpecExample)) ??
    elementChildren.find((child) => !isComponentElement(child, SpecProtocol) && !isComponentElement(child, SpecSheet)) ??
    childList[0] ??
    null;
  const protocol = elementChildren.find((child) => isComponentElement(child, SpecProtocol)) ?? null;
  const sheet = elementChildren.find((child) => isComponentElement(child, SpecSheet)) ?? null;
  const [open, setOpen] = useState(false);
  const specEntries = Children.toArray(
    isValidElement(sheet) ? (sheet.props as { children?: ReactNode }).children : sheet,
  )
    .map((child) => {
      if (!isValidElement(child)) {
        return null;
      }

      const props = child.props as { label?: string; value?: string };
      return props.label && props.value ? [props.label, props.value] : null;
    })
    .filter((entry): entry is [string, string] => Array.isArray(entry) && entry.length === 2)
    .map(([label, value]) => [label, value] as const);
  const specJson = JSON.stringify(
    Object.fromEntries(specEntries.map(([label, value]) => [toJsonKey(label), value])),
    null,
    2,
  );
  const previewSpec = specJson.split("\n").slice(0, 4).join("\n");

  return (
    <Tabs className={cn("not-prose mt-6 mb-12", className)} defaultValue="preview">
      <TabsList className="mb-5">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        {protocol ? <TabsTrigger value="protocol">Protocol</TabsTrigger> : null}
      </TabsList>
      <TabsContent value="preview">
        <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-background">
          <div className="relative flex min-h-72 w-full items-center justify-center bg-background p-10">
            <div className="mx-auto w-full max-w-[26rem]">{preview}</div>
          </div>
          {sheet ? (
            <div
              className="relative overflow-hidden border-t **:data-[slot=copy-button]:right-4 **:data-[slot=copy-button]:hidden data-[spec-visible=true]:**:data-[slot=copy-button]:flex [&_[data-rehype-pretty-code-figure]]:m-0! [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-72"
              data-slot="code"
              data-spec-visible={open}
            >
              {open ? (
                <figure className="m-0 bg-muted/25" data-rehype-pretty-code-figure="">
                  <CopyButton label="Copy spec" value={specJson} />
                  <pre className="m-0 overflow-x-auto px-4 py-3.5">
                    <code className="font-mono text-sm leading-6 whitespace-pre-wrap" data-language="json">
                      {renderJsonCode(specJson)}
                    </code>
                  </pre>
                </figure>
              ) : (
                <div className="relative bg-muted/25">
                  <figure className="m-0" data-rehype-pretty-code-figure="">
                    <pre className="m-0 overflow-x-auto px-4 py-3.5">
                      <code className="font-mono text-sm leading-6 whitespace-pre-wrap" data-language="json">
                        {renderJsonCode(previewSpec)}
                      </code>
                    </pre>
                  </figure>
                  <div
                    className="absolute inset-0 flex items-center justify-center pb-4"
                    style={{
                      background:
                        "linear-gradient(to top, var(--color-code), color-mix(in oklab, var(--color-code) 60%, transparent), transparent)",
                    }}
                  >
                    <Button
                      className="relative z-10 rounded-lg bg-background text-foreground shadow-none hover:bg-muted"
                      onClick={() => setOpen(true)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      View Spec
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </TabsContent>
      {protocol ? (
        <TabsContent value="protocol">
          <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-background">
            <div className="relative w-full bg-muted/25">
              <div className="h-full w-full">
                {protocol}
              </div>
            </div>
            {sheet ? (
              <div className="relative overflow-hidden border-t bg-background">
                <div className="relative">
                  <figure className="m-0" data-rehype-pretty-code-figure="">
                    <pre className="m-0 overflow-x-auto bg-background px-4 py-3.5">
                      <code className="font-mono text-sm leading-6 whitespace-pre-wrap" data-language="json">
                        {renderJsonCode(previewSpec)}
                      </code>
                    </pre>
                  </figure>
                  <div
                    className="absolute inset-0 flex items-center justify-center pb-4"
                    style={{
                      background:
                        "linear-gradient(to top, color-mix(in oklab, var(--background) 92%, transparent), color-mix(in oklab, var(--background) 35%, transparent), transparent)",
                    }}
                  >
                    <Button
                      className="relative z-10 rounded-lg bg-background text-foreground shadow-none hover:bg-muted"
                      onClick={() => setOpen(true)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      View Spec
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </TabsContent>
      ) : null}
    </Tabs>
  );
}

export function SpecExample({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(className)}>{children}</div>;
}

export function SpecSheet({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("grid gap-3", className)}>{children}</div>;
}

export function SpecCaption({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("not-prose mt-4 text-sm leading-6 text-muted-foreground", className)}>{children}</p>;
}

export function SpecProtocol({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

export function ProtocolCode({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const rawLines = code.replace(/^\n+|\n+$/g, "").split("\n");
  const contentLines = rawLines.filter((line) => line.trim().length > 0);
  const sharedIndent = contentLines.reduce<number>((current, line) => {
    const match = line.match(/^(\s*)/);
    const indent = match ? match[1].length : 0;

    return current === 0 ? indent : Math.min(current, indent);
  }, 0);
  const lines = rawLines.map((line) => line.slice(sharedIndent));

  return (
    <div className={cn("h-full w-full overflow-hidden px-4 py-3.5 text-left", className)}>
      <pre
        className="m-0 w-full overflow-hidden text-left bg-transparent font-mono text-[13px] leading-7"
        style={{
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        <code>
        {lines.map((line, index) => {
          const trimmed = line.trim();

          if (trimmed === "{" || trimmed === "}" || trimmed === "[" || trimmed === "]") {
            return (
              <span className="block text-foreground/45" key={`${index}-${line}`}>
                {line}
              </span>
            );
          }

          const keyValueMatch = line.match(/^(\s*)"([^"]+)":\s"([^"]+)"(,?)$/);
          if (keyValueMatch) {
            const [, indent, key, stringValue, comma] = keyValueMatch;

            return (
              <span className="block" key={`${index}-${line}`}>
                <span className="text-foreground/35">{indent}</span>
                <span className="text-foreground/45">"</span>
                <span style={{ color: "var(--json-key, #cf222e)" }}>{key}</span>
                <span className="text-foreground/45">"</span>
                <span className="text-foreground/55">: </span>
                <span style={{ color: "var(--json-string, #0a3069)" }}>"{stringValue}"</span>
                {comma ? <span className="text-foreground/45">{comma}</span> : null}
              </span>
            );
          }

          const arrayItemMatch = line.match(/^(\s*)"([^"]+)"(,?)$/);
          if (arrayItemMatch) {
            const [, indent, stringValue, comma] = arrayItemMatch;

            return (
              <span className="block" key={`${index}-${line}`}>
                <span className="text-foreground/35">{indent}</span>
                <span style={{ color: "var(--json-string, #0a3069)" }}>"{stringValue}"</span>
                {comma ? <span className="text-foreground/45">{comma}</span> : null}
              </span>
            );
          }

          return (
            <span className="block text-foreground/72" key={`${index}-${line}`}>
              {line}
            </span>
          );
        })}
        </code>
      </pre>
    </div>
  );
}

export function SpecRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-baseline sm:gap-4">
      <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</div>
      <code className="rounded-md bg-background px-[0.45rem] py-[0.3rem] font-mono text-[12.8px] leading-[20.8px] text-foreground">
        {value}
      </code>
    </div>
  );
}
