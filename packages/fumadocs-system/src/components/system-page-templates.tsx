import type { ReactNode } from "react";
import { LinkedCard } from "./docs-mdx";

export type BoardLandingCard = {
  href: string;
  title: string;
  description: string;
};

export type LinkIndexItem = {
  href: string;
  title: string;
};

export function BoardLandingTemplate({
  cards,
  children,
}: {
  cards: BoardLandingCard[];
  children?: ReactNode;
}) {
  return (
    <>
      {children}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <LinkedCard key={card.href} href={card.href} className="items-start gap-1 p-6 text-sm md:p-6">
            <div className="font-medium">{card.title}</div>
            <div className="leading-relaxed text-muted-foreground">{card.description}</div>
          </LinkedCard>
        ))}
      </div>
    </>
  );
}

export function DocsSystemIndexTemplate({
  cards,
  children,
}: {
  cards: BoardLandingCard[];
  children?: ReactNode;
}) {
  return (
    <>
      {children}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <LinkedCard key={card.href} href={card.href} className="items-start gap-1 p-6 text-sm md:p-6">
            <div className="font-medium">{card.title}</div>
            <div className="leading-relaxed text-muted-foreground">{card.description}</div>
          </LinkedCard>
        ))}
      </div>
    </>
  );
}

export function LinkIndexTemplate({
  footer,
  items,
}: {
  items: LinkIndexItem[];
  footer?: ReactNode;
}) {
  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"
          >
            {item.title}
          </a>
        ))}
      </div>

      {footer ? <>{footer}</> : null}
    </>
  );
}
