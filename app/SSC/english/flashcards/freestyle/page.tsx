"use client";

import { PageLoader } from "@/components/custom/page-loader";
import { cn } from "@/lib/utils";
import { CTA, DUO } from "@/features/games/buttons";
import { GAME_TONE } from "@/features/games/tone";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
//ui imports
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useGetFilteredCardsQuery } from "@/redux/FlashcardApiSlice";
import Loader from "@/components/custom/loader";
import ErrorState from "@/components/custom/error-state";

//custom imports
import { resetFilter, TabFilter, updateFilter } from "@/redux/FilterSlice";
import { RootState } from "@/redux/store";
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { MAIN_FILTERS, TABS } from "@/lib/english_filters";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Flame, LogOut, SlidersHorizontal, X, Shuffle } from "lucide-react";
import { freestyleSpotKey } from "@/features/flashcards/resume";

const TAB_LABEL: Record<string, string> = { vocab: "Vocab", idiom: "Idioms", ows: "One-word" };
const FILTER_LABEL: Record<string, string> = { exam: "Exam", year: "Year asked", difficulty: "Difficulty" };

/** "ssc cgl" → "SSC CGL", "easy" → "Easy", "all" → "All". */
function filterValueLabel(val: string): string {
  if (val === "all") return "All";
  if (/^ssc /.test(val)) return val.toUpperCase();
  return val.charAt(0).toUpperCase() + val.slice(1);
}

