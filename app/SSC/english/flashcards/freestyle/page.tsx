"use client";

import { useEffect, useState } from "react";
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
import { SlidersVertical, Dices, AlertTriangle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  const rawFilters = Object.entries(filterStore[activeTab]);
  const activeFilters = rawFilters.reduce<string[]>((acc, [key, val]) => {
    if (key === "subject" || key === "type" || key === "alphabet") return acc;
    if (key === "highFrequency") {
      if (val === true) acc.push("High frequency");
    } else if (val !== "all") {
      acc.push(val as string);
    }
    return acc;
  }, []);

  const { currentCardId } = useSelector((state: RootState) => state.session);
  const currentIndex = data ? data.findIndex((card: any) => card._id === currentCardId) : -1;
  const currentCardNumber = currentIndex >= 0 ? currentIndex + 1 : 1;
  const totalCards = data ? data.length : 0;

  return (
    <>
      <TopicPageLayout contentMaxWidthClass="w-full max-w-[500px]" hideBreadcrumbs={true} centerContent={false}>
      <Tabs
        defaultValue={activeTab}
        onValueChange={(val) => setActiveTab(val)}
        className="flex flex-col items-center w-full transition-all duration-300"
      >
        {/* Control Panel Container */}
        <div className="flex flex-col gap-1 w-full bg-card border border-primary/20 rounded-2xl p-2.5 sm:p-3 mb-1 shadow-xs">
          {/* Header Row: Title + Mode on Left, Quit on Right */}
          <div className="flex items-center justify-between w-full gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Dices
                className="w-4 h-4 text-primary/80 shrink-0"
                fill="currentColor"
                fillOpacity={0.1}
              />
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-foreground uppercase">
                Flashcards
              </span>
              <span className="text-muted-foreground/40 font-normal text-xs">•</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {activeTab}
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

          {/* Tabs & Filters Dialog */}
          {!isError && (
            <>
              <div className="flex flex-row items-center gap-1.5 sm:gap-2 w-full mt-0.5">
                <TabsList className="flex-1 !h-8 sm:!h-9 bg-muted/60 border border-border/60 p-0.5 sm:p-1 rounded-lg sm:rounded-xl shadow-2xs">
                  {TABS.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="flex-1 h-full hover:cursor-pointer hover:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-2xs rounded-md sm:rounded-lg transition-all duration-200 font-bold uppercase text-[9px] sm:text-xs text-muted-foreground data-[state=active]:text-foreground"
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

                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-8 sm:h-9 hover:cursor-pointer border-border shadow-2xs hover:bg-muted/50 transition-all rounded-lg sm:rounded-xl px-2 sm:px-2.5 flex items-center gap-1"
                    >
                      <SlidersVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="font-semibold text-[9px] sm:text-xs text-foreground hidden min-[400px]:inline">
                        Filters
                      </span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="flex flex-col h-full p-6">
                    <SheetHeader className="text-left border-b border-border/40 pb-4 mb-4">
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

                      <div className="flex items-center justify-between p-4 rounded-lg bg-accent/20 border border-border/30 my-6 shadow-xs">
                        <div className="flex flex-col gap-0.5 pr-2">
                          <Label
                            htmlFor="highFrequency"
                            className="font-semibold text-sm text-foreground cursor-pointer select-none"
                          >
                            High Frequency Cards
                          </Label>
                          <span className="text-[11px] text-muted-foreground leading-normal">
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

                    <SheetFooter className="mt-auto pt-4 border-t border-border/40 flex-row gap-3">
                      <Button
                        className="flex-1 h-11 rounded-xl font-semibold hover:cursor-pointer transition-all"
                        variant="outline"
                        onClick={handleFilterResetClick}
                      >
                        Clear Filters
                      </Button>
                      <Button
                        className="flex-1 h-11 rounded-xl font-bold hover:cursor-pointer transition-all shadow-sm"
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
                <div className="w-full mt-1.5 flex flex-col gap-0.5 px-0.5">
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
                    className="h-1 bg-muted border border-border/50"
                    barClassName="bg-primary rounded-full"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Flashcard Deck Area */}
        <div className="relative w-full mt-2">
          {isLoading ? (
            <div className="flex flex-row justify-center min-h-[300px] items-center">
              <Loader size="lg" text="Loading flashcards..." />
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center min-h-[350px] p-6 w-full">
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
                  deck={data}
                  deckId={activeTab}
                  isLinear={true}
                  mode="freestyle"
                  activeFilters={activeFilters}
                />
              </div>

              {/* Absolute Loading Overlay during fetches */}
              {isFetching && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex items-center justify-center pointer-events-none">
                  <div className="bg-card/95 backdrop-blur-sm px-8 py-5 rounded-3xl shadow-2xl border border-border flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-200">
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
      <AlertDialogContent className="sm:w-full max-w-sm border border-border">
        <AlertDialogHeader className="pb-3 border-b border-border/40">
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
            className="flex-1 sm:flex-none h-11 rounded-2xl text-sm font-bold border border-destructive/40 bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all shadow-sm"
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
