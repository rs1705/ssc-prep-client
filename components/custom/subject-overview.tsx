import Link from "next/link";
import { ArrowUpRight, CircleMinus, Clock, FileText, Target } from "lucide-react";
import { SUBJECT_META, TIER1_PATTERN } from "@/lib/exam-pattern";
import { subjectTheme, type SubjectKey } from "@/lib/subject-theme";

/** Section facts for one subject on the SSC CGL Tier 1 paper. */
export function ExamPatternStrip({ subject }: { subject: SubjectKey }) {
  const theme = subjectTheme(subject);
  const meta = SUBJECT_META[subject];

  const facts = [
    { icon: FileText, value: String(TIER1_PATTERN.questionsPerSection), label: "Questions", short: "Questions" },
    { icon: Target, value: String(TIER1_PATTERN.marksPerSection), label: "Marks", short: "Marks" },
    { icon: CircleMinus, value: `−${TIER1_PATTERN.negativeMark.toFixed(2)}`, label: "Per wrong answer", short: "Per wrong" },
    { icon: Clock, value: `${TIER1_PATTERN.durationMinutes} min`, label: "Whole paper", short: "Paper" },
  ];

  return (
    <section
      aria-label={`${meta.paperSection} in ${TIER1_PATTERN.exam}`}
      className={`relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-4 sm:p-6 ${theme.banner}`}
    >
      <div className="flex flex-col gap-3 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-xl">
          <p className="section-label">
            {TIER1_PATTERN.exam} · Section
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl">
            {meta.paperSection}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{meta.tagline}</p>
        </div>

        <dl className="grid shrink-0 grid-cols-4 gap-1.5 sm:gap-2 lg:w-auto">
          {facts.map(({ icon: Icon, value, label, short }) => (
            <div
              key={label}
              className="flex min-w-0 flex-col gap-0.5 rounded-xl border-2 border-border bg-card px-2 py-2 text-center sm:min-w-[6.5rem] sm:gap-1 sm:rounded-2xl sm:px-3.5 sm:py-3 sm:text-left"
            >
              <Icon className={`hidden h-4 w-4 sm:block ${theme.text}`} aria-hidden="true" />
              <dd className="whitespace-nowrap font-mono text-sm font-black tabular-nums leading-tight text-foreground sm:text-lg sm:leading-none">
                {value}
              </dd>
              <dt className="text-[11px] font-medium leading-tight text-muted-foreground sm:text-xs">
                <span className="sm:hidden">{short}</span>
                <span className="hidden sm:inline">{label}</span>
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Syllabus topics as chips; topics with practice available are links. */
export function SyllabusMap({ subject }: { subject: SubjectKey }) {
  const theme = subjectTheme(subject);
  const { syllabus } = SUBJECT_META[subject];
  const liveCount = syllabus.filter((t) => t.href).length;

  return (
    <section aria-labelledby={`syllabus-${subject}`} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={`syllabus-${subject}`} className="text-lg font-extrabold text-foreground">
          Syllabus map
        </h2>
        <p className="text-xs font-medium text-muted-foreground">
          {liveCount > 0
            ? `${liveCount} of ${syllabus.length} topics have practice ready`
            : `${syllabus.length} topics · practice coming soon`}
        </p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {syllabus.map((topic) =>
          topic.href ? (
            <li key={topic.name}>
              <Link
                href={topic.href}
                className={`group inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 px-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${theme.chip}`}
              >
                {topic.name}
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ) : (
            <li
              key={topic.name}
              className="inline-flex min-h-10 items-center rounded-full border-2 border-dashed border-border px-3.5 text-sm font-medium text-muted-foreground"
            >
              {topic.name}
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
