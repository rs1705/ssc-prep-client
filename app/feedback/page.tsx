"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, usePathname } from "next/navigation";
import { MessageSquare, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const feedbackSchema = z.object({
  category: z.enum(["bug", "feature", "content", "other"]),
  rating: z.number().min(1).max(5, "Please select a rating"),
  message: z.string().min(10, {
    message: "Feedback must be at least 10 characters long",
  }),
  name: z.string().min(2, "Name must be at least 2 characters").or(z.literal("")),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const CATEGORIES = [
  { id: "bug", label: "Bug Report 🐛", color: "hover:border-destructive hover:bg-destructive/5" },
  { id: "feature", label: "Feature Idea ✨", color: "hover:border-primary hover:bg-primary/5" },
  { id: "content", label: "Content Issue 📚", color: "hover:border-amber-500 hover:bg-amber-500/5" },
  { id: "other", label: "Other 💬", color: "hover:border-slate-500 hover:bg-slate-500/5" },
] as const;

const RATING_EMOJIS = [
  { value: 1, emoji: "😠", label: "Poor" },
  { value: 2, emoji: "😐", label: "Okay" },
  { value: 3, emoji: "😊", label: "Good" },
  { value: 4, emoji: "🤩", label: "Great" },
  { value: 5, emoji: "🚀", label: "Amazing" },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      category: "other",
      rating: 0,
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
    } catch (error: any) {
      console.error("Failed to submit feedback:", error);
      setErrorMsg("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-[550px] bg-card/60 border border-border/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center text-center py-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-500 mb-5">
              <CheckCircle2 className="w-12 h-12 animate-bounce" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Thank You!</h1>
            <p className="text-sm text-muted-foreground mt-3 max-w-[400px]">
              Your feedback has been submitted successfully. We appreciate your insights to help improve SSC Prep!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full">
              <Button
                onClick={() => router.push("/SSC")}
                className="flex-1 h-11 rounded-xl font-bold bg-gradient-to-r from-primary to-indigo-600 text-white hover:opacity-95 shadow-md active:scale-98 transition-all"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSuccess(false);
                  form.reset({
                    category: "other",
                    rating: 0,
                    message: "",
                    name: user?.displayName || "",
                  });
                }}
                className="flex-1 h-11 rounded-xl font-semibold border-border hover:bg-muted text-muted-foreground"
              >
                Submit More Feedback
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-black tracking-tight">Share Your Feedback</h1>
              </div>
              <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-1">
                <span>Spotted a bug? Have an idea? Help us build the ultimate preparation app. Or check out our</span>
                <button
                  type="button"
                  onClick={() => setShowRoadmap(!showRoadmap)}
                  className="text-primary font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  Upcoming Features 🚀
                </button>
              </p>
            </div>

            {showRoadmap && (
              <div className="bg-muted/50 rounded-2xl p-4 border border-border/85 animate-in slide-in-from-top-2 duration-300 space-y-3">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span>🚀</span> App Roadmap & Upcoming Features
                </h4>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                    <span className="text-emerald-500 font-bold mt-0.5">●</span>
                    <div>
                      <span className="font-semibold text-foreground">Speed Math Modules:</span> Timed drills for Addition, Subtraction, Multiplication, Division, Percentage, Ratios, Simplification, etc. <span className="inline-block text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-full ml-1 select-none">In Active Development</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                    <span className="text-sky-500 font-bold mt-0.5">●</span>
                    <div>
                      <span className="font-semibold text-foreground">PYQs & Topic Practice:</span> Chapter-wise previous year questions and topic practice for all subjects. <span className="inline-block text-[9px] bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold px-1.5 py-0.5 rounded-full ml-1 select-none">Planned; Coming Soon</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                    <span className="text-violet-500 font-bold mt-0.5">●</span>
                    <div>
                      <span className="font-semibold text-foreground">English Word Games:</span> Interactive crossword and word-shuffling puzzles. <span className="inline-block text-[9px] bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold px-1.5 py-0.5 rounded-full ml-1 select-none">Planned; Coming Soon</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                    <span className="text-rose-500 font-bold mt-0.5">●</span>
                    <div>
                      <span className="font-semibold text-foreground">GK & Static Quiz:</span> Daily static general knowledge cards and topic checks. <span className="inline-block text-[9px] bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold px-1.5 py-0.5 rounded-full ml-1 select-none">Planned; Coming Soon</span>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Category selector */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</Label>
                <div className="grid grid-cols-2 gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = form.watch("category") === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => form.setValue("category", cat.id)}
                        className={`h-11 rounded-xl border text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-sm font-bold"
                            : "border-border bg-card/40 text-foreground " + cat.color
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating selection */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">How is your experience?</Label>
                <div className="flex justify-between p-3 bg-muted/40 border rounded-2xl">
                  {RATING_EMOJIS.map((rating) => {
                    const isSelected = form.watch("rating") === rating.value;
                    return (
                      <button
                        key={rating.value}
                        type="button"
                        onClick={() => form.setValue("rating", rating.value)}
                        className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 cursor-pointer flex-1"
                        title={rating.label}
                      >
                        <span
                          className={`text-2xl select-none transition-all ${
                            isSelected ? "scale-125 filter drop-shadow" : "opacity-60 saturate-[40%]"
                          }`}
                        >
                          {rating.emoji}
                        </span>
                        <span
                          className={`text-[9px] font-bold transition-all ${
                            isSelected ? "text-primary" : "text-muted-foreground/60"
                          }`}
                        >
                          {rating.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {form.formState.errors.rating && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    {form.formState.errors.rating.message}
                  </p>
                )}
              </div>

              {/* Message field */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Details
                </Label>
                <textarea
                  id="message"
                  placeholder="Describe what went wrong or how we can improve..."
                  {...form.register("message")}
                  rows={4}
                  className="w-full rounded-2xl border border-input bg-card/40 p-3 text-sm font-medium shadow-sm transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/60 resize-none min-h-[100px]"
                />
                {form.formState.errors.message && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>

              {/* Name field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Your Name <span className="text-[10px] text-muted-foreground/50 lowercase font-medium">(optional)</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  {...form.register("name")}
                  className="h-11 rounded-xl border border-input bg-card/40 font-medium text-sm"
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {errorMsg && (
                <div className="text-xs text-red-500 font-semibold text-center mt-1">
                  {errorMsg}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl font-bold bg-gradient-to-r from-primary to-indigo-600 text-white hover:opacity-95 shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Feedback...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
