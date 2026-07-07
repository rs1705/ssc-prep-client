"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//ui imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetFilteredCardsQuery } from "@/redux/FlashcardApiSlice";
import { PuffLoader } from "react-spinners";

//custom imports
import { resetFilter, TabFilter, updateFilter } from "@/redux/FilterSlice";
import { RootState } from "@/redux/store";
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { MAIN_FILTERS, TABS } from "@/lib/english_filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
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

  const { data, isLoading, isError } = useGetFilteredCardsQuery(
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
        <div className="flex flex-row justify-center">
          <PuffLoader />
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
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-2 text-center space-y-2 px-4">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 shadow-sm inline-block">
              Freestyle
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              🎲 Freestyle Practice🎲
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
              Choose a category, set your filter preferences, and master high-frequency SSC vocabulary.
            </p>
          </div>

          <div className="flex justify-center flex-col">
            <div className="flex w-full max-w-md flex-row items-center gap-2.5 px-4 mb-2">
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
                    <SheetContent>
                      <SheetHeader className="text-center">
                        <SheetTitle className="text-2xl">Filters</SheetTitle>
                        <SheetDescription>
                          Choose the filters from the following based on your
                          preferences
                        </SheetDescription>
                      </SheetHeader>
                      <div className="max-w-full px-4">
                        {Object.entries(MAIN_FILTERS)
                          .filter(([k]) => k !== "highFrequency")
                          .map(([key, values]) => (
                            <div key={key}>
                              <div className="flex justify-between mb-2">
                                <Label htmlFor={key} className="flex-3/12">
                                  {key.toUpperCase()}
                                </Label>

                                <Select
                                  value={
                                    draftFilters[
                                    key as keyof Omit<
                                      TabFilter,
                                      "highFrequency"
                                    >
                                    ]
                                  }
                                  onValueChange={(val) =>
                                    handleSelectChange(key, val)
                                  }
                                >
                                  <SelectTrigger
                                    id={key}
                                    className="flex-9/12 font-semibold shadow-sm hover:shadow-md hover:cursor-pointer"
                                  >
                                    <SelectValue placeholder="Select..." />{" "}
                                  </SelectTrigger>

                                  <SelectContent className="font-semibold">
                                    <SelectItem value="all">All</SelectItem>
                                    {values.map((val) => (
                                      <SelectItem key={val} value={val}>
                                        {val.toUpperCase()}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          ))}
                        <div className="flex justify-between my-5">
                          <Label className="hover:cursor-pointer">
                            High frequency{" "}
                            <Checkbox
                              name="highfrequency"
                              checked={draftFilters.highFrequency ?? false}
                              onCheckedChange={(val: boolean) =>
                                setDraftFilters((prev) => ({
                                  ...prev,
                                  highFrequency: val,
                                }))
                              }
                            />
                          </Label>
                          {/* <Label className="hover:cursor-pointer">
                            Special words
                            <Checkbox
                              name="specialword"
                              checked={false}
                              onCheckedChange={(val: boolean) =>
                                setDraftFilters((prev) => ({
                                  ...prev,
                                  specialword: val,
                                }))
                              }
                            />
                          </Label> */}
                        </div>
                      </div>
                      <div className="flex flex-row justify-evenly  items-center px-4 gap-1 text-center">
                        <Button
                          className="w-[50%] hover:cursor-pointer"
                          onClick={handleFilterSetClick}
                          variant="default"
                        >
                          Apply
                        </Button>
                        <Button
                          className="w-[50%] hover:cursor-pointer"
                          variant="default"
                          onClick={handleFilterResetClick}
                        >
                          Clear
                        </Button>
                      </div>
                      {/* <p className="text-center">or</p>
                      <div className="flex flex-row justify-center px-4">
                        <Button
                          variant="default"
                          className="w-full hover:cursor-pointer"
                        >
                          <BowArrow /> Start a session
                        </Button>
                      </div> */}
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="hover:cursor-pointer"
                          >
                            Close
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>

                <TabsContent value={activeTab}></TabsContent>

                {/* Jump to Letter bar */}
                <div className="flex items-center px-1 justify-between rounded-xl">
                  <p className="font-bold text-sm text-slate-600">Jump to Letter</p>
                  <Select
                    value={filterStore[activeTab]?.alphabet || "a"}
                    onValueChange={(val) => {
                      dispatch(updateFilter({ tab: activeTab, filter: { alphabet: val } }));
                      localStorage.setItem(`freestyle_alphabet_${activeTab}`, val);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs font-bold uppercase shadow-sm hover:shadow-md hover:cursor-pointer bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
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

                {/* Filter Badges */}
                {activeFilters.length > 0 && (
                  <div className="flex gap-1.5 mb-1 justify-start items-center px-1 flex-wrap">
                    <p className="font-bold text-sm text-slate-600">Active filters</p>
                    {activeFilters.map((f) => (
                      <Badge variant="secondary" key={f} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/40 dark:border-slate-700/40 text-slate-600 dark:text-slate-300">
                        {f.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                )}

                <FlashcardDeck deck={data} deckId={activeTab} isLinear={true} mode="freestyle" />

              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreestylePage;
