"use client";
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

    {
      title: "🧩 Reasoning",
      description:
        "Challenge your mind with fun reasoning puzzles and boost problem-solving speed.",
      linkTo: "/SSC/reasoning",
      buttonText: "Start Reasoning",
    },
    {
      title: "🧮 Maths",
      description:
        "Practice smart maths tricks, sharpen accuracy, and solve questions with confidence.",
      linkTo: "/SSC/maths",
      buttonText: "Practice Maths",
    },

    {
      title: "🌊 GK",
      description:
        "Dive into the vast ocean of General knowledge to stay ahead and ace in exams.",
      linkTo: "/SSC/gk",
      buttonText: "Explore GK",
    },
  ];

  return (
    <div>
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
