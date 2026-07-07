"use client"
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { useGetStudyDeckQuery } from "@/redux/FlashcardApiSlice";
import Loader from "@/components/custom/loader";
const FsrsPage = () => {
    const { data, isLoading, isError } = useGetStudyDeckQuery();

    if (isLoading) return <Loader size="lg" text="Syncing study deck..." className="min-h-[300px]" />
    if (isError) return <p className="text-center">Error...</p>

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
            {data?.length > 0 ? <FlashcardDeck deck={data} isLinear={false} mode="study" /> : <p>No study cards available today! 🎉</p>}
        </div>
    )
}

export default FsrsPage;