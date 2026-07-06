"use client";
import { Info } from "lucide-react";
import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { useAuth } from "@/context/auth";
import { SectionCardProps } from "@/lib/types";
export default function Home() {
  const { user } = useAuth();
  const sections: SectionCardProps[] = [
    {
      title: "👩🏼‍🎓 English",
      description:
        "Enhance your grammar, vocabulary, and fluency to score higher in every test.",
      linkTo: "/SSC/english",
      buttonText: "Start Learning",
    },

    // {
    //   title: "🧩 Reasoning",
    //   description:
    //     "Challenge your mind with fun reasoning puzzles and boost problem-solving speed.",
    //   linkTo: "/SSC/reasoning",
    //   buttonText: "Start Reasoning",
    // },
    // {
    //   title: "🧮 Maths",
    //   description:
    //     "Practice smart maths tricks, sharpen accuracy, and solve questions with confidence.",
    //   linkTo: "/SSC/maths",
    //   buttonText: "Practice Maths",
    // },

    // {
    //   title: "🌊 GK",
    //   description:
    //     "Dive into the vast ocean of General knowledge to stay ahead and ace in exams.",
    //   linkTo: "/SSC/gk",
    //   buttonText: "Explore GK",
    // },
  ];

  return (
    <div>
      <div className="bg-sky-50 border-l-4 border-sky-500 p-3 mb-8 rounded-r-xl max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm">
        <Info className="w-5 h-5 text-sky-500 shrink-0" />
        <p className="text-sky-900 text-xs sm:text-sm font-medium">
          🚀 <strong className="font-bold text-sky-950">App in Development:</strong> We are currently rolling out our English modules. More features and subjects are on the way!
        </p>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold my-5">
          Hi {user?.displayName || "Guest"}! <br />
          Welcome to your activity center.🔮
        </h1>
        <p>
          Choose the subject of your liking and get started to sharpen your exam
          skills.
        </p>
      </div>
      <br />
      <SectionCardGrid sections={sections} />
    </div>
  );
}
