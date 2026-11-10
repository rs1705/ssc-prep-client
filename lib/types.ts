export interface FlashCardInterface {
  _id: string;
  /** Same value as `_id`; the Nest API returns both. */
  id?: string;
  exam?: string;
  year?: string;
  type: string;
  difficulty: string;
  subject: string;
  front: FlashCardFrontProps;
  back: FlashCardBackProps;
  tags: string[];
}
export interface FlashCardFrontProps {
  text: string;
  pronunciation?: {
    english: string;
    hindi: string;
  };
}

export interface FlashCardBackProps {
  content_eng: string;
  example_eng?: [string];
  content_hindi?: [string];
  example_hindi?: [string];
  synonyms?: [string];
  antonyms?: [string];
}

export interface DashboardStats {
  streak: number;
  xp: number;
  dailyGoal: number;
  solvedToday: number;
  /** Seven entries Mon..Sun; true when the user practised that day. */
  activeDays: boolean[];
}

export interface RecentSession {
  id: string;
  title: string;
  subject: "maths" | "english" | "reasoning" | "gk";
  /** e.g. "22/25" */
  result: string;
  /** 0-100 */
  accuracy: number;
  xpEarned: number;
  completedAt: string;
}
