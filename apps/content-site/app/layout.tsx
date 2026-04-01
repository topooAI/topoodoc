import type { Metadata } from "next";
import { DocsRootLayout } from "@topoo/fumadocs-system";
import type { ReactNode } from "react";
import { docsSite } from "@/docs.config";
import "@/app/global.css";

export const metadata: Metadata = {
  title: docsSite.metadata.title,
  description: docsSite.metadata.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <DocsRootLayout>{children}</DocsRootLayout>;
}
