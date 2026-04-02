import { BoardLandingTemplate, DocsSystemIndexTemplate, LinkIndexTemplate } from "@topoo/fumadocs-system";

type SystemPageDefinition = {
  render: () => React.ReactNode;
};

const topoUiLandingCards = [
  {
    href: "/docs/topooui/components",
    title: "Components",
    description: "Browse reference components and preview the TopooUI component surface.",
  },
  {
    href: "/docs/topooui/installation",
    title: "Installation",
    description: "Set up dependencies, packages, and runtime structure for the UI system.",
  },
  {
    href: "/docs/topooui/theming",
    title: "Theming",
    description: "Tokens, CSS variables, and visual system configuration for shared UI.",
  },
  {
    href: "/docs/topooui/forms",
    title: "Forms",
    description: "Validate form patterns and field-level docs treatment.",
  },
  {
    href: "/docs/topooui/registry",
    title: "Registry",
    description: "Manage code distribution, namespaces, and reusable delivery patterns.",
  },
  {
    href: "/docs/topooui/changelog",
    title: "Changelog",
    description: "Track structural and visual changes to the shared documentation system.",
  },
];

const topoUiComponentItems = [
  "Accordion",
  "Alert",
  "Alert Dialog",
  "Aspect Ratio",
  "Avatar",
  "Badge",
  "Breadcrumb",
  "Button",
  "Button Group",
  "Calendar",
  "Card",
  "Carousel",
  "Chart",
  "Checkbox",
  "Collapsible",
  "Combobox",
  "Command",
  "Context Menu",
  "Data Table",
  "Date Picker",
  "Dialog",
  "Direction",
  "Drawer",
  "Dropdown Menu",
  "Empty",
  "Field",
  "Form",
  "Hover Card",
  "Input",
  "Input Group",
  "Input OTP",
  "Item",
  "Kbd",
  "Label",
  "Menubar",
  "Native Select",
  "Navigation Menu",
  "Pagination",
  "Popover",
  "Progress",
  "Radio Group",
  "Resizable",
  "Scroll Area",
  "Select",
  "Separator",
  "Sheet",
  "Sidebar",
  "Skeleton",
  "Slider",
  "Sonner",
  "Spinner",
  "Switch",
  "Table",
  "Tabs",
  "Textarea",
  "Toast",
  "Toggle",
  "Toggle Group",
  "Tooltip",
  "Typography",
].map((title) => ({
  title,
  href: `/docs/topooui/components/${title.toLowerCase().replaceAll(" ", "-")}`,
}));

const topoUiDocsCards = [
  {
    href: "/docs/topooui/docs/schema",
    title: "Schema",
    description: "Page types, block types, and the allowed structure of content data.",
  },
  {
    href: "/docs/topooui/docs/renderer-contract",
    title: "Renderer Contract",
    description: "Which templates and blocks own final rendering for each schema type.",
  },
  {
    href: "/docs/topooui/docs/blocks",
    title: "Blocks",
    description: "Documentation-specific blocks such as preview + code, installation, callout, and package tabs.",
  },
  {
    href: "/docs/topooui/docs/content-ownership",
    title: "Content Ownership",
    description: "The boundary between content repos and the topoodoc rendering system.",
  },
];

const systemPages: Record<string, SystemPageDefinition> = {
  "/docs/topooui": {
    render: () => (
      <BoardLandingTemplate cards={topoUiLandingCards}>
        <p className="leading-relaxed [&:not(:first-child)]:mt-6">
          All current reference content now lives under <strong className="font-medium">TopooUI</strong>. This board
          is where we build the shared component language, docs primitives, and reusable UI patterns for the rest of
          the product surfaces.
        </p>
      </BoardLandingTemplate>
    ),
  },
  "/docs/topooui/components": {
    render: () => (
      <LinkIndexTemplate
        items={topoUiComponentItems}
        footer={
          <>
            <hr className="my-4 md:my-8" />
            <p className="leading-relaxed [&:not(:first-child)]:mt-6">
              Can&apos;t find what you need? Try the{" "}
              <a className="font-medium underline underline-offset-4" href="/docs/topooui/registry">
                registry directory
              </a>{" "}
              for community-maintained components.
            </p>
          </>
        }
      />
    ),
  },
  "/docs/topooui/docs": {
    render: () => (
      <DocsSystemIndexTemplate cards={topoUiDocsCards}>
        <>
          <p className="leading-relaxed [&:not(:first-child)]:mt-6">
            TopooUI does not only own generic product UI. It also owns the documentation rendering system used by{" "}
            <code>doc.topoo.ai</code>.
          </p>
          <p className="leading-relaxed [&:not(:first-child)]:mt-6">This board documents:</p>
          <ul className="my-6 ml-6 list-disc">
            <li className="mt-2">how docs pages are structured</li>
            <li className="mt-2">which schema types exist</li>
            <li className="mt-2">which renderers own final layout</li>
            <li className="mt-2">which blocks are available to content authors</li>
            <li className="mt-2">where content ownership stops and system ownership begins</li>
          </ul>
        </>
      </DocsSystemIndexTemplate>
    ),
  },
};

export function getSystemPageDefinition(url: string) {
  return systemPages[url] ?? null;
}
