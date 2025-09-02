import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { SectionCardProps } from "@/lib/types";

export default function Home() {
  const sections: SectionCardProps[] = [
    {
      title: "Reasoning 🧩",
      description:
        "Challenge your mind with fun reasoning puzzles and boost problem-solving speed.",
      linkTo: "/SSC/reasoning",
      buttonText: "Start Reasoning",
    },
    {
      title: "Maths Mastery 🧮",
      description:
        "Practice smart maths tricks, sharpen accuracy, and solve questions with confidence.",
      linkTo: "/SSC/maths",
      buttonText: "Practice Maths",
    },
    {
      title: "English Excellence 👩🏼‍🎓",
      description:
        "Enhance your grammar, vocabulary, and fluency to score higher in every test.",
      linkTo: "/SSC/english",
      buttonText: "Start Learning",
    },
    {
      title: "GK Ocean 🌊",
      description:
        "Dive into current affairs, history, and world facts to stay ahead in exams.",
      linkTo: "/SSC/gk",
      buttonText: "Explore GK",
    },
  ];

  return (
    <div>
      <div className="text-center">
        <h1 className="text-5xl font-bold my-5">
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
