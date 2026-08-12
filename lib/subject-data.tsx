import {
  Zap,
  Lightbulb,
  Target,
  ClipboardList,
  Layers,
  Skull,
} from "lucide-react";
import { SectionCardProps } from "@/components/custom/section-card/section-card";

export const SUBJECT_SECTIONS: Record<string, SectionCardProps[]> = {
  maths: [
    {
      title: "Speed Math",
      description: "Gamified timed arithmetic drills for rapid operations.",
      icon: <Zap className="w-5 h-5" strokeWidth={2} />,
      buttonText: "START",
      linkTo: "/SSC/maths/mental-maths",
      colorTheme: "emerald",
    },
    {
      title: "Formulas & Tricks",
      description: "Master shortcut techniques to cut equation solving time.",
      icon: <Lightbulb className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: "emerald",
    },
    {
      title: "Topic wise Pyqs",
      description: "Chapter-wise drills sorted by difficulty.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: "emerald",
    },
    {
      title: "Sectional Pyqs",
      description:
        "Practice with previous year questions to master exam patterns.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: "emerald",
    },
  ],
  english: [
    {
      title: "Flashcards",
      description: "Optimize vocabulary memory with spaced-repetition.",
      icon: <Layers className="w-5 h-5" strokeWidth={2} />,
      buttonText: "START",
      linkTo: "/SSC/english/flashcards",
      colorTheme: "violet",
    },
    {
      title: "Topic wise Pyqs",
      description: "Chapter-wise drills sorted by difficulty.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: "violet",
    },
    {
      title: "Sectional Pyqs",
      description:
        "Practice with previous year questions to master exam patterns.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: "violet",
    },
    {
      title: "Games",
      description:
        "Play Hangman, Word Shuffle and Crossword to test your vocabulary.",
      icon: <Skull className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: "violet",
    },
  ],
  gk: [
    {
      title: "Topic wise Pyqs",
      description: "Chapter-wise drills sorted by difficulty.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: "rose",
    },
    {
      title: "Sectional Pyqs",
      description:
        "Practice with previous year questions to master exam patterns.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: "rose",
    },
  ],
  reasoning: [
    {
      title: "Topic wise Pyqs",
      description: "Chapter-wise drills sorted by difficulty.",
      icon: <Target className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: "amber",
    },
    {
      title: "Sectional Pyqs",
      description:
        "Practice with previous year questions to master exam patterns.",
      icon: <ClipboardList className="w-5 h-5" strokeWidth={2} />,
      buttonText: "COMING SOON",
      linkTo: "#",
      colorTheme: "amber",
    },
  ],
};
