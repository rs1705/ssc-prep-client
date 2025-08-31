import SectionCard from "@/components/custom/section-card";
import { SectionCardProps } from "@/lib/types";

export default function Home() {
  const sections: SectionCardProps[] = [
    {
      title: "Logical Reasoning",
      description:
        "Sharpen your problem-solving and analytical skills with interactive reasoning exercises.",
      linkTo: "/SSC/reasoning",
      buttonText: "Start Reasoning",
    },
    {
      title: "Maths Mastery",
      description:
        "Boost your maths skills with practice questions designed for SSC exams.",
      linkTo: "/SSC/maths",
      buttonText: "Practice Maths",
    },
    {
      title: "English Excellence",
      description:
        "Improve your grammar, vocabulary, and comprehension with targeted exercises.",
      linkTo: "/SSC/english",
      buttonText: "Start Learning",
    },
    {
      title: "General Knowledge",
      description:
        "Test and expand your GK knowledge to stay ahead in competitive exams.",
      linkTo: "/SSC/gk",
      buttonText: "Explore GK",
    },
  ];

  return (
    <main>
      <div className="text-center">
        <h1 className="text-5xl font-bold my-5">Welcome to activity center.</h1>
        <p>
          Choose the subject of your liking and get started to sharpen your exam
          skills.
        </p>
      </div>
      <br />
      <div className="flex flex-wrap justify-center gap-5">
        {sections.map((item: SectionCardProps, index: number) => (
          <div className="lg:w-[35%] md:w-[35%] sm:w-full" key={index}>
            <SectionCard
              key={index}
              title={item.title}
              description={item.description}
              linkTo={item.linkTo}
              buttonText={item.buttonText}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
