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
import { EyeOff, Eye, Check, Copy, ChevronDown, X, Sparkles } from "lucide-react";
import { RevisionConfig } from "./TopicCard";
import { SSC_PERCENTAGES } from "@/lib/mathGenerator";

interface RevisionDialogProps {
  name: string;
  emoji?: React.ReactNode;
  revisionConfig: RevisionConfig;
  trigger: React.ReactNode;
  colorTheme?: "sky";
}

export const RevisionDialog: React.FC<RevisionDialogProps> = ({
  name,
  emoji,
  revisionConfig,
  trigger,
  colorTheme = "sky",
}) => {
  const [selfTest, setSelfTest] = useState(false);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [copiedNum, setCopiedNum] = useState<number | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("Easy");

  const themeMap: Record<
    string,
    {
      iconBg: string;
      activeBtn: string;
      modeIcon: string;
      revealRow: string;
      revealPill: string;
      sparkle: string;
    }
  > = {
    sky: {
      iconBg: "bg-[color-mix(in_oklab,var(--color-sky-500)_10%,var(--card))] shadow-inner ring-1 ring-border/40 text-sky-600 dark:text-sky-400",
      activeBtn: "bg-sky-600 text-white shadow-sm border-0",
      modeIcon: "text-sky-500",
      revealRow: "bg-[color-mix(in_oklab,var(--color-sky-500)_5%,var(--card))] hover:bg-[color-mix(in_oklab,var(--color-sky-500)_10%,var(--card))] border-sky-500/25 text-sky-600 dark:text-sky-400",
      revealPill: "text-sky-600 dark:text-sky-400 bg-[color-mix(in_oklab,var(--color-sky-500)_15%,var(--card))] border-sky-500/30",
      sparkle: "text-sky-500",
    },
  };

  const currentTheme = themeMap[colorTheme] ?? themeMap.sky;

  const toggleSection = (label: string) => {
    setOpenSection((prev) => (prev === label ? null : label));
  };

  const { type, ranges } = revisionConfig;

  // Generate items grouped by range
  const groupedItems = ranges.map((rangeObj) => {
    const length = rangeObj.max - rangeObj.min + 1;
    const items = Array.from({ length }, (_, i) => {
      const num = i + rangeObj.min;
      let value: string | number = 0;
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
      } else if (type === "percentage") {
        const config = SSC_PERCENTAGES[num];
        if (config) {
          value = `${config.numerator}/${config.denominator}`;
          text = config.display;
        }
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
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          // Reset states on close
          setSelfTest(false);
          setRevealed({});
          setCopiedNum(null);
          setOpenSection("Easy");
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg rounded-3xl border-border/60 bg-card backdrop-blur-2xl shadow-2xl p-0 flex flex-col gap-0 max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b-2 border-border/40 bg-card backdrop-blur-xl flex flex-row items-center justify-between space-y-0 text-left shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2.5 text-foreground">
            {emoji && (
              <span className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-xl select-none ${currentTheme.iconBg}`}>
                {emoji}
              </span>
            )}
            <span>{name} Revision</span>
          </DialogTitle>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              onClick={() => {
                setSelfTest(!selfTest);
                setRevealed({});
              }}
              className={`h-8 px-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase gap-1.5 transition-all cursor-pointer select-none ${
                selfTest
                  ? currentTheme.activeBtn
                  : "bg-[color-mix(in_oklab,var(--muted)_70%,var(--card))] hover:bg-muted text-foreground border-2 border-border"
              }`}
            >
              {selfTest ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Study Mode</span>
                </>
              ) : (
                <>
                  <EyeOff className={`w-3.5 h-3.5 ${currentTheme.modeIcon}`} />
                  <span>Self Test</span>
                </>
              )}
            </Button>
            <DialogClose asChild>
              <button
                aria-label="Close dialog"
                title="Close dialog"
                className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted border-2 border-border active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" strokeWidth={2.2} />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Accordion Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar min-h-0 space-y-3">
          {groupedItems.map((group) => {
            const isSectionOpen = openSection === group.label;
            return (
              <div
                key={group.label}
                className="rounded-2xl surface-card hover:border-border/80 overflow-hidden transition-all duration-200 shadow-2xs"
              >
                {/* Section Header Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleSection(group.label)}
                  className="w-full text-left py-2.5 px-3.5 flex items-center justify-between hover:bg-[color-mix(in_oklab,var(--muted)_50%,var(--card))] transition-colors cursor-pointer group/header select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border-2 border-border bg-muted text-muted-foreground"
                    >
                      {group.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-muted-foreground/80 tracking-wider">
                      Range: {group.range}
                    </span>
                  </div>
                  {/* Chevron Indicator */}
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground/50 group-hover/header:text-foreground transition-transform duration-200 ${
                      isSectionOpen ? "transform rotate-0" : "transform -rotate-90"
                    }`}
                  />
                </button>

                {/* Rows Grid Accordion Panel */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isSectionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1.5 p-3.5 pt-2 border-t-2 border-border/30 bg-[color-mix(in_oklab,var(--muted)_15%,var(--card))]">
                      {group.items.map((item) => {
                        const equation = `${item.text} = ${item.value}`;
                        const isRevealed = !selfTest || revealed[item.num];
                        const isCopied = copiedNum === item.num;

                        return (
                          <div
                            key={item.num}
                            onClick={() => handleRowClick(item.num, equation)}
                            className={`flex items-center justify-between gap-2 h-9 px-3 rounded-xl border-2 transition-all duration-150 cursor-pointer select-none group/row ${
                              selfTest && !isRevealed
                                ? currentTheme.revealRow
                                : "border-transparent hover:border-border/50 hover:bg-card"
                            }`}
                          >
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-bold text-muted-foreground min-w-[55px] w-[55px] text-left font-mono tracking-tight">
                                {item.text}
                              </span>
                              <span className="text-xs text-muted-foreground/40 font-black font-mono">
                                =
                              </span>
                            </div>

                            <div className="flex-1 flex items-center justify-between pl-1 min-w-0">
                              {isCopied ? (
                                <span className="text-xs font-bold font-mono text-emerald-500 flex items-center gap-1 animate-in fade-in duration-200">
                                  <Check className="w-3 h-3" />
                                  Copied!
                                </span>
                              ) : selfTest && !isRevealed ? (
                                <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md group-hover/row:scale-105 transition-all ${currentTheme.revealPill}`}>
                                  Reveal
                                </span>
                              ) : (
                                <span className="text-sm font-black text-foreground font-mono tracking-tight whitespace-nowrap shrink-0">
                                  {item.value}
                                </span>
                              )}

                              {/* Copy Icon on Hover (Only in Study Mode) */}
                              {!selfTest && !isCopied && (
                                <Copy className="w-3 h-3 text-transparent group-hover/row:text-muted-foreground/60 transition-colors shrink-0" />
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

        {/* Footer Helper Tip */}
        <div className="px-4 py-2.5 bg-[color-mix(in_oklab,var(--muted)_30%,var(--card))] border-t-2 border-border/40 text-xs font-medium text-muted-foreground flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className={`w-3.5 h-3.5 shrink-0 ${currentTheme.sparkle}`} />
            <span>
              {selfTest
                ? "Click on any 'Reveal' button to test your recall"
                : "Click on any row to copy the equation to clipboard"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
