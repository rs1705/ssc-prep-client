import type { Metadata } from "next";
import { ReviewSession } from "@/features/review/ReviewSession";

export const metadata: Metadata = {
  title: "Mistakes review",
  description: "Go over the questions you got wrong until you know them.",
};

export default function ReviewPage() {
  return <ReviewSession />;
}
