"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, usePathname } from "next/navigation";
import { 
  MessageSquare, CheckCircle2, Loader2, Send, Bug, Lightbulb, 
  BookOpen, HelpCircle, Rocket, Sparkles, Clock, ArrowRight,
  ShieldCheck, HeartHandshake, ChevronRight, Check, Compass
} from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
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
  { 
    id: "bug", 
    label: "Bug Report", 
    desc: "Something is broken or acting up",
    icon: Bug, 
    badge: "Fix",
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    activeColor: "border-rose-500/50 bg-rose-500/10 text-rose-500 shadow-rose-500/10"
  },
  { 
    id: "feature", 
    label: "Feature Request", 
    desc: "New tool, drill, or trick idea",
    icon: Lightbulb, 
    badge: "Idea",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    activeColor: "border-amber-500/50 bg-amber-500/10 text-amber-500 shadow-amber-500/10"
  },
  { 
    id: "content", 
    label: "Content Accuracy", 
    desc: "Question, formula, or typo issue",
    icon: BookOpen, 
    badge: "QA",
    color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    activeColor: "border-violet-500/50 bg-violet-500/10 text-violet-500 shadow-violet-500/10"
  },
  { 
    id: "other", 
    label: "General Feedback", 
    desc: "Thoughts, praise, or suggestions",
    icon: MessageSquare, 
    badge: "Note",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    activeColor: "border-emerald-500/50 bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10"
  },
] as const;

const RATING_EMOJIS = [
  { value: 1, emoji: "😠", label: "Frustrating", desc: "1/5" },
  { value: 2, emoji: "😐", label: "Needs Work", desc: "2/5" },
  { value: 3, emoji: "😊", label: "Good", desc: "3/5" },
  { value: 4, emoji: "🤩", label: "Great", desc: "4/5" },
  { value: 5, emoji: "🚀", label: "Superb", desc: "5/5" },
];

