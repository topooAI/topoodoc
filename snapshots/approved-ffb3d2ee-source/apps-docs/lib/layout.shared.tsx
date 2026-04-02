import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { TopooBrand } from "@/components/topoo-brand";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <TopooBrand />,
      url: "/docs",
    },
    links: [
      {
        type: "main",
        text: "Docs",
        url: "/docs",
        active: "nested-url",
      },
      {
        type: "main",
        text: "Product",
        url: "/docs/foundations/product",
        active: "nested-url",
      },
      {
        type: "main",
        text: "Source",
        url: "https://github.com/topooAI/topoo",
        external: true,
      },
    ],
    searchToggle: {
      enabled: false,
    },
  };
}
