import { BRIEF_SUMMARIES } from "../data/dossier";

type BriefKey = keyof typeof BRIEF_SUMMARIES;

export function BriefSummary({ summaryKey }: { summaryKey: BriefKey }) {
  const summary = BRIEF_SUMMARIES[summaryKey];

  return (
    <div className="space-y-8 italic border-l-4 border-star-gold pl-8">
      <p>{summary.body}</p>
      <ul className="space-y-2 not-italic font-mono text-sm uppercase">
        {summary.bullets.map((bullet) => (
          <li key={bullet}>- {bullet}</li>
        ))}
      </ul>
    </div>
  );
}
