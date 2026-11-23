"use client";
import { describeRoute, logActivity, logMistakes } from "@/lib/activity-log";
import { recordPlanActivity } from "@/lib/today-plan";
import { playFeedback } from "@/features/games/feedback";
import { DrillLobby } from "@/features/speed-maths/DrillLobby";
import { CTA, DUO } from "@/features/games/buttons";
import { GAME_TONE, TONE_BAND } from "@/features/games/tone";
import { ActionBar } from "@/features/games/ActionBar";
import { ResultHero } from "@/features/games/ResultHero";
import { STREAK_BAND, StatTile, accuracySignal } from "@/features/games/StatTile";
import { useBestScore } from "@/features/games/useBestScore";
import { bestStreak, drillBestKey, drillHeadline, paceSignal } from "@/features/speed-maths/results";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { track } from "@/lib/analytics";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { ProgressBar } from "@/components/custom/ProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth";
import { useMentalMathsEngine } from "@/hooks/useMentalMathsEngine";
import { DIFFICULTY_CONFIGS } from "@/lib/mathGenerator";
import { readStored, writeStored } from "@/lib/storage";
import {
  Trophy,
  Check,
  Minus,
  XCircle,
  AlertTriangle,
  X,
  Zap,
  Flame,
  Pause,
  Play,
  ChevronLeft,
  Crown,
  LayoutGrid,
  RotateCcw,
  Sprout,
  Star,
  Target,
  ThumbsUp,
  Timer,
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
  "Speed follows precision...",
  "Eyes on the numbers...",
  "Think fast, calculate accurately...",
  "Precision over rush...",
  "Breathe in, calculate out...",
  "Ready to conquer...",
  "Focus mode activated...",
  "Every second counts...",
  "Sharpen your focus...",
  "Trust your preparation...",
  "Calculate with confidence...",
  "Master the mental math...",
  "Find your rhythm...",
  "Lightning fast, laser sharp...",
  "Zero in on the solution...",
  "Push your limits today...",
  "Stay calm, stay accurate...",
];

const getQuestionFontSize = (text: string | undefined) => {
  if (!text) return "text-3xl sm:text-4xl md:text-5xl lg:text-6xl";
  const len = text.length;
  if (len <= 10) return "text-4xl sm:text-5xl md:text-6xl lg:text-7xl";
  if (len <= 18) return "text-3xl sm:text-4xl md:text-5xl lg:text-6xl";
  if (len <= 30) return "text-2xl sm:text-3xl md:text-4xl lg:text-5xl";
  if (len <= 50) return "text-2xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug";
  if (len <= 80) return "text-xl sm:text-2xl md:text-2xl lg:text-3xl leading-snug";
  return "text-lg sm:text-xl md:text-xl lg:text-2xl leading-snug";
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
      ? `Squares ranging from ${min} to ${max}`
      : `Squares of ${min} to ${max}, e.g. ${min}² = ${min * min}`;
  }
  if (t === "cubes") {
    return d === "all"
      ? `Cubes ranging from ${min} to ${max}`
      : `Cubes of ${min} to ${max}, e.g. ${min}³ = ${min * min * min}`;
  }
  if (t === "addition") {
    const digits = min.toString().length;
    return d === "all"
      ? `Additions ranging from ${min} to ${max}`
      : `${digits}-digit numbers from ${min} to ${max}, e.g. ${max} + ${min} = ${max + min}`;
  }
  if (t === "subtraction") {
    const digits = min.toString().length;
    return d === "all"
      ? `Subtractions ranging from ${min} to ${max}`
      : `${digits}-digit numbers from ${min} to ${max}, e.g. ${max} − ${min} = ${max - min}`;
  }
  if (t === "multiplication") {
    return d === "all"
      ? `Multiplication ranging from ${min} to ${max}`
      : `Numbers from ${min} to ${max}, e.g. ${min} × ${min} = ${min * min}`;
  }
  if (t === "division") {
    return d === "all"
      ? `Division ranging up to divisors of ${max}`
      : `Divisors from ${min} to ${max}, e.g. ${max * min} ÷ ${min} = ${max}`;
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

type Difficulty = "easy" | "medium" | "hard" | "all";
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "all"];
const DRILL_SETTINGS_KEY = "ssc:mental-maths:settings";

