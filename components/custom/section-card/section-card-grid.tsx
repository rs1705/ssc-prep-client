import SectionCard, { type SectionCardProps } from "./section-card";

export type { SectionCardProps };

const SectionCardGrid = ({ sections }: { sections: SectionCardProps[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 sm:auto-rows-fr gap-4 sm:gap-5 w-full">
      {sections.map((item, index) => (
        <SectionCard key={item.title} {...item} index={index} />
      ))}
    </div>
  );
};

export default SectionCardGrid;
