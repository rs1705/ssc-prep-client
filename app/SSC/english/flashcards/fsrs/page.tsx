"use client"
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { useGetStudyDeckQuery } from "@/redux/FlashcardApiSlice";
const FsrsPage = () => {
    const { data, isLoading, isError } = useGetStudyDeckQuery();

    if (isLoading) return <p className="text-center">Loading...</p>
    if (isError) return <p className="text-center">Error...</p>

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-2 text-center space-y-2 px-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 shadow-sm inline-block">
                    Study Mode
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">
                    Study Mode
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Master SSC vocabulary through spaced repetition.
                </p>
            </div>
            {data?.length > 0 ? <FlashcardDeck deck={data} isLinear={false} mode="study" /> : <p>No study cards available today! 🎉</p>}
        </div>
    )
}

export default FsrsPage;