interface StoredDrillSettings {
  mode: "timed" | "freestyle";
  difficulty: Difficulty;
  timeLimit: number | null;
  questionLimit: number | null;
  inputLayout: "keys" | "mcq";
}

export default function MentalMathsPractice() {
  const { topic } = useParams() as { topic: string };
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState<boolean>(false);
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);
  const engine = useMentalMathsEngine(topic, showQuitConfirm || isManuallyPaused);
  const gameState = engine.state.status;

  // Sound + vibration for every answer, and a short fanfare at the end.
  useEffect(() => {
    const status = engine.state.currentAnswerStatus;
    if (status === "correct" || status === "wrong") playFeedback(status);
  }, [engine.state.currentAnswerStatus, engine.state.questionIndex]);

  const drillLogged = useRef(false);
  useEffect(() => {
    if (gameState !== "game_over") {
      drillLogged.current = false;
      return;
    }
    if (drillLogged.current) return;
    drillLogged.current = true;
    playFeedback("finish");
    recordPlanActivity("drill", topic);
    if (engine.state.attemptedQuestionsCount > 0) submitBest(engine.state.score);
    const path = window.location.pathname;
    const route = describeRoute(path);
    logActivity({
      kind: "drill",
      subject: "maths",
      label: route.label,
      href: path,
      correct: engine.state.correctAnswers,
      total: engine.state.attemptedQuestionsCount,
    });
    logMistakes(
      engine.state.history
        .filter((h) => h.status === "wrong")
        .map((h) => ({
          subject: "maths" as const,
          source: route.label,
          prompt: h.questionText,
          answer: String(h.correctAnswer),
          href: path,
        })),
    );
    // Logged once per finished drill; engine values are read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const bestKey = drillBestKey(
    topic,
    engine.state.mode,
    engine.state.mode === "timed" ? engine.state.timeLimit : engine.state.questionLimit,
    engine.state.difficulty,
  );
  const { best, isNewBest, submit: submitBest, clearNewBest } = useBestScore(bestKey);

  const inputRef = useRef<HTMLInputElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [inputLayout, setInputLayout] = useState<"keys" | "mcq">("mcq");

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
    clearNewBest();
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

  // Restore the last-used drill settings once, after mount (localStorage is client-only).
  useEffect(() => {
    const saved = readStored<Partial<StoredDrillSettings>>(
      DRILL_SETTINGS_KEY,
      {},
    );
    const mode = saved.mode === "freestyle" ? "freestyle" : "timed";
    const difficulty = DIFFICULTIES.includes(saved.difficulty as Difficulty)
      ? (saved.difficulty as Difficulty)
      : engine.state.difficulty;
    engine.setConfig(
      mode,
      difficulty,
      typeof saved.timeLimit === "number"
        ? saved.timeLimit
        : engine.state.timeLimit,
      typeof saved.questionLimit === "number"
        ? saved.questionLimit
        : engine.state.questionLimit,
    );
    if (saved.inputLayout === "keys" || saved.inputLayout === "mcq") {
      setInputLayout(saved.inputLayout);
    }
    setSettingsLoaded(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!settingsLoaded) return;
    writeStored<StoredDrillSettings>(DRILL_SETTINGS_KEY, {
      mode: engine.state.mode,
      difficulty: engine.state.difficulty,
      timeLimit: engine.state.timeLimit,
      questionLimit: engine.state.questionLimit,
      inputLayout,
    });
  }, [
    settingsLoaded,
    engine.state.mode,
    engine.state.difficulty,
    engine.state.timeLimit,
    engine.state.questionLimit,
    inputLayout,
  ]);

  // A drill left in a background tab shouldn't keep burning the clock.
  useEffect(() => {
    if (gameState !== "active") {
      setIsManuallyPaused(false);
      return;
    }
    const handleVisibility = () => {
      if (document.hidden) setIsManuallyPaused(true);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [gameState]);

  // Global Keyboard Support for Deep Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter to play again on game over
      if (gameState === "game_over" && e.key === "Enter") {
        e.preventDefault();
        engine.resetSession();
        return;
      }

      if (gameState !== "active" || showQuitConfirm) return;

      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        e.preventDefault();
        setIsManuallyPaused((paused) => !paused);
        return;
      }

      if (isManuallyPaused) return;

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
  }, [
    gameState,
    inputLayout,
    engine,
    userInput,
    handleEnterSubmit,
    showQuitConfirm,
    isManuallyPaused,
  ]);

  const correctVal = engine.state.correctAnswers;
  const wrongVal = engine.state.wrongAnswers;
  const skippedVal = engine.state.skippedAnswers;

  // Game over 100% accuracy confetti effect
  useEffect(() => {
    if (gameState === "game_over") {
      const correct = engine.state.correctAnswers;
      const total =
        correct + engine.state.wrongAnswers + engine.state.skippedAnswers;
      const accuracy = total > 0 ? Math.floor((correct / total) * 100) : 0;

      if ((accuracy === 100 || isNewBest) && total > 0 && confettiCanvasRef.current) {
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
    isNewBest,
  ]);

  // PostHog: Capture session completion with full performance stats
  useEffect(() => {
    if (gameState === "game_over") {
      const total = correctVal + wrongVal + skippedVal;
      track("mental_maths_session_completed", {
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

  // Consecutive correct answers ending at the latest attempt.
  let streak = 0;
  for (let i = engine.state.history.length - 1; i >= 0; i--) {
    if (engine.state.history[i].status !== "correct") break;
    streak += 1;
  }

  const answerAnnouncement =
    engine.state.currentAnswerStatus === "correct"
      ? "Correct"
      : engine.state.currentAnswerStatus === "wrong"
        ? `Wrong. The correct answer was ${engine.state.currentQuestion?.correctAnswer}`
        : engine.state.currentAnswerStatus === "skipped"
          ? "Skipped"
          : "";

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

  let barColorClass = "bg-gradient-to-r from-sky-400 to-sky-600";
  let timerTextColorClass = "text-muted-foreground";

  if (isTimedMode && sec !== null) {
    if (sec <= 3) {
      barColorClass = "from-rose-500 to-rose-600 animate-pulse";
      timerTextColorClass = "text-rose-500 dark:text-rose-400 font-extrabold";
    } else if (sec <= 5) {
      barColorClass = "from-rose-500 to-rose-600 transition-colors duration-500";
      timerTextColorClass = "text-rose-500 dark:text-rose-400 font-extrabold";
    } else if (sec <= 10) {
      barColorClass =
        "from-amber-400 to-amber-500 transition-colors duration-500";
      timerTextColorClass =
        "text-amber-700 dark:text-amber-300 font-extrabold";
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

  return (
    <TopicPageLayout
      contentMaxWidthClass={
        gameState === "game_over"
          ? "w-full max-w-3xl lg:max-w-4xl"
          : "w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-[560px]"
      }
      hideBreadcrumbs={true}
      centerContent={true}
    >
      <div
        className={`relative w-full flex flex-col surface-card rounded-3xl select-none transition-all duration-300 p-4 sm:p-5 md:p-6 flex-1 min-h-[570px] min-[390px]:min-h-[610px] md:min-h-[580px] lg:min-h-[600px] max-h-[calc(92dvh-3.5rem)] md:max-h-[calc(90dvh-4.5rem)] my-auto ${gameState === "game_over" ? "overflow-y-auto [scrollbar-width:thin]" : "overflow-hidden"}`}
      >
        <header className="mb-3 flex shrink-0 items-center justify-between gap-3 border-b-2 border-border pb-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                gameState === "active" ? setShowQuitConfirm(true) : router.push("/SSC/maths/mental-maths")
              }
              aria-label={gameState === "active" ? "Quit drill" : "Back to all drills"}
              className={DUO.icon}
            >
              {gameState === "active" ? <X className="h-5 w-5" aria-hidden="true" /> : <ChevronLeft className="h-5 w-5" aria-hidden="true" />}
            </button>
            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-base font-extrabold capitalize text-foreground sm:text-lg">
                {topic.replace(/[-_]/g, " ")} drill
              </h1>
              <p className={`truncate text-xs font-semibold ${GAME_TONE.maths.text}`}>Speed Maths</p>
            </div>
          </div>
          {gameState === "active" && (
            <button
              type="button"
              onClick={() => setIsManuallyPaused(true)}
              aria-label="Pause drill"
              title="Pause (P)"
              className={DUO.icon}
            >
              <Pause className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </header>

        {gameState === "active" && isManuallyPaused && !showQuitConfirm && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Drill paused"
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 rounded-3xl bg-background backdrop-blur-md animate-in fade-in duration-200"
          >
            <div className="text-2xl font-black tracking-tight">Paused</div>
            <p className="text-xs font-mono font-semibold text-muted-foreground">
              The clock is stopped.
            </p>
            <Button
              autoFocus
              onClick={() => setIsManuallyPaused(false)}
              className={cn(DUO.primary, "px-7")}
            >
              <Play className="w-4 h-4" /> Resume
              <kbd className="hidden md:inline rounded bg-white/20 px-1.5 py-0.5 text-xs">
                P
              </kbd>
            </Button>
          </div>
        )}

        {/* Master Layout Wrapper */}
        <div className="relative w-full flex flex-col flex-1 min-h-0">
          {gameState === "idle" && (
            <DrillLobby
              isMixed={topic === "mixed"}
              difficulty={engine.state.difficulty}
              difficultyNote={getDifficultyDescription(topic, engine.state.difficulty) ?? ""}
              mode={engine.state.mode}
              timeLimit={engine.state.timeLimit}
              questionLimit={engine.state.questionLimit}
              inputLayout={inputLayout}
              onDifficulty={handleDifficultyChange}
              onMode={handleModeChange}
              onTimeLimit={handleTimerLimitChange}
              onQuestionLimit={handleQuestionLimitChange}
              onInputLayout={setInputLayout}
              onStart={handleStartPractice}
            />
          )}

          {/* OTHER GAME STATES */}
          {gameState !== "idle" && (
            <div className="w-full flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-3 min-h-0">
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
                      className="text-8xl font-black tabular-nums text-sky-600 dark:text-sky-300"
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
                <div className="h-full w-full flex flex-col flex-1 gap-1.5 sm:gap-2.5">
                  {/* Top Bar: Topic Badge + Score Pill + Switcher */}
                  <div className="flex items-center justify-between w-full pb-1.5 gap-2">
                    {/* Left: mode and level (the drill's name is in the header) */}
                    <div className="flex min-w-0 items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide select-none">
                      <span className="rounded-lg bg-muted px-2 py-1 text-foreground/80">
                        {engine.state.mode === "timed" ? "Timed" : "Freestyle"}
                      </span>
                      {topic !== "mixed" && (
                        <span className="truncate rounded-lg bg-muted px-2 py-1 text-foreground/80">{engine.state.difficulty}</span>
                      )}
                    </div>

                    {/* Right: Score Pill + Layout Switcher */}
                    <div className="flex items-center gap-2 shrink-0">
                      {streak >= 2 && (
                        <div
                          className="flex items-center gap-1 bg-[color-mix(in_oklab,var(--brand-500)_10%,var(--card))] dark:bg-[color-mix(in_oklab,var(--brand-500)_15%,var(--card))] border-2 border-brand-500/20 rounded-full px-2.5 py-1 select-none animate-in zoom-in-75 duration-200"
                          aria-label={`${streak} correct in a row`}
                        >
                          <Flame
                            className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400"
                            aria-hidden="true"
                          />
                          <span className="text-xs sm:text-sm font-black text-brand-700 dark:text-brand-400 font-mono tabular-nums">
                            {streak}
                          </span>
                        </div>
                      )}

                      {/* Score Pill */}
                      <div className="flex items-center gap-1.5 bg-[color-mix(in_oklab,var(--color-emerald-500)_10%,var(--card))] dark:bg-[color-mix(in_oklab,var(--color-emerald-500)_15%,var(--card))] border-2 border-emerald-500/20 rounded-full px-2.5 py-1 select-none">
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
                      <div className="flex items-center bg-[color-mix(in_oklab,var(--muted)_50%,var(--card))] p-0.5 rounded-xl border-2 border-border select-none text-xs font-bold w-[76px] sm:w-[84px]">
                        <button
                          type="button"
                          onClick={() => setInputLayout("mcq")}
                          aria-pressed={inputLayout === "mcq"}
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
                          aria-pressed={inputLayout === "keys"}
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
                  <div className="w-full flex flex-col gap-1 my-0.5 sm:my-1">
                    {/* Labels Row */}
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground select-none">
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
                      label={isTimedMode ? "Time remaining" : "Questions completed"}
                      barClassName={`${barColorClass} transition-all duration-100 ease-linear`}
                    />
                  </div>

                  <div role="status" aria-live="polite" className="sr-only">
                    {answerAnnouncement}
                  </div>

                  {/* Question Box */}
                  <div
                    className={`
                            my-0.5 sm:my-1.5 flex-1 flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl py-3 sm:py-4 md:py-6 lg:py-7 px-4 sm:px-6 md:px-8 min-h-[96px] sm:min-h-[110px] md:min-h-[120px] lg:min-h-[130px] overflow-hidden border-2 transition-all duration-200 ease-in-out select-none relative
                            ${engine.state.currentAnswerStatus === "correct" ? "border-emerald-500/60 bg-[color-mix(in_oklab,var(--color-emerald-500)_15%,var(--card))] text-emerald-600 dark:text-emerald-300" : ""}
                            ${engine.state.currentAnswerStatus === "wrong" ? "border-rose-500/60 bg-[color-mix(in_oklab,var(--color-rose-500)_15%,var(--card))] text-rose-600 dark:text-rose-300" : ""}
                            ${engine.state.currentAnswerStatus === "skipped" ? "border-brand-500/60 bg-[color-mix(in_oklab,var(--brand-500)_15%,var(--card))] text-brand-600 dark:text-brand-300" : ""}
                            ${engine.state.currentAnswerStatus === "idle" ? "border-border/40 bg-card backdrop-blur-xl" : ""}
                        `}
                  >
                    {engine.state.currentAnswerStatus !== "idle" && (
                      <div
                        aria-hidden="true"
                        className="absolute top-2.5 right-2.5 z-10"
                      >
                        {engine.state.currentAnswerStatus === "correct" ? (
                          <Check className="w-5 h-5" strokeWidth={3} />
                        ) : engine.state.currentAnswerStatus === "wrong" ? (
                          <XCircle className="w-5 h-5" strokeWidth={2.5} />
                        ) : (
                          <Minus className="w-5 h-5" strokeWidth={3} />
                        )}
                      </div>
                    )}
                    {/* No exit animation: the options swap instantly, so an
                        outgoing question lingering beside them reads as a flash. */}
                    <motion.div
                      key={engine.state.questionIndex}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.14, ease: "easeOut" }}
                      className={`font-black tracking-tight text-center w-full font-mono break-words relative z-10 ${getQuestionFontSize(
                        engine.state.currentQuestion?.questionText,
                      )}`}
                    >
                      {engine.state.currentQuestion?.questionText}
                    </motion.div>
                  </div>

                  {/* Wrapper for Inputs & Keypad */}
                  <div className="w-full shrink-0 relative flex flex-col justify-end pb-0.5 h-[230px] sm:h-[240px] md:h-[250px] lg:h-[260px]">
                    <AnimatePresence mode="wait">
                      {inputLayout === "keys" ? (
                        <motion.div
                          key="numpad"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.12, ease: "easeInOut" }}
                          className="flex flex-col gap-2 sm:gap-2.5 w-full h-full justify-between"
                        >
                          {/* Answer Input Bar */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleEnterSubmit(userInput);
                            }}
                            className="flex gap-2 sm:gap-2.5 w-full shrink-0"
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
                              className="h-9 sm:h-10 md:h-11 flex-1 rounded-2xl text-center px-4 text-base sm:text-lg md:text-xl font-bold font-mono border-2 border-border bg-card backdrop-blur-md focus-visible:bg-card focus-visible:border-brand-400/70 focus-visible:ring-2 focus-visible:ring-brand-400/20 caret-brand-400 shadow-inner transition-all"
                              autoFocus
                            />
                            <Button
                              type="submit"
                              className={cn(DUO.primary, "h-11 min-h-11 w-24 shrink-0 px-0 sm:w-28")}
                              onClick={() => handleEnterSubmit(userInput)}
                            >
                              Enter
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              className={cn(DUO.secondary, "h-11 min-h-11 shrink-0 px-4")}
                              onClick={() => handleEnterSubmit("skip")}
                            >
                              Skip
                            </Button>
                          </form>

                          {/* Tactile 3D Keypad */}
                          <div className="grid h-full min-h-0 w-full flex-1 grid-cols-3 gap-2">
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
                                aria-label={
                                  btn === "⌫"
                                    ? "Backspace"
                                    : btn === "Clear"
                                      ? "Clear answer"
                                      : btn
                                }
                                onClick={() => handleNumClick(btn)}
                                className={cn(
                                  DUO.option,
                                  "h-full w-full select-none font-mono font-black outline-none",
                                  btn === "Clear"
                                    ? "border-rose-500 bg-[color-mix(in_oklab,var(--color-rose-500)_12%,var(--card))] text-xs font-extrabold uppercase text-rose-700 hover:bg-[color-mix(in_oklab,var(--color-rose-500)_20%,var(--card))] dark:text-rose-300 sm:text-sm"
                                    : btn === "⌫"
                                      ? cn(DUO.idle, "bg-muted font-sans text-lg sm:text-xl")
                                      : cn(DUO.idle, "text-xl sm:text-2xl"),
                                )}
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
                          className="flex flex-col items-center justify-end flex-1 h-full gap-3 sm:gap-4 md:gap-4.5 w-full"
                        >
                          {/* 3D MCQ Options Grid */}
                          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 w-full flex-1 min-h-0">
                            {engine?.state?.currentQuestion?.options?.map(
                              (option, idx) => {
                                const isSelected = selectedOption === option;
                                const status = engine.state.currentAnswerStatus;
                                let highlightClass: string = DUO.idle;
                                if (isSelected) {
                                  if (status === "correct") highlightClass = DUO.correct;
                                  else if (status === "wrong") highlightClass = DUO.wrong;
                                }
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    aria-label={`Option ${idx + 1}: ${option}`}
                                    className={cn(DUO.option, "group relative flex h-full w-full select-none flex-col items-center justify-center p-2 font-bold sm:p-3", highlightClass)}
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
                                    <span className="absolute top-2 left-2.5 px-1.5 py-0.5 rounded-lg bg-muted text-muted-foreground group-hover:text-foreground font-mono text-xs sm:text-xs md:text-xs font-bold tracking-wider transition-colors">
                                      {idx + 1}
                                    </span>
                                    <span className="font-mono text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mt-1">
                                      {option}
                                    </span>
                                  </button>
                                );
                              },
                            )}
                          </div>
                          {/* 3D Skip Button for MCQ */}
                          <div className="flex w-full shrink-0 items-center justify-center pt-1 pb-0.5">
                            <button
                              type="button"
                              onClick={() => handleEnterSubmit("skip")}
                              className={cn(DUO.secondary, "min-h-12 w-full sm:w-auto sm:px-10")}
                            >
                              Skip
                              <kbd className="hidden md:inline rounded bg-muted px-1.5 py-0.5 text-xs normal-case">
                                Enter
                              </kbd>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* 4. RESULTS */}
              {gameState === "game_over" &&
                (() => {
                  const correct = engine.state.correctAnswers;
                  const wrong = engine.state.wrongAnswers;
                  const skipped = engine.state.skippedAnswers;
                  const total = correct + wrong + skipped;
                  const accuracy = total > 0 ? Math.floor((correct / total) * 100) : 0;

                  const validTimes = engine.state.history
                    .filter((h) => h.timeTaken && h.timeTaken > 0)
                    .map((h) => (h.timeTaken ?? 0) / 1000);
                  const fastestTime = validTimes.length > 0 ? Math.min(...validTimes) : 0;
                  const avgTime =
                    engine.state.history.length > 0
                      ? engine.state.history.reduce((acc, curr) => acc + (curr.timeTaken ?? 0), 0) /
                        Math.max(1, engine.state.history.length) /
                        1000
                      : 0;
                  const target = getTargetTime(topic, engine.state.difficulty);
                  const streakBest = bestStreak(engine.state.history);
                  const BadgeIcon = isNewBest
                    ? Trophy
                    : accuracy === 100 && total >= 5
                      ? Crown
                      : accuracy >= 80
                        ? Star
                        : accuracy >= 50
                          ? ThumbsUp
                          : Sprout;
                  const setup =
                    engine.state.mode === "timed"
                      ? `${engine.state.timeLimit}s timed`
                      : `${engine.state.questionLimit} questions`;

                  return (
                    <div className="relative flex min-h-0 w-full flex-1 flex-col text-left animate-in fade-in duration-300">
                      <canvas
                        ref={confettiCanvasRef}
                        className="pointer-events-none absolute inset-0 z-[100] h-full w-full rounded-3xl"
                      />

                      <div className="flex flex-col gap-5 pb-3">
                        <ResultHero
                          icon={BadgeIcon}
                          badgeClass={isNewBest ? "bg-brand-500 text-white" : TONE_BAND.maths}
                          headline={drillHeadline(accuracy, total)}
                          line={
                            <>
                              <span className="font-bold text-foreground tabular-nums">
                                {correct} of {total}
                              </span>{" "}
                              right · <span className="capitalize">{topic.replace(/[-_]/g, " ")}</span> · {setup}
                            </>
                          }
                          ribbon={
                            isNewBest ? (
                              <span className="mt-1 flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
                                <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                                New best score
                              </span>
                            ) : best > 0 ? (
                              <span className="mt-1 text-xs font-semibold text-muted-foreground">
                                Your best here: <span className="tabular-nums text-foreground">{best}</span>
                              </span>
                            ) : null
                          }
                        />

                        <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Your results">
                          <StatTile label="Score" value={engine.state.score} icon={Zap} band={TONE_BAND.maths} index={0} />
                          <StatTile
                            label="Accuracy"
                            value={accuracy}
                            suffix="%"
                            icon={Target}
                            signal={total > 0 ? accuracySignal(accuracy) : undefined}
                            band="bg-muted text-foreground"
                            display={total === 0 ? "—" : undefined}
                            index={1}
                          />
                          <StatTile
                            label="Avg pace"
                            value={avgTime}
                            decimals={1}
                            suffix="s"
                            icon={Timer}
                            signal={total > 0 ? paceSignal(avgTime, target) : undefined}
                            band="bg-muted text-foreground"
                            note={`target ${target}s`}
                            display={total === 0 ? "—" : undefined}
                            index={2}
                          />
                          <StatTile
                            label="Best streak"
                            value={streakBest}
                            icon={Flame}
                            band={STREAK_BAND}
                            note={fastestTime > 0 ? `fastest ${fastestTime.toFixed(1)}s` : undefined}
                            index={3}
                          />
                        </div>

                        {total > 0 && (
                          <section aria-label="Review your answers" className="mx-auto flex w-full max-w-2xl flex-col gap-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="section-label">Review</h3>
                              <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                                {wrong > 0 ? `${wrong} to look at` : "No mistakes"}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex flex-col">
                                <ol className="flex flex-col divide-y-2 divide-border overflow-hidden rounded-2xl border-2 border-border bg-card">
                                  {engine.state.history.map((item, idx) => {
                                    const isCorrect = item.status === "correct";
                                    const isWrong = item.status === "wrong";
                                    const secs = (item.timeTaken ?? 0) / 1000;
                                    const slow = item.status !== "skipped" && secs > target;
                                    return (
                                      <li key={idx} className="flex items-center gap-3 px-3 py-2.5">
                                        <span
                                          className={cn(
                                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white",
                                            isCorrect ? "bg-emerald-500" : isWrong ? "bg-rose-500" : "bg-muted text-muted-foreground",
                                          )}
                                          aria-label={isCorrect ? "Right" : isWrong ? "Wrong" : "Skipped"}
                                        >
                                          {isCorrect ? (
                                            <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                                          ) : isWrong ? (
                                            <X className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                                          ) : (
                                            <Minus className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                                          )}
                                        </span>
                                        <div className="min-w-0 flex-1 font-mono text-[15px] leading-snug">
                                          <span className="text-foreground">{item.questionText} = </span>
                                          <span className="font-extrabold text-foreground">{item.correctAnswer}</span>
                                          {isWrong && (
                                            <span className="ml-2 text-sm font-bold text-rose-600 line-through dark:text-rose-400">{item.userAnswer}</span>
                                          )}
                                          {item.status === "skipped" && <span className="ml-2 font-sans text-xs font-semibold text-muted-foreground">skipped</span>}
                                        </div>
                                        <span
                                          className={cn(
                                            "shrink-0 font-mono text-xs font-bold tabular-nums",
                                            slow ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground",
                                          )}
                                          title={slow ? `Slower than the ${target}s target` : undefined}
                                        >
                                          {item.status === "skipped" ? "" : `${secs.toFixed(1)}s`}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ol>
                              </div>
                            </div>
                          </section>
                        )}
                      </div>

                      <ActionBar
                        className="sticky -bottom-4 z-30 -mb-4 bg-card pb-[max(1rem,env(safe-area-inset-bottom))] sm:-bottom-5 sm:-mb-5 sm:pb-5 md:-bottom-6 md:-mb-6 md:pb-6"
                        note={
                          !user ? (
                            <p className="text-center text-xs font-medium text-muted-foreground">
                              Playing as a guest.{" "}
                              <button
                                type="button"
                                onClick={signInWithGoogle}
                                className="font-bold text-foreground underline underline-offset-2 hover:text-brand-600"
                              >
                                Sign in to save your scores
                              </button>
                            </p>
                          ) : undefined
                        }
                      >
                        <button type="button" onClick={engine.resetSession} autoFocus className={CTA.primary}>
                          <RotateCcw className="h-5 w-5" aria-hidden="true" />
                          Practice again
                        </button>
                        <button type="button" onClick={() => router.push("/SSC/maths/mental-maths")} className={CTA.secondary}>
                          <LayoutGrid className="h-5 w-5" aria-hidden="true" />
                          All drills
                        </button>
                      </ActionBar>
                    </div>
                  );
                })()}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
        <AlertDialogContent className="sm:w-full max-w-sm surface-card rounded-3xl shadow-2xl p-4 sm:p-6">
          <AlertDialogHeader className="pb-3 border-b-2 border-border/40">
            <AlertDialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              {gameState === "game_over" ? "Exit to Topics?" : "Quit Practice Session?"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3 font-medium">
            {gameState === "game_over" ? (
              "Are you sure you want to exit? You will return to the mental maths menu."
            ) : (
              <>
                Your current progress and score of{" "}
                <span className="text-foreground font-mono font-bold">{engine.state.score}</span>{" "}
                will be reset.
              </>
            )}
          </AlertDialogDescription>

          <AlertDialogFooter className="flex-row gap-2 mt-4 sm:justify-end">
            <AlertDialogCancel
              className="flex-1 sm:flex-none h-10 sm:h-11 px-4 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider uppercase surface-card text-foreground hover:bg-[color-mix(in_oklab,var(--muted)_60%,var(--card))] active:scale-95 transition-all cursor-pointer"
              onClick={() => setShowQuitConfirm(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 sm:flex-none h-10 sm:h-11 px-4 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider uppercase border-2 border-destructive/30 bg-[color-mix(in_oklab,var(--destructive)_10%,var(--card))] text-destructive hover:bg-destructive hover:text-white active:scale-95 transition-all cursor-pointer shadow-xs"
              onClick={() => {
                setShowQuitConfirm(false);
                if (gameState === "game_over") {
                  router.push("/SSC/maths/mental-maths");
                } else {
                  engine.resetSession();
                }
              }}
            >
              {gameState === "game_over" ? "Yes, Exit" : "Yes, Quit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TopicPageLayout>
  );
}
