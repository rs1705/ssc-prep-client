"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bookmark, Search, Trash2, Swords, Copy, Check, 
  Sparkles, BookOpen, Zap, HelpCircle, ArrowRight
} from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";

interface BookmarkItem {
  id: string;
  category: "vocab" | "formula" | "question";
  title: string;
  subtitle: string;
  content: string;
  tag: string;
  linkTo: string;
}

const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: "bm-1",
    category: "vocab",
    title: "Obsequious",
    subtitle: "Hindi: चापलूस (Chāpalūsa)",
    content: "Obedient or attentive to an excessive or servile degree. Synonyms: Sycophantic, Fawning, Subservient.",
    tag: "High-Freq Vocab",
    linkTo: "/SSC/english/flashcards/fsrs",
  },
  {
    id: "bm-2",
    category: "formula",
    title: "Fraction Conversion: 1/17",
    subtitle: "Speed Math · Decimal Equivalent",
    content: "1/17 = 5.88% (or 0.0588). Memorize: 2/17 = 11.76%, 3/17 = 17.64%, 4/17 = 23.52%.",
    tag: "Speed Fraction",
    linkTo: "/SSC/maths/mental-maths/percentages",
  },
  {
    id: "bm-3",
    category: "formula",
    title: "Sum of First N Odd Numbers",
    subtitle: "Arithmetic Sequence Shortcut",
    content: "Sum of first n odd numbers = n². Example: 1 + 3 + 5 + ... + 49 (25 terms) = 25² = 625.",
    tag: "Quant Trick",
    linkTo: "/SSC/maths/mental-maths/squares",
  },
  {
    id: "bm-4",
    category: "question",
    title: "Battle of Khanwa (1527)",
    subtitle: "Mughal Empire · Static GK",
    content: "Fought between Babur and Rana Sanga of Mewar near Khanwa village. Babur assumed the title of 'Ghazi' after this battle.",
    tag: "History PYQ",
    linkTo: "/SSC/gk",
  },
  {
    id: "bm-5",
    category: "vocab",
    title: "Ephemeral",
    subtitle: "Hindi: क्षणिक (Kshanik)",
    content: "Lasting for a very short time. Synonyms: Transient, Fleeting, Evancent. Antonym: Permanent.",
    tag: "High-Freq Vocab",
    linkTo: "/SSC/english/flashcards/fsrs",
  },
  {
    id: "bm-6",
    category: "formula",
    title: "Pythagorean Triplets: 20, 21, 29",
    subtitle: "Geometry & Mensuration Shortcut",
    content: "20² + 21² = 400 + 441 = 841 = 29². Essential for fast hypotenuse calculation.",
    tag: "Geometry",
    linkTo: "/SSC/maths/mental-maths",
  },
];

export default function BookmarksPage() {
  const [items, setItems] = useState<BookmarkItem[]>(INITIAL_BOOKMARKS);
  const [activeTab, setActiveTab] = useState<"all" | "vocab" | "formula" | "question">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === "all" || item.category === activeTab;
    const matchesQuery = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <ProtectedRoute>
      <TopicPageLayout
        title="Saved Knowledge Vault"
        description="Your curated repository of difficult vocabulary words, mental math shortcuts, and tricky PYQ concepts for fast revision."
        contentMaxWidthClass="w-full max-w-[1280px]"
      >
        <div className="flex flex-col gap-6 py-2">
          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 bg-card/60 backdrop-blur-md border border-border/40 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto scrollbar-none">
              {(["all", "vocab", "formula", "question"] as const).map((tab) => {
                const labels = {
                  all: `All (${items.length})`,
                  vocab: `Vocab (${items.filter((i) => i.category === "vocab").length})`,
                  formula: `Formulas (${items.filter((i) => i.category === "formula").length})`,
                  question: `Questions (${items.filter((i) => i.category === "question").length})`,
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab
                        ? "bg-foreground text-background shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/80"
                    }`}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search saved cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-10 rounded-2xl bg-card/60 backdrop-blur-md border border-border/40 text-xs font-medium focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Bookmarks Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => {
                const glowMap = {
                  vocab: "bg-violet-500/10",
                  formula: "bg-emerald-500/10",
                  question: "bg-amber-500/10",
                };
                const tagTheme = {
                  vocab: "text-violet-500 bg-violet-500/10 border-violet-500/20",
                  formula: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                  question: "text-amber-500 bg-amber-500/10 border-amber-500/20",
                };

                return (
                  <div
                    key={item.id}
                    className="p-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/40 shadow-xl shadow-black/5 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tagTheme[item.category]}`}>
                          {item.tag}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopy(item.id, `${item.title}: ${item.content}`)}
                            title="Copy to clipboard"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors cursor-pointer"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Remove bookmark"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <div className="text-[11px] font-mono font-semibold text-muted-foreground mt-0.5 mb-3">
                        {item.subtitle}
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed font-medium bg-card/40 backdrop-blur-sm p-3.5 rounded-2xl border border-border/30">
                        {item.content}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border/40 relative z-10 flex items-center justify-between">
                      <Link href={item.linkTo} className="w-full">
                        <Button
                          variant="ghost"
                          className="w-full h-9 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider gap-1.5 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 border border-amber-500/20"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          Practice Related Module
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/40 flex flex-col items-center justify-center text-center max-w-md mx-auto my-8">
              <Bookmark className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <h4 className="text-base font-black text-foreground">No Bookmarks Found</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Save difficult flashcards, math shortcuts, or static GK points while practicing to access them quickly here.
              </p>
            </div>
          )}
        </div>
      </TopicPageLayout>
    </ProtectedRoute>
  );
}
