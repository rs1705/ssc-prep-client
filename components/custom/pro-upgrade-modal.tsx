"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ShieldCheck, Rocket, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export function ProUpgradeModal({ isOpen, onClose, featureName = "this feature" }: ProUpgradeModalProps) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-card border-2 border-primary/20 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto relative flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 p-8 pb-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-500/20 relative z-10">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-foreground relative z-10 mb-2">
                  Unlock {featureName}
                </h2>
                <p className="text-sm text-foreground/70 font-medium relative z-10">
                  Target your exact weaknesses and optimize your score with PrepPilot PRO.
                </p>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 flex flex-col bg-background">
                <div className="flex items-baseline justify-center gap-1 mb-6">
                  <span className="text-4xl font-black text-foreground">₹99</span>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">/ month</span>
                </div>

                <ul className="flex flex-col gap-3 mb-8">
                  <li className="flex items-start gap-3 text-sm font-semibold text-foreground/90">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><span className="text-foreground font-bold">Unlimited Topic Drills:</span> Master specific weak areas.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm font-semibold text-foreground/90">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><span className="text-foreground font-bold">Full PYQ Vault:</span> Access all historical shifts (2020-2025).</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm font-semibold text-foreground/90">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><span className="text-foreground font-bold">AI Analytics:</span> Deep insights into pacing and accuracy.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm font-semibold text-foreground/90">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><span className="text-foreground font-bold">FSRS Flashcards:</span> Algorithmically synced study mode.</span>
                  </li>
                </ul>

                {/* CTA */}
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-center hover:opacity-90 hover:scale-[1.02] transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" /> Upgrade to PRO
                </Link>
                
                <div className="text-center mt-4">
                  <button onClick={onClose} className="text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
