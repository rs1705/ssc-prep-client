import React from "react";
import { SectionCardProps } from "@/lib/types";
import SectionCard from "./section-card";

type SectionCardGridProps = {
  sections: SectionCardProps[];
  layout?: "grid-4" | "grid-2";
};

const SectionCardGrid: React.FC<SectionCardGridProps> = ({ sections, layout = "grid-2" }) => {
  if (layout === "grid-4") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {sections.map((item: SectionCardProps, index: number) => (
          <SectionCard
            key={index}
            index={index}
            cols={4}
            icon={item.icon}
            title={item.title}
            description={item.description}
            linkTo={item.linkTo}
            buttonText={item.buttonText}
            knowMoreText={item.knowMoreText}
            colorTheme={item.colorTheme}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
      {sections.map((item: SectionCardProps, index: number) => (
        <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[400px]" key={index}>
          <SectionCard
            key={index}
            index={index}
            cols={2}
            icon={item.icon}
            title={item.title}
            description={item.description}
            linkTo={item.linkTo}
            buttonText={item.buttonText}
            knowMoreText={item.knowMoreText}
            colorTheme={item.colorTheme}
          />
        </div>
      ))}
    </div>
  );
};

export default SectionCardGrid;
