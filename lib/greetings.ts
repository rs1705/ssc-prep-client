import { dayNumber } from "@/lib/today-plan";

/**
 * Dashboard header text: a greeting that follows the time of day and a
 * motivational line that changes once a day (the same all day, for everyone).
 */

export type DayPart = "lateNight" | "early" | "morning" | "afternoon" | "evening" | "night";

export function dayPart(hour: number): DayPart {
  if (hour < 4) return "lateNight";
  if (hour < 7) return "early";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

// Each reads naturally followed by ", <name>".
const GREETINGS: Record<DayPart, string[]> = {
  lateNight: ["Burning the midnight oil", "Still going strong", "Quiet hours, sharp mind"],
  early: ["Up before the sun", "Rise and shine", "An early start wins the day"],
  morning: ["Good morning", "Fresh morning, fresh start", "A bright morning to you"],
  afternoon: ["Good afternoon", "Keep the momentum", "Afternoon power hour"],
  evening: ["Good evening", "Evening study time", "Welcome back this evening"],
  night: ["Late study session", "One more push tonight", "Finish the day strong"],
};

export interface Quote {
  text: string;
  /** Only for quotes by real people; the rest are our own lines. */
  by?: string;
}

export const QUOTES: Quote[] = [
  { text: "Arise, awake, and stop not till the goal is reached.", by: "Swami Vivekananda" },
  { text: "The selection list doesn't care how you felt today. It only counts what you did." },
  { text: "Every question you solve today is one you won't fear in the exam hall." },
  { text: "Toppers aren't born on result day. They're built on ordinary days like this one." },
  { text: "Take up one idea. Make that one idea your life.", by: "Swami Vivekananda" },
  { text: "Fifteen honest minutes beat three hours of planning to study." },
  { text: "Your future posting is being decided by today's practice, not tomorrow's motivation." },
  { text: "Small daily wins compound into a rank." },
  { text: "Strength does not come from physical capacity. It comes from an indomitable will.", by: "Mahatma Gandhi" },
  { text: "Discipline is choosing what you want most over what you want now." },
  { text: "A mistake you review today is a mark you keep on exam day." },
  { text: "You don't have to be great to start, but you have to start to be great." },
  { text: "Well begun is half done.", by: "Aristotle" },
  { text: "The exam tests your speed. Your habits decide it." },
  { text: "When it feels hard, you are getting better. Keep going." },
  { text: "One more set. One more card. One step closer to the name on the list." },
  { text: "Consistency is the quiet superpower behind every selection." },
  { text: "Doubt kills more dreams than failure ever will. Practice anyway." },
  { text: "The best time to prepare was yesterday. The next best time is right now." },
  { text: "Make your family proud on result day by making yourself proud today." },
  { text: "Focus on progress, not perfection. Perfection never cleared a cut-off." },
  { text: "Hard work beats talent when talent doesn't work hard." },
  { text: "Dreams don't work unless you do." },
  { text: "Speed comes from practice. Confidence comes from preparation." },
  { text: "Today's sweat is tomorrow's uniform, badge and pride." },
  { text: "Don't count the days left. Make the days left count." },
  { text: "Lakhs will apply. Few will prepare like you. Be one of the few." },
  { text: "Your only competition is the person you were yesterday." },
  { text: "Every expert was once a beginner who refused to quit." },
  { text: "The pain of discipline weighs ounces. The pain of regret weighs tonnes." },
  { text: "A calm mind solves faster. Breathe, then begin." },
  { text: "You are one good habit away from a different result." },
  { text: "Show up today, even for fifteen minutes. Showing up is the whole secret." },
  { text: "Great things are done by a series of small things brought together." },
  { text: "Believe you can, then practice until you know you can." },
  { text: "Rank is just a number until you earn it. Earn it today." },
  { text: "Tough syllabus? Tougher you." },
  { text: "Success is the sum of small efforts, repeated day in and day out." },
  { text: "Bet on yourself. Then practice like the bet depends on it." },
  { text: "The government job you want is waiting. Go and get it." },
];

const pick = <T,>(items: T[], n: number) => items[((n % items.length) + items.length) % items.length];

export function greetingFor(date: Date): string {
  return pick(GREETINGS[dayPart(date.getHours())], dayNumber(date));
}

export function quoteFor(date: Date): Quote {
  // Step by a prime so neighbouring days don't follow the list order.
  return pick(QUOTES, dayNumber(date) * 7);
}
