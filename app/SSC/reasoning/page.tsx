import SectionCardGrid from "@/components/custom/section-card/section-card-grid";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";


import { SUBJECT_SECTIONS } from "@/lib/subject-data";

const ReasoningHomePage = () => {
  const sections = SUBJECT_SECTIONS.reasoning;
  return (
    <TopicPageLayout
      title="Reasoning"
      description="Improve deducing speed and shape recognition with chapter practice and analytical tests."
    >
      <SectionCardGrid sections={sections} />
    </TopicPageLayout>
  );
};

export default ReasoningHomePage;
