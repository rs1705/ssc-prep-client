"use client"
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { useGetStudyDeckQuery } from "@/redux/FlashcardApiSlice";
const FsrsPage = () => {
    const { data, isLoading, isError } = useGetStudyDeckQuery();
    console.log(data);
    return (
        <div>
            <h1>FSRS</h1>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error loading study deck</p>}
            <FlashcardDeck deck={data?.deck} />
        </div>
    )
}

export default FsrsPage;