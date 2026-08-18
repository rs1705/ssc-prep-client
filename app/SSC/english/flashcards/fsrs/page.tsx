"use client";
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetStudyDeckQuery } from "@/redux/FlashcardApiSlice";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import Loader from "@/components/custom/loader";
import ErrorState from "@/components/custom/error-state";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, BookOpen, AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProgressBar } from "@/components/custom/ProgressBar";

const FsrsPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data, isLoading, isError, refetch } = useGetStudyDeckQuery(
    undefined,
    {
      skip: !user,
    },
  );

  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  
  const { currentCardId } = useSelector((state: RootState) => state.session);
  const currentIndex = data ? data.findIndex((card: any) => card._id === currentCardId) : -1;
  const currentCardNumber = currentIndex >= 0 ? currentIndex + 1 : 1;
  const totalCards = data ? data.length : 0;
  const router = useRouter();

  if (isAuthLoading) {
    return (
      <TopicPageLayout hideBreadcrumbs={true} centerContent={true}>
        <div className="flex-1 w-full h-full min-h-[50dvh] flex flex-col items-center justify-center">
          <Loader
            size="lg"
            text="Checking auth session..."
          />
        </div>
      </TopicPageLayout>
    );
  }

  if (!user) {
    return (
      <TopicPageLayout hideBreadcrumbs={true} centerContent={true}>
        <div className="w-full max-w-[500px] mx-auto transition-all duration-300 ease-in-out animate-in fade-in">
          <div className="flex flex-col items-center justify-center text-center p-8 min-h-[320px] rounded-3xl bg-card border-2 border-border shadow-sm">
            <span className="text-5xl mb-4 select-none animate-pulse">🔒</span>
            <h3 className="text-lg font-bold text-foreground mb-1.5">
              Sign In Required
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
              Spaced repetition tracks your learning history and schedules
              reviews dynamically. Sign in to start your personalized study
              session!
            </p>
            <Link href="/signin">
              <Button className="h-10 px-6 text-xs font-mono font-bold tracking-wider uppercase rounded-full shadow-xs hover:shadow-md hover:shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-orange-500 text-white active:scale-95 transition-all hover:cursor-pointer border-0 flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </TopicPageLayout>
    );
  }

  return (
    <>
      <TopicPageLayout contentMaxWidthClass="w-full max-w-sm sm:max-w-md md:max-w-[480px]" hideBreadcrumbs={true} centerContent={false}>
      <div className="flex flex-col items-center w-full transition-all duration-300">
        {/* Compact Gameplay Stats Header Bar */}
        <div className="flex flex-col gap-1 w-full bg-card/95 md:bg-card/60 backdrop-blur-xl border-2 border-border/60 rounded-2xl p-2.5 sm:p-3 mb-1 shadow-xs">
          {/* Row 1: Left is Section Title & Mode, Right is Quit Button */}
          <div className="flex items-center justify-between w-full gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen
                className="w-4 h-4 text-violet-500 dark:text-violet-400 shrink-0"
                fill="currentColor"
                fillOpacity={0.15}
              />
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-foreground uppercase">
                Flashcards
              </span>
              <span className="text-muted-foreground/40 font-normal text-xs">•</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Daily Review
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowQuitConfirm(true)}
              className="h-7 w-7 rounded-full flex items-center justify-center bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all cursor-pointer flex-shrink-0 border-none outline-none"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Progress Bar Container */}
          {totalCards > 0 && !isLoading && !isError && (
            <div className="w-full mt-3 mb-2 flex flex-col gap-1.5 px-1">
              <div className="w-full flex justify-between items-end mb-0.5">
                <span className="text-[9px] font-bold tracking-wider text-muted-foreground select-none">
                  PROGRESS
                </span>
                <span className="text-[9px] font-bold tracking-wider text-muted-foreground select-none font-mono">
                  {currentCardNumber} / {totalCards}
                </span>
              </div>
              <ProgressBar
                value={(currentCardNumber / totalCards) * 100}
                barClassName="bg-gradient-to-r from-amber-500 to-orange-500"
              />
            </div>
          )}
        </div>

        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[360px] sm:min-h-[420px]">
          {isLoading ? (
            <div className="flex-1 w-full h-full min-h-[45dvh] flex flex-col items-center justify-center py-8">
              <Loader
                size="lg"
                text="Syncing study deck..."
              />
            </div>
          ) : isError ? (
            <div className="flex flex-1 justify-center items-center min-h-[350px] p-6 w-full">
              <ErrorState
                title="Failed to Load Study Deck"
                description="We encountered an issue syncing your spaced repetition study deck. Please try again."
                onRetry={refetch}
              />
            </div>
          ) : data?.length > 0 ? (
            <FlashcardDeck deck={data} isLinear={false} mode="study" />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[220px] p-6 text-center">
              <p className="text-center font-medium text-muted-foreground">
                No study cards available today! 🎉
              </p>
            </div>
          )}
        </div>
      </div>
    </TopicPageLayout>
    
      <AlertDialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
        <AlertDialogContent className="sm:w-full max-w-sm border-2 border-border">
          <AlertDialogHeader className="pb-3 border-b-2 border-border/40">
            <AlertDialogTitle className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              Quit Flashcards?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed mt-4">
            Are you sure you want to quit? You will return to the flashcards menu.
          </AlertDialogDescription>
          <AlertDialogFooter className="flex-row gap-2 mt-4 sm:justify-end">
            <AlertDialogCancel
              className="flex-1 sm:flex-none h-11 rounded-2xl text-sm font-semibold border-border/85 hover:bg-muted"
              onClick={() => setShowQuitConfirm(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 sm:flex-none h-11 rounded-2xl text-sm font-bold border-2 border-destructive/40 bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all shadow-sm"
              onClick={() => {
                setShowQuitConfirm(false);
                router.push("/SSC/english/flashcards");
              }}
            >
              Yes, Quit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FsrsPage;
