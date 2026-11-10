import {
  Zap,
  Lightbulb,
  Target,
  ClipboardList,
  Layers,
  Skull,
} from "lucide-react";
import type { SectionCardProps } from "@/components/custom/section-card/section-card";
import { SUBJECT_HUE } from "@/lib/subject-theme";

export const SUBJECT_SECTIONS: Record<string, SectionCardProps[]> = {
  maths: [
    {
      title: "Speed Math",
      description: "Gamified timed arithmetic drills for rapid operations.",
      icon: <Zap className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Start",
      meta: "12 drills · 3 levels",
      linkTo: "/SSC/maths/mental-maths",
      colorTheme: SUBJECT_HUE.maths,
    },
    {
      title: "Formulas & Tricks",
      description: "Every formula and shortcut in the quant syllabus, with a worked example and a test-yourself mode.",
      icon: <Lightbulb className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Open",
      meta: "99 cards · 22 topics",
      linkTo: "/SSC/maths/formula-practice",
      colorTheme: SUBJECT_HUE.maths,
    },
    {
      title: "Topic-wise PYQs",
      description: "Real past-paper questions grouped by topic, with an explanation for each.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Start",
      meta: "Sets of 10 · explanations",
      linkTo: "/SSC/maths/topic-pyqs",
      colorTheme: SUBJECT_HUE.maths,
    },
    {
      title: "Sectional PYQs",
      description:
        "Sit this section of a real paper against the clock, with exam marking.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Start",
      meta: "2 papers · timed",
      linkTo: "/SSC/maths/sectional-pyqs",
      colorTheme: SUBJECT_HUE.maths,
    },
  ],
  english: [
    {
      title: "Flashcards",
      description: "Optimize vocabulary memory with spaced-repetition.",
      icon: <Layers className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Start",
      meta: "637 cards · 2 modes",
      linkTo: "/SSC/english/flashcards",
      colorTheme: SUBJECT_HUE.english,
    },
    {
      title: "Topic-wise PYQs",
      description: "Real past-paper questions grouped by topic, with an explanation for each.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Start",
      meta: "Sets of 10 · explanations",
      linkTo: "/SSC/english/topic-pyqs",
      colorTheme: SUBJECT_HUE.english,
    },
    {
      title: "Sectional PYQs",
      description:
        "Sit this section of a real paper against the clock, with exam marking.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Start",
      meta: "2 papers · timed",
      linkTo: "/SSC/english/sectional-pyqs",
      colorTheme: SUBJECT_HUE.english,
    },
    {
      title: "Games",
      description:
        "Hangman, Odd Link, Word of the Day and Spelling Sprint: quick games for SSC vocabulary.",
      icon: <Skull className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Play",
      meta: "4 games",
      linkTo: "/SSC/english/games",
      colorTheme: SUBJECT_HUE.english,
    },
  ],
  gk: [
    {
      title: "Topic-wise PYQs",
      description: "Real past-paper questions grouped by topic, with an explanation for each.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Start",
      meta: "Sets of 10 · explanations",
      linkTo: "/SSC/gk/topic-pyqs",
      colorTheme: SUBJECT_HUE.gk,
    },
    {
      title: "Sectional PYQs",
      description:
        "Sit this section of a real paper against the clock, with exam marking.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Start",
      meta: "2 papers · timed",
      linkTo: "/SSC/gk/sectional-pyqs",
      colorTheme: SUBJECT_HUE.gk,
    },
  ],
  reasoning: [
    {
      title: "Topic-wise PYQs",
      description: "Real past-paper questions grouped by topic, with an explanation for each.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Start",
      meta: "Sets of 10 · explanations",
      linkTo: "/SSC/reasoning/topic-pyqs",
      colorTheme: SUBJECT_HUE.reasoning,
    },
    {
      title: "Sectional PYQs",
      description:
        "Sit this section of a real paper against the clock, with exam marking.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "Start",
      meta: "2 papers · timed",
      linkTo: "/SSC/reasoning/sectional-pyqs",
      colorTheme: SUBJECT_HUE.reasoning,
    },
  ],
};
