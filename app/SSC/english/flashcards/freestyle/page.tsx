"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { SlidersVertical, Dices } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const FreestylePage = () => {
  const filterStore = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("vocab");
  const [draftFilters, setDraftFilters] = useState(filterStore[activeTab]);
  const [open, setOpen] = useState(false);

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

  const { data, isLoading, isFetching, isError, refetch } = useGetFilteredCardsQuery(
    filterStore[activeTab],
  );

  useEffect(() => {
    setDraftFilters(filterStore[activeTab]);
  }, [filterStore, activeTab]);

  useEffect(() => {
    const savedAlphabet = localStorage.getItem(`freestyle_alphabet_${activeTab}`);
    if (savedAlphabet && savedAlphabet !== filterStore[activeTab]?.alphabet) {
      dispatch(updateFilter({ tab: activeTab, filter: { alphabet: savedAlphabet } }));
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

  return (
    <div className="flex flex-col overflow-x-hidden">
      {isLoading ? (
        <div className="flex flex-row justify-center min-h-[300px] items-center">
          <Loader size="lg" text="Loading flashcards..." />
        </div>
      ) : isError ? (
        // Error State
        <div className="flex justify-center items-center min-h-[350px] p-6 w-full">
          <ErrorState 
            title="Failed to Load Flashcards"
            description="We encountered an issue while loading your vocabulary practice cards. Please try again."
            onRetry={refetch}
          />
        </div>
      ) : (
        <TopicPageLayout
          hideBreadcrumbs={true}
        >
          <div className="flex justify-center flex-col w-full mx-auto">
            {/* Compact Gameplay Stats Header Bar */}
            <div className="flex flex-col gap-2 w-full pb-2 border-b border-border/60 mb-3 px-4 min-[375px]:w-[375px] min-[375px]:px-0 md:w-[500px] mx-auto">
                {/* Row 1: Left is Section Title, Right is Quit Button */}
                <div className="flex items-center justify-between w-full gap-2 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <Dices className="w-[18px] h-[18px] text-primary/80 shrink-0" fill="currentColor" fillOpacity={0.1} />
                        <span className="font-black text-lg sm:text-xl tracking-tight text-foreground leading-normal">
                            Freestyle Flashcards
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

                {/* Row 2: Left is active mode & category filter details */}
                <div className="flex items-center justify-between w-full gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5 pl-[26px] min-w-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                        <span>Freestyle</span>
                        <span className="text-muted-foreground/35 font-normal">•</span>
                        <span className="font-semibold text-primary">{activeTab.toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <div className="flex w-full flex-row items-center justify-center">
              <Tabs
                defaultValue={activeTab}
                onValueChange={(val) => setActiveTab(val)}
                className="w-full px-4 min-[375px]:w-[375px] min-[375px]:px-0 md:w-[500px] mx-auto"
              >
                <div className="flex flex-row items-center gap-2.5 w-full">
                  <TabsList className="flex-1 dark:bg-slate-900/60 dark:border-slate-800/60 ">
                    {TABS.map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="flex-1 hover:cursor-pointer hover:text-slate-900 dark:hover:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm rounded-lg py-1.5 transition-all duration-200 font-bold uppercase text-xs text-slate-600 dark:text-slate-400 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="h-10 hover:cursor-pointer border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all duration-200 rounded-xl px-3 flex items-center gap-1.5">
                        <SlidersVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Filters</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="flex flex-col h-full p-6">
                      <SheetHeader className="text-left border-b border-border/40 pb-4 mb-4">
                        <SheetTitle className="text-xl font-bold tracking-tight">Filter Cards</SheetTitle>
                        <SheetDescription>
                          Refine vocabulary cards by category, starting letter, and frequency.
                        </SheetDescription>
                      </SheetHeader>

                      <div className="flex-1 overflow-y-auto px-1">
                        {Object.entries(MAIN_FILTERS)
                          .filter(([k]) => k !== "highFrequency")
                          .map(([key, values]) => (
                            <div key={key} className="flex flex-col gap-1.5 mb-5">
                              <Label htmlFor={key} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {key === "category" ? "Category" : key === "letter" ? "Starting Letter" : key.toUpperCase()}
                              </Label>

                              <Select
                                value={
                                  draftFilters[
                                  key as keyof Omit<TabFilter, "highFrequency">
                                  ]
                                }
                                onValueChange={(val) => handleSelectChange(key, val)}
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
                            <Label htmlFor="highFrequency" className="font-semibold text-sm text-foreground cursor-pointer select-none">
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

                {/* Toolbar: Jump to Letter + Active Filters */}
                <div className="flex flex-col gap-1.5 px-1 py-2 mt-0.5 mb-1 rounded-2xl bg-accent/30 dark:bg-slate-900/40 border border-border/40">
                  {/* Jump to Letter */}
                  <div className="flex items-center justify-between px-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Jump to Letter</p>
                    <Select
                      value={filterStore[activeTab]?.alphabet || "a"}
                      onValueChange={(val) => {
                        dispatch(updateFilter({ tab: activeTab, filter: { alphabet: val } }));
                        localStorage.setItem(`freestyle_alphabet_${activeTab}`, val);
                      }}
                    >
                      <SelectTrigger className="w-16 h-8 text-xs font-bold uppercase shadow-sm hover:shadow-md bg-background border-border">
                        <SelectValue placeholder="Letter" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
                          <SelectItem key={letter} value={letter} className="uppercase font-semibold text-xs">
                            {letter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active Filters */}
                  {activeFilters.length > 0 && (
                    <>
                      <div className="h-px bg-border/50 mx-3" />
                      <div className="flex items-center gap-2 px-3 flex-wrap">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0">Filters</p>
                        {activeFilters.map((f) => (
                          <Badge variant="secondary" key={f} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {f.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {isFetching ? (
                  <div className="w-[375px] md:w-[500px] min-h-[400px] flex items-center justify-center mx-auto">
                    <Loader size="md" />
                  </div>
                ) : (
                  <FlashcardDeck deck={data} deckId={activeTab} isLinear={true} mode="freestyle" />
                )}

              </Tabs>
            </div>
          </div>
        </TopicPageLayout>
      )}
    </div>
  );
};

export default FreestylePage;
