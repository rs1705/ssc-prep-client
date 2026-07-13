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
  email: z.string().email("Invalid email address").or(z.literal("")),
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

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      category: "other",
      rating: 0,
      message: "",
      email: "",
    },
  });

  // Pre-fill email if user is authenticated
  useEffect(() => {
    if (user?.email) {
      form.setValue("email", user.email);
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
        email: values.email || "anonymous",
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
                    email: user?.email || "",
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
              <p className="text-sm text-muted-foreground">
                Spotted a bug? Have an idea? Help us build the ultimate preparation app.
              </p>
            </div>

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

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email Address <span className="text-[10px] text-muted-foreground/50 lowercase font-medium">(optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...form.register("email")}
                  className="h-11 rounded-xl border border-input bg-card/40 font-medium text-sm"
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.email.message}
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
