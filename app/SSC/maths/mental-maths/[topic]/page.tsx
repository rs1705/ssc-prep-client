"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import posthog from "posthog-js";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { ProgressBar } from "@/components/custom/ProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMentalMathsEngine } from "@/hooks/useMentalMathsEngine";
import { DIFFICULTY_CONFIGS } from "@/lib/mathGenerator";
import { ENCOURAGEMENT_MESSAGES } from "@/lib/encouragementMessages";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  MinusCircle,
  X,
  Zap,
  Swords,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const COUNTDOWN_MESSAGES = [
  "Clear your mind...",
  "Focus on accuracy...",
  "Take a deep breath...",
  "You've got this...",
  "Lock in...",
  "Stay sharp...",
  "Trust your instincts...",
];

const getQuestionFontSize = (text: string | undefined) => {
  if (!text) return "text-4xl sm:text-5xl";
  const len = text.length;
  if (len <= 10) return "text-4xl sm:text-5xl md:text-6xl";
  if (len <= 18) return "text-3xl sm:text-4xl md:text-5xl";
  if (len <= 28) return "text-2xl sm:text-3xl md:text-4xl";
  return "text-xl sm:text-2xl md:text-3xl";
};

const renderTopicIcon = (topic: string, className?: string) => {
  const iconClass = className || "text-primary/80 shrink-0 w-[18px] h-[18px]";
  switch (topic.toLowerCase()) {
    case "addition":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case "subtraction":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case "division":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <circle cx="12" cy="6" r="1.5" fill="currentColor" />
          <circle cx="12" cy="18" r="1.5" fill="currentColor" />
        </svg>
      );
    case "multiplication":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case "squares":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 12h18M12 3v18" />
        </svg>
      );
    case "cubes":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    default:
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
  }
};

const getDifficultyDescription = (topic: string, diff: string) => {
  const t = topic.toLowerCase();
  const d = diff.toLowerCase();
  const config = DIFFICULTY_CONFIGS[t];

  if (!config) return "";

  let min = config.easyMin;
  let max = config.easyMax;

  if (d === "medium") {
    min = config.mediumMin;
    max = config.mediumMax;
  } else if (d === "hard") {
    min = config.hardMin;
    max = config.hardMax;
  } else if (d === "all") {
    max = config.hardMax;
  }

  if (t === "squares") {
    return d === "all"
      ? `💡 Squares ranging from ${min} to ${max}`
      : `💡 Squares from ${min} to ${max} [e.g., ${min}² = ${min * min}]`;
  }
  if (t === "cubes") {
    return d === "all"
      ? `💡 Cubes ranging from ${min} to ${max}`
      : `💡 Cubes from ${min} to ${max} [e.g., ${min}³ = ${min * min * min}]`;
  }
  if (t === "addition") {
    const digits = min.toString().length;
    return d === "all"
      ? `💡 Additions ranging from ${min} to ${max}`
      : `💡 ${digits}-digit additions ( Range: ${min} to ${max}) [e.g.,${max} + ${min}=${max + min}]`;
  }
  if (t === "subtraction") {
    const digits = min.toString().length;
    return d === "all"
      ? `💡 Subtractions ranging from ${min} to ${max}`
      : `💡 ${digits}-digit subtractions ( Range: ${min} to ${max}) [e.g,${max}-${min}=${max - min}]`;
  }
  if (t === "multiplication") {
    return d === "all"
      ? `💡Multiplication ranging from ${min} to ${max}`
      : `💡 ${min} to ${max} [e.g ${min}x${min}=${min * min}]`;
  }
  if (t === "division") {
    return d === "all"
      ? `💡 Division ranging up to divisors of ${max}`
      : `💡 Division with divisors from ${min} to ${max} [e.g ${max * min} ÷ ${min} = ${max}]`;
  }

  return "";
};

