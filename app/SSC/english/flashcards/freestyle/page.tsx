"use client";

import { cn } from "@/lib/utils";
import { DUO } from "@/features/games/buttons";
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
import { Label } from "@/components/ui/label";
import { useGetFilteredCardsQuery } from "@/redux/FlashcardApiSlice";
import Loader from "@/components/custom/loader";
import ErrorState from "@/components/custom/error-state";

//custom imports
import { resetFilter, TabFilter, updateFilter } from "@/redux/FilterSlice";
import { RootState } from "@/redux/store";
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { MAIN_FILTERS, TABS } from "@/lib/english_filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersVertical, Dices, AlertTriangle, X, Shuffle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  const totalCards = position.total;

  return (
    <>
      <TopicPageLayout contentMaxWidthClass="w-full max-w-sm sm:max-w-md md:max-w-[480px]" hideBreadcrumbs={true} centerContent={false}>
      <Tabs
        defaultValue={activeTab}
        onValueChange={(val) => setActiveTab(val)}
        className="flex flex-col items-center w-full transition-all duration-300"
      >
        {/* Control Panel Container */}
        <div className="flex flex-col gap-1 w-full surface-card rounded-2xl p-2.5 sm:p-3 shadow-xs">
          {/* Header Row: Title + Mode on Left, Quit on Right */}
          <div className="flex items-center justify-between w-full gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Dices
                className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400 shrink-0"
                fill="currentColor"
                fillOpacity={0.15}
              />
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-foreground uppercase">
                Flashcards
              </span>
              <span className="text-muted-foreground/40 font-normal text-xs">•</span>
              <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-700 dark:text-fuchsia-400">
                {activeTab}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowQuitConfirm(true)}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted border-2 border-border active:scale-95 transition-all cursor-pointer shrink-0"
              title="Quit"
              aria-label="Quit session"
            >
              <X className="w-4 h-4" strokeWidth={2.2} />
            </button>
          </div>

          {/* Tabs & Filters Dialog */}
          {!isError && (
            <>
              <div className="flex flex-row items-center gap-1.5 sm:gap-2 w-full mt-0.5">
                <TabsList className="flex-1 !h-8 sm:!h-9 bg-[color-mix(in_oklab,var(--muted)_60%,var(--card))] border-2 border-border p-0.5 sm:p-1 rounded-lg sm:rounded-xl shadow-2xs">
                  {TABS.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="flex-1 h-full hover:cursor-pointer hover:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-2xs rounded-md sm:rounded-lg transition-all duration-200 font-bold uppercase text-xs sm:text-xs text-muted-foreground data-[state=active]:text-foreground"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Jump to Letter */}
                <Select
                  value={filterStore[activeTab]?.alphabet || "a"}
                  onValueChange={(val) => {
                    dispatch(
                      updateFilter({
                        tab: activeTab,
                        filter: { alphabet: val },
                      }),
                    );
                    localStorage.setItem(`freestyle_alphabet_${activeTab}`, val);
                  }}
                >
                  <SelectTrigger className="w-10 sm:w-12 !h-8 sm:!h-9 rounded-lg sm:rounded-xl px-0 sm:px-1.5 flex justify-center items-center text-xs font-bold uppercase shadow-2xs bg-background border-border hover:cursor-pointer">
                    <SelectValue placeholder="A" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
                      <SelectItem
                        key={letter}
                        value={letter}
                        className="uppercase font-semibold text-xs"
                      >
                        {letter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <button
                  type="button"
                  aria-pressed={shuffled}
                  onClick={() => setShuffled((v) => !v)}
                  title={shuffled ? "Back to A-Z order" : "Shuffle the cards"}
                  aria-label="Shuffle cards"
                  className={`flex h-8 w-9 shrink-0 items-center justify-center rounded-lg border-2 transition-colors sm:h-9 sm:rounded-xl ${
                    shuffled
                      ? "border-brand-600 bg-brand-600 text-on-brand"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Shuffle className="h-3.5 w-3.5" />
                </button>

                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-8 sm:h-9 hover:cursor-pointer border-border shadow-2xs hover:bg-[color-mix(in_oklab,var(--muted)_50%,var(--card))] transition-all rounded-lg sm:rounded-xl px-2 sm:px-2.5 flex items-center gap-1"
                    >
                      <SlidersVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="font-semibold text-xs sm:text-xs text-foreground hidden min-[400px]:inline">
                        Filters
                      </span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="flex flex-col h-full p-6">
                    <SheetHeader className="text-left border-b-2 border-border/40 pb-4 mb-4">
                      <SheetTitle className="text-xl font-bold tracking-tight">
                        Filter Cards
                      </SheetTitle>
                      <SheetDescription>
                        Refine vocabulary cards by category, starting letter,
                        and frequency.
                      </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto scrollbar-none px-1">
                      {Object.entries(MAIN_FILTERS)
                        .filter(([k]) => k !== "highFrequency")
                        .map(([key, values]) => (
                          <div key={key} className="flex flex-col gap-1.5 mb-5">
                            <Label
                              htmlFor={key}
                              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                              {key === "category"
                                ? "Category"
                                : key === "letter"
                                  ? "Starting Letter"
                                  : key.toUpperCase()}
                            </Label>

                            <Select
                              value={
                                draftFilters[
                                  key as keyof Omit<TabFilter, "highFrequency">
                                ]
                              }
                              onValueChange={(val) =>
                                handleSelectChange(key, val)
                              }
                            >
                              <SelectTrigger
                                id={key}
                                className="w-full h-11 bg-background border-border rounded-md shadow-xs font-semibold hover:cursor-pointer focus:ring-1 focus:ring-inset focus:ring-primary"
                              >
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>

                              <SelectContent className="font-semibold rounded-md">
                                <SelectItem value="all">All</SelectItem>
                                {values.map((val) => (
                                  <SelectItem key={val} value={val}>
                                    {val.toUpperCase()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}

                      <div className="flex items-center justify-between p-4 rounded-lg bg-[color-mix(in_oklab,var(--accent)_20%,var(--card))] border-2 border-border my-6 shadow-xs">
                        <div className="flex flex-col gap-0.5 pr-2">
                          <Label
                            htmlFor="highFrequency"
                            className="font-semibold text-sm text-foreground cursor-pointer select-none"
                          >
                            High Frequency Cards
                          </Label>
                          <span className="text-xs text-muted-foreground leading-normal">
                            Only show words frequently asked in SSC exams.
                          </span>
                        </div>
                        <Checkbox
                          id="highFrequency"
                          checked={draftFilters.highFrequency ?? false}
                          onCheckedChange={(val: boolean) =>
                            setDraftFilters((prev) => ({
                              ...prev,
                              highFrequency: val,
                            }))
                          }
                          className="h-5 w-5 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground hover:cursor-pointer"
                        />
                      </div>
                    </div>

                    <SheetFooter className="mt-auto pt-4 border-t-2 border-border/40 flex-row gap-3">
                      <Button
                        className={cn(DUO.secondary, "flex-1")}
                        variant="outline"
                        onClick={handleFilterResetClick}
                      >
                        Clear Filters
                      </Button>
                      <Button
                        className={cn(DUO.primary, "flex-1")}
                        onClick={handleFilterSetClick}
                      >
                        Apply Filters
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Progress Bar Container */}
              {totalCards > 0 && (
                <div className="w-full mt-3 mb-2 flex flex-col gap-1.5 px-1">
                  <div className="w-full flex justify-between items-end mb-0.5">
                    <span className="text-xs font-bold tracking-wider text-muted-foreground select-none">
                      {shuffled ? "SHUFFLED" : "PROGRESS"}
                    </span>
                    <span className="text-xs font-bold tracking-wider text-muted-foreground select-none font-mono">
                      {currentCardNumber} / {totalCards}
                    </span>
                  </div>
                  <ProgressBar
                    value={(currentCardNumber / totalCards) * 100}
                    barClassName="bg-gradient-to-r from-brand-500 to-brand-alt-500"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Flashcard Deck Area */}
        <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[360px] sm:min-h-[420px]">
          {isLoading ? (
            <div className="flex-1 w-full h-full min-h-[45dvh] flex flex-col justify-center items-center py-8">
              <Loader size="lg" text="Loading flashcards..." />
            </div>
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
                />
              </div>

              {/* Absolute Loading Overlay during fetches */}
              {isFetching && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex items-center justify-center pointer-events-none">
                  <div className="surface-card rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-200 p-4 sm:p-6">
                    <Loader size="md" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 animate-pulse">
                      Syncing Cards...
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Tabs>
    </TopicPageLayout>

    <AlertDialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
      <AlertDialogContent className="sm:w-full max-w-sm surface-card rounded-3xl shadow-2xl p-4 sm:p-6">
        <AlertDialogHeader className="pb-3 border-b-2 border-border/40">
          <AlertDialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            Quit Flashcards?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3 font-medium">
          Are you sure you want to quit? You will return to the flashcards menu.
        </AlertDialogDescription>
        <AlertDialogFooter className="flex-row gap-2 mt-4 sm:justify-end">
          <AlertDialogCancel
            className="flex-1 sm:flex-none h-10 sm:h-11 px-4 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider uppercase surface-card text-foreground hover:bg-[color-mix(in_oklab,var(--muted)_60%,var(--card))] active:scale-95 transition-all cursor-pointer"
            onClick={() => setShowQuitConfirm(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex-1 sm:flex-none h-10 sm:h-11 px-4 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider uppercase border-2 border-destructive/30 bg-[color-mix(in_oklab,var(--destructive)_10%,var(--card))] text-destructive hover:bg-destructive hover:text-white active:scale-95 transition-all cursor-pointer shadow-xs"
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
export default FreestylePage;
