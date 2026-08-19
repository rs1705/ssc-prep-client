"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calculator, Sparkles, Copy, Check, Eye, EyeOff, 
  Swords, Search, BookOpen, ChevronRight 
} from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormulaCard {
  id: string;
  category: "algebra" | "trigo" | "geometry" | "mensuration" | "arithmetic";
  title: string;
  formula: string;
  explanation: string;
  example: string;
  tag: string;
}

const FORMULAS: FormulaCard[] = [
  {
    id: "f-1",
    category: "algebra",
    title: "If x + 1/x = k",
    formula: "x² + 1/x² = k² - 2  ·  x³ + 1/x³ = k³ - 3k",
    explanation: "Standard algebraic symmetric recurrence for higher polynomial degrees.",
    example: "If x + 1/x = 4, then x² + 1/x² = 14, and x³ + 1/x³ = 52.",
    tag: "Algebra PYQ Favorite",
  },
  {
    id: "f-2",
    category: "algebra",
    title: "Sum of Cubes: a³ + b³ + c³ - 3abc",
    formula: "(a + b + c) · [a² + b² + c² - (ab + bc + ca)]",
    explanation: "Special Condition: If a + b + c = 0, then a³ + b³ + c³ = 3abc.",
    example: "If a = 25, b = -15, c = -10, sum is 0, so a³ + b³ + c³ = 3(25)(-15)(-10) = 11,250.",
    tag: "SSC CGL Tier 1 & 2",
  },
  {
    id: "f-3",
    category: "trigo",
    title: "Secant & Tangent Conjugate: sec θ + tan θ = k",
    formula: "sec θ - tan θ = 1/k  ⇒  sec θ = (k² + 1)/2k,  tan θ = (k² - 1)/2k",
    explanation: "Derived directly from sec² θ - tan² θ = 1. Same applies to cosec θ ± cot θ.",
    example: "If sec θ + tan θ = 5, then sec θ - tan θ = 1/5 = 0.2.",
    tag: "Trigonometry",
  },
  {
    id: "f-4",
    category: "geometry",
    title: "Circle Intersecting Chords Theorem",
    formula: "PA · PB = PC · PD",
    explanation: "When two chords AB and CD intersect at point P (internal or external).",
    example: "If PA=4, PB=6, PC=3, then PD = (4×6)/3 = 8 cm.",
    tag: "Geometry Theorem",
  },
  {
    id: "f-5",
    category: "geometry",
    title: "Direct & Transverse Common Tangent (DCT / TCT)",
    formula: "DCT = √(d² - (r₁ - r₂)²)   ·   TCT = √(d² - (r₁ + r₂)²)",
    explanation: "Where d is distance between circle centers, and r₁, r₂ are radii.",
    example: "If d=13, r₁=8, r₂=3, DCT = √(169 - 25) = 12 cm.",
    tag: "Circle Tangents",
  },
  {
    id: "f-6",
    category: "mensuration",
    title: "Frustum of a Right Circular Cone",
    formula: "Volume = (1/3)πh (R² + r² + Rr)  ·  CSA = πl (R + r)",
    explanation: "Where l = √(h² + (R - r)²), R = bottom radius, r = top radius.",
    example: "Used for bucket and truncated conical vessel questions.",
    tag: "Mensuration 3D",
  },
  {
    id: "f-7",
    category: "arithmetic",
    title: "Compound vs Simple Interest Difference (2 & 3 Years)",
    formula: "Diff (2 yrs) = P(R/100)²   ·   Diff (3 yrs) = P(R/100)² · (3 + R/100)",
    explanation: "Fast calculation of principal or rate without compounding manually.",
    example: "If P = ₹10,000, R = 10%, Diff for 2 yrs = 10000 × (0.01) = ₹100.",
    tag: "CI - SI Shortcut",
  },
  {
    id: "f-8",
    category: "arithmetic",
    title: "Alligation & Mixture Rule",
    formula: "Quantity (Cheaper) / Quantity (Dearer) = (d - m) / (m - c)",
    explanation: "Where c = cheaper price, d = dearer price, m = mean average price.",
    example: "Mix ₹15/kg wheat with ₹20/kg wheat to get ₹18/kg ⇒ ratio is (20-18)/(18-15) = 2:3.",
    tag: "Mixture Ratio",
  },
  {
    id: "f-9",
    category: "geometry",
    title: "Inradius & Circumradius of Right-Angled Triangle",
    formula: "Inradius (r) = (P + B - H)/2   ·   Circumradius (R) = H/2",
    explanation: "Where P = Perpendicular, B = Base, H = Hypotenuse. Area = r × s (semi-perimeter).",
    example: "For a 6, 8, 10 triangle: r = (6 + 8 - 10)/2 = 2 cm, R = 10/2 = 5 cm.",
    tag: "Triangle Radii",
  },
  {
    id: "f-10",
    category: "geometry",
    title: "Apollonius' Theorem (Median Length)",
    formula: "AB² + AC² = 2(AD² + BD²)",
    explanation: "Where AD is median to side BC in triangle ABC, and BD = DC = BC/2.",
    example: "If AB=7, AC=9, BC=8 (BD=4), then 49 + 81 = 2(AD² + 16) ⇒ AD = 7 cm.",
    tag: "Median Formula",
  },
  {
    id: "f-11",
    category: "trigo",
    title: "Maxima & Minima of a sin θ + b cos θ",
    formula: "Maximum = +√(a² + b²)   ·   Minimum = -√(a² + b²)",
    explanation: "For a sin² θ + b cosec² θ (where a,b > 0), Minimum Value = 2√(ab).",
    example: "For 3 sin θ + 4 cos θ: Max = +√(9 + 16) = +5, Min = -5.",
    tag: "Trigo Extrema",
  },
  {
    id: "f-12",
    category: "arithmetic",
    title: "Successive Discounts & Equivalence",
    formula: "Single Equivalent Discount = x + y - (xy / 100) %",
    explanation: "For 3 successive discounts: compute for first two, then combine with third.",
    example: "Two successive discounts of 20% and 10% = 20 + 10 - 2 = 28% total discount.",
    tag: "Profit & Discount",
  },
  {
    id: "f-13",
    category: "arithmetic",
    title: "Boats & Streams (Upstream & Downstream)",
    formula: "Boat Speed (u) = (D + U)/2   ·   Current Speed (v) = (D - U)/2",
    explanation: "Where D = Downstream Speed (u + v), U = Upstream Speed (u - v).",
    example: "If Downstream is 14 km/h and Upstream is 8 km/h, Boat in still water = (14+8)/2 = 11 km/h.",
    tag: "Speed & Streams",
  },
  {
    id: "f-14",
    category: "mensuration",
    title: "Rhombus: Area & Side Relation",
    formula: "Area = (1/2) · d₁ · d₂   ·   4a² = d₁² + d₂²",
    explanation: "Diagonals of a rhombus bisect each other at 90 degrees.",
    example: "If d₁=12, d₂=16, then Area = (1/2)(12)(16) = 96 cm², Side a = √(36 + 64) = 10 cm.",
    tag: "Rhombus Geometry",
  },
];

