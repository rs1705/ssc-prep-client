"use client";

import { useMemo, useState } from "react";
import { useAnswered, type Answered } from "@/features/pyq/answered";
import type { SubjectKey } from "@/lib/subject-theme";
import { useGetPyqTopicTreeQuery, type PyqTopicNode } from "@/redux/PyqApi";

/** Shared by the progress-map prototypes: every subtopic with its status. */

export type Status = "bud" | "growing" | "mastered" | "review";
export interface LeafInfo {
  subject: SubjectKey;
  topic: PyqTopicNode;
  sub: PyqTopicNode;
  done: number;
  right: number;
  lastAt: number;
  status: Status;
}

export const SUBJECTS: SubjectKey[] = ["maths", "reasoning", "english", "gk"];
export const HUE: Record<SubjectKey, string> = { maths: "#f6c453", reasoning: "#a78bfa", english: "#f472b6", gk: "#5eead4" };
export const REVIEW = "#fb923c";
const WEEK = 7 * 24 * 3600 * 1000;

export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

function statsFor(answered: Record<string, Answered>, nodeId: string) {
  let done = 0;
  let right = 0;
  let lastAt = 0;
  for (const a of Object.values(answered)) {
    if (!a.tags.some((t) => t === nodeId || t.startsWith(`${nodeId}.`))) continue;
    done++;
    if (a.ok) right++;
    lastAt = Math.max(lastAt, a.at);
  }
  return { done, right, lastAt };
}

function statusOf(done: number, right: number, lastAt: number, count: number, now: number): Status {
  if (done === 0) return "bud";
  const acc = right / done;
  if ((done >= 2 && acc < 0.6) || now - lastAt > WEEK) return "review";
  if (acc >= 0.8 && done / count >= 0.5) return "mastered";
  return "growing";
}

/** Made-up answers so a prototype shows every state (the same every time). */
function sampleAnswers(lists: PyqTopicNode[][]): Record<string, Answered> {
  const out: Record<string, Answered> = {};
  const now = Date.now();
  let k = 0;
  lists.forEach((list, li) => {
    list.forEach((topic, ti) => {
      // Earlier topics are further along, like a real student working down the list.
      for (const sub of topic.children) {
        if (sub.count === 0) continue;
        k++;
        if (ti > 2 + li && (k * 7) % 10 > 2) continue;
        const kind = k % 6; // 0 review (wrong), 1 review (old), else growing / mastered
        for (let i = 0; i < Math.min(sub.count, 3); i++)
          out[`${sub.id}#${i}`] = {
            at: kind === 1 ? now - 12 * 86400000 : now - i * 3600000,
            ok: kind === 0 ? i === 0 : kind >= 3 ? true : i !== 1,
            tags: [sub.id],
          };
      }
    });
  });
  return out;
}

export function useProgressMap(demo: boolean) {
  const maths = useGetPyqTopicTreeQuery("maths");
  const reasoning = useGetPyqTopicTreeQuery("reasoning");
  const english = useGetPyqTopicTreeQuery("english");
  const gk = useGetPyqTopicTreeQuery("gk");
  const real = useAnswered();
  const [now] = useState(() => Date.now());
  const trees = useMemo(
    () => ({ maths: maths.data ?? [], reasoning: reasoning.data ?? [], english: english.data ?? [], gk: gk.data ?? [] }) as Record<SubjectKey, PyqTopicNode[]>,
    [maths.data, reasoning.data, english.data, gk.data],
  );
  const answered = useMemo(() => (demo ? sampleAnswers(SUBJECTS.map((s) => trees[s])) : real), [demo, trees, real]);
  const leaves = useMemo(() => {
    const out = new Map<string, LeafInfo>();
    for (const subject of SUBJECTS)
      for (const topic of trees[subject])
        for (const sub of topic.children) {
          if (sub.count === 0) continue;
          const s = statsFor(answered, sub.id);
          out.set(sub.id, { subject, topic, sub, ...s, status: statusOf(s.done, s.right, s.lastAt, sub.count, now) });
        }
    return out;
  }, [trees, answered, now]);
  /** Share of the questions under these topics that are done. */
  const share = (nodes: PyqTopicNode[]) => {
    let total = 0;
    let done = 0;
    for (const n of nodes)
      for (const s of n.children) {
        total += s.count;
        done += Math.min(leaves.get(s.id)?.done ?? 0, s.count);
      }
    return total ? done / total : 0;
  };
  const loading = [maths, reasoning, english, gk].some((q) => q.isLoading);
  return { trees, leaves, share, loading, now };
}

export const practiseHref = (l: LeafInfo) =>
  `/SSC/${l.subject}/topic-pyqs?topic=${encodeURIComponent(l.topic.id)}&sub=${encodeURIComponent(l.sub.id)}`;
