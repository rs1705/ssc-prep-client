"use client";

import { useCallback } from "react";
import { notFound, useParams } from "next/navigation";
import { SprintGame } from "@/features/drills/SprintGame";
import { REASONING_DRILLS_HREF, drillBySlug } from "@/features/reasoning-drills/drills";
import { buildQueue } from "@/features/reasoning-drills/generators";

export default function ReasoningDrillPage() {
  const { drill: slug } = useParams<{ drill: string }>();
  const drill = drillBySlug(slug);
  const generate = drill?.generate;
  const build = useCallback(() => (generate ? buildQueue(generate) : []), [generate]);

  if (!drill) notFound();

  return (
    <SprintGame
      title={drill.title}
      subtitle="Reasoning speed drill"
      blurb={drill.description}
      icon={drill.icon}
      tips={drill.tips}
      storageKey={`ssc:reasoning:${drill.slug}:best`}
      buildQueue={build}
      tone="reasoning"
      backHref={REASONING_DRILLS_HREF}
      backLabel="Back to all drills"
    />
  );
}
