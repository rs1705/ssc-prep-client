"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, usePathname } from "next/navigation";
import {
  MessageSquare,
  CheckCircle2,
  Loader2,
  Send,
  Bug,
  Lightbulb,
  BookOpen,
  Rocket,
  Check,
} from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/auth";
import { DUO } from "@/features/games/buttons";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const feedbackSchema = z.object({
  category: z.enum(["bug", "feature", "content", "other"]),
  rating: z.number().min(1).max(5, "Please select an experience rating"),
  message: z.string().min(10, {
    message: "Please provide at least 10 characters of detail",
  }),
  name: z.string().min(2, "Name must be at least 2 characters").or(z.literal("")),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const CATEGORIES = [
  { id: "content", label: "Mistake in a question", desc: "Wrong answer, typo or unclear explanation", icon: BookOpen },
  { id: "bug", label: "Something broke", desc: "A screen, button or game misbehaved", icon: Bug },
  { id: "feature", label: "An idea", desc: "A drill, topic or feature you would like", icon: Lightbulb },
  { id: "other", label: "Anything else", desc: "Thoughts, praise or suggestions", icon: MessageSquare },
] as const;

const RATING_EMOJIS = [
  { value: 1, emoji: "😠", label: "Frustrating" },
  { value: 2, emoji: "😐", label: "Needs work" },
  { value: 3, emoji: "😊", label: "Good" },
  { value: 4, emoji: "🤩", label: "Great" },
  { value: 5, emoji: "🚀", label: "Superb" },
];

type Status = "Live" | "Next" | "Planned";

const ROADMAP: { title: string; desc: string; status: Status }[] = [
  { title: "Topic-wise and sectional PYQs", desc: "Real Tier 1 questions with explanations, in all four sections", status: "Live" },
  { title: "Speed drills, flashcards and games", desc: "Quant and Reasoning drills, spaced-repetition cards, word games", status: "Live" },
  { title: "Progress synced to your account", desc: "History, mistakes and daily plan on every device", status: "Live" },
  { title: "More past papers", desc: "More shifts and years in the question bank", status: "Next" },
  { title: "Analytics", desc: "Accuracy and time per topic from your saved answers", status: "Planned" },
  { title: "Bookmarks and leaderboard", desc: "Save questions; weekly points with friends", status: "Planned" },
];

const STATUS_STYLE: Record<Status, string> = {
  Live: "border-emerald-500/30 bg-[color-mix(in_oklab,var(--color-emerald-500)_12%,var(--card))] text-emerald-700 dark:text-emerald-300",
  Next: "border-brand-500/30 bg-[color-mix(in_oklab,var(--brand-500)_12%,var(--card))] text-brand-700 dark:text-brand-300",
  Planned: "border-border bg-muted text-muted-foreground",
};

export default function FeedbackPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      category: "feature",
      rating: 5,
      message: "",
      name: "",
    },
  });

  // Pre-fill name if user is authenticated
  useEffect(() => {
    if (user?.displayName) {
      form.setValue("name", user.displayName);
    }
  }, [user, form]);

  const selectedCategory = form.watch("category");
  const selectedRating = form.watch("rating");

  const onSubmit = async (values: FeedbackFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await addDoc(collection(db, "feedback"), {
        category: values.category,
        rating: values.rating,
        message: values.message,
        name: values.name || "anonymous",
        userId: user?.uid || null,
        url: window.location.href,
        path: pathname,
        userAgent: navigator.userAgent,
        submittedAt: new Date(),
      });

      setIsSuccess(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#3b82f6", "#d946ef"]
      });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setErrorMsg("Failed to submit feedback. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TopicPageLayout
      title="Feedback"
      description="Found a mistake in a question, hit a bug, or have an idea? Tell us. Every message is read."
      contentMaxWidthClass="w-full max-w-[1400px]"
    >
      <div className="grid w-full grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12">
        <div className="surface-card rounded-3xl p-4 sm:p-6 lg:col-span-7 xl:col-span-8">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white">
                  <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                </span>
                <h2 className="text-2xl font-extrabold text-foreground">Thank you!</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Your feedback has been sent. Mistakes in questions are fixed first.
                </p>
                <div className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row">
                  <button type="button" onClick={() => router.push("/dashboard")} className={cn(DUO.primary, "flex-1")}>
                    Back to dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      form.reset({ category: "feature", rating: 5, message: "", name: user?.displayName || "" });
                    }}
                    className={cn(DUO.secondary, "flex-1")}
                  >
                    Send another
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <fieldset className="flex flex-col">
                  <legend className="section-label mb-2.5">What is it about?</legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => form.setValue("category", cat.id)}
                          className={cn(
                            DUO.option,
                            isSelected
                              ? "border-brand-500 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))]"
                              : DUO.idle,
                            "flex items-start gap-3 p-3 text-left",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                              isSelected ? "bg-brand-500 text-white" : "bg-muted text-muted-foreground",
                            )}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2 text-sm font-bold text-foreground">
                              {cat.label}
                              {isSelected && <Check className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">{cat.desc}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="flex flex-col">
                  <div className="mb-2.5 flex items-center justify-between">
                    <legend className="section-label">How is the app so far?</legend>
                    <span className="text-xs font-bold text-brand-700 dark:text-brand-400">
                      {RATING_EMOJIS.find((r) => r.value === selectedRating)?.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {RATING_EMOJIS.map((rating) => {
                      const isSelected = selectedRating === rating.value;
                      return (
                        <button
                          key={rating.value}
                          type="button"
                          aria-label={rating.label}
                          aria-pressed={isSelected}
                          onClick={() => form.setValue("rating", rating.value)}
                          className={cn(
                            DUO.option,
                            isSelected
                              ? "border-brand-500 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))]"
                              : DUO.idle,
                            "flex min-h-14 items-center justify-center text-2xl sm:text-3xl",
                          )}
                        >
                          <span aria-hidden="true">{rating.emoji}</span>
                        </button>
                      );
                    })}
                  </div>
                  {form.formState.errors.rating && (
                    <p className="mt-2 text-xs font-medium text-rose-600">{form.formState.errors.rating.message}</p>
                  )}
                </fieldset>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="message" className="section-label">
                    Tell us more
                  </Label>
                  <textarea
                    id="message"
                    placeholder="Which question or screen, what happened, and what you expected…"
                    {...form.register("message")}
                    rows={4}
                    className="min-h-[120px] w-full resize-none rounded-2xl border-2 border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  {form.formState.errors.message && (
                    <p className="text-xs font-medium text-rose-600">{form.formState.errors.message.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="section-label flex items-center justify-between">
                    <span>Your name</span>
                    <span className="normal-case tracking-normal text-muted-foreground/70">optional</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    {...form.register("name")}
                    className="h-12 rounded-2xl border-2 border-border bg-card px-4 text-sm focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs font-medium text-rose-600">{form.formState.errors.name.message}</p>
                  )}
                </div>

                {errorMsg && (
                  <p className="rounded-2xl border-2 border-rose-500/30 bg-[color-mix(in_oklab,var(--color-rose-500)_10%,var(--card))] p-3 text-center text-sm font-semibold text-rose-700 dark:text-rose-300">
                    {errorMsg}
                  </p>
                )}

                <button type="submit" disabled={isSubmitting} className={cn(DUO.primary, "w-full")}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Send feedback
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-5 xl:col-span-4">
          <section aria-labelledby="roadmap-heading" className="surface-card rounded-3xl p-4 sm:p-6">
            <h2 id="roadmap-heading" className="section-label mb-3 flex items-center gap-2">
              <Rocket className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              Roadmap
            </h2>
            <ul className="flex flex-col gap-2">
              {ROADMAP.map((item) => (
                <li key={item.title} className="rounded-2xl border-2 border-border bg-card p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-foreground">{item.title}</span>
                    <span className={cn("shrink-0 rounded-full border-2 px-2 py-0.5 text-xs font-bold", STATUS_STYLE[item.status])}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </TopicPageLayout>
  );
}