const ROADMAP_ITEMS = [
  {
    title: "Speed Math Practice Engine",
    desc: "Timed arithmetic, percentage fractions & BODMAS chains",
    status: "Active Sprint",
    statusColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: Rocket,
  },
  {
    title: "PYQ Shift Vault (2018–2024)",
    desc: "Filterable authentic Tier 1 & Tier 2 exam papers",
    status: "In Progress",
    statusColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  {
    title: "Interactive English Vocab Games",
    desc: "Crosswords, sentence anagrams & rapid root words",
    status: "Planned",
    statusColor: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/20",
    icon: Sparkles,
  },
  {
    title: "AI Weakness Radar & Diagnostics",
    desc: "Pinpoints sub-topic accuracy leaks across sectional tests",
    status: "Planned",
    statusColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: Compass,
  },
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
        colors: ["#f59e0b", "#10b981", "#8b5cf6"]
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
      title="Feedback & Roadmap"
      description="Help us build the highest-converting SSC CGL prep system. Your bug reports, speed math ideas, and suggestions go directly into the next sprint."
      contentMaxWidthClass="w-full max-w-[1400px]"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
        {/* Left Column: Form / Success Card */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className="bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-black/5 relative overflow-hidden noise-overlay">
            {/* Ambient Lighting Mesh */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center text-center py-8 relative z-10"
                >
                  <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-3xl flex items-center justify-center text-emerald-500 mb-6 shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
                    Feedback Received
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                    Thank You for Shaping PrepPilot!
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-3 max-w-md leading-relaxed font-medium">
                    We review every community submission to optimize sprint priorities. Your insight directly improves the CGL 2026 prep experience.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-md">
                    <Button
                      onClick={() => router.push("/dashboard")}
                      className="flex-1 h-12 px-6 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95 transition-all duration-200 cursor-pointer border-0"
                    >
                      Return to Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSuccess(false);
                        form.reset({
                          category: "feature",
                          rating: 5,
                          message: "",
                          name: user?.displayName || "",
                        });
                      }}
                      className="flex-1 h-12 px-6 rounded-full text-xs font-mono font-bold tracking-widest uppercase border border-border/60 hover:bg-card/80 text-foreground cursor-pointer transition-all"
                    >
                      Submit Another
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative z-10"
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-inner">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                          Direct Feedback Portal
                        </h2>
                        <p className="text-xs text-muted-foreground font-medium">
                          Submitted directly to the core engineering team
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      Tier 1 Focused
                    </span>
                  </div>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Category Selection */}
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                        1. Select Category
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CATEGORIES.map((cat) => {
                          const isSelected = selectedCategory === cat.id;
                          const Icon = cat.icon;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => form.setValue("category", cat.id)}
                              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                                isSelected
                                  ? `${cat.activeColor} shadow-md`
                                  : "border-border/50 bg-card/40 hover:bg-card/70 hover:border-border text-foreground"
                              }`}
                            >
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${cat.color}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-extrabold text-foreground tracking-tight">
                                    {cat.label}
                                  </span>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-amber-500" />
                                  )}
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 truncate">
                                  {cat.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Rating Selection */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                          2. Overall App Experience
                        </Label>
                        <span className="text-xs font-mono font-bold text-amber-500">
                          {RATING_EMOJIS.find(r => r.value === selectedRating)?.label || "Select rating"}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2 p-2 bg-card/40 backdrop-blur-md rounded-2xl border border-border/40">
                        {RATING_EMOJIS.map((rating) => {
                          const isSelected = selectedRating === rating.value;
                          return (
                            <button
                              key={rating.value}
                              type="button"
                              onClick={() => form.setValue("rating", rating.value)}
                              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                                isSelected 
                                  ? "bg-amber-500/15 border border-amber-500/30 scale-105 shadow-sm shadow-amber-500/10" 
                                  : "hover:bg-muted/50 opacity-70 hover:opacity-100"
                              }`}
                            >
                              <span className="text-2xl sm:text-3xl select-none transition-transform duration-200">
                                {rating.emoji}
                              </span>
                              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isSelected ? "text-amber-500" : "text-muted-foreground"}`}>
                                {rating.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {form.formState.errors.rating && (
                        <p className="text-xs font-medium text-rose-500">
                          {form.formState.errors.rating.message}
                        </p>
                      )}
                    </div>

                    {/* Message / Details */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                        3. Details & Explanation
                      </Label>
                      <textarea
                        id="message"
                        placeholder="Tell us exactly what happened, what formula was off, or what feature would supercharge your preparation..."
                        {...form.register("message")}
                        rows={4}
                        className="w-full rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md p-4 text-sm font-medium shadow-inner transition-all focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 placeholder:text-muted-foreground/50 resize-none min-h-[120px]"
                      />
                      {form.formState.errors.message && (
                        <p className="text-xs font-medium text-rose-500">
                          {form.formState.errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Name / Identifier Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                        <span>4. Aspirant Name</span>
                        <span className="text-muted-foreground/50 normal-case font-normal">(optional)</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        {...form.register("name")}
                        className="h-12 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md px-4 text-sm font-medium focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/20 transition-all"
                      />
                      {form.formState.errors.name && (
                        <p className="text-xs font-medium text-rose-500">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    {errorMsg && (
                      <div className="text-xs font-mono font-bold text-rose-500 text-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        {errorMsg}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 sm:h-13 px-6 rounded-full text-xs font-mono font-bold tracking-widest uppercase gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 hover:cursor-pointer flex items-center justify-center border-0 group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Transmitting to Engineering Queue...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                          Transmit Feedback
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Roadmap & Developer SLA (Desktop Rail) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          {/* Upcoming Roadmap Card */}
          <div className="bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl p-6 shadow-xl shadow-black/5 noise-overlay relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                  Public Engineering Roadmap
                </h3>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">
                Sprint 4
              </span>
            </div>

            <div className="space-y-3.5">
              {ROADMAP_ITEMS.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-card/40 border border-border/40 hover:border-amber-500/30 transition-all flex flex-col gap-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                      <item.icon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-5.5">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Developer Commitment Card */}
          <div className="bg-card/60 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-6 shadow-xl shadow-emerald-500/5 noise-overlay relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <HeartHandshake className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  Our Community Promise
                </h4>
                <p className="text-[10px] font-mono text-emerald-500">24-Hour Review SLA</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Every bug and feature idea logged here is triaged by our team. If you report a calculation discrepancy or question typo, we correct the database within hours!
            </p>
          </div>
        </div>
      </div>
    </TopicPageLayout>
  );
}
