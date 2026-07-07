"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { SlidersVertical } from "lucide-react";
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

  const { data, isLoading, isFetching, isError } = useGetFilteredCardsQuery(
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
        <div className="flex justify-center items-center p-6">
          <p className="text-red-500 font-semibold">
            Oops! Something went wrong while loading flashcards.
            {isError}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6 text-center px-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">
              Freestyle Practice
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Pick a category, apply filters, and start practising.
            </p>
          </div>

          <div className="flex justify-center flex-col">
            <div className="flex w-full max-w-md sm:max-w-xl md:max-w-2xl flex-row items-center gap-2.5 px-4">
              <Tabs
                defaultValue={activeTab}
                onValueChange={(val) => setActiveTab(val)}
                className="w-full"
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

                      <div className="flex-1 overflow-y-auto pr-1">
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
                                  className="w-full h-11 bg-background border-border rounded-xl shadow-xs font-semibold hover:cursor-pointer focus:ring-1 focus:ring-primary focus:ring-offset-0"
                                >
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>

                                <SelectContent className="font-semibold rounded-xl">
                                  <SelectItem value="all" className="rounded-lg">All</SelectItem>
                                  {values.map((val) => (
                                    <SelectItem key={val} value={val} className="rounded-lg">
                                      {val.toUpperCase()}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))}

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/20 border border-border/30 my-6 shadow-xs">
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
        </div>
      )}
    </div>
  );
};

export default FreestylePage;
