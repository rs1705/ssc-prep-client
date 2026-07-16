"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { ProgressBar } from "@/components/custom/ProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMentalMathsEngine } from "@/hooks/useMentalMathsEngine";
import {Trophy, Award, Target, Flame, CheckCircle2, XCircle, HelpCircle, AlertTriangle } from "lucide-react";
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
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [animatedAccuracy, setAnimatedAccuracy] = useState<number>(0);
    const [inputLayout, setInputLayout] = useState<"keys" | "mcq">("mcq");
    const [resultsTab, setResultsTab] = useState<"overview" | "review">("overview");

    const handleDifficultyChange = (newDifficulty: "easy" | "medium" | "hard" | "all") => {
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

    const handleEnterSubmit = (userInput: string | number | "skip") => {
        if (userInput === "skip") {
            engine.submitUserAnswer("skip")
        } else {
            if (inputLayout === "keys" && typeof userInput === "string" && userInput.trim() !== "") {
                engine.submitUserAnswer(Number(userInput))
            } else if (inputLayout === "mcq" && typeof userInput == "number") {
                engine.submitUserAnswer(userInput)
            }
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
        setSelectedOption(null);
        console.log(engine.state);
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
                    <div className="w-full flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                        {/* Title Section */}
                        <div className="text-center pb-2.5 border-b border-border/40">
                            <h2 className="text-2xl font-extrabold tracking-tight capitalize bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">
                                {topic} Practice
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1 leading-normal">
                                Speed test your calculations for {topic}. Select difficulty and beat the clock!
                            </p>
                        </div>                        {/* Difficulty */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Select Difficulty</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {(["easy", "medium", "hard", "all"] as const).map((d) => {
                                    const isSelected = d === engine.state.difficulty;
                                    const label = d === "easy" ? "Easy" : d === "medium" ? "Medium" : d === "hard" ? "Hard" : "All";
                                    return (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => handleDifficultyChange(d)}
                                            className={`rounded-2xl h-10 border-2 font-bold text-xs transition-all duration-200 ease-in-out active:scale-[0.98] cursor-pointer ${
                                                isSelected
                                                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                                                    : "border-border hover:bg-muted/30 text-foreground bg-card"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Practice Mode Selection */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Practice Mode</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Timed Mode Card */}
                                <button
                                    type="button"
                                    onClick={() => handleModeChange("timed")}
                                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 text-center h-24 w-full transition-all duration-200 ease-in-out active:scale-[0.98] outline-none cursor-pointer ${
                                        engine.state.mode === "timed"
                                            ? "border-primary bg-primary/[0.03] text-primary shadow-sm"
                                            : "border-border bg-card hover:bg-muted/50 text-foreground"
                                    }`}
                                >
                                    <div className={`p-1.5 rounded-xl mb-1 transition-all duration-200 ${engine.state.mode === "timed" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={engine.state.mode === "timed" ? "animate-pulse" : ""}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    </div>
                                    <span className="font-bold text-xs">Timed Sprint</span>
                                    <span className="text-[9px] text-muted-foreground mt-0.5 leading-normal">Solve against the clock</span>
                                </button>

                                {/* Freestyle Mode Card */}
                                <button
                                    type="button"
                                    onClick={() => handleModeChange("freestyle")}
                                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 text-center h-24 w-full transition-all duration-200 ease-in-out active:scale-[0.98] outline-none cursor-pointer ${
                                        engine.state.mode === "freestyle"
                                            ? "border-primary bg-primary/[0.03] text-primary shadow-sm"
                                            : "border-border bg-card hover:bg-muted/50 text-foreground"
                                    }`}
                                >
                                    <div className={`p-1.5 rounded-xl mb-1 transition-all duration-200 ${engine.state.mode === "freestyle" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={engine.state.mode === "freestyle" ? "animate-pulse" : ""}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                                    </div>
                                    <span className="font-bold text-xs">Freestyle Run</span>
                                    <span className="text-[9px] text-muted-foreground mt-0.5 leading-normal">Solve at your own pace</span>
                                </button>
                            </div>
                        </div>

                        {/* Mode Specific Limits */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                {engine.state.mode === "timed" ? "Select Time Limit" : "Select Question Limit"}
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {engine.state.mode === "timed" ? [30, 60, 90].map((t) => {
                                    const isSelected = t === engine.state.timeLimit;
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => handleTimerLimitChange(t)}
                                            className={`rounded-2xl h-10 border-2 font-bold text-xs transition-all duration-200 ease-in-out active:scale-[0.98] cursor-pointer ${
                                                isSelected
                                                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                                                    : "border-border hover:bg-muted/30 text-foreground bg-card"
                                            }`}
                                        >
                                            {t}s
                                        </button>
                                    );
                                }) : [10, 20, 30].map((q) => {
                                    const isSelected = q === engine.state.questionLimit;
                                    return (
                                        <button
                                            key={q}
                                            type="button"
                                            onClick={() => handleQuestionLimitChange(q)}
                                            className={`rounded-2xl h-10 border-2 font-bold text-xs transition-all duration-200 ease-in-out active:scale-[0.98] cursor-pointer ${
                                                isSelected
                                                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                                                    : "border-border hover:bg-muted/30 text-foreground bg-card"
                                            }`}
                                        >
                                            {q} Qs
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Input Layout Selection */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Select Input Layout</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setInputLayout("mcq")}
                                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 text-center h-16 w-full transition-all duration-200 ease-in-out active:scale-[0.98] outline-none cursor-pointer ${
                                        inputLayout === "mcq"
                                            ? "border-primary bg-primary/[0.03] text-primary shadow-sm"
                                            : "border-border bg-card hover:bg-muted/50 text-foreground"
                                    }`}
                                >
                                    <span className="font-bold text-xs">Multiple Choice (MCQ)</span>
                                    <span className="text-[9px] text-muted-foreground mt-0.5 leading-normal">Choose from 4 options</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setInputLayout("keys")}
                                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 text-center h-16 w-full transition-all duration-200 ease-in-out active:scale-[0.98] outline-none cursor-pointer ${
                                        inputLayout === "keys"
                                            ? "border-primary bg-primary/[0.03] text-primary shadow-sm"
                                            : "border-border bg-card hover:bg-muted/50 text-foreground"
                                    }`}
                                >
                                    <span className="font-bold text-xs">Numpad (Keyboard)</span>
                                    <span className="text-[9px] text-muted-foreground mt-0.5 leading-normal">Type your answer directly</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2.5 w-full mt-3">
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
                        <div className="flex flex-col gap-2.5 w-full pb-3 border-b border-border/60">
                            {/* Row 1: Left is Topic Title, Right is Score + Quit */}
                            <div className="flex items-center justify-between w-full gap-2 min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                    {engine.state.mode === "timed" ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/80 shrink-0"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/80 shrink-0"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                                    )}
                                    <span className="font-black text-lg sm:text-xl tracking-tight text-foreground leading-tight truncate capitalize">
                                        {topic}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between sm:justify-start gap-2 flex-shrink-0 w-[130px] sm:w-auto">
                                    <div className="flex items-center justify-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-xl text-xs font-bold flex-1 sm:flex-initial">
                                        <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-semibold">Score</span>
                                        <span>{engine.state.score}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowQuitConfirm(true)}
                                        className="text-xs font-semibold text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-full px-3 py-1 border border-transparent hover:border-destructive/30 transition-colors flex-1 sm:flex-initial text-center justify-center"
                                    >
                                        Quit
                                    </button>
                                </div>
                            </div>

                            {/* Row 2: Left is Freestyle/Timed + Difficulty, Right is Layout Switcher */}
                            <div className="flex items-center justify-between w-full gap-2 flex-shrink-0">
                                <div className="flex items-center gap-1.5 pl-[26px] min-w-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                                    <span>{engine.state.mode === "timed" ? "Timed" : "Freestyle"}</span>
                                    <span className="text-muted-foreground/35 font-normal">•</span>
                                    <span className={`font-semibold ${engine.state.difficulty === "easy" ? "text-emerald-600 dark:text-emerald-400" :
                                        engine.state.difficulty === "medium" ? "text-amber-500" :
                                            "text-rose-600 dark:text-rose-400"
                                        }`}>
                                        {engine.state.difficulty}
                                    </span>
                                </div>

                                {/* Compact Layout Switcher */}
                                <div className="flex items-center bg-muted/50 p-0.5 rounded-xl border border-border/40 select-none text-[10px] font-bold w-[130px] sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => setInputLayout("mcq")}
                                        className={`flex-1 sm:flex-initial sm:px-3 py-1 rounded-lg transition-all cursor-pointer text-center ${inputLayout === "mcq"
                                            ? "bg-background text-primary shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        title="MCQ Mode"
                                    >
                                        MCQ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setInputLayout("keys")}
                                        className={`flex-1 sm:flex-initial sm:px-3 py-1 rounded-lg transition-all cursor-pointer text-center ${inputLayout === "keys"
                                            ? "bg-background text-primary shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        title="Keypad Mode"
                                    >
                                        NUM
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Progress Bar */}
                        <div className="w-full flex flex-col gap-1.5">
                            <ProgressBar
                                value={progressPercentage}
                                className="h-1.5 bg-muted/65"
                            />
                            <div className="flex justify-between text-[11px] text-muted-foreground">
                                <span className="font-bold uppercase tracking-wider">Progress</span>
                                <span className="font-bold tracking-wider">{progressText}</span>
                            </div>
                        </div>

                        {/* Central Question Panel */}
                        <div className={`
                            flex flex-col items-center justify-center rounded-2xl py-7 px-4 min-h-[100px] overflow-hidden border transition-all duration-150 ease-in-out select-none
                            ${engine.state.currentAnswerStatus === "correct" ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)] text-emerald-600 dark:text-emerald-400" : ""}
                            ${engine.state.currentAnswerStatus === "wrong" ? "border-rose-500 bg-rose-500/10 dark:bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)] text-rose-600 dark:text-rose-400" : ""}
                            ${engine.state.currentAnswerStatus === "skipped" ? "border-amber-500 bg-amber-500/10 dark:bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)] text-amber-600 dark:text-amber-400" : ""}
                            ${engine.state.currentAnswerStatus === "idle" ? "border-border/80 bg-muted/20" : ""}
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
                                    className="text-4xl sm:text-5xl font-black tracking-tight text-center w-full"
                                >
                                    {engine.state.currentQuestion?.questionText}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <AnimatePresence mode="wait">
                            {inputLayout === "keys" ? (
                                <motion.div
                                    key="numpad"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.15, ease: "easeInOut" }}
                                    className="flex flex-col gap-4 w-full h-[324px] sm:h-[296px]"
                                >
                                    {/* Answer Input Bar */}
                                    <form onSubmit={(e) => { e.preventDefault(); handleEnterSubmit(userInput) }} className="flex gap-2 w-full">
                                        <Input
                                            ref={inputRef}
                                            type="text"
                                            inputMode="none"
                                            placeholder="Type answer..."
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ""))}
                                            className="h-11 sm:h-12 flex-1 rounded-2xl text-center text-base sm:text-lg font-bold border border-input focus-visible:ring-primary/20 bg-background shadow-sm"
                                            autoFocus
                                        />
                                        <Button
                                            type="submit"
                                            className="h-11 sm:h-12 rounded-2xl px-5 sm:px-7 text-xs sm:text-sm font-bold bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground hover:opacity-95 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                                            onClick={() => handleEnterSubmit(userInput)}
                                        >
                                            Enter
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-11 sm:h-12 rounded-2xl px-5 sm:px-7 text-xs sm:text-sm font-semibold border border-border/80 hover:bg-muted hover:border-border text-muted-foreground hover:text-foreground active:scale-[0.98] transition-all cursor-pointer"
                                            onClick={() => handleEnterSubmit("skip")}
                                        >
                                            Skip
                                        </Button>
                                    </form>

                                    {/* Interactive Thumb Keypad (For smooth mobile typing) */}
                                    <div className="grid grid-cols-3 gap-2 p-2 bg-muted/30 border border-border/40 rounded-3xl shadow-inner">
                                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "⌫"].map((btn) => (
                                            <button
                                                key={btn}
                                                type="button"
                                                onClick={() => handleNumClick(btn)}
                                                className={`h-14 sm:h-12 font-extrabold rounded-2xl border transition-all duration-150 ease-out outline-none select-none active:scale-95 cursor-pointer shadow-sm ${btn === "Clear" || btn === "⌫"
                                                    ? "bg-muted text-muted-foreground hover:bg-muted/80 border-border/50 hover:border-primary/20 text-xs sm:text-xs"
                                                    : "bg-card text-foreground hover:bg-muted/40 border-border hover:border-primary/25 text-base sm:text-base"
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
                                    className="flex flex-col gap-4 w-full h-[324px] sm:h-[296px]"
                                >
                                    {/* MCQ Options Grid */}
                                    <div className="grid grid-cols-2 gap-3 mt-1">
                                        {engine?.state?.currentQuestion?.options?.map((option, idx) => {
                                            const isSelected = selectedOption === option;
                                            const status = engine.state.currentAnswerStatus;
                                            let highlightClass = "border-border hover:border-primary bg-card text-foreground hover:bg-muted/30 hover:shadow-sm";
                                            if (isSelected) {
                                                if (status === "correct") {
                                                    highlightClass = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm";
                                                } else if (status === "wrong") {
                                                    highlightClass = "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm";
                                                }
                                            }
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    className={`relative h-[122px] sm:h-[106px] font-extrabold rounded-2xl border transition-all duration-150 ease-out flex items-center justify-center px-4 active:scale-[0.98] cursor-pointer ${highlightClass}`}
                                                    onClick={() => {
                                                        if (engine.state.currentAnswerStatus !== "idle") return;
                                                        setSelectedOption(option);
                                                        handleEnterSubmit(option);
                                                    }}
                                                >
                                                    <span className="absolute top-2.5 left-2.5 sm:top-auto sm:left-4 text-muted-foreground text-[9px] sm:text-[10px] bg-muted px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md select-none font-bold">
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span className="truncate w-full text-center text-lg sm:text-sm font-extrabold tracking-tight">
                                                        {option}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {/* Skip Button for MCQ */}
                                    <div className="flex justify-center items-center h-[52px] sm:h-[56px]">
                                        <button
                                            type="button"
                                            onClick={() => handleEnterSubmit("skip")}
                                            className="text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl px-4 py-2 active:scale-95 transition-all cursor-pointer"
                                        >
                                            Skip Question
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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



                    const getAchievementIcon = (acc: number) => {
                        let Icon = Trophy;
                        let colorClass = "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20";
                        if (acc >= 90) {
                            Icon = Trophy;
                            colorClass = "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20 shadow-[0_4px_12px_rgba(34,197,94,0.08)]";
                        } else if (acc >= 75) {
                            Icon = Award;
                            colorClass = "text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-[0_4px_12px_rgba(249,115,22,0.08)]";
                        } else if (acc >= 50) {
                            Icon = Target;
                            colorClass = "text-yellow-500 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20 shadow-[0_4px_12px_rgba(234,179,8,0.08)]";
                        } else {
                            Icon = Flame;
                            colorClass = "text-red-500 dark:text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_4px_12px_rgba(239,68,68,0.08)]";
                        }

                        return (
                            <div className={`p-3.5 rounded-full border flex items-center justify-center ${colorClass} select-none`}>
                                <Icon className="w-9 h-9" strokeWidth={2.2} />
                            </div>
                        );
                    };

                    return (
                        <div className="w-full flex flex-col items-center text-center gap-4 py-2 animate-in fade-in duration-300">
                            {/* Themed Accomplishment SVG Icon */}
                            {getAchievementIcon(accuracy)}

                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">
                                    Session Completed!
                                </h2>
                                <p className="text-muted-foreground text-xs mt-1.5 font-semibold">
                                    You answered <strong className="text-foreground">{correct}</strong> out of <strong className="text-foreground">{engine.state.attemptedQuestionsCount}</strong> questions correctly.
                                </p>
                                <div className="flex items-center justify-center gap-1.5 mt-2.5 select-none">
                                    <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded-md text-[9px] font-bold uppercase tracking-wider">
                                        🏷️ {topic}
                                    </span>
                                    <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded-md text-[9px] font-bold uppercase tracking-wider">
                                        {engine.state.mode === "timed" ? "⏱️ Timed" : "⚡ Freestyle"}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-wider border ${engine.state.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" :
                                        engine.state.difficulty === "medium" ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20" :
                                            "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                        }`}>
                                        {engine.state.difficulty}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center bg-muted/50 p-1 rounded-2xl border border-border/40 select-none text-xs font-bold w-full max-w-[280px] mb-3">
                                <button
                                    type="button"
                                    onClick={() => setResultsTab("overview")}
                                    className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${resultsTab === "overview"
                                        ? "bg-background text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    Overview
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setResultsTab("review")}
                                    className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${resultsTab === "review"
                                        ? "bg-background text-primary shadow-sm"
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
                                        className="w-full flex flex-col items-center gap-3 h-[270px] justify-center"
                                    >
                                        {/* Performance Encouragement */}
                                        <p className={`text-base font-extrabold mt-0 ${accuracy >= 90 ? "text-green-600 dark:text-green-400" :
                                            accuracy >= 75 ? "text-orange-500 dark:text-orange-400" :
                                                accuracy >= 50 ? "text-yellow-500 dark:text-yellow-400" :
                                                    "text-red-500 dark:text-red-400"
                                            }`}>
                                            {accuracy >= 90 && "Calculated Genius!You completely crushed this session!  🧠 "}
                                            {accuracy >= 75 && accuracy < 90 && "Superb Performance! You are building massive momentum! 🚀 "}
                                            {accuracy >= 50 && accuracy < 75 && "Solid Session!Keep grinding, you are leveling up!  👍 "}
                                            {accuracy < 50 && "Keep Fighting!  Every mistake builds consistency. Let's run it back!  💪 "}
                                        </p>

                                        {/* Centered Circular Accuracy Gauge */}
                                        <div className="relative flex items-center justify-center w-36 h-36 my-0 select-none">
                                            <svg className="w-full h-full transform -rotate-90 relative z-10">
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
                                                    className="stroke-green-500"
                                                    strokeWidth="6"
                                                    fill="transparent"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={strokeDashoffset}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center z-20">
                                                <span className="text-3xl font-extrabold tracking-tight text-foreground">{animatedAccuracy}%</span>
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">Accuracy</span>
                                            </div>
                                        </div>

                                        {/* Metric Grid (3-column layout) */}
                                        <div className="grid grid-cols-3 gap-3 w-full">
                                            {/* Correct Answers */}
                                            <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/[0.03] border border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center min-h-[90px] shadow-sm transition-all">
                                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Correct</span>
                                                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{correct}</span>
                                            </div>

                                            {/* Incorrect Answers */}
                                            <div className="p-4 bg-rose-500/5 dark:bg-rose-500/[0.03] border border-rose-500/20 rounded-2xl flex flex-col items-center justify-center min-h-[90px] shadow-sm transition-all">
                                                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider mb-1">Wrong</span>
                                                <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">{wrong}</span>
                                            </div>

                                            {/* Skipped Answers */}
                                            <div className="p-4 bg-amber-500/5 dark:bg-amber-500/[0.03] border border-amber-500/20 rounded-2xl flex flex-col items-center justify-center min-h-[90px] shadow-sm transition-all">
                                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">Skipped</span>
                                                <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{skipped}</span>
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
                                        className="w-full flex flex-col h-[270px] text-left font-sans"
                                    >
                                        <div className="w-full border border-border rounded-2xl overflow-hidden bg-card shadow-sm h-full">
                                            <div className="h-full overflow-y-auto divide-y divide-border/60">
                                                {engine.state.history.map((item, idx) => {
                                                    const isCorrect = item.status === "correct";
                                                    const isWrong = item.status === "wrong";
                                                    const isSkipped = item.status === "skipped";

                                                    return (
                                                        <div key={idx} className="flex items-center justify-between p-3.5 text-xs">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="font-extrabold text-sm text-foreground">{item.questionText}</span>
                                                                <span className="text-[10px] text-muted-foreground">
                                                                    Correct: <strong className="text-foreground">{item.correctAnswer}</strong>
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <div className="flex flex-col items-end gap-0.5">
                                                                    <span className={`font-bold ${isCorrect ? "text-emerald-500" :
                                                                        isWrong ? "text-rose-500" : "text-amber-500"
                                                                        }`}>
                                                                        {isSkipped ? "Skipped" : `Your Answer: ${item.userAnswer}`}
                                                                    </span>
                                                                    <span className={`text-[10px] font-semibold ${
                                                                        (item.timeTaken ?? 0) >= 3000
                                                                            ? "text-rose-500 dark:text-rose-400"
                                                                            : "text-emerald-500 dark:text-emerald-400"
                                                                    }`}>
                                                                        ⏱️ {((item.timeTaken ?? 0) / 1000).toFixed(1)}s
                                                                    </span>
                                                                </div>

                                                                {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                                                                {isWrong && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                                                                {isSkipped && <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                           

                            {/* Action buttons */}
                            <div className="flex gap-2.5 w-full mt-4">
                                <Button
                                    onClick={engine.resetSession}
                                    className="flex-[1.5] h-12 rounded-2xl font-bold text-sm bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 text-primary-foreground transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
                                >
                                    ⚡ Practice Again
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setResultsTab("overview");
                                        router.push("/SSC/maths/mental-maths");
                                    }}
                                    className="flex-1 h-12 rounded-2xl font-semibold border-border/80 text-muted-foreground hover:text-foreground active:scale-[0.99] transition-all cursor-pointer"
                                >
                                    Back
                                </Button>
                            </div>
                        </div>
                    );
                })()}

            </div>

            <AlertDialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
                <AlertDialogContent className="rounded-3xl w-[calc(100%-2rem)] sm:w-full max-w-sm border border-border">
                    <AlertDialogHeader className="pb-3 border-b border-border/40">
                        <AlertDialogTitle className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                            Quit Practice Session?
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed mt-4">
                        Your current progress and score of <strong className="text-foreground">{engine.state.score}</strong> will be reset.
                    </AlertDialogDescription>
                    <AlertDialogFooter className="flex-row gap-2 mt-4 sm:justify-end">
                        <AlertDialogCancel
                            className="flex-1 sm:flex-none h-11 rounded-2xl text-sm font-semibold border-border/85 hover:bg-muted"
                            onClick={() => setShowQuitConfirm(false)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="flex-1 sm:flex-none h-11 rounded-2xl text-sm font-bold border border-red-200 dark:border-red-900/40 bg-transparent text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
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
