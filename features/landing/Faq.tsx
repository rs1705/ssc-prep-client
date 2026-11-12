"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const SSC_FAQS = [
  {
    question: "Are these real previous year questions?",
    answer: "Yes. The questions come from official SSC CGL Tier 1 papers (currently shifts from 2024 and 2025). Each one is tagged by topic and comes with a step-by-step explanation. Questions that need a figure are left out for now, and more papers are being added."
  },
  {
    question: "How does the Mental Maths Arena help me score higher in Quant?",
    answer: "SSC Tier 1 requires solving 25 Quant questions in roughly 15–18 minutes. Writing manual scratch work for basic calculations (like 65², 15% of 240, or 74 × 11) bleeds 3–5 seconds per question. Our timed calculation arena builds instant calculation reflex so you finish the Quant section with minutes to spare."
  },
  {
    question: "How do Smart Flashcards work for English vocabulary?",
    answer: "Instead of rereading static PDF lists, flashcards use spaced repetition. After each card you rate how well you knew it, and the algorithm brings hard cards back sooner and easy ones later. That is what moves words, idioms and one-word substitutions into long-term memory."
  },
  {
    question: "How does EptSSC differ from regular test series or PDF compilations?",
    answer: "PDF compilations are passive, and a generic test series only gives you a score at the end. EptSSC is built for active practice: timed speed drills, real PYQs with an explanation after every answer, and spaced repetition, so you find and fix weak spots while you practice."
  },
  {
    question: "Can I practice on mobile phones and tablets?",
    answer: "Yes. Every drill, flashcard deck, game and PYQ test is built mobile-first and works on phones, tablets and desktops."
  }
];

/* ─── Scroll-Driven Timeline Line ─── */

export default function AspirantFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full py-12 sm:py-20 relative z-10 bg-background scroll-mt-24">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full surface-card text-xs sm:text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-brand-500" /> Aspirant Knowledge Base
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
            Everything you need to know about our questions, speed training methodology, and study system.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {SSC_FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border-2 transition-all overflow-hidden ${
                  isOpen 
                    ? "bg-card border-brand-500/30 shadow-lg shadow-brand-500/5" 
                    : "bg-card border-border/40 hover:border-border/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-xl bg-card border-2 border-border/40 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-500" : "text-muted-foreground"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 text-xs sm:text-sm text-foreground/80 leading-relaxed font-normal border-t-2 border-border/20 mt-1"
                  >
                    <p className="pt-3">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Main Landing Page ─── */
