"use client";

import type { ReactNode } from "react";
import { Fragment } from "react";
import { ExpandableFigure } from "./docs-mdx";
import { cn } from "../lib/utils";
import styles from "./project-architecture-map-figure.module.css";

const blocks = [
  "Core Definition",
  "Execution Architecture",
  "Operating System",
  "Version Spine",
  "Surface Mapping",
  "Boundary & Strategy",
];

const chain = ["Outcome", "Workstream", "Task", "Run", "Activity", "Artifact"];

const governance = [
  "Actor Model",
  "Capability Model",
  "Execution State Machine",
  "Observability & Evaluation",
  "External Boundaries",
];

function Pill({
  children,
  active = false,
  compact = false,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        styles.pill,
        compact && styles.pillCompact,
        active && styles.pillActive,
        className,
      )}
    >
      <span className={styles.pillLabel}>{children}</span>
    </div>
  );
}

function TopCard() {
  return (
    <section className={styles.layerCard}>
      <div className={styles.layerHeader}>
        <div className={styles.layerTitle}>toProject Board</div>
        <div className={cn(styles.layerSubtitle, "max-w-[22rem]")}>
          project-centered execution control plane
        </div>
      </div>
    </section>
  );
}

function LayerCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(styles.layerCard, className)}>
      <div className={styles.layerHeader}>
        <div className={styles.layerTitle}>{title}</div>
        {subtitle ? <div className={styles.layerSubtitle}>{subtitle}</div> : null}
      </div>
      <div className={styles.layerBody}>{children}</div>
    </section>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.subsection}>
      <div className={styles.subsectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function BlockLayerCard() {
  return (
    <LayerCard title="Block Layer" subtitle="Six structural blocks organize the board and scope the docs.">
      <div className={styles.pillGrid6}>
        {blocks.map((item) => (
          <Pill key={item}>{item}</Pill>
        ))}
      </div>
    </LayerCard>
  );
}

function ChainLayerCard() {
  return (
    <LayerCard
      title="Execution Object Chain"
      subtitle="The execution chain is read left to right and keeps project state explicit."
    >
      <div className={styles.chainRow}>
        {chain.map((item, index) => (
          <Fragment key={item}>
            <div className={styles.chainItem}>
              <Pill active={item === "Outcome"} className={styles.chainPill}>
                {item}
              </Pill>
            </div>
            {index < chain.length - 1 ? (
              <span className={styles.chainArrow}>→</span>
            ) : null}
          </Fragment>
        ))}
      </div>
    </LayerCard>
  );
}

function RuntimeCard() {
  return (
    <LayerCard
      className="h-full"
      title="Runtime + Sandbox"
      subtitle="Execution runtime and safety boundary are grouped but distinct."
    >
      <div className={styles.subsectionStack}>
        <Subsection title="Runtimes">
          <div className={styles.pillGrid2}>
            <Pill>Local Runtime</Pill>
            <Pill>Cloudflare Managed Runtime</Pill>
          </div>
        </Subsection>
        <Subsection title="Safety Boundary">
          <div>
            <Pill>Execution Sandbox Model</Pill>
          </div>
        </Subsection>
      </div>
    </LayerCard>
  );
}

function VersionCard() {
  return (
    <LayerCard
      className="h-full"
      title="Version + Ledger Spine"
      subtitle="Version truth and ledger truth stay separated inside the same spine."
    >
      <div className={styles.subsectionStack}>
        <Subsection title="Versions">
          <div className={styles.pillGrid3}>
            <Pill>GitHub Source</Pill>
            <Pill>Execution Version</Pill>
            <Pill>Artifact Version</Pill>
          </div>
        </Subsection>
        <Subsection title="Ledgers">
          <div className={styles.pillGrid2}>
            <Pill>Run Ledger</Pill>
            <Pill>Artifact Ledger</Pill>
          </div>
        </Subsection>
      </div>
    </LayerCard>
  );
}

function GovernanceCard() {
  return (
    <LayerCard title="Governance + Observation" subtitle="Control logic, evaluation, and outer boundaries stay visible at the bottom layer.">
      <div className={styles.pillGrid5}>
        {governance.map((item) => (
          <Pill key={item}>{item}</Pill>
        ))}
      </div>
    </LayerCard>
  );
}

function ArchitectureCanvas({ modal = false }: { modal?: boolean }) {
  return (
    <div className={styles.canvas} style={modal ? { padding: "32px 40px" } : undefined}>
      <div className={styles.stack}>
        <TopCard />
        <BlockLayerCard />
        <ChainLayerCard />
        <div className={styles.pairGrid}>
          <RuntimeCard />
          <VersionCard />
        </div>
        <GovernanceCard />
      </div>
    </div>
  );
}

export function ProjectArchitectureMapFigure() {
  return (
    <div className={cn("not-prose", styles.figureRoot)}>
      <ExpandableFigure
        className={styles.expandable}
        modalClassName={styles.modalBody}
        title="Project layered architecture"
      >
        <ArchitectureCanvas modal />
      </ExpandableFigure>
    </div>
  );
}
