"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMentalMathsEngine } from "@/hooks/useMentalMathsEngine";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel
} from "@/components/ui/alert-dialog";

export default function MentalMathsPractice() {
    const { topic } = useParams() as { topic: string };
    const router = useRouter();

    const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);
    const engine = useMentalMathsEngine(topic, showQuitConfirm);
    const gameState = engine.state.status

    const inputRef = useRef<HTMLInputElement>(null);
    const [userInput, setUserInput] = useState<string>("");
    const [animatedAccuracy, setAnimatedAccuracy] = useState<number>(0);

    const handleDifficultyChange = (newDifficulty: "easy" | "medium" | "hard") => {
        engine.setConfig(engine.state.mode, newDifficulty, engine.state.timeLimit, engine.state.questionLimit)
    }

    const handleModeChange = (newMode: "timed" | "freestyle") => {
        engine.setConfig(newMode, engine.state.difficulty, engine.state.timeLimit, engine.state.questionLimit)

    }

    const handleTimerLimitChange = (newTimeLimit: number) => {
        engine.setConfig(engine.state.mode, engine.state.difficulty, newTimeLimit, engine.state.questionLimit)

    }

    const handleQuestionLimitChange = (newQuestionLimit: number) => {
        engine.setConfig(engine.state.mode, engine.state.difficulty, engine.state.timeLimit, newQuestionLimit)

    }

    const handleStartPractice = () => {
        engine.startSession();

    }

    const handleEnterSubmit = (userInput: string | "skip") => {
        if (userInput === "skip") {
            engine.submitUserAnswer("skip")
        } else {
            if (userInput.trim() !== "")
                engine.submitUserAnswer(Number(userInput))
        }
    }

    const handleNumClick = (numpadValue: string) => {
        if (numpadValue.toLowerCase() === "clear") {
            setUserInput("")
        } else if (numpadValue === "⌫")
            setUserInput(userInput.slice(0, userInput.length - 1))
        else {
            setUserInput(userInput + numpadValue)
        }
    }

    useEffect(() => {
        setUserInput("");
    }, [engine.state.currentQuestion]);
 
    // Animate accuracy percentage on game over screen
    const correctVal = engine.state.correctAnswers;
    const wrongVal = engine.state.wrongAnswers;
    const skippedVal = engine.state.skippedAnswers;
    const totalVal = correctVal + wrongVal + skippedVal;
    const targetAccuracy = totalVal > 0 ? Math.floor((correctVal / totalVal) * 100) : 0;
 
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

    // Progress bar calculations
    const timeRemaining = engine.state.timeRemaining ?? 0;
    const timeLimit = engine.state.timeLimit ?? 1;
    const attemptedQuestionsCount = engine.state.attemptedQuestionsCount;
    const questionLimit = engine.state.questionLimit ?? 1;

    const progressPercentage = engine.state.mode === "timed"
        ? Math.min(100, Math.max(0, (timeRemaining / timeLimit) * 100))
        : Math.min(100, Math.max(0, (attemptedQuestionsCount / questionLimit) * 100));

    const progressText = engine.state.mode === "timed"
        ? `${timeRemaining}s remaining`
        : `${attemptedQuestionsCount} / ${questionLimit} Qs`;

    return (
        <TopicPageLayout
            contentMaxWidthClass="w-full max-w-md"
        >
            <div className="w-full mt-2 flex flex-col items-center justify-center p-6 bg-card border border-border rounded-3xl shadow-sm select-none">

                {/* 1. LOBBY CONFIGURATION SCREEN */}
                {gameState === "idle" && (
                    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                        {/* Title Section */}
                        <div className="text-center pb-3 border-b border-border/40">
                            <h2 className="text-2xl font-extrabold tracking-tight capitalize bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">
                                {topic} Practice
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-normal">
                                Speed test your calculations for {topic}. Select difficulty and beat the clock!
                            </p>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Select Difficulty</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {([ "easy", "medium", "hard" ] as const).map((d) => {
                                    const isSelected = d === engine.state.difficulty;
                                    const diffStyles = {
                                        easy: isSelected 
                                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold"
                                            : "border-border bg-card hover:border-emerald-500/30 hover:bg-emerald-500/5 text-foreground",
                                        medium: isSelected 
                                            ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm font-bold"
                                            : "border-border hover:border-amber-500/30 hover:bg-amber-500/5 text-foreground",
                                        hard: isSelected 
                                            ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm font-bold"
                                            : "border-border hover:border-rose-500/30 hover:bg-rose-500/5 text-foreground"
                                    };
                                    const label = d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Hard";
                                    return (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => handleDifficultyChange(d)}
                                            className={`rounded-2xl h-11 border text-xs capitalize transition-all duration-200 ease-out ${diffStyles[d]}`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Practice Mode Selection */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Practice Mode</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Timed Mode Card */}
                                <button
                                    type="button"
                                    onClick={() => handleModeChange("timed")}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center h-28 w-full transition-all duration-200 ease-out outline-none ${
                                        engine.state.mode === "timed"
                                            ? "border-primary bg-primary/[0.03] shadow-sm"
                                            : "border-border bg-card hover:bg-muted/50"
                                    }`}
                                >
                                    <span className="text-2xl mb-1.5">⏱️</span>
                                    <span className={`font-bold text-xs ${engine.state.mode === "timed" ? "text-primary" : "text-foreground"}`}>Timed Sprint</span>
                                    <span className="text-[10px] text-muted-foreground mt-0.5 leading-normal">Solve against the clock</span>
                                </button>

                                {/* Freestyle Mode Card */}
                                <button
                                    type="button"
                                    onClick={() => handleModeChange("freestyle")}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center h-28 w-full transition-all duration-200 ease-out outline-none ${
                                        engine.state.mode === "freestyle"
                                            ? "border-primary bg-primary/[0.03] shadow-sm"
                                            : "border-border bg-card hover:bg-muted/50"
                                    }`}
                                >
                                    <span className="text-2xl mb-1.5">🥋</span>
                                    <span className={`font-bold text-xs ${engine.state.mode === "freestyle" ? "text-primary" : "text-foreground"}`}>Freestyle Run</span>
                                    <span className="text-[10px] text-muted-foreground mt-0.5 leading-normal">Solve at your own pace</span>
                                </button>
                            </div>
                        </div>

                        {/* Mode Specific Limits */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                {engine.state.mode === "timed" ? "Select Time Limit" : "Select Question Limit"}
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {engine.state.mode === "timed" ? [30, 60, 90].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => handleTimerLimitChange(t)}
                                        className={`rounded-2xl h-11 border-2 font-bold text-xs transition-all duration-200 ease-out active:scale-[0.98] ${
                                            t === engine.state.timeLimit
                                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                                : "border-border hover:bg-muted/30 text-foreground"
                                        }`}
                                    >
                                        {t}s
                                    </button>
                                )) : [10, 20, 30].map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => handleQuestionLimitChange(q)}
                                        className={`rounded-2xl h-11 border-2 font-bold text-xs transition-all duration-200 ease-out active:scale-[0.98] ${
                                            q === engine.state.questionLimit
                                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                                : "border-border hover:bg-muted/30 text-foreground"
                                        }`}
                                    >
                                        {q} Qs
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2.5 w-full mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 h-12 rounded-2xl font-semibold border-border/80 text-muted-foreground hover:text-foreground active:scale-[0.99] transition-all"
                                onClick={() => router.push("/SSC/maths/mental-maths")}
                            >
                                Back
                            </Button>
                            <Button
                                className="flex-[2] h-12 rounded-2xl font-bold text-sm bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 text-primary-foreground transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group"
                                onClick={handleStartPractice}
                            >
                                ⚡ Start Practice Sprint
                            </Button>
                        </div>
                    </div>
                )}

                {/* 2. THREE-SECOND START COUNTDOWN */}
                {gameState === "countdown" && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-7xl font-extrabold animate-ping text-primary">
                            {engine.state.countdownTick}
                        </div>
                        <p className="text-muted-foreground mt-8 animate-pulse text-sm">
                            Get ready to calculate...
                        </p>
                    </div>
                )}

                {/* 3. ACTIVE PRACTICE BOARD */}
                {gameState === "active" && (
                    <div className="w-full flex flex-col gap-6">
                        {/* Header Stats Bar */}
                        <div className="flex items-center justify-between w-full pb-3 border-b border-border/60">
                            <div className="flex flex-col gap-0.5">
                                <span className={`font-bold text-base tracking-tight ${engine.state.mode === "timed" ? "text-primary" : "text-foreground"}`}>
                                    {engine.state.mode === "timed" ? "Timed Practice" : "Freestyle Practice"}
                                </span>
                                <span className="text-[11px] text-muted-foreground capitalize">{topic}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1">
                                    <span className="text-xs text-muted-foreground">Score</span>
                                    <span className="text-sm font-bold text-foreground">{engine.state.score}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowQuitConfirm(true)}
                                    className="text-xs font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-full px-3 py-1.5 transition-colors"
                                >
                                    Quit
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Progress Bar */}
                        <div className="w-full flex flex-col gap-1.5">
                            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-primary h-full transition-all duration-300 ease-out"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span className="font-medium">{progressText}</span>
                            </div>
                        </div>

                        {/* Central Question Panel */}
                        <div className={`
                            flex flex-col items-center justify-center rounded-2xl py-5 px-4 min-h-[78px] overflow-hidden border-2 transition-all duration-75 ease-in-out
                            ${engine.state.currentAnswerStatus === "correct" ? "border-green-500 bg-green-500/5 shadow-[0_0_10px_rgba(34,197,94,0.15)]" : ""}
                            ${engine.state.currentAnswerStatus === "wrong" ? "border-red-500 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.15)]" : ""}
                            ${engine.state.currentAnswerStatus === "skipped" ? "border-amber-500 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.15)]" : ""}
                            ${engine.state.currentAnswerStatus === "idle" ? "border-primary/30 bg-transparent" : ""}
                        `}>
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    key={engine.state.questionIndex}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{
                                        x: { type: "spring", stiffness: 600, damping: 36 },
                                        opacity: { duration: 0.06, ease: "easeInOut" }
                                    }}
                                    className="text-4xl font-extrabold tracking-tight text-center w-full"
                                >
                                    {engine.state.currentQuestion?.questionText}
                                </motion.div>
                            </AnimatePresence>
                        </div>
 
                        {/* Answer Input Bar */}
                        <form onSubmit={(e) => { e.preventDefault(); handleEnterSubmit(userInput) }} className="flex gap-2">
                            <Input
                                ref={inputRef}
                                type="text"
                                inputMode="none"
                                placeholder="Type answer..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ""))}
                                className="h-11 sm:h-12 rounded-2xl text-center text-base sm:text-lg font-semibold border border-input focus-visible:ring-primary/20 bg-background"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                className="h-11 sm:h-12 rounded-2xl px-4 sm:px-6 text-xs sm:text-sm font-bold bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground hover:opacity-95 shadow-sm active:scale-[0.98] transition-transform"
                                onClick={() => handleEnterSubmit(userInput)}
                            >
                                Enter
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 sm:h-12 rounded-2xl px-4 sm:px-6 text-xs sm:text-sm font-semibold border border-border/80 hover:bg-muted hover:border-border text-muted-foreground hover:text-foreground active:scale-[0.98] transition-all"
                                onClick={() => handleEnterSubmit("skip")}
                            >
                                Skip
                            </Button>
                        </form>

                        {/* Interactive Thumb Keypad (For smooth mobile typing) */}
                        <div className="grid grid-cols-3 gap-1.5 mt-2">
                            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "⌫"].map((btn) => (
                                <button
                                    key={btn}
                                    type="button"
                                    onClick={() => handleNumClick(btn)}
                                    className={`h-11 sm:h-12 font-semibold rounded-2xl border transition-colors duration-150 ease-out outline-none select-none active:scale-95 ${
                                        btn === "Clear" || btn === "⌫"
                                            ? "bg-muted text-muted-foreground hover:bg-muted/80 border-border/50 hover:border-primary/30 text-xs sm:text-sm"
                                            : "bg-background text-foreground hover:bg-muted/50 border-border hover:border-primary/30 text-sm sm:text-base"
                                    }`}
                                >
                                    {btn}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. PERFORMANCE RESULTS SCORECARD */}
                {gameState === "game_over" && (() => {
                    const correct = engine.state.correctAnswers;
                    const wrong = engine.state.wrongAnswers;
                    const skipped = engine.state.skippedAnswers;
                    const total = correct + wrong + skipped;
                    const accuracy = total > 0 ? Math.floor((correct / total) * 100) : 0;
                    const radius = 48;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (circumference * animatedAccuracy) / 100;

                    return (
                        <div className="w-full flex flex-col items-center text-center gap-6 py-4 animate-in fade-in duration-300">
                            <div className="text-5xl">🏆</div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Session Completed!</h2>
                                <p className="text-muted-foreground text-xs mt-2 font-medium">
                                    You answered <strong className="text-foreground">{correct}</strong> out of <strong className="text-foreground">{engine.state.attemptedQuestionsCount}</strong> questions correctly.
                                </p>
                                <p className={`text-base font-extrabold mt-3 ${accuracy >= 90 ? "text-green-600 dark:text-green-400" :
                                    accuracy >= 75 ? "text-emerald-500 dark:text-emerald-400" :
                                        accuracy >= 50 ? "text-amber-500 dark:text-amber-400" : "text-red-500"
                                    }`}>
                                    {accuracy >= 90 && "Outstanding! You are a calculation wizard! 🧙‍♂️"}
                                    {accuracy >= 75 && accuracy < 90 && "Great job! Very impressive speed and accuracy! 🚀"}
                                    {accuracy >= 50 && accuracy < 75 && "Good effort! Solid practice session. 👍"}
                                    {accuracy < 50 && "Keep pushing! Consistency builds speed! 💪"}
                                </p>
                            </div>

                            {/* Centered Circular Accuracy Gauge */}
                            <div className="relative flex items-center justify-center w-36 h-36 my-4 animate-in zoom-in-75 duration-500">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="72"
                                        cy="72"
                                        r={radius}
                                        className="stroke-muted/30"
                                        strokeWidth="6"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="72"
                                        cy="72"
                                        r={radius}
                                        className={`${accuracy >= 75 ? "stroke-green-500" :
                                            accuracy >= 50 ? "stroke-amber-500" : "stroke-red-500"
                                            }`}
                                        strokeWidth="6"
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black tracking-tight">{animatedAccuracy}%</span>
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">Accuracy</span>
                                </div>
                            </div>

                            {/* Metric Grid (3-column layout) */}
                            <div className="grid grid-cols-3 gap-2.5 w-full">
                                {/* Correct Answers */}
                                <div className="p-3.5 bg-muted/30 border border-border/80 rounded-2xl flex flex-col items-center justify-center min-h-[90px]">
                                    <span className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider mb-1">Correct</span>
                                    <span className="text-xl font-bold text-foreground">{correct}</span>
                                </div>

                                {/* Incorrect Answers */}
                                <div className="p-3.5 bg-muted/30 border border-border/80 rounded-2xl flex flex-col items-center justify-center min-h-[90px]">
                                    <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wider mb-1">Wrong</span>
                                    <span className="text-xl font-bold text-foreground">{wrong}</span>
                                </div>

                                {/* Skipped Answers */}
                                <div className="p-3.5 bg-muted/30 border border-border/80 rounded-2xl flex flex-col items-center justify-center min-h-[90px]">
                                    <span className="text-[10px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider mb-1">Skipped</span>
                                    <span className="text-xl font-bold text-foreground">{skipped}</span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 w-full mt-4">
                                <Button
                                    onClick={engine.resetSession}
                                    className="flex-1 h-12 rounded-2xl font-bold bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 text-primary-foreground transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group"
                                >
                                    ⚡ Practice Again
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/SSC/maths/mental-maths")}
                                    className="flex-1 h-12 rounded-2xl font-semibold border-border/80"
                                >
                                    Back to Topics
                                </Button>
                            </div>
                        </div>
                    );
                })()}

            </div>

            <AlertDialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
                <AlertDialogContent className="rounded-3xl w-[calc(100%-2rem)] sm:w-full max-w-sm border border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold tracking-tight text-foreground">
                            Quit Practice Session?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed mt-2">
                            Are you sure you want to quit this sprint? Your current progress and score of <strong className="text-foreground">{engine.state.score}</strong> will be reset.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row gap-2 mt-4 sm:justify-end">
                        <AlertDialogCancel
                            className="flex-1 sm:flex-none h-11 rounded-2xl text-sm font-semibold border-border/85 hover:bg-muted"
                            onClick={() => setShowQuitConfirm(false)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="flex-1 sm:flex-none h-11 rounded-2xl text-sm font-bold bg-destructive hover:bg-destructive/90 text-white"
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
