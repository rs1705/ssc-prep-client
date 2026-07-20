
import SectionCard from "./section-card";

export interface SectionCardProps {
  title: string;
  description: string;
  linkTo: string;
  buttonText: string;
  knowMoreText?: string;
  className?: string;
  icon?: any;
  index?: number;
  cols?: number;
  colorTheme?: "sky" | "emerald" | "rose" | "amber" | "indigo" | "violet";
}

const SectionCardGrid = ({ sections }: { sections: SectionCardProps[] }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
    >
      {sections.map((item: SectionCardProps, index: number) => (
        <SectionCard
          key={index}
          index={index}
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
};

export default SectionCardGrid;
