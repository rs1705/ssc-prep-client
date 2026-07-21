"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { EyeOff, Check, Copy, ChevronDown, X } from "lucide-react";
import { RevisionConfig } from "./TopicCard";

interface RevisionDialogProps {
  name: string;
  emoji?: React.ReactNode;
  revisionConfig: RevisionConfig;
  trigger: React.ReactNode;
}

export const RevisionDialog: React.FC<RevisionDialogProps> = ({
  name,
  emoji,
  revisionConfig,
  trigger,
}) => {
  const [selfTest, setSelfTest] = useState(false);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [copiedNum, setCopiedNum] = useState<number | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("Easy"); // Default to "Easy" open

  const toggleSection = (label: string) => {
    setOpenSection((prev) => (prev === label ? null : label));
  };

  const { type, ranges } = revisionConfig;

  // 1. Generate items grouped by range
  const groupedItems = ranges.map((rangeObj) => {
    const length = rangeObj.max - rangeObj.min + 1;
    const items = Array.from({ length }, (_, i) => {
      const num = i + rangeObj.min;
      let value = 0;
      let text = "";

      if (type === "square") {
        value = num * num;
        text = `${num}²`;
      } else if (type === "cube") {
        value = num * num * num;
        text = `${num}³`;
      } else if (type === "table") {
        value = num;
        text = `Table ${num}`;
      }

      return { num, value, text };
    });

    return {
      label: rangeObj.label,
      range: rangeObj.range,
      items,
    };
  });

  const handleCopy = (num: number, equation: string) => {
    navigator.clipboard.writeText(equation).then(() => {
      setCopiedNum(num);
      setTimeout(() => setCopiedNum(null), 1000);
    });
  };

  const handleRowClick = (num: number, equation: string) => {
    if (selfTest) {
      setRevealed((prev) => ({ ...prev, [num]: !prev[num] }));
    } else {
      handleCopy(num, equation);
    }
  };

  return (
    <Dialog onOpenChange={(open) => {
      if (!open) {
        // Reset states on close
        setSelfTest(false);
        setRevealed({});
        setCopiedNum(null);
        setOpenSection("Easy");
      }
    }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-md border-border/80 flex flex-col gap-0 max-h-[85vh]">
        <DialogHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between space-y-0 text-left">
          <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground">
            <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-md text-[10px] font-black bg-primary/10 border border-primary/20 text-primary select-none">
              {emoji}
            </span>
            {name} Revision
          </DialogTitle>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant={selfTest ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelfTest(!selfTest);
                setRevealed({});
              }}
              style={{ width: "115px", minWidth: "115px", maxWidth: "115px" }}
              className="h-8 px-0 justify-center shrink-0 rounded-xl text-xs gap-1.5 font-bold hover:cursor-pointer transition-all border-border/60"
            >
              <EyeOff className="w-3.5 h-3.5" />
              {selfTest ? "Study Mode" : "Self Test"}
            </Button>
            <DialogClose asChild>
              <button
                aria-label="Close dialog"
                className="h-8 w-8 rounded-full flex items-center justify-center bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all cursor-pointer flex-shrink-0 border-none outline-none"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Accordion Container */}
        <div className="flex-1 overflow-y-auto pr-1.5 mt-1.5 custom-scrollbar min-h-0">
          {groupedItems.map((group) => {
            const isSectionOpen = openSection === group.label;
            return (
              <div
                key={group.label}
                className="mb-3.5 rounded-2xl border border-border/50 bg-card/20 overflow-hidden transition-all duration-200"
              >
                {/* Section Header Accordion Trigger */}
                <button
                  onClick={() => toggleSection(group.label)}
                  className="w-full text-left py-2.5 px-3.5 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer group/header"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${group.label === "Easy"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : group.label === "Medium"
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                        }`}
                    >
                      {group.label}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground/80 tracking-wider">
                      Range: {group.range}
                    </span>
                  </div>
                  {/* Chevron Indicator */}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-muted-foreground/50 group-hover/header:text-muted-foreground transition-transform duration-200 ${isSectionOpen ? "transform rotate-0" : "transform -rotate-90"
                      }`}
                  />
                </button>

                {/* Rows Grid Accordion Panel (Smooth CSS Height Transition) */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isSectionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 p-3.5 pt-2 border-t border-border/20 dark:border-border/10 bg-background/30">
                      {group.items.map((item) => {
                        const equation = `${item.text} = ${item.value}`;
                        const isRevealed = !selfTest || revealed[item.num];
                        const isCopied = copiedNum === item.num;

                        return (
                          <div
                            key={item.num}
                            onClick={() => handleRowClick(item.num, equation)}
                            className={`flex items-center justify-start gap-6 h-9 px-3 border-b border-border/10 dark:border-border/5 hover:bg-muted/50 rounded-xl transition-all duration-150 cursor-pointer select-none group/row ${selfTest && !isRevealed ? "hover:border-primary/20" : ""
                              }`}
                          >
                            <span className="text-xs font-semibold text-muted-foreground min-w-[28px]">{item.text}</span>
                            <span className="text-[10px] text-muted-foreground/30 font-bold">=</span>

                            <div className="flex-1 flex items-center justify-between">
                              {isCopied ? (
                                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 animate-in fade-in duration-200">
                                  <Check className="w-3 h-3" />
                                  Copied!
                                </span>
                              ) : selfTest && !isRevealed ? (
                                <span className="text-xs font-bold text-primary dark:text-blue-400 opacity-60 group-hover/row:opacity-100 transition-opacity">
                                  Reveal
                                </span>
                              ) : (
                                <span className="text-sm font-black text-foreground">
                                  {item.value}
                                </span>
                              )}

                              {/* Copy Icon on Hover (Only in Study Mode) */}
                              {!selfTest && !isCopied && (
                                <Copy className="w-3 h-3 text-muted-foreground/0 group-hover/row:text-muted-foreground/50 transition-colors ml-2" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
