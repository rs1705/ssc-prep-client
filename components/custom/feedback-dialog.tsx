"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePathname } from "next/navigation";
import { MessageSquare, CheckCircle2, Loader2, Star } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

export default function FeedbackDialog() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
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

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form states on close
      setTimeout(() => {
        setIsSuccess(false);
        setErrorMsg(null);
        form.reset({
          category: "other",
          rating: 0,
          message: "",
          email: user?.email || "",
        });
      }, 300);
    }
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white rounded-full shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_24px_rgba(99,102,241,0.4)] active:scale-95 transition-all duration-200 cursor-pointer group"
          title="Provide Feedback"
        >
          <MessageSquare className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-6 rounded-3xl border bg-background/95 backdrop-blur-md shadow-2xl overflow-hidden">
        {isSuccess ? (
          <div className="flex flex-col items-center text-center py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-500 mb-4">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">Thank You!</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2 px-2">
              Your feedback has been submitted successfully. We appreciate your help in making SSC Prep better!
            </DialogDescription>
            <Button
              onClick={() => onOpenChange(false)}
              className="mt-6 w-full h-11 rounded-xl font-semibold bg-gradient-to-r from-primary to-indigo-600 text-white hover:opacity-95 shadow-md active:scale-98 transition-transform"
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold tracking-tight">Share Your Feedback</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Spotted a bug? Have an idea? Help us build the ultimate preparation app.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">
              {/* Category selector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</Label>
                <div className="grid grid-cols-2 gap-2">
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
                            : "border-border bg-card text-foreground " + cat.color
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating selection */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">How is your experience?</Label>
                <div className="flex justify-between p-2.5 bg-muted/40 border rounded-2xl">
                  {RATING_EMOJIS.map((rating) => {
                    const isSelected = form.watch("rating") === rating.value;
                    return (
                      <button
                        key={rating.value}
                        type="button"
                        onClick={() => form.setValue("rating", rating.value)}
                        className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 cursor-pointer"
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
              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Details
                </Label>
                <textarea
                  id="message"
                  placeholder="Describe what went wrong or how we can improve..."
                  {...form.register("message")}
                  rows={3}
                  className="w-full rounded-2xl border border-input bg-card p-3 text-sm font-medium shadow-sm transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/60 resize-none min-h-[80px]"
                />
                {form.formState.errors.message && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email Address <span className="text-[10px] text-muted-foreground/50 lowercase font-medium">(optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...form.register("email")}
                  className="h-11 rounded-xl border border-input bg-card font-medium text-sm"
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

              {/* Actions */}
              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 h-11 rounded-xl font-semibold border-border hover:bg-muted text-muted-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-xl font-bold bg-gradient-to-r from-primary to-indigo-600 text-white hover:opacity-95 shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
