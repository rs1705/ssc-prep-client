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
    <div className="flex flex-col">
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
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-center">
              🎲 Freestyle Mode 🎲
            </h1>
            <p className="text-center text-slate-600">
              Your learning adventure starts here! Choose a category
            </p>
          </div>

          <div className="flex justify-center flex-col">
            <div className="flex w-full max-w-md flex-row">
              <Tabs
                defaultValue={activeTab}
                onValueChange={(val) => setActiveTab(val)}
              >
                <TabsList className="w-full">
                  {TABS.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="hover:cursor-pointer hover:bg-white"
                    >
                      {tab.toUpperCase()}
                    </TabsTrigger>
                  ))}
                  <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="hover:cursor-pointer">
                        <SlidersVertical />
                        Filters
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
                          variant="secondary"
                        >
                          Apply
                        </Button>
                        <Button
                          className="w-[50%] hover:cursor-pointer"
                          variant="secondary"
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
                </TabsList>

                <TabsContent value={activeTab}></TabsContent>

                {/* A-Z Dropdown */}
                <div className="flex flex-row items-center justify-between mb-2 px-4 w-full max-w-sm mx-auto">
                  <p className="font-semibold text-slate-500">Jump to Letter</p>
                  <Select
                    value={filterStore[activeTab]?.alphabet || "a"}
                    onValueChange={(val) => {
                      dispatch(updateFilter({ tab: activeTab, filter: { alphabet: val } }));
                      localStorage.setItem(`freestyle_alphabet_${activeTab}`, val);
                    }}
                  >
                    <SelectTrigger className="w-[120px] font-semibold uppercase shadow-sm hover:shadow-md hover:cursor-pointer">
                      <SelectValue placeholder="Letter" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
                        <SelectItem key={letter} value={letter} className="uppercase font-semibold">
                          {letter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activeFilters.length > 0 && (
                  <div className="flex gap-2 mb-2 rounded-md font-semibold justify-center items-center px-4 text-center flex-wrap">
                    <span className="text-sm text-slate-500">Filters:</span>
                    {activeFilters.map((f) => (
                      <Badge variant="secondary" key={f}>{f.toUpperCase()}</Badge>
                    ))}
                  </div>
                )}

                <FlashcardDeck deck={data} deckId={activeTab} isLinear={true} />

              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreestylePage;