const FreestylePage = () => {
  const filterStore = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("vocab");
  const [draftFilters, setDraftFilters] = useState(filterStore[activeTab]);
  const [open, setOpen] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const router = useRouter();

  const handleSelectChange = (key: string, value: string) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterSetClick = () => {
    dispatch(updateFilter({ tab: activeTab, filter: draftFilters }));
    setOpen(false);
  };

  const handleFilterResetClick = () => {
    dispatch(resetFilter({ tab: activeTab }));
    setOpen(false);
  };

  const { data, isLoading, isFetching, isError, refetch } =
    useGetFilteredCardsQuery(filterStore[activeTab]);

  useEffect(() => {
    setDraftFilters(filterStore[activeTab]);
  }, [filterStore, activeTab]);

  useEffect(() => {
    const savedAlphabet = localStorage.getItem(
      `freestyle_alphabet_${activeTab}`,
    );
    if (savedAlphabet && savedAlphabet !== filterStore[activeTab]?.alphabet) {
      dispatch(
        updateFilter({ tab: activeTab, filter: { alphabet: savedAlphabet } }),
      );
    }
  }, [dispatch, activeTab, filterStore]);

  const [shuffled, setShuffled] = useState(false);
  const [position, setPosition] = useState({ current: 1, total: 0 });
  const onPosition = useCallback(
    (current: number, total: number) => setPosition({ current, total }),
    [],
  );
  const currentCardNumber = position.current;
  const applied = filterStore[activeTab];
  const activeFilterCount =
    (["exam", "year", "difficulty"] as const).filter((k) => applied?.[k] && applied[k] !== "all").length +
    (applied?.highFrequency ? 1 : 0);
  const totalCards = position.total;

  return (
    <>
      <TopicPageLayout contentMaxWidthClass="w-full max-w-sm sm:max-w-md md:max-w-[480px]" hideBreadcrumbs={true} centerContent={false}>
      <Tabs
        defaultValue={activeTab}
        onValueChange={(val) => setActiveTab(val)}
        className="flex flex-col items-center w-full transition-all duration-300"
      >
        {/* Control panel: header, deck tabs, letter, shuffle, filters, progress */}
        <div className="flex w-full flex-col gap-3 surface-card rounded-3xl p-3 sm:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setShowQuitConfirm(true)}
              aria-label="Leave flashcards"
              title="Leave"
              className={DUO.icon}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-base font-extrabold text-foreground sm:text-lg">Flashcards</h1>
              <p className="truncate text-xs font-semibold text-fuchsia-800 dark:text-fuchsia-300">
                Freestyle · {TAB_LABEL[activeTab] ?? activeTab}
              </p>
            </div>
          </div>

          {!isError && (
            <>
              <div className="flex w-full items-center gap-2">
                <TabsList className="!h-11 flex-1 rounded-2xl border-2 border-border bg-muted p-1">
                  {TABS.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="h-full flex-1 rounded-xl text-xs font-extrabold text-muted-foreground transition-colors hover:cursor-pointer hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-fuchsia-800 data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:text-fuchsia-200"
                    >
                      {TAB_LABEL[tab] ?? tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Jump to a letter */}
                <Select
                  value={filterStore[activeTab]?.alphabet || "a"}
                  onValueChange={(val) => {
                    dispatch(updateFilter({ tab: activeTab, filter: { alphabet: val } }));
                    localStorage.setItem(`freestyle_alphabet_${activeTab}`, val);
                  }}
                >
                  <SelectTrigger
                    aria-label="Starting letter"
                    className="!h-11 w-14 shrink-0 justify-center gap-1 rounded-2xl border-2 border-b-4 border-border bg-card px-2 text-sm font-extrabold uppercase shadow-none hover:cursor-pointer hover:bg-muted [&>svg]:h-3.5 [&>svg]:w-3.5"
                  >
                    <SelectValue placeholder="A" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] rounded-2xl">
                    {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
                      <SelectItem key={letter} value={letter} className="text-sm font-bold uppercase">
                        {letter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-pressed={shuffled}
                  onClick={() => setShuffled((v) => !v)}
                  title={shuffled ? "Back to A-Z order" : "Shuffle the cards"}
                  className={cn(
                    DUO.option,
                    "flex min-h-11 flex-1 items-center justify-center gap-2 px-3 text-sm font-extrabold",
                    shuffled ? GAME_TONE.english.selected : DUO.idle,
                  )}
                >
                  <Shuffle className="h-4 w-4" aria-hidden="true" />
                  {shuffled ? "Shuffled" : "A–Z order"}
                </button>

                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        DUO.option,
                        "flex min-h-11 flex-1 items-center justify-center gap-2 px-3 text-sm font-extrabold",
                        activeFilterCount > 0 ? GAME_TONE.english.selected : DUO.idle,
                      )}
                    >
                      <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-600 px-1.5 text-[11px] font-black tabular-nums text-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col gap-0 rounded-t-3xl border-2 border-b-0 p-0"
                  >
                    <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-border" aria-hidden="true" />
                    <SheetHeader className="px-5 pb-3 pt-3 text-left">
                      <SheetTitle className="text-xl font-extrabold tracking-tight">Filter cards</SheetTitle>
                      <SheetDescription className="text-sm">
                        Pick which {TAB_LABEL[activeTab]?.toLowerCase() ?? ""} cards to practice.
                      </SheetDescription>
                    </SheetHeader>

                    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-4 [scrollbar-width:none]">
                      {(Object.entries(MAIN_FILTERS) as [keyof typeof FILTER_LABEL, string[]][]).map(([key, values]) => {
                        const current = (draftFilters[key as keyof TabFilter] as string | undefined) ?? "all";
                        return (
                          <section key={key} className="flex flex-col gap-2">
                            <h3 className="section-label">{FILTER_LABEL[key] ?? key}</h3>
                            <div role="group" aria-label={FILTER_LABEL[key] ?? key} className="flex flex-wrap gap-2">
                              {["all", ...values].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  aria-pressed={current === val}
                                  onClick={() => handleSelectChange(key, val)}
                                  className={cn(
                                    DUO.option,
                                    "min-h-10 px-3.5 text-sm font-bold",
                                    current === val ? GAME_TONE.english.selected : DUO.idle,
                                  )}
                                >
                                  {filterValueLabel(val)}
                                </button>
                              ))}
                            </div>
                          </section>
                        );
                      })}

                      <button
                        type="button"
                        role="switch"
                        aria-checked={draftFilters.highFrequency ?? false}
                        onClick={() => setDraftFilters((prev) => ({ ...prev, highFrequency: !prev.highFrequency }))}
                        className={cn(
                          DUO.option,
                          "flex items-center gap-3 px-4 py-3 text-left",
                          draftFilters.highFrequency ? GAME_TONE.english.selected : DUO.idle,
                        )}
                      >
                        <Flame className="h-5 w-5 shrink-0 text-fuchsia-600 dark:text-fuchsia-400" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-extrabold">Most asked words only</span>
                          <span className="block text-xs font-medium text-muted-foreground">
                            Words that come up often in SSC papers
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                            draftFilters.highFrequency ? "bg-fuchsia-600" : "bg-muted-foreground/30",
                          )}
                        >
                          <span
                            className={cn(
                              "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-[left]",
                              draftFilters.highFrequency ? "left-6" : "left-1",
                            )}
                          />
                        </span>
                      </button>
                    </div>

                    <SheetFooter className="mt-0 flex-row gap-2.5 border-t-2 border-border px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                      <button type="button" onClick={handleFilterResetClick} className={cn(DUO.secondary, "min-h-12 flex-1 px-3")}>
                        Clear all
                      </button>
                      <button type="button" onClick={handleFilterSetClick} className={cn(DUO.primary, "min-h-12 flex-[2] px-3")}>
                        Show cards
                      </button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              {totalCards > 0 && (
                <div className="flex items-center gap-3 px-0.5">
                  <ProgressBar
                    value={(currentCardNumber / totalCards) * 100}
                    label="Cards seen"
                    className="h-3 flex-1 p-0"
                    barClassName="bg-gradient-to-r from-fuchsia-400 to-fuchsia-600"
                  />
                  <span className="shrink-0 font-mono text-xs font-black tabular-nums text-muted-foreground">
                    {currentCardNumber}/{totalCards}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Flashcard Deck Area */}
        <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[360px] sm:min-h-[420px]">
          {isLoading ? (
            <PageLoader text="Loading flashcards" />
          ) : isError ? (
            <div className="flex flex-1 justify-center items-center min-h-[350px] p-6 w-full">
              <ErrorState
                title="Failed to Load Flashcards"
                description="We encountered an issue while loading your vocabulary practice cards. Please try again."
                onRetry={refetch}
              />
            </div>
          ) : (
            <>
              <div
                className={`transition-all duration-300 w-full ${isFetching ? "opacity-40 pointer-events-none grayscale-[0.2]" : "opacity-100"}`}
              >
                <FlashcardDeck
                  deck={data ?? []}
                  resetKey={activeTab}
                  shuffled={shuffled}
                  mode="freestyle"
                  onPosition={onPosition}
                  rememberKey={freestyleSpotKey(activeTab, filterStore[activeTab])}
                />
              </div>

              {/* Absolute Loading Overlay during fetches */}
              {isFetching && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex items-center justify-center pointer-events-none">
                  <div className="surface-card rounded-3xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:p-6">
                    <Loader text="Updating cards" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Tabs>
    </TopicPageLayout>

    <AlertDialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
      <AlertDialogContent className="max-w-sm rounded-3xl p-5 sm:p-6">
        <AlertDialogHeader className="items-center text-center">
          <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--color-fuchsia-500)_14%,var(--card))] text-fuchsia-700 dark:text-fuchsia-300">
            <LogOut className="h-7 w-7" aria-hidden="true" />
          </div>
          <AlertDialogTitle className="text-xl font-extrabold">Leave flashcards?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">
            Your place is saved, so you can pick up from this card next time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 flex-col gap-2.5 sm:flex-col">
          <AlertDialogCancel className={cn(CTA.primary, "m-0 h-auto border-brand-700 hover:text-white")}>Keep going</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setShowQuitConfirm(false);
              router.push("/SSC/english/flashcards");
            }}
            className={cn(CTA.secondary, "m-0 h-auto")}
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};
export default FreestylePage;
