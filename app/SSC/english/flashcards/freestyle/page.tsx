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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useGetFilteredCardsQuery } from "@/redux/FlashcardApiSlice";
import { PuffLoader } from "react-spinners";
//custom imports
import { resetFilter, updateFilter } from "@/redux/FilterSlice";
import { RootState } from "@/redux/store";
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import { MAIN_FILTERS, TABS } from "@/lib/english_filters";
import { Button } from "@/components/ui/button";

const FreestylePage = () => {
  const filterStore = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch();

  const [isFilterOn, setIsFilterOn] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [draftFilters, setDraftFilters] = useState(filterStore[activeTab]);

  const handleSwitchChange = (checked: boolean) => {
    setIsFilterOn(checked);
    if (!checked) {
      dispatch(resetFilter({ tab: activeTab }));
    }
  };

  const handleSelectChange = (key: string, value: string) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterSubmit = () => {
    dispatch(updateFilter({ tab: activeTab, filter: draftFilters }));
  };

  const { data, isLoading, isError } = useGetFilteredCardsQuery(
    filterStore[activeTab]
  );

  useEffect(() => {
    setDraftFilters(filterStore[activeTab]);
  }, [filterStore, activeTab]);

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
            <div className="flex items-center gap-2  rounded-md justify-start px-2 w-full">
              <Label htmlFor="filter-switch" className="text-md font-bold">
                Filter :
              </Label>
              <Switch
                id="filter-switch"
                checked={isFilterOn}
                onCheckedChange={() => handleSwitchChange(!isFilterOn)}
                className="hover:cursor-pointer data-[state=checked]:bg-green-500 
             data-[state=unchecked]:bg-slate-300"
              />
            </div>
            <div className="flex w-full max-w-sm flex-row justify-center">
              <Tabs
                defaultValue={activeTab}
                onValueChange={(val) => setActiveTab(val)}
              >
                <TabsList className="w-full">
                  {TABS.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="hover:cursor-pointer hover:bg-white w-[85px]"
                    >
                      {tab.toUpperCase()}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {isFilterOn && (
                  <div className="flex flex-row justify-center gap-1 border-0 shadow-none p-0 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-top-20">
                    {Object.entries(MAIN_FILTERS).map(([key, values]) => (
                      <div key={key} className="flex flex-col items-center">
                        <Select
                          disabled={!isFilterOn}
                          value={draftFilters[key]}
                          onValueChange={(val) => handleSelectChange(key, val)}
                        >
                          <SelectTrigger className="w-[95px] font-semibold shadow-sm hover:shadow-md hover:cursor-pointer">
                            <SelectValue placeholder={key.toUpperCase()} />
                          </SelectTrigger>
                          <SelectContent className="font-semibold text-center ">
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
                    <Button
                      className="hover:cursor-pointer"
                      onClick={handleFilterSubmit}
                    >
                      🔎Filter
                    </Button>
                  </div>
                )}
                <TabsContent value={activeTab}></TabsContent>
                <FlashcardDeck deck={data} deckId={activeTab} />
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreestylePage;
