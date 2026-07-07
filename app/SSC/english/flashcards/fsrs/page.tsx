"use client"
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { useGetStudyDeckQuery } from "@/redux/FlashcardApiSlice";
import Loader from "@/components/custom/loader";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const FsrsPage = () => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { data, isLoading, isError } = useGetStudyDeckQuery(undefined, {
        skip: !user
    });

    if (isAuthLoading) return <Loader size="lg" text="Checking auth session..." className="min-h-[300px]" />

    if (!user) {
        return (
            <div className="flex flex-col items-center w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6 text-center max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">
                        Study Mode
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Master SSC vocabulary through spaced repetition.
                    </p>
                </div>

                <div className="w-[375px] md:w-[500px] mx-auto transition-all duration-300 ease-in-out animate-in fade-in">
                    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[320px] rounded-3xl bg-card border border-border shadow-sm">
                        <span className="text-5xl mb-4 select-none animate-pulse">🔒</span>
                        <h3 className="text-lg font-bold text-foreground mb-1.5">Sign In Required</h3>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
                            Spaced repetition tracks your learning history and schedules reviews dynamically. Sign in to start your personalized study session!
                        </p>
                        <Link href="/signin">
                            <Button className="h-10 px-5 text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 hover:cursor-pointer flex items-center gap-2">
                                <LogIn className="w-4 h-4" />
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) return <Loader size="lg" text="Syncing study deck..." className="min-h-[300px]" />
    if (isError) return <p className="text-center text-red-500 font-semibold mt-4">Error loading study deck. Please try again later.</p>

    return (
        <div className="flex flex-col items-center w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6 text-center px-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">
                    Study Mode
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Master SSC vocabulary through spaced repetition.
                </p>
            </div>
            {data?.length > 0 ? <FlashcardDeck deck={data} isLinear={false} mode="study" /> : <p className="text-center font-medium text-slate-500 dark:text-slate-400 mt-4">No study cards available today! 🎉</p>}
        </div>
    )
}

export default FsrsPage;