import React from "react";
import { SectionCardProps } from "@/lib/types";
import SectionCard from "./section-card";

type SectionCardGridProps = {
  sections: SectionCardProps[];
};

const SectionCardGrid: React.FC<SectionCardGridProps> = ({ sections }) => {
  return (
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
  );
};

export default SectionCardGrid;