export default function FormulaPracticePage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hiddenFormulas, setHiddenFormulas] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleHide = (id: string) => {
    setHiddenFormulas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFormulas = FORMULAS.filter((f) => {
    const matchesCat = activeCategory === "all" || f.category === activeCategory;
    const matchesQuery = 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <TopicPageLayout
      title="Formulas & Speed Math Cheatsheets"
      description="Essential theorems, algebraic identities, and shortcut formulas calibrated for lightning-fast Tier 1 & Tier 2 solving."
      contentMaxWidthClass="w-full max-w-[1300px]"
    >
      <div className="flex flex-col gap-8 py-2">
        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 bg-card/60 backdrop-blur-md border-2 border-border/40 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto scrollbar-none">
            {[
              { id: "all", label: "All Formulas" },
              { id: "algebra", label: "Algebra" },
              { id: "trigo", label: "Trigonometry" },
              { id: "geometry", label: "Geometry" },
              { id: "mensuration", label: "Mensuration" },
              { id: "arithmetic", label: "Arithmetic" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search formulas & identities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 pl-10 rounded-2xl bg-card/60 backdrop-blur-md border-2 border-border/40 text-xs font-medium focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredFormulas.map((card) => {
            const isHidden = hiddenFormulas[card.id];
            return (
              <div
                key={card.id}
                className="p-6 sm:p-7 rounded-3xl bg-card/60 backdrop-blur-xl border-2 border-border/40 shadow-xl shadow-black/5 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border-2 border-amber-500/20">
                      {card.tag}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleHide(card.id)}
                        title={isHidden ? "Reveal formula" : "Hide formula to test yourself"}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors cursor-pointer"
                      >
                        {isHidden ? <Eye className="w-3.5 h-3.5 text-amber-500" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(card.id, card.formula)}
                        title="Copy formula"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors cursor-pointer"
                      >
                        {copiedId === card.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground mb-3">
                    {card.title}
                  </h3>

                  {/* Formula Box */}
                  <div className={`p-4 rounded-2xl border-2 transition-all duration-300 font-mono text-sm sm:text-base font-black ${
                    isHidden 
                      ? "bg-muted/40 border-border/40 text-muted-foreground/30 blur-sm select-none cursor-pointer" 
                      : "bg-card/80 border-amber-500/30 text-amber-500 shadow-inner"
                  }`}
                  onClick={() => isHidden && toggleHide(card.id)}
                  >
                    {card.formula}
                  </div>

                  <p className="text-xs text-foreground/80 leading-relaxed font-medium mt-3">
                    {card.explanation}
                  </p>

                  <div className="text-xs text-muted-foreground bg-card/40 border-2 border-border/30 p-2.5 rounded-xl mt-2 font-mono">
                    <span className="text-foreground font-bold">Example:</span> {card.example}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t-2 border-border/40 relative z-10">
                  <Link href="/SSC/maths/mental-maths">
                    <Button
                      variant="ghost"
                      className="w-full h-9 rounded-xl text-xs font-mono font-bold uppercase tracking-wider gap-1.5 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 border-2 border-amber-500/20"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      Test in Mental Maths Drill
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TopicPageLayout>
  );
}
