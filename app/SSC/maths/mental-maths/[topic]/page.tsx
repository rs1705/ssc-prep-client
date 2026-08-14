"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import posthog from "posthog-js";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { ProgressBar } from "@/components/custom/ProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth";
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
  if (!text) return "text-4xl sm:text-5xl lg:text-6xl";
  const len = text.length;
  if (len <= 10) return "text-4xl sm:text-5xl md:text-6xl lg:text-7xl";
  if (len <= 18) return "text-3xl sm:text-4xl md:text-5xl lg:text-6xl";
  if (len <= 28) return "text-2xl sm:text-3xl md:text-4xl lg:text-5xl";
  if (len <= 45) return "text-xl sm:text-2xl md:text-3xl lg:text-4xl";
  if (len <= 70) return "text-lg sm:text-xl md:text-2xl lg:text-3xl";
  return "text-base sm:text-lg md:text-xl lg:text-2xl leading-tight";
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

const getTargetTime = (topicId: string, diff: string) => {
  const targets: Record<string, Record<string, number>> = {
    addition: { easy: 3, medium: 5, hard: 8, blitz: 4 },
    subtraction: { easy: 3, medium: 5, hard: 8, blitz: 4 },
    multiplication: { easy: 4, medium: 7, hard: 12, blitz: 6 },
    division: { easy: 4, medium: 7, hard: 12, blitz: 6 },
    squares: { easy: 3, medium: 5, hard: 8, blitz: 4 },
    cubes: { easy: 3, medium: 5, hard: 8, blitz: 4 },
    "square-roots": { easy: 4, medium: 6, hard: 10, blitz: 5 },
    "cube-roots": { easy: 4, medium: 6, hard: 10, blitz: 5 },
    percentages: { easy: 5, medium: 8, hard: 15, blitz: 7 },
    fractions: { easy: 5, medium: 8, hard: 15, blitz: 7 },
    ratios: { easy: 5, medium: 8, hard: 15, blitz: 7 },
    "number-series": { easy: 5, medium: 10, hard: 15, blitz: 8 },
  };
  return targets[topicId]?.[diff] || 10;
};

