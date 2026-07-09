"use client"
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { useGetStudyDeckQuery } from "@/redux/FlashcardApiSlice";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
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
            <TopicPageLayout
                title="Study Mode"
                description="Master SSC vocabulary through spaced repetition."
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
    if (isError) return <p className="text-center text-red-500 font-semibold mt-4">Error loading study deck. Please try again later.</p>

    return (
        <TopicPageLayout
            title="Study Mode"
            description="Master SSC vocabulary through spaced repetition."
        >
            {data?.length > 0 ? <FlashcardDeck deck={data} isLinear={false} mode="study" /> : <p className="text-center font-medium text-slate-500 dark:text-slate-400 mt-4">No study cards available today! 🎉</p>}
        </TopicPageLayout>
    )
}

export default FsrsPage;