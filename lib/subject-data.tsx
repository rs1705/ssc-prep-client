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
      buttonText: "START",
      linkTo: "/SSC/maths/mental-maths",
      colorTheme: SUBJECT_HUE.maths,
    },
    {
      title: "Formulas & Tricks",
      description: "Master shortcut techniques to cut equation solving time.",
      icon: <Lightbulb className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: SUBJECT_HUE.maths,
    },
    {
      title: "Topic wise Pyqs",
      description: "Chapter-wise drills sorted by difficulty.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: SUBJECT_HUE.maths,
    },
    {
      title: "Sectional Pyqs",
      description:
        "Practice with previous year questions to master exam patterns.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: SUBJECT_HUE.maths,
    },
  ],
  english: [
    {
      title: "Flashcards",
      description: "Optimize vocabulary memory with spaced-repetition.",
      icon: <Layers className="w-5 h-5" strokeWidth={2} />,
      buttonText: "START",
      linkTo: "/SSC/english/flashcards",
      colorTheme: SUBJECT_HUE.english,
    },
    {
      title: "Topic wise Pyqs",
      description: "Chapter-wise drills sorted by difficulty.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: SUBJECT_HUE.english,
    },
    {
      title: "Sectional Pyqs",
      description:
        "Practice with previous year questions to master exam patterns.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: SUBJECT_HUE.english,
    },
    {
      title: "Games",
      description:
        "Hangman, Odd Link, Word of the Day and Spelling Sprint: quick games for SSC vocabulary.",
      icon: <Skull className="w-5 h-5" strokeWidth={2} />,
      buttonText: "PLAY",
      linkTo: "/SSC/english/games",
      colorTheme: SUBJECT_HUE.english,
    },
  ],
  gk: [
    {
      title: "Topic wise Pyqs",
      description: "Chapter-wise drills sorted by difficulty.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: SUBJECT_HUE.gk,
    },
    {
      title: "Sectional Pyqs",
      description:
        "Practice with previous year questions to master exam patterns.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: SUBJECT_HUE.gk,
    },
  ],
  reasoning: [
    {
      title: "Topic wise Pyqs",
      description: "Chapter-wise drills sorted by difficulty.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: SUBJECT_HUE.reasoning,
    },
    {
      title: "Sectional Pyqs",
      description:
        "Practice with previous year questions to master exam patterns.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: SUBJECT_HUE.reasoning,
    },
  ],
};