export default function MentalMathsPractice() {
  const { topic } = useParams() as { topic: string };
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

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

  // Global Keyboard Support for Deep Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter to play again on game over
      if (gameState === "game_over" && e.key === "Enter") {
        e.preventDefault();
        engine.resetSession();
        return;
      }

      if (gameState !== "active") return;

      if (inputLayout === "mcq") {
        const options = engine.state.currentQuestion?.options || [];
        const isIdle = engine.state.currentAnswerStatus === "idle";

        if (e.key === "1" && options[0] !== undefined && isIdle) {
          e.preventDefault();
          setSelectedOption(options[0]);
          handleEnterSubmit(options[0]);
        } else if (e.key === "2" && options[1] !== undefined && isIdle) {
          e.preventDefault();
          setSelectedOption(options[1]);
          handleEnterSubmit(options[1]);
        } else if (e.key === "3" && options[2] !== undefined && isIdle) {
          e.preventDefault();
          setSelectedOption(options[2]);
          handleEnterSubmit(options[2]);
        } else if (e.key === "4" && options[3] !== undefined && isIdle) {
          e.preventDefault();
          setSelectedOption(options[3]);
          handleEnterSubmit(options[3]);
        } else if (e.key === "Enter" && isIdle) {
          e.preventDefault();
          handleEnterSubmit("skip");
        }
      } else if (inputLayout === "keys" && e.key === "Enter") {
        // Form submission handles it when focused, but in case input loses focus:
        if (document.activeElement !== inputRef.current) {
          e.preventDefault();
          handleEnterSubmit(userInput);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, inputLayout, engine, userInput, handleEnterSubmit]);

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
  const containerHeightClass =
    "w-full min-h-[40vh] lg:min-h-[50vh] mb-2 md:mb-4";

  return (
    <TopicPageLayout
      contentMaxWidthClass={`w-full ${
        gameState === "idle"
          ? "max-w-xl"
          : gameState === "active"
            ? "max-w-2xl"
            : "max-w-4xl"
      }`}
      hideBreadcrumbs={true}
      centerContent={true}
    >
      <div
        className={`relative w-full sm:mt-2 flex flex-col p-4 sm:p-6 bg-card border border-primary/30 rounded-3xl shadow-sm select-none ${containerHeightClass}`}
      >
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

        {/* Master Layout Wrapper */}
        <div className="relative w-full flex flex-col flex-1">
          {/* 1. LOBBY CONFIGURATION SCREEN */}
          {gameState === "idle" && (
            <div className="w-full flex flex-col flex-1 justify-center max-w-xl mx-auto gap-4 lg:gap-5 animate-in fade-in slide-in-from-bottom-3 pb-2 pt-2">
              {/* Aligned Back Button */}
              <div className="flex justify-start w-full -mb-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex items-center gap-1 h-8 px-2 -ml-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all cursor-pointer flex-shrink-0 border-none outline-none text-xs font-semibold"
                  title="Back"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                  <span className="hidden sm:inline">Back</span>
                </button>
              </div>

              {/* Title Section */}
              <div className="text-center pb-2 lg:pb-3 flex flex-col items-center">
                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight capitalize text-foreground mb-1.5">
                  {topic.replace("-", " ")} Practice
                </h2>
                <p className="text-xs lg:text-sm text-muted-foreground font-medium">
                  Speed test your calculations for {topic.replace("-", " ")} and
                  beat the clock.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:gap-4 pb-2 px-1">
                {/* 1. Difficulty Card */}
                {topic !== "mixed" && (
                  <div className="bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl p-4 lg:p-5 shadow-lg shadow-black/5 noise-overlay">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono text-[10px] font-bold">
                        1
                      </span>
                      <h3 className="text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground">
                        Select Difficulty
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
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
                            className={`rounded-2xl h-10 lg:h-11 flex items-center justify-center font-bold font-mono text-xs lg:text-sm transition-all duration-75 cursor-pointer border select-none ${
                              isSelected
                                ? "bg-amber-400/20 dark:bg-amber-400/15 border-amber-400/60 dark:border-amber-400/50 border-b-[4px] border-b-amber-500 text-amber-600 dark:text-amber-300 font-black shadow-sm shadow-amber-500/15 active:border-b-[1px] active:translate-y-[3px]"
                                : "bg-card/70 border-border/60 border-b-[4px] border-b-border/80 hover:bg-card hover:border-amber-400/40 text-foreground active:border-b-[1px] active:translate-y-[3px]"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs italic text-muted-foreground border-l-2 border-amber-400/60 pl-3">
                      <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                      <span>
                        {getDifficultyDescription(
                          topic,
                          engine.state.difficulty,
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. Practice Mode Card */}
                <div className="bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl p-4 lg:p-5 shadow-lg shadow-black/5 noise-overlay">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/15 text-amber-500 dark:text-amber-400 border border-amber-400/30 font-mono text-[10px] font-bold">
                      2
                    </span>
                    <h3 className="text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground">
                      Practice Mode
                    </h3>
                  </div>
                  {topic !== "mixed" && (
                    <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                      <button
                        type="button"
                        onClick={() => handleModeChange("timed")}
                        className={`rounded-2xl flex flex-col items-center justify-center h-20 lg:h-24 transition-all duration-75 cursor-pointer border select-none ${
                          engine.state.mode === "timed"
                            ? "bg-amber-400/20 dark:bg-amber-400/15 border-amber-400/60 dark:border-amber-400/50 border-b-[4px] border-b-amber-500 text-amber-600 dark:text-amber-300 font-black shadow-sm shadow-amber-500/15 active:border-b-[1px] active:translate-y-[3px]"
                            : "bg-card/70 border-border/60 border-b-[4px] border-b-border/80 hover:bg-card hover:border-amber-400/40 active:border-b-[1px] active:translate-y-[3px]"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center mb-1 ${engine.state.mode === "timed" ? "bg-amber-400/25 text-amber-500 dark:text-amber-300" : "bg-muted text-muted-foreground"}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5 lg:w-4 lg:h-4"
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
                        </div>
                        <span
                          className={`font-black font-mono text-xs ${engine.state.mode === "timed" ? "text-amber-600 dark:text-amber-300" : "text-foreground"}`}
                        >
                          Timed
                        </span>
                        <span className="text-[9px] text-muted-foreground font-medium">
                          Race the clock
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleModeChange("freestyle")}
                        className={`rounded-2xl flex flex-col items-center justify-center h-20 lg:h-24 transition-all duration-75 cursor-pointer border select-none ${
                          engine.state.mode === "freestyle"
                            ? "bg-amber-400/20 dark:bg-amber-400/15 border-amber-400/60 dark:border-amber-400/50 border-b-[4px] border-b-amber-500 text-amber-600 dark:text-amber-300 font-black shadow-sm shadow-amber-500/15 active:border-b-[1px] active:translate-y-[3px]"
                            : "bg-card/70 border-border/60 border-b-[4px] border-b-border/80 hover:bg-card hover:border-amber-400/40 active:border-b-[1px] active:translate-y-[3px]"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center mb-1 ${engine.state.mode === "freestyle" ? "bg-amber-400/25 text-amber-500 dark:text-amber-300" : "bg-muted text-muted-foreground"}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5 lg:w-4 lg:h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                          </svg>
                        </div>
                        <span
                          className={`font-black font-mono text-xs ${engine.state.mode === "freestyle" ? "text-amber-600 dark:text-amber-300" : "text-foreground"}`}
                        >
                          Freestyle
                        </span>
                        <span className="text-[9px] text-muted-foreground font-medium">
                          No pressure
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Mode Limits */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {engine.state.mode === "timed"
                      ? (topic === "mixed" ? [60, 120, 300] : [30, 60, 90]).map(
                          (t) => {
                            const isSelected = t === engine.state.timeLimit;
                            return (
                              <button
                                key={t}
                                type="button"
                                onClick={() => handleTimerLimitChange(t)}
                                className={`rounded-2xl h-10 lg:h-11 flex items-center justify-center font-bold font-mono text-xs lg:text-sm transition-all duration-75 cursor-pointer border select-none ${
                                  isSelected
                                    ? "bg-amber-400/20 dark:bg-amber-400/15 border-amber-400/60 dark:border-amber-400/50 border-b-[4px] border-b-amber-500 text-amber-600 dark:text-amber-300 font-black shadow-sm shadow-amber-500/15 active:border-b-[1px] active:translate-y-[3px]"
                                    : "bg-card/70 border-border/60 border-b-[4px] border-b-border/80 hover:bg-card hover:border-amber-400/40 text-foreground active:border-b-[1px] active:translate-y-[3px]"
                                }`}
                              >
                                {t}s
                              </button>
                            );
                          },
                        )
                      : [10, 20, 30].map((q) => {
                          const isSelected = q === engine.state.questionLimit;
                          return (
                            <button
                              key={q}
                              type="button"
                              onClick={() => handleQuestionLimitChange(q)}
                              className={`rounded-2xl h-10 lg:h-11 flex items-center justify-center font-bold font-mono text-xs lg:text-sm transition-all duration-75 cursor-pointer border select-none ${
                                isSelected
                                  ? "bg-amber-400/20 dark:bg-amber-400/15 border-amber-400/60 dark:border-amber-400/50 border-b-[4px] border-b-amber-500 text-amber-600 dark:text-amber-300 font-black shadow-sm shadow-amber-500/15 active:border-b-[1px] active:translate-y-[3px]"
                                  : "bg-card/70 border-border/60 border-b-[4px] border-b-border/80 hover:bg-card hover:border-amber-400/40 text-foreground active:border-b-[1px] active:translate-y-[3px]"
                              }`}
                            >
                              {q} Qs
                            </button>
                          );
                        })}
                  </div>
                </div>

                {/* 3. Input Layout Card */}
                <div className="bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl p-4 lg:p-5 shadow-lg shadow-black/5 noise-overlay">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/15 text-amber-500 dark:text-amber-400 border border-amber-400/30 font-mono text-[10px] font-bold">
                      3
                    </span>
                    <h3 className="text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground">
                      Input Layout
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setInputLayout("mcq")}
                      className={`rounded-2xl flex flex-col items-center justify-center h-16 lg:h-20 transition-all duration-75 cursor-pointer border select-none ${
                        inputLayout === "mcq"
                          ? "bg-amber-400/20 dark:bg-amber-400/15 border-amber-400/60 dark:border-amber-400/50 border-b-[4px] border-b-amber-500 text-amber-600 dark:text-amber-300 font-black shadow-sm shadow-amber-500/15 active:border-b-[1px] active:translate-y-[3px]"
                          : "bg-card/70 border-border/60 border-b-[4px] border-b-border/80 hover:bg-card hover:border-amber-400/40 active:border-b-[1px] active:translate-y-[3px]"
                      }`}
                    >
                      <span
                        className={`font-black font-mono text-xs lg:text-sm ${inputLayout === "mcq" ? "text-amber-600 dark:text-amber-300" : "text-foreground"}`}
                      >
                        MCQS
                      </span>
                      <span className="text-[9px] text-muted-foreground font-medium">
                        Pick from 4 options
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInputLayout("keys")}
                      className={`rounded-2xl flex flex-col items-center justify-center h-16 lg:h-20 transition-all duration-75 cursor-pointer border select-none ${
                        inputLayout === "keys"
                          ? "bg-amber-400/20 dark:bg-amber-400/15 border-amber-400/60 dark:border-amber-400/50 border-b-[4px] border-b-amber-500 text-amber-600 dark:text-amber-300 font-black shadow-sm shadow-amber-500/15 active:border-b-[1px] active:translate-y-[3px]"
                          : "bg-card/70 border-border/60 border-b-[4px] border-b-border/80 hover:bg-card hover:border-amber-400/40 active:border-b-[1px] active:translate-y-[3px]"
                      }`}
                    >
                      <span
                        className={`font-black font-mono text-xs lg:text-sm ${inputLayout === "keys" ? "text-amber-600 dark:text-amber-300" : "text-foreground"}`}
                      >
                        NUMPAD
                      </span>
                      <span className="text-[9px] text-muted-foreground font-medium">
                        Type it out fast
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="flex w-full shrink-0">
                <Button
                  className="w-full h-12 lg:h-13 rounded-2xl text-xs sm:text-sm font-mono font-black tracking-widest uppercase gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 border-0 border-b-[5px] border-b-amber-600 active:border-b-[1px] active:translate-y-[4px] hover:brightness-105 transition-all duration-75 cursor-pointer flex items-center justify-center group"
                  onClick={handleStartPractice}
                >
                  <Swords className="w-4 h-4 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300" />
                  Launch Practice Drill
                </Button>
              </div>
            </div>
          )}

          {/* OTHER GAME STATES */}
          {gameState !== "idle" && (
            <div className="w-full flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-3">
              {/* 2. THREE-SECOND START COUNTDOWN */}
              {gameState === "countdown" && (
                <div className="h-full flex flex-col flex-1 items-center justify-center py-10">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={engine.state.countdownTick}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "backOut" }}
                      className="text-8xl font-black text-amber-400 dark:text-amber-300 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)] font-mono"
                    >
                      {engine.state.countdownTick}
                    </motion.div>
                  </AnimatePresence>
                  <motion.p
                    key={countdownMsg}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    className="text-muted-foreground mt-6 text-xs font-mono font-semibold"
                  >
                    {countdownMsg}
                  </motion.p>
                </div>
              )}

              {/* 3. ACTIVE PRACTICE BOARD */}
              {gameState === "active" && (
                /* Active Game Container - Zero Scroll Fit */
                <div className="h-full w-full flex flex-col flex-1 justify-between">
                  {/* Top Bar: Topic Badge + Score Pill + Switcher */}
                  <div className="flex items-center justify-between w-full pb-2 gap-2">
                    {/* Left: Topic Icon + Name & Tags */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-2xl text-primary flex items-center justify-center border border-primary/20">
                        {renderTopicIcon(
                          topic,
                          "w-4 h-4 sm:w-5 sm:h-5 shrink-0",
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 justify-center">
                        <span className="font-black text-sm sm:text-base tracking-tight text-foreground leading-none capitalize truncate">
                          {topic}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1 min-w-0 text-[9px] font-mono font-bold uppercase tracking-wider select-none">
                          <span className="bg-muted/70 text-foreground/80 px-1.5 py-0.5 rounded">
                            {engine.state.mode === "timed"
                              ? "Timed"
                              : "Freestyle"}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded bg-muted/70 ${
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
                              className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums"
                            >
                              {engine.state.score}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Compact Layout Switcher */}
                      <div className="flex items-center bg-muted/50 p-0.5 rounded-xl border border-border/40 select-none text-[10px] font-bold w-[76px] sm:w-[84px]">
                        <button
                          type="button"
                          onClick={() => setInputLayout("mcq")}
                          className={`flex-1 py-0.5 rounded-lg transition-all cursor-pointer text-center ${
                            inputLayout === "mcq"
                              ? "bg-foreground text-background shadow-xs font-black"
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
                              ? "bg-foreground text-background shadow-xs font-black"
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
                  <div className="w-full flex flex-col gap-1 my-1">
                    {/* Labels Row */}
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground select-none">
                        {engine.state.mode === "timed"
                          ? "Time Remaining"
                          : "Progress"}
                      </span>
                      <span
                        className={`text-xs font-black font-mono tabular-nums tracking-wide transition-colors ${timerTextColorClass}`}
                      >
                        {progressText}
                      </span>
                    </div>
                    {/* Bar */}
                    <ProgressBar
                      value={progressPercentage}
                      className="h-1.5 bg-muted/60 rounded-full border border-border/30 overflow-hidden"
                      barClassName={`${barColorClass} rounded-full transition-all duration-100 ease-linear shadow-xs`}
                    />
                  </div>

                  {/* Question Box */}
                  <div
                    className={`
                            my-2 sm:my-3 shrink-0 flex flex-col items-center justify-center rounded-3xl py-6 px-6 min-h-[135px] sm:min-h-[155px] md:min-h-[175px] overflow-hidden border transition-all duration-200 ease-in-out select-none relative shadow-sm
                            ${engine.state.currentAnswerStatus === "correct" ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 scale-[1.01]" : ""}
                            ${engine.state.currentAnswerStatus === "wrong" ? "border-rose-500/60 bg-rose-500/15 text-rose-600 dark:text-rose-300 scale-[0.99]" : ""}
                            ${engine.state.currentAnswerStatus === "skipped" ? "border-amber-500/60 bg-amber-500/15 text-amber-600 dark:text-amber-300" : ""}
                            ${engine.state.currentAnswerStatus === "idle" ? "border-border/40 bg-card/60 backdrop-blur-xl" : ""}
                        `}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={engine.state.questionIndex}
                        initial={{ y: 14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -14, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                        className={`font-black tracking-tight text-center w-full font-mono break-words relative z-10 ${getQuestionFontSize(
                          engine.state.currentQuestion?.questionText,
                        )}`}
                      >
                        {engine.state.currentQuestion?.questionText}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Wrapper for Inputs & Keypad */}
                  <div className="w-full my-1.5 relative flex flex-col justify-center min-h-[260px] sm:min-h-[280px]">
                    <AnimatePresence mode="wait">
                      {inputLayout === "keys" ? (
                        <motion.div
                          key="numpad"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.12, ease: "easeInOut" }}
                          className="flex flex-col gap-3 w-full h-full justify-between"
                        >
                          {/* Answer Input Bar */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleEnterSubmit(userInput);
                            }}
                            className="flex gap-2.5 w-full"
                          >
                            <Input
                              ref={inputRef}
                              type="text"
                              inputMode="none"
                              placeholder="Type answer..."
                              value={userInput}
                              onChange={(e) =>
                                setUserInput(e.target.value.replace(/\D/g, ""))
                              }
                              className="h-11 sm:h-12 flex-1 rounded-2xl text-center px-4 text-lg sm:text-xl font-bold font-mono border border-border/60 bg-card/70 backdrop-blur-md focus-visible:bg-card focus-visible:border-amber-400/70 focus-visible:ring-2 focus-visible:ring-amber-400/20 caret-amber-400 shadow-inner transition-all"
                              autoFocus
                            />
                            <Button
                              type="submit"
                              className="h-11 sm:h-12 w-24 sm:w-32 flex-shrink-0 rounded-2xl text-xs sm:text-sm font-mono font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white border-0 border-b-[4px] border-b-amber-600 active:border-b-[1px] active:translate-y-[3px] hover:brightness-105 transition-all duration-75 cursor-pointer shadow-md shadow-amber-500/25"
                              onClick={() => handleEnterSubmit(userInput)}
                            >
                              Enter
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-11 sm:h-12 rounded-2xl px-4 flex-shrink-0 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground bg-card/60 hover:bg-card border border-border/50 border-b-[3px] border-b-border active:border-b-[1px] active:translate-y-[2px] transition-all duration-75 cursor-pointer"
                              onClick={() => handleEnterSubmit("skip")}
                            >
                              Skip
                            </Button>
                          </form>

                          {/* Tactile 3D Keypad */}
                          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 p-2 sm:p-2.5 bg-card/50 backdrop-blur-xl border border-border/40 rounded-3xl shadow-inner">
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
                                className={`h-12 sm:h-14 md:h-15 font-black rounded-2xl border transition-all duration-75 ease-out outline-none select-none cursor-pointer font-mono ${
                                  btn === "Clear"
                                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 border-rose-500/40 border-b-[4px] border-b-rose-600/70 active:border-b-[1px] active:translate-y-[3px] text-xs sm:text-sm font-bold uppercase font-mono shadow-xs"
                                    : btn === "⌫"
                                      ? "bg-muted/60 text-foreground hover:bg-muted border-border/60 border-b-[4px] border-b-border/80 active:border-b-[1px] active:translate-y-[3px] text-lg sm:text-xl font-sans shadow-xs"
                                      : "bg-card/90 text-foreground hover:bg-card hover:border-amber-400/60 hover:border-b-amber-500 border-border/60 border-b-[4px] border-b-border/80 active:border-b-[1px] active:translate-y-[3px] text-xl sm:text-2xl shadow-xs"
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
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.12, ease: "easeInOut" }}
                          className="flex flex-col items-center justify-center gap-3 w-full py-1"
                        >
                          {/* 3D MCQ Options Grid */}
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md sm:max-w-lg mx-auto">
                            {engine?.state?.currentQuestion?.options?.map(
                              (option, idx) => {
                                const optionLabels = ["A", "B", "C", "D"];
                                const isSelected = selectedOption === option;
                                const status = engine.state.currentAnswerStatus;
                                let highlightClass =
                                  "border-border/60 border-b-[5px] border-b-border/80 bg-card/85 text-foreground hover:bg-card hover:border-amber-400/60 hover:border-b-amber-500 shadow-sm";
                                if (isSelected) {
                                  if (status === "correct") {
                                    highlightClass =
                                      "border-emerald-500/70 border-b-[5px] border-b-emerald-600 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10";
                                  } else if (status === "wrong") {
                                    highlightClass =
                                      "border-rose-500/70 border-b-[5px] border-b-rose-600 bg-rose-500/20 text-rose-600 dark:text-rose-400 shadow-rose-500/10";
                                  }
                                }
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    className={`relative h-20 sm:h-24 md:h-26 font-bold rounded-2xl sm:rounded-3xl border transition-all duration-75 ease-out flex flex-col items-center justify-center p-3 active:border-b-[1px] active:translate-y-[4px] cursor-pointer select-none backdrop-blur-md group ${highlightClass}`}
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
                                    <span className="absolute top-2.5 left-3 px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-muted-foreground group-hover:text-foreground font-mono text-[10px] sm:text-xs font-bold tracking-wider transition-colors">
                                      {optionLabels[idx] || idx + 1}
                                    </span>
                                    <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                                      {option}
                                    </span>
                                  </button>
                                );
                              },
                            )}
                          </div>
                          {/* 3D Skip Button for MCQ */}
                          <div className="flex justify-center items-center pt-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEnterSubmit("skip")}
                              className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground bg-card/60 hover:bg-card rounded-xl px-6 py-2 border border-border/50 border-b-[3px] border-b-border active:border-b-[1px] active:translate-y-[2px] transition-all duration-75 cursor-pointer"
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
                    <div className="w-full h-full flex-1 flex flex-col items-center text-left py-2 animate-in fade-in duration-300 relative">
                      {/* Localized Confetti Canvas */}
                      <canvas
                        ref={confettiCanvasRef}
                        className="absolute inset-0 pointer-events-none w-full h-full z-[100] rounded-3xl"
                      />

                      {/* Header */}
                      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-foreground/20 gap-4 shrink-0">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                          <div className="p-2.5 rounded-full border flex items-center justify-center text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-sm shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-6 h-6 sm:w-8 sm:h-8"
                            >
                              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                              <path d="M4 22h16"></path>
                              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                            </svg>
                          </div>
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                                Session complete
                              </h2>
                              <div className="flex items-center gap-1.5 select-none mt-1 sm:mt-0">
                                <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-[9px] font-bold uppercase tracking-widest border border-border/50">
                                  {topic}
                                </span>
                                <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-[9px] font-bold uppercase tracking-widest border border-border/50">
                                  {engine.state.mode === "timed"
                                    ? "Timed"
                                    : "Freestyle"}
                                </span>
                                <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-[9px] font-bold uppercase tracking-widest border border-border/50">
                                  {engine.state.difficulty}
                                </span>
                              </div>
                            </div>
                            <p className="text-muted-foreground text-xs mt-2 font-medium">
                              <strong className="text-foreground">
                                {correct}
                              </strong>{" "}
                              of{" "}
                              <strong className="text-foreground">
                                {engine.state.attemptedQuestionsCount}
                              </strong>{" "}
                              correct · you averaged{" "}
                              <strong className="text-foreground">
                                {(
                                  engine.state.history.reduce(
                                    (acc, curr) => acc + (curr.timeTaken ?? 0),
                                    0,
                                  ) /
                                  Math.max(1, engine.state.history.length) /
                                  1000
                                ).toFixed(1)}
                                s
                              </strong>{" "}
                              against a{" "}
                              {getTargetTime(topic, engine.state.difficulty)}s
                              target.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Main Layout Container */}
                      <div className="w-full flex flex-col lg:flex-row flex-1 h-full min-h-0 gap-8 lg:gap-0">
                        {/* LEFT COLUMN: Overview Stats & Pacing */}
                        <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col justify-between gap-8 pt-5 pb-5 lg:pr-6">
                          {/* Top Stats Block */}
                          <div className="flex items-center gap-6">
                            {/* Giant Accuracy Gauge */}
                            <div className="relative flex flex-col items-center justify-center w-[120px] h-[120px] shrink-0">
                              <svg className="w-full h-full transform -rotate-90 relative z-10">
                                <circle
                                  cx="50%"
                                  cy="50%"
                                  r="42%"
                                  className="stroke-emerald-500/20"
                                  strokeWidth="8"
                                  fill="transparent"
                                />
                                <circle
                                  cx="50%"
                                  cy="50%"
                                  r="42%"
                                  className={accuracyColors.stroke}
                                  strokeWidth="8"
                                  fill="transparent"
                                  pathLength="100"
                                  strokeDasharray="100"
                                  strokeDashoffset={100 - animatedAccuracy}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute flex flex-col items-center justify-center z-20">
                                <span className="text-2xl font-black tracking-tight text-foreground font-mono leading-none mb-1">
                                  {animatedAccuracy}%
                                </span>
                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                                  Accuracy
                                </span>
                              </div>
                            </div>

                            {/* Stacked Counts */}
                            <div className="flex flex-col flex-1 gap-2.5">
                              <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-xl border border-border/50">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                                  Correct
                                </span>
                                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                  {correct}
                                </span>
                              </div>
                              <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-xl border border-border/50">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                                  Incorrect
                                </span>
                                <span className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono">
                                  {wrong}
                                </span>
                              </div>
                              <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-xl border border-border/50">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                                  Skipped
                                </span>
                                <span className="text-sm font-black text-amber-600 dark:text-amber-500 font-mono">
                                  {skipped}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Pacing Chart */}
                          {engine.state.history.length > 0 && (
                            <div className="w-full flex flex-col flex-1 pt-4 border-t border-border border-dashed">
                              <div className="flex justify-between items-center mb-4 shrink-0">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                  Pace per question
                                </span>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  target{" "}
                                  {getTargetTime(
                                    topic,
                                    engine.state.difficulty,
                                  )}
                                  s
                                </span>
                              </div>

                              <div className="relative flex-1 flex w-full min-h-[140px] pl-7 pb-5 mt-2">
                                {/* Y-axis Labels */}
                                <div className="absolute left-0 top-0 bottom-5 w-6 flex flex-col justify-between items-end text-[9px] text-muted-foreground font-mono pr-2">
                                  <span>30s</span>
                                  <span>15s</span>
                                  <span>0s</span>
                                </div>
                                {/* Target Line */}
                                <div className="absolute left-7 right-0 top-[66.66%] border-t border-dashed border-orange-500 z-0"></div>
                                {/* Target Label */}
                                <div className="absolute right-0 top-[66.66%] -translate-y-1/2 bg-background px-1 text-[8px] font-bold text-orange-500/80 z-0">
                                  TARGET{" "}
                                  {getTargetTime(
                                    topic,
                                    engine.state.difficulty,
                                  )}
                                  s
                                </div>

                                <div className="relative flex-1 flex items-end justify-between gap-1.5 border-l border-b border-border">
                                  {/* Bars */}
                                  {engine.state.history.map((item, idx) => {
                                    const timeSec =
                                      (item.timeTaken ?? 0) / 1000;
                                    const targetSec = getTargetTime(
                                      topic,
                                      engine.state.difficulty,
                                    );
                                    const heightPct = Math.max(
                                      2,
                                      Math.min(
                                        (timeSec / (targetSec * 3)) * 100,
                                        100,
                                      ),
                                    );
                                    const isWrong = item.status === "wrong";

                                    return (
                                      <div
                                        key={idx}
                                        className="relative flex flex-col justify-end items-center flex-1 z-10 group h-full"
                                      >
                                        <div
                                          className={`w-full rounded-sm transition-all cursor-crosshair ${isWrong ? "bg-rose-400/80 hover:bg-rose-500" : "bg-emerald-400/80 hover:bg-emerald-500"}`}
                                          style={{ height: `${heightPct}%` }}
                                        />
                                        {/* X-axis Label (only show every 5th or first/last if many) */}
                                        {(idx === 0 ||
                                          idx ===
                                            engine.state.history.length - 1 ||
                                          (idx + 1) % 5 === 0) && (
                                          <div className="absolute top-full mt-1 text-[8px] text-muted-foreground font-mono text-center">
                                            Q{idx + 1}
                                          </div>
                                        )}
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-popover border border-border text-popover-foreground text-[10px] font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                                          Q{idx + 1}: {timeSec.toFixed(1)}s
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="w-full flex justify-between items-center text-[10px] text-muted-foreground mt-4 font-mono">
                                <span>
                                  avg{" "}
                                  {(
                                    engine.state.history.reduce(
                                      (acc, curr) =>
                                        acc + (curr.timeTaken ?? 0),
                                      0,
                                    ) /
                                    Math.max(1, engine.state.history.length) /
                                    1000
                                  ).toFixed(1)}
                                  s
                                </span>
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  fastest{" "}
                                  {(
                                    Math.min(
                                      ...engine.state.history.map(
                                        (h) => h.timeTaken ?? Infinity,
                                      ),
                                    ) / 1000
                                  ).toFixed(1)}
                                  s
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: Review Answers */}
                        <div className="w-full lg:flex-1 flex flex-col h-[350px] lg:h-full lg:min-h-0 border-t lg:border-t-0 lg:border-l border-foreground/20 pt-6 lg:pt-5 pb-5 lg:pl-6 lg:pr-2">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              Review
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {engine.state.history.length} questions
                            </span>
                          </div>

                          {engine.state.history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                              <span className="text-2xl mb-2">📋</span>
                              <p className="text-xs">No questions attempted</p>
                            </div>
                          ) : (
                            <div className="relative flex-1 min-h-[250px]">
                              <div className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent lg:pr-4">
                                <div className="flex flex-col divide-y divide-border/80">
                                  {engine.state.history.map((item, idx) => {
                                    const isCorrect = item.status === "correct";
                                    const isWrong = item.status === "wrong";
                                    const isSkipped = item.status === "skipped";

                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-start justify-between py-3.5 px-2 -mx-2 rounded-none hover:bg-muted/40 transition-colors group"
                                      >
                                        <div className="flex items-start gap-4 flex-1 min-w-0 pr-4">
                                          <span className="text-[10px] font-mono text-muted-foreground/50 w-5 mt-0.5 shrink-0">
                                            {String(idx + 1).padStart(2, "0")}.
                                          </span>
                                          <div className="flex items-center justify-center mt-0.5 shrink-0">
                                            {isCorrect && (
                                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            )}
                                            {isWrong && (
                                              <XCircle className="w-4 h-4 text-rose-500" />
                                            )}
                                            {isSkipped && (
                                              <MinusCircle className="w-4 h-4 text-amber-500" />
                                            )}
                                          </div>
                                          <div className="text-[13px] font-mono font-extrabold text-foreground flex-1 flex flex-wrap gap-x-2 gap-y-1 items-baseline min-w-0">
                                            <span className="text-foreground/90">
                                              {item.questionText} =
                                            </span>
                                            <span className="shrink-0 flex items-center gap-1.5 whitespace-nowrap">
                                              {isCorrect || isSkipped ? (
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                                                  {item.correctAnswer}
                                                </span>
                                              ) : (
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                                                  {item.correctAnswer}
                                                  <span className="text-muted-foreground/60 text-[11px] ml-2.5 mr-1 font-semibold ">
                                                    You:
                                                  </span>
                                                  <span className="line-through text-rose-500 opacity-70">
                                                    {item.userAnswer}
                                                  </span>
                                                </span>
                                              )}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-0.5 shrink-0">
                                          <div className="w-[84px]">
                                            {isCorrect && (
                                              <div className="w-full text-center py-[3px] rounded-full bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[9px] font-semibold tracking-widest uppercase">
                                                Correct
                                              </div>
                                            )}
                                            {isWrong && (
                                              <div className="w-full text-center py-[3px] rounded-full bg-rose-500/5 text-rose-600 dark:text-rose-400 text-[9px] font-semibold tracking-widest uppercase">
                                                Incorrect
                                              </div>
                                            )}
                                            {isSkipped && (
                                              <div className="w-full text-center py-[3px] rounded-full bg-amber-500/5 text-amber-600 dark:text-amber-500 text-[9px] font-semibold tracking-widest uppercase">
                                                Skipped
                                              </div>
                                            )}
                                          </div>

                                          <div className="w-12 flex justify-end">
                                            {!isSkipped && (
                                              <div className="flex items-center gap-1.5 text-[11px] font-mono text-orange-500/80 shrink-0">
                                                {(item.timeTaken ?? 0) / 1000 >
                                                getTargetTime(
                                                  topic,
                                                  engine.state.difficulty,
                                                ) ? (
                                                  <span className="text-sm">
                                                    🐢
                                                  </span>
                                                ) : (
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="w-3.5 h-3.5 fill-current"
                                                  >
                                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                                  </svg>
                                                )}
                                                {(
                                                  (item.timeTaken ?? 0) / 1000
                                                ).toFixed(1)}
                                                s
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="w-full flex gap-3 pt-5 border-t border-foreground/20 shrink-0">
                        <button
                          type="button"
                          onClick={() => router.back()}
                          className="flex-[3] h-12 lg:h-13 flex items-center justify-center rounded-2xl text-xs font-mono font-bold tracking-widest uppercase bg-card/70 text-foreground hover:bg-card border border-border/60 border-b-[4px] border-b-border/80 active:border-b-[1px] active:translate-y-[3px] transition-all duration-75 cursor-pointer shadow-xs select-none"
                        >
                          Back
                        </button>
                        <Button
                          onClick={engine.resetSession}
                          className="flex-[7] h-12 lg:h-13 px-5 py-2 rounded-2xl text-xs lg:text-sm font-mono font-black tracking-widest uppercase gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white border-0 border-b-[5px] border-b-amber-600 active:border-b-[1px] active:translate-y-[4px] hover:brightness-105 transition-all duration-75 hover:cursor-pointer flex items-center justify-center shadow-lg shadow-amber-500/30 group"
                        >
                          <Swords className="w-4 h-4 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300" />
                          Practice Again
                        </Button>
                      </div>

                      {/* Minimalist Guest Auth Prompt */}
                      {!user && (
                        <div className="w-full mt-4 text-center animate-in fade-in duration-700 delay-300">
                          <p className="text-[10px] text-muted-foreground/80 font-medium tracking-wide">
                            Playing as a Guest.{" "}
                            <button 
                              onClick={signInWithGoogle} 
                              className="text-foreground hover:text-primary font-bold underline underline-offset-2 transition-colors cursor-pointer"
                            >
                              Sign in with Google to save scores
                            </button>
                          </p>
                        </div>
                      )}
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
