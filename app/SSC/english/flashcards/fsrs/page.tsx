"use client"
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { useGetStudyDeckQuery } from "@/redux/FlashcardApiSlice";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import Loader from "@/components/custom/loader";
import ErrorState from "@/components/custom/error-state";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, BookOpen } from "lucide-react";

const FsrsPage = () => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { data, isLoading, isError, refetch } = useGetStudyDeckQuery(undefined, {
        skip: !user
    });

    if (isAuthLoading) return <Loader size="lg" text="Checking auth session..." className="min-h-[300px]" />

    if (!user) {
        return (
            <TopicPageLayout
                hideBreadcrumbs={true}
                centerContent={true}
            >
                <div className="w-full px-4 min-[375px]:w-[375px] min-[375px]:px-0 mx-auto transition-all duration-300 ease-in-out animate-in fade-in">
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
            </TopicPageLayout>
        );
    }

    if (isLoading) return <Loader size="lg" text="Syncing study deck..." className="min-h-[300px]" />
    
    if (isError) {
        return (
            <TopicPageLayout
                hideBreadcrumbs={true}
                centerContent={true}
            >
                <div className="flex justify-center items-center min-h-[350px] p-6 w-full">
                    <ErrorState 
                        title="Failed to Load Study Deck"
                        description="We encountered an issue syncing your spaced repetition study deck. Please try again."
                        onRetry={refetch}
                    />
                </div>
            </TopicPageLayout>
        );
    }

    return (
        <TopicPageLayout
            hideBreadcrumbs={true}
            centerContent={true}
        >
            <div className="flex justify-center flex-col w-full mx-auto">
                {/* Compact Gameplay Stats Header Bar */}
                <div className="flex flex-col gap-2 w-full pb-2 border-b border-border/60 mb-3 px-4 min-[375px]:w-[375px] min-[375px]:px-0 md:w-[500px] mx-auto">
                    {/* Row 1: Left is Section Title, Right is Quit Button */}
                    <div className="flex items-center justify-between w-full gap-2 min-w-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <BookOpen className="w-[18px] h-[18px] text-primary/80 shrink-0" fill="currentColor" fillOpacity={0.1} />
                            <span className="font-black text-lg sm:text-xl tracking-tight text-foreground leading-normal uppercase">
                                Flashcards
                            </span>
                        </div>
                        <Link href="/SSC/english/flashcards">
                            <button
                                type="button"
                                className="text-xs font-bold text-destructive hover:bg-destructive/10 rounded-full px-2.5 py-1 transition-all active:scale-95 cursor-pointer flex-shrink-0"
                            >
                                Quit
                            </button>
                        </Link>
                    </div>

                    {/* Row 2: Left is active mode details */}
                    <div className="flex items-center justify-between w-full gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1.5 pl-[26px] min-w-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                            <span>Study Mode</span>
                            <span className="text-muted-foreground/35 font-normal">•</span>
                            <span className="font-semibold text-primary">Daily Review</span>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    {data?.length > 0 ? <FlashcardDeck deck={data} isLinear={false} mode="study" /> : <p className="text-center font-medium text-slate-500 dark:text-slate-400 mt-4">No study cards available today! 🎉</p>}
                </div>
            </div>
        </TopicPageLayout>
    )
}

export default FsrsPage;