export default function MentalMathsPractice() {
  const { topic } = useParams() as { topic: string };
  const router = useRouter();

  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);
  const engine = useMentalMathsEngine(topic, showQuitConfirm);
  const gameState = engine.state.status;

  const inputRef = useRef<HTMLInputElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [animatedAccuracy, setAnimatedAccuracy] = useState<number>(0);
  const [inputLayout, setInputLayout] = useState<"keys" | "mcq">("mcq");
  const [resultsTab, setResultsTab] = useState<"overview" | "review">(
    "overview",
  );

  const countdownMsg = React.useMemo(() => {
    if (gameState !== "countdown") return "";
    return COUNTDOWN_MESSAGES[
      Math.floor(Math.random() * COUNTDOWN_MESSAGES.length)
    ];
  }, [gameState]);

  const handleDifficultyChange = (
    newDifficulty: "easy" | "medium" | "hard" | "all",
  ) => {
    engine.setConfig(
      engine.state.mode,
      newDifficulty,
      engine.state.timeLimit,
      engine.state.questionLimit,
    );
  };

  const handleModeChange = (newMode: "timed" | "freestyle") => {
    engine.setConfig(
      newMode,
      engine.state.difficulty,
      engine.state.timeLimit,
      engine.state.questionLimit,
    );
  };

  const handleTimerLimitChange = (newTimeLimit: number) => {
    engine.setConfig(
      engine.state.mode,
      engine.state.difficulty,
      newTimeLimit,
      engine.state.questionLimit,
    );
  };

  const handleQuestionLimitChange = (newQuestionLimit: number) => {
    engine.setConfig(
      engine.state.mode,
      engine.state.difficulty,
      engine.state.timeLimit,
      newQuestionLimit,
    );
  };

  const handleStartPractice = () => {
    engine.startSession();
  };

  const handleEnterSubmit = (userInput: string | number | "skip") => {
    if (userInput === "skip") {
      engine.submitUserAnswer("skip");
    } else {
      if (
        inputLayout === "keys" &&
        typeof userInput === "string" &&
        userInput.trim() !== ""
      ) {
        engine.submitUserAnswer(Number(userInput));
      } else if (inputLayout === "mcq" && typeof userInput == "number") {
        engine.submitUserAnswer(userInput);
      }
    }
  };

  const handleNumClick = (numpadValue: string) => {
    if (numpadValue.toLowerCase() === "clear") {
      setUserInput("");
    } else if (numpadValue === "⌫")
      setUserInput(userInput.slice(0, userInput.length - 1));
    else {
      setUserInput(userInput + numpadValue);
    }
  };

  useEffect(() => {
    setUserInput("");
    setSelectedOption(null);
  }, [engine.state.currentQuestion]);

  // Animate accuracy percentage on game over screen
  const correctVal = engine.state.correctAnswers;
  const wrongVal = engine.state.wrongAnswers;
  const skippedVal = engine.state.skippedAnswers;
  const totalVal = correctVal + wrongVal + skippedVal;
  const targetAccuracy =
    totalVal > 0 ? Math.floor((correctVal / totalVal) * 100) : 0;

  const encouragementMessage = React.useMemo(() => {
    let messages = ENCOURAGEMENT_MESSAGES.needsImprovement;
    if (targetAccuracy >= 90) messages = ENCOURAGEMENT_MESSAGES.exceptional;
    else if (targetAccuracy >= 75) messages = ENCOURAGEMENT_MESSAGES.great;
    else if (targetAccuracy >= 50) messages = ENCOURAGEMENT_MESSAGES.good;
    return messages[Math.floor(Math.random() * messages.length)];
  }, [targetAccuracy]);

  useEffect(() => {
    if (gameState === "game_over") {
      setAnimatedAccuracy(0);
      if (targetAccuracy === 0) return;

      let start = 0;
      const duration = 800; // Snappy 800ms animation
      const stepTime = Math.max(Math.floor(duration / targetAccuracy), 10);

      const timer = setInterval(() => {
        start += 1;
        setAnimatedAccuracy(start);
        if (start >= targetAccuracy) {
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setAnimatedAccuracy(0);
    }
  }, [gameState, targetAccuracy]);

  // Game over 100% accuracy confetti effect
  useEffect(() => {
    if (gameState === "game_over") {
      const correct = engine.state.correctAnswers;
      const total =
        correct + engine.state.wrongAnswers + engine.state.skippedAnswers;
      const accuracy = total > 0 ? Math.floor((correct / total) * 100) : 0;

      if (accuracy === 100 && confettiCanvasRef.current) {
        const myConfetti = confetti.create(confettiCanvasRef.current, {
          resize: true,
          useWorker: true,
        });

        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          zIndex: 100,
        };

        function fire(particleRatio: number, opts: confetti.Options) {
          myConfetti(
            Object.assign({}, defaults, opts, {
              particleCount: Math.floor(count * particleRatio),
            }),
          );
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      }
    }
  }, [
    gameState,
    engine.state.correctAnswers,
    engine.state.wrongAnswers,
    engine.state.skippedAnswers,
  ]);

  // PostHog: Capture session completion with full performance stats
  useEffect(() => {
    if (gameState === "game_over") {
      const total = correctVal + wrongVal + skippedVal;
      posthog.capture("mental_maths_session_completed", {
        topic,
        difficulty: engine.state.difficulty,
        mode: engine.state.mode,
        score: engine.state.score,
        correctAnswers: correctVal,
        wrongAnswers: wrongVal,
        skippedAnswers: skippedVal,
        totalQuestions: total,
        accuracy: total > 0 ? Math.floor((correctVal / total) * 100) : 0,
        timeLimit: engine.state.timeLimit,
        questionLimit: engine.state.questionLimit,
      });
    }
  }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Progress bar calculations
  const timeRemaining = engine.state.timeRemaining ?? 0;
  const timeLimit = engine.state.timeLimit ?? 1;
  const attemptedQuestionsCount = engine.state.attemptedQuestionsCount;
  const questionLimit = engine.state.questionLimit ?? 1;

  const isTimedMode = engine.state.mode === "timed";
  const sec =
    isTimedMode && engine.state.timeRemaining !== null
      ? engine.state.timeRemaining
      : null;

  let barColorClass = "";
  let timerTextColorClass = "text-muted-foreground";

  if (isTimedMode && sec !== null) {
    if (sec <= 3) {
      barColorClass = "from-red-500 to-rose-600 animate-pulse";
      timerTextColorClass = "text-rose-500 dark:text-rose-400 font-extrabold";
    } else if (sec <= 5) {
      barColorClass = "from-red-500 to-rose-600 transition-colors duration-500";
      timerTextColorClass = "text-rose-500 dark:text-rose-400 font-extrabold";
    } else if (sec <= 10) {
      barColorClass =
        "from-orange-500 to-amber-500 transition-colors duration-500";
      timerTextColorClass =
        "text-orange-500 dark:text-orange-400 font-extrabold";
    }
  }

  const progressPercentage = isTimedMode
    ? Math.min(100, Math.max(0, (timeRemaining / timeLimit) * 100))
    : Math.min(
        100,
        Math.max(0, (attemptedQuestionsCount / questionLimit) * 100),
      );

  const progressText = isTimedMode
    ? `${timeRemaining}s remaining`
    : `${attemptedQuestionsCount} / ${questionLimit} Qs`;

  const containerHeightClass = "w-full h-auto mb-2 md:mb-4";

  return (
    <TopicPageLayout
      contentMaxWidthClass="w-full max-w-md"
      hideBreadcrumbs={true}
      centerContent={true}
    >
      <div
        className={`relative w-full sm:mt-2 flex flex-col p-4 sm:p-6 bg-card border border-primary/30 rounded-3xl shadow-sm select-none ${containerHeightClass} transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {/* Back / Quit Button */}
        {gameState === "idle" && (
          <div className="flex justify-start w-full shrink-0 -mt-1 -ml-1 sm:-mt-2 sm:-ml-2 z-50 mb-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1 h-8 px-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all cursor-pointer flex-shrink-0 border-none outline-none text-xs font-semibold"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        )}
        {gameState === "active" && (
          <div className="flex justify-end w-full shrink-0 -mt-2 -mr-2 sm:-mt-3 sm:-mr-3 z-50">
            <button
              type="button"
              onClick={() => setShowQuitConfirm(true)}
              className="h-8 w-8 mb-2 rounded-full flex items-center justify-center bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all cursor-pointer flex-shrink-0 border-none outline-none"
              title="Quit"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        )}
        {gameState === "game_over" && (
          <div className="flex justify-end w-full shrink-0 -mt-2 -mr-2 sm:-mt-3 sm:-mr-3 z-50">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-8 w-8 mb-2 rounded-full flex items-center justify-center bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all cursor-pointer flex-shrink-0 border-none outline-none"
              title="Close"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* 
          Master Layout Wrapper: 
          The idle screen is always in the DOM (but hidden visually when not idle) 
          so it perfectly dictates the exact physical height of the entire card.
          Other screens render absolutely on top of it.
        */}
        <div className="relative w-full flex flex-col flex-1">
          {/* 1. LOBBY CONFIGURATION SCREEN (Always rendered) */}
          <div
            className={`w-full flex flex-col gap-1 transition-all duration-300 ${
              gameState === "idle"
                ? "opacity-100 z-10 animate-in fade-in slide-in-from-bottom-3"
                : "opacity-0 invisible pointer-events-none"
            }`}
            aria-hidden={gameState !== "idle"}
          >
            {/* Title Section */}
            <div className="text-center pb-1">
              <h2 className="text-2xl font-extrabold tracking-tight capitalize text-foreground">
                {topic} Practice
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 leading-normal">
                Speed test your calculations for {topic} and beat the clock!
              </p>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none pb-2">
              {/* Difficulty Card */}
              <div className="bg-muted/10 border border-border/50 rounded-2xl p-3 shadow-sm transition-all hover:bg-muted/20 hover:border-border">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary font-mono text-[10px] pt-px">
                    1
                  </span>
                  Select Difficulty
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {(["easy", "medium", "hard", "all"] as const).map((d) => {
                    const isSelected = d === engine.state.difficulty;
                    const label =
                      d === "easy"
                        ? "Easy"
                        : d === "medium"
                          ? "Medium"
                          : d === "hard"
                            ? "Hard"
                            : "All";
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleDifficultyChange(d)}
                        className={`rounded-xl h-12 flex-1 border-2 font-bold text-xs transition-all duration-200 ease-in-out active:scale-[0.96] cursor-pointer ${
                          isSelected
                            ? "border-accent bg-accent/10 text-accent shadow-sm"
                            : "border-border/50 hover:bg-muted/50 hover:border-border text-foreground bg-card"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed italic border-l-2 border-primary/20 pl-2">
                  {getDifficultyDescription(topic, engine.state.difficulty)}
                </p>
              </div>

              {/* Practice Mode & Limits Card */}
              <div className="bg-muted/10 border border-border/50 rounded-2xl p-3 shadow-sm transition-all hover:bg-muted/20 hover:border-border">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary font-mono text-[10px] pt-px">
                    2
                  </span>
                  Practice Mode
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Timed Mode Card */}
                  <button
                    type="button"
                    onClick={() => handleModeChange("timed")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center h-24 w-full transition-all duration-200 ease-in-out active:scale-[0.96] outline-none cursor-pointer ${
                      engine.state.mode === "timed"
                        ? "border-accent bg-accent/[0.08] text-accent shadow-sm"
                        : "border-border/50 bg-card hover:bg-muted/60 hover:border-border text-foreground"
                    }`}
                  >
                    <div
                      className={`p-1 rounded-lg mb-1 transition-all duration-200 ${engine.state.mode === "timed" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={
                          engine.state.mode === "timed" ? "animate-pulse" : ""
                        }
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <span className="font-bold text-[11px]">Timed</span>
                  </button>

                  {/* Freestyle Mode Card */}
                  <button
                    type="button"
                    onClick={() => handleModeChange("freestyle")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center h-24 w-full transition-all duration-200 ease-in-out active:scale-[0.96] outline-none cursor-pointer ${
                      engine.state.mode === "freestyle"
                        ? "border-accent bg-accent/[0.08] text-accent shadow-sm"
                        : "border-border/50 bg-card hover:bg-muted/60 hover:border-border text-foreground"
                    }`}
                  >
                    <div
                      className={`p-1 rounded-lg mb-1 transition-all duration-200 ${engine.state.mode === "freestyle" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={
                          engine.state.mode === "freestyle"
                            ? "animate-pulse"
                            : ""
                        }
                      >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    </div>
                    <span className="font-bold text-[11px]">Freestyle</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {engine.state.mode === "timed"
                    ? [30, 60, 90].map((t) => {
                        const isSelected = t === engine.state.timeLimit;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleTimerLimitChange(t)}
                            className={`rounded-xl h-12 flex-1 border-2 font-bold font-mono text-xs transition-all duration-200 ease-in-out active:scale-[0.96] cursor-pointer ${
                              isSelected
                                ? "border-accent bg-accent/10 text-accent shadow-sm"
                                : "border-border/50 hover:bg-muted/50 hover:border-border text-foreground bg-card"
                            }`}
                          >
                            {t}s
                          </button>
                        );
                      })
                    : [10, 20, 30].map((q) => {
                        const isSelected = q === engine.state.questionLimit;
                        return (
                          <button
                            key={q}
                            type="button"
                            onClick={() => handleQuestionLimitChange(q)}
                            className={`rounded-xl h-12 flex-1 border-2 font-bold font-mono text-xs transition-all duration-200 ease-in-out active:scale-[0.96] cursor-pointer ${
                              isSelected
                                ? "border-accent bg-accent/10 text-accent shadow-sm"
                                : "border-border/50 hover:bg-muted/50 hover:border-border text-foreground bg-card"
                            }`}
                          >
                            {q} Qs
                          </button>
                        );
                      })}
                </div>
              </div>

              {/* Input Layout Card */}
              <div className="bg-muted/10 border border-border/50 rounded-2xl p-3 shadow-sm transition-all hover:bg-muted/20 hover:border-border">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary font-mono text-[10px] pt-px">
                    3
                  </span>
                  Input Layout
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInputLayout("mcq")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center h-14 w-full transition-all duration-200 ease-in-out active:scale-[0.96] outline-none cursor-pointer ${
                      inputLayout === "mcq"
                        ? "border-accent bg-accent/[0.08] text-accent shadow-sm"
                        : "border-border/50 bg-card hover:bg-muted/60 hover:border-border text-foreground"
                    }`}
                  >
                    <span className="font-bold text-[11px]">MCQs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputLayout("keys")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center h-14 w-full transition-all duration-200 ease-in-out active:scale-[0.96] outline-none cursor-pointer ${
                      inputLayout === "keys"
                        ? "border-accent bg-accent/[0.08] text-accent shadow-sm"
                        : "border-border/50 bg-card hover:bg-muted/60 hover:border-border text-foreground"
                    }`}
                  >
                    <span className="font-bold text-[11px]">NUMPAD</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full mt-auto">
              <Button
                className="flex-1 h-12 px-5 py-3 rounded-full text-[11px] font-extrabold tracking-widest uppercase gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 hover:cursor-pointer flex items-center justify-center border-0 group"
                onClick={handleStartPractice}
              >
                <Swords className="w-4 h-4 group-hover:rotate-12 group-hover:scale-120 transition-transform duration-300" />
                Practice
              </Button>
            </div>
          </div>

          {/* ABSOLUTE OVERLAYS FOR OTHER GAME STATES (Perfectly matches idle height) */}
          {gameState !== "idle" && (
            <div className="absolute inset-0 z-20 w-full h-full flex flex-col">
              {/* 2. THREE-SECOND START COUNTDOWN */}
              {gameState === "countdown" && (
                <div className="h-full flex flex-col items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={engine.state.countdownTick}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "backOut" }}
                      className="text-8xl font-black text-accent drop-shadow-md font-mono"
                    >
                      {engine.state.countdownTick}
                    </motion.div>
                  </AnimatePresence>
                  <motion.p
                    key={countdownMsg}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    className="text-muted-foreground mt-8 text-sm font-semibold"
                  >
                    {countdownMsg}
                  </motion.p>
                </div>
              )}

              {/* 3. ACTIVE PRACTICE BOARD */}
              {gameState === "active" && (
                /* Active Game Container */
                <div className="h-full w-full max-w-sm sm:max-w-md mx-auto flex flex-col justify-between pt-1 pb-1">
                  {/* Top Bar: Topic Badge + Score Pill + Switcher */}
                  <div className="flex items-center justify-between w-full pb-3 gap-2">
                    {/* Left: Topic Icon + Name & Tags */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex-shrink-0 bg-primary/10 p-2 rounded-xl text-primary flex items-center justify-center">
                        {renderTopicIcon(
                          topic,
                          "w-5 h-5 sm:w-6 sm:h-6 shrink-0",
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 justify-center">
                        <span className="font-black text-base sm:text-lg tracking-tight text-foreground leading-none capitalize truncate">
                          {topic}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 min-w-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 select-none">
                          <span>
                            {engine.state.mode === "timed"
                              ? "Timed"
                              : "Freestyle"}
                          </span>
                          <span className="text-muted-foreground/25">•</span>
                          <span
                            className={`${
                              engine.state.difficulty === "easy"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : engine.state.difficulty === "medium"
                                  ? "text-amber-500"
                                  : engine.state.difficulty === "all"
                                    ? "text-primary"
                                    : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {engine.state.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Score Pill + Layout Switcher */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Score Pill */}
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 rounded-full px-2.5 py-1 select-none">
                        <Zap className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 fill-emerald-500 dark:fill-emerald-400" />
                        <div className="h-5 overflow-hidden flex items-center relative min-w-[16px] justify-center">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={engine.state.score}
                              initial={{ y: 14, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -14, opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 25,
                              }}
                              className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums"
                            >
                              {engine.state.score}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Compact Layout Switcher */}
                      <div className="flex items-center bg-muted/50 p-0.5 rounded-xl border border-border/40 select-none text-[10px] font-bold w-[80px] sm:w-[92px]">
                        <button
                          type="button"
                          onClick={() => setInputLayout("mcq")}
                          className={`flex-1 py-0.5 rounded-lg transition-all cursor-pointer text-center ${
                            inputLayout === "mcq"
                              ? "bg-background text-primary shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          title="MCQ Mode"
                        >
                          MCQ
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputLayout("keys")}
                          className={`flex-1 py-0.5 rounded-lg transition-all cursor-pointer text-center ${
                            inputLayout === "keys"
                              ? "bg-background text-primary shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          title="Keypad Mode"
                        >
                          NUM
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress / Timer Row */}
                  <div className="w-full flex flex-col gap-1 mb-1">
                    {/* Labels Row */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 select-none">
                        {engine.state.mode === "timed" ? "Time Left" : "Progress"}
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-black font-mono tabular-nums tracking-wide transition-colors ${timerTextColorClass}`}
                      >
                        {progressText}
                      </span>
                    </div>
                    {/* Bar */}
                    <ProgressBar
                      value={progressPercentage}
                      className="h-1.5 bg-muted/50 rounded-full"
                      barClassName={barColorClass}
                    />
                  </div>

                  <div
                    className={`
                            mt-2 flex-1 flex flex-col items-center justify-center rounded-2xl py-5 px-4 min-h-[120px] overflow-hidden border transition-all duration-300 ease-in-out select-none
                            ${engine.state.currentAnswerStatus === "correct" ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)] text-emerald-600 dark:text-emerald-400 scale-[1.02]" : ""}
                            ${engine.state.currentAnswerStatus === "wrong" ? "border-rose-500 bg-rose-500/10 dark:bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)] text-rose-600 dark:text-rose-400 scale-[0.98]" : ""}
                            ${engine.state.currentAnswerStatus === "skipped" ? "border-amber-500 bg-amber-500/10 dark:bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)] text-amber-600 dark:text-amber-400" : ""}
                            ${engine.state.currentAnswerStatus === "idle" ? "border-border/80 bg-background/50" : ""}
                        `}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={engine.state.questionIndex}
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                        className={`font-black tracking-tight text-center w-full font-mono ${getQuestionFontSize(
                          engine.state.currentQuestion?.questionText,
                        )}`}
                      >
                        {engine.state.currentQuestion?.questionText}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Fixed-Height Wrapper for Inputs to prevent Question Panel jumping */}
                  <div className="h-[286px] sm:h-[322px] w-full mt-4 sm:mt-6 mb-5 sm:mb-7 relative">
                    <AnimatePresence mode="wait">
                      {inputLayout === "keys" ? (
                        <motion.div
                          key="numpad"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.15, ease: "easeInOut" }}
                          className="flex flex-col gap-2.5 w-full"
                        >
                          {/* Answer Input Bar */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleEnterSubmit(userInput);
                            }}
                            className="flex gap-2 w-full"
                          >
                            <Input
                              ref={inputRef}
                              type="text"
                              inputMode="none"
                              placeholder="Answer..."
                              value={userInput}
                              onChange={(e) =>
                                setUserInput(e.target.value.replace(/\D/g, ""))
                              }
                              className="h-11 sm:h-12 flex-1 rounded-xl text-center px-4 text-base sm:text-lg font-medium border border-border bg-muted/40 focus-visible:bg-background focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 caret-primary shadow-inner transition-all"
                              autoFocus
                            />
                            <Button
                              type="submit"
                              className="h-11 sm:h-12 w-24 sm:w-32 flex-shrink-0 rounded-2xl text-xs sm:text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-transform cursor-pointer"
                              onClick={() => handleEnterSubmit(userInput)}
                            >
                              Enter
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-11 sm:h-12 rounded-2xl px-3 sm:px-4 flex-shrink-0 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted active:scale-[0.98] transition-all cursor-pointer"
                              onClick={() => handleEnterSubmit("skip")}
                            >
                              Skip
                            </Button>
                          </form>

                          {/* Interactive Thumb Keypad (For smooth mobile typing) */}
                          <div className="grid grid-cols-3 gap-2 p-2 bg-muted/30 border border-border/40 rounded-3xl shadow-inner">
                            {[
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                              "Clear",
                              "0",
                              "⌫",
                            ].map((btn) => (
                              <button
                                key={btn}
                                type="button"
                                onClick={() => handleNumClick(btn)}
                                className={`h-[54px] sm:h-[58px] font-extrabold rounded-2xl border transition-all duration-150 ease-out outline-none select-none active:scale-[0.90] cursor-pointer shadow-sm hover:shadow-md font-mono ${
                                  btn === "Clear"
                                    ? "bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground border-border/60 text-xs active:bg-accent/10 active:border-accent font-sans"
                                    : btn === "⌫"
                                      ? "bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground border-border/60 text-base active:bg-accent/10 active:border-accent font-sans"
                                      : "bg-card text-foreground hover:bg-muted/40 border-border/60 text-lg active:bg-accent/10 active:border-accent"
                                }`}
                              >
                                {btn}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="mcq"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.15, ease: "easeInOut" }}
                          className="flex flex-col gap-3 w-full h-full"
                        >
                          {/* MCQ Options Grid */}
                          <div className="grid grid-cols-2 gap-3 flex-1">
                            {engine?.state?.currentQuestion?.options?.map(
                              (option, idx) => {
                                const isSelected = selectedOption === option;
                                const status = engine.state.currentAnswerStatus;
                                let highlightClass =
                                  "border border-border/60 hover:shadow-md bg-card text-foreground hover:bg-muted/40 active:bg-accent/10 active:border-accent";
                                if (isSelected) {
                                  if (status === "correct") {
                                    highlightClass =
                                      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                                  } else if (status === "wrong") {
                                    highlightClass =
                                      "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400";
                                  }
                                }
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    className={`relative h-full font-black rounded-2xl border-2 transition-all duration-150 ease-out flex items-center justify-center px-2 sm:px-4 active:scale-[0.90] cursor-pointer shadow-sm ${highlightClass}`}
                                    onClick={() => {
                                      if (
                                        engine.state.currentAnswerStatus !==
                                        "idle"
                                      )
                                        return;
                                      setSelectedOption(option);
                                      handleEnterSubmit(option);
                                    }}
                                  >
                                    <span className="absolute top-2.5 left-2.5 text-primary text-[9px] sm:text-[10px] bg-primary/20 px-1.5 py-0.5 rounded-md select-none font-bold">
                                      {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="truncate w-full text-center text-base sm:text-lg font-black tracking-tight mt-2.5 sm:mt-1 font-mono">
                                      {option}
                                    </span>
                                  </button>
                                );
                              },
                            )}
                          </div>
                          {/* Skip Button for MCQ */}
                          <div className="flex justify-center items-center h-10 sm:h-12 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEnterSubmit("skip")}
                              className="text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl px-4 py-2 active:scale-95 transition-all cursor-pointer"
                            >
                              Skip
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* 4. PERFORMANCE RESULTS SCORECARD */}
              {gameState === "game_over" &&
                (() => {
                  const correct = engine.state.correctAnswers;
                  const wrong = engine.state.wrongAnswers;
                  const skipped = engine.state.skippedAnswers;
                  const total = correct + wrong + skipped;
                  const accuracy =
                    total > 0 ? Math.floor((correct / total) * 100) : 0;
                  const radius = 48;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDashoffset =
                    circumference - (circumference * animatedAccuracy) / 100;

                  const getAccuracyColorClasses = (acc: number) => {
                    if (acc >= 90)
                      return {
                        text: "text-green-600 dark:text-green-400",
                        stroke: "stroke-green-500",
                      };
                    if (acc >= 75)
                      return {
                        text: "text-orange-500 dark:text-orange-400",
                        stroke: "stroke-orange-500",
                      };
                    if (acc >= 50)
                      return {
                        text: "text-yellow-500 dark:text-yellow-400",
                        stroke: "stroke-yellow-500",
                      };
                    return {
                      text: "text-red-500 dark:text-red-400",
                      stroke: "stroke-red-500",
                    };
                  };
                  const accuracyColors = getAccuracyColorClasses(accuracy);

                  return (
                    <div className="w-full flex-1 flex flex-col items-center justify-between text-center py-2 animate-in fade-in duration-300 relative">
                      {/* Localized Confetti Canvas */}
                      <canvas
                        ref={confettiCanvasRef}
                        className="absolute inset-0 pointer-events-none w-full h-full z-[100] rounded-3xl"
                      />

                      {/* Themed Accomplishment SVG Icon */}
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.5,
                          ease: "easeInOut",
                        }}
                        className="p-3.5 rounded-full border flex items-center justify-center text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_4px_12px_rgba(16,185,129,0.15)] select-none"
                      >
                        <Trophy className="w-9 h-9" strokeWidth={2.2} />
                      </motion.div>

                      <div>
                        <h2 className="text-2xl font-extrabold text-foreground">
                          Session completed!
                        </h2>
                        <p className="text-muted-foreground text-xs mt-1.5 font-semibold">
                          You answered{" "}
                          <strong className="text-foreground">{correct}</strong>{" "}
                          out of{" "}
                          <strong className="text-foreground">
                            {engine.state.attemptedQuestionsCount}
                          </strong>{" "}
                          questions correctly.
                        </p>
                        <div className="flex items-center justify-center gap-1.5 mt-2.5 select-none">
                          <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded-md text-[9px] font-bold uppercase">
                            🏷️ {topic}
                          </span>
                          <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded-md text-[9px] font-bold uppercase">
                            {engine.state.mode === "timed"
                              ? "⏱️ Timed"
                              : "⚡ Freestyle"}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-wider border ${
                              engine.state.difficulty === "easy"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : engine.state.difficulty === "medium"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                            }`}
                          >
                            {engine.state.difficulty}
                          </span>
                        </div>

                        {/* Performance Encouragement */}
                        <p
                          className={`text-xs sm:text-base font-extrabold text-center mt-2 tracking-tight ${accuracyColors.text}`}
                        >
                          {encouragementMessage}
                        </p>
                      </div>

                      <div className="w-full flex flex-col items-center border border-border/40 rounded-3xl overflow-hidden bg-transparent mt-1">
                        <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border/40 select-none text-xs font-bold w-[240px] mt-3 mb-1">
                          <button
                            type="button"
                            onClick={() => setResultsTab("overview")}
                            className={`flex-1 py-1 rounded-lg transition-all cursor-pointer text-center${
                              resultsTab === "overview"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Overview
                          </button>
                          <button
                            type="button"
                            onClick={() => setResultsTab("review")}
                            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                              resultsTab === "review"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Review Answers
                          </button>
                        </div>

                        <AnimatePresence mode="wait">
                          {resultsTab === "overview" ? (
                            <motion.div
                              key="overview"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="w-full flex flex-col h-[260px] text-left"
                            >
                              <div className="w-full overflow-hidden bg-transparent h-full px-3 pb-2 flex flex-col items-center justify-start gap-4">
                                {/* Centered Circular Accuracy Gauge */}
                                <div className="relative flex items-center justify-center w-[120px] h-[120px] select-none">
                                  <svg className="w-full h-full transform -rotate-90 relative z-10">
                                    <circle
                                      cx="60"
                                      cy="60"
                                      r={radius}
                                      className="stroke-muted/30"
                                      strokeWidth="5"
                                      fill="transparent"
                                    />
                                    <circle
                                      cx="60"
                                      cy="60"
                                      r={radius}
                                      className={accuracyColors.stroke}
                                      strokeWidth="5"
                                      fill="transparent"
                                      strokeDasharray={circumference}
                                      strokeDashoffset={strokeDashoffset}
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <div className="absolute flex flex-col items-center justify-center z-20">
                                    <span className="text-2xl font-extrabold tracking-tight text-foreground font-mono">
                                      {animatedAccuracy}%
                                    </span>
                                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                                      Accuracy
                                    </span>
                                  </div>
                                </div>

                                {/* Metric Grid (3-column layout) */}
                                <div className="grid grid-cols-3 gap-2.5 w-full">
                                  {/* Correct Answers */}
                                  <div className="py-3 px-1 bg-emerald-500/5 dark:bg-emerald-500/[0.03] border border-emerald-500/20 rounded-xl flex flex-col items-center justify-center min-h-[58px] shadow-xs transition-all hover:bg-emerald-500/10">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mb-1.5 opacity-80" />
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-0.5">
                                      Correct
                                    </span>
                                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                                      {correct}
                                    </span>
                                  </div>

                                  {/* Incorrect Answers */}
                                  <div className="py-3 px-1 bg-rose-500/5 dark:bg-rose-500/[0.03] border border-rose-500/20 rounded-xl flex flex-col items-center justify-center min-h-[58px] shadow-xs transition-all hover:bg-rose-500/10">
                                    <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 mb-1.5 opacity-80" />
                                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider mb-0.5">
                                      Wrong
                                    </span>
                                    <span className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                                      {wrong}
                                    </span>
                                  </div>

                                  {/* Skipped Answers */}
                                  <div className="py-3 px-1 bg-amber-500/5 dark:bg-amber-500/[0.03] border border-amber-500/20 rounded-xl flex flex-col items-center justify-center min-h-[58px] shadow-xs transition-all hover:bg-amber-500/10">
                                    <MinusCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 mb-1.5 opacity-80" />
                                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-0.5">
                                      Skipped
                                    </span>
                                    <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                                      {skipped}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="review"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="w-full flex flex-col h-[260px] text-left"
                            >
                              <div className="w-full overflow-hidden bg-transparent h-full">
                                {engine.state.history.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center text-center h-1 p-2 text-muted-foreground select-none">
                                    <span className="text-3xl mb-2">📋</span>
                                    <p className="text-xs font-semibold">
                                      No questions attempted
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/80 mt-0.5 leading-relaxed max-w-[200px]">
                                      Answers will be shown here when you
                                      complete at least one question.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="h-full overflow-y-auto scrollbar-none divide-y divide-border/60">
                                    {engine.state.history.map((item, idx) => {
                                      const isCorrect =
                                        item.status === "correct";
                                      const isWrong = item.status === "wrong";
                                      const isSkipped =
                                        item.status === "skipped";

                                      // Background tints based on status
                                      const rowBgClass = isCorrect
                                        ? "bg-emerald-500/[0.015] hover:bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] dark:hover:bg-emerald-500/[0.02]"
                                        : isWrong
                                          ? "bg-rose-500/[0.015] hover:bg-rose-500/[0.03] dark:bg-rose-500/[0.01] dark:hover:bg-rose-500/[0.02]"
                                          : "bg-amber-500/[0.015] hover:bg-amber-500/[0.03] dark:bg-amber-500/[0.01] dark:hover:bg-amber-500/[0.02]";

                                      return (
                                        <div
                                          key={idx}
                                          className={`flex items-center justify-between p-3 sm:p-4 text-xs transition-colors ${rowBgClass}`}
                                        >
                                          <div className="flex flex-col gap-1">
                                            <span className="font-extrabold text-[13px] sm:text-sm text-foreground font-mono flex items-center gap-1.5">
                                              {isCorrect && (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                              )}
                                              {isWrong && (
                                                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                              )}
                                              {isSkipped && (
                                                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                                              )}
                                              {item.questionText}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-medium">
                                              {isCorrect ? (
                                                <span>
                                                  Correct:{" "}
                                                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                    {item.correctAnswer}
                                                  </strong>
                                                </span>
                                              ) : isSkipped ? (
                                                <span>
                                                  Correct:{" "}
                                                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                    {item.correctAnswer}
                                                  </strong>
                                                </span>
                                              ) : (
                                                <span>
                                                  Correct:{" "}
                                                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                    {item.correctAnswer}
                                                  </strong>{" "}
                                                  • You:{" "}
                                                  <strong className="text-rose-600 dark:text-rose-400 font-bold line-through">
                                                    {item.userAnswer}
                                                  </strong>
                                                </span>
                                              )}
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5">
                                              <span
                                                className={`font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wide transition-colors ${
                                                  isCorrect
                                                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                                                    : isWrong
                                                      ? "text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                                                      : "text-amber-600 dark:text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
                                                }`}
                                              >
                                                {isCorrect
                                                  ? "Correct"
                                                  : isWrong
                                                    ? "Incorrect"
                                                    : "Skipped"}
                                              </span>
                                            </div>
                                            {!isSkipped && (
                                              <div
                                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted/50 ${
                                                  (item.timeTaken ?? 0) >= 3000
                                                    ? "text-rose-500 dark:text-rose-400"
                                                    : "text-emerald-600 dark:text-emerald-400"
                                                }`}
                                              >
                                                <span className="text-[11px] leading-none">
                                                  {(item.timeTaken ?? 0) < 2000
                                                    ? "⚡"
                                                    : "🐢"}
                                                </span>
                                                <span className="font-bold text-[10px] font-mono">
                                                  {(
                                                    (item.timeTaken ?? 0) / 1000
                                                  ).toFixed(1)}
                                                  s
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 w-full mt-3 pb-1">
                        <button
                          type="button"
                          onClick={() => router.back()}
                          className="h-11 px-4 rounded-full text-[11px] font-extrabold tracking-widest uppercase bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-[0.97] transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 border border-border/40"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
                          Back
                        </button>
                        <Button
                          onClick={engine.resetSession}
                          className="flex-1 h-11 px-5 py-3 rounded-full text-[11px] font-extrabold tracking-widest uppercase gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 hover:cursor-pointer flex items-center justify-center border-0 group"
                        >
                          <RotateCcw className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-500" />
                          Practice Again
                        </Button>
                      </div>
                    </div>
                  );
                })()}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
        <AlertDialogContent className="sm:w-full max-w-sm border border-border">
          <AlertDialogHeader className="pb-3 border-b border-border/40">
            <AlertDialogTitle className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              Quit Practice Session?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed mt-4">
            Your current progress and score of{" "}
            <strong className="text-foreground">{engine.state.score}</strong>{" "}
            will be reset.
          </AlertDialogDescription>
          <AlertDialogFooter className="flex-row gap-2 mt-4 sm:justify-end">
            <AlertDialogCancel
              className="flex-1 sm:flex-none h-11 rounded-2xl text-sm font-semibold border-border/85 hover:bg-muted"
              onClick={() => setShowQuitConfirm(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 sm:flex-none h-11 rounded-2xl text-sm font-bold border border-destructive/40 bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all shadow-sm"
              onClick={() => {
                setShowQuitConfirm(false);
                engine.resetSession();
              }}
            >
              Yes, Quit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TopicPageLayout>
  );
}
