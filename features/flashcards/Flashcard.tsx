import React, { useState, useEffect } from "react";
import {
  FlashCardInterface,
  FlashCardBackProps,
  FlashCardFrontProps,
} from "@/lib/types";

export interface ColorScheme {
  bg: string;
  textMain: string;
  textSecondary: string;
  accent: string;
  accentBg: string;
  border: string;
}

interface FlashCardProps {
  card: FlashCardInterface;
  onFlipChange?: (flipped: boolean) => void;
  colorScheme?: ColorScheme;
  activeFilters?: string[];
  isDragging?: boolean;
}

interface CardFrontPropsWithStyle extends FlashCardFrontProps {
  scheme?: ColorScheme;
  tags?: string[];
  type?: string;
  activeFilters?: string[];
}

interface CardBackPropsWithStyle extends FlashCardBackProps {
  scheme?: ColorScheme;
}


const DEFAULT_SCHEME: ColorScheme = {
  bg: "from-stone-50 to-stone-100/90 dark:from-zinc-900 dark:to-zinc-950",
  textMain: "text-stone-900 dark:text-zinc-100",
  textSecondary: "text-stone-600 dark:text-zinc-400",
  accent: "text-amber-600 dark:text-amber-400",
  accentBg: "bg-white/60 dark:bg-zinc-800/60 border-stone-200/80 dark:border-zinc-700/40",
  border: "border border-stone-200/80 dark:border-zinc-800"
};

const CardFront = ({ text, pronunciation, scheme = DEFAULT_SCHEME, tags = [], type, activeFilters = [] }: CardFrontPropsWithStyle) => {
  const [animate, setAnimate] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 10);
    
    // Always show hint
    setShowHint(true);
    
    return () => clearTimeout(timeout);
  }, [text]);

  const activeFiltersLower = activeFilters.map(f => f.toLowerCase());
  const validTags = tags.filter(tag => tag && tag.trim().length > 0 && activeFiltersLower.includes(tag.toLowerCase()));
  const showType = type && type.toLowerCase() !== "vocabulary" && activeFiltersLower.includes(type.toLowerCase());

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(0deg)",
      }}
      className={`bg-gradient-to-br ${scheme.bg} flex flex-col items-center justify-between gap-1.5 rounded-3xl shadow-2xl ${scheme.border} text-center px-4 py-4 sm:px-6 sm:py-5 overflow-hidden`}
    >
      {/* Badges Container */}
      <div className="w-full flex flex-wrap gap-1.5 justify-center items-center opacity-95 z-10 pt-1">
        {showType && (
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${scheme.accent} bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-xs backdrop-blur-md ${animate ? "animate-fadeIn" : ""}`}>
            {type}
          </span>
        )}
        {validTags.map((tag, idx) => (
          <span key={idx} className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${scheme.textSecondary} bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-xs backdrop-blur-md ${animate ? "animate-fadeIn" : ""}`} style={{ animationDelay: `${50 * (idx + 1)}ms` }}>
            {tag}
          </span>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 my-auto">
        <p
          key={text}
          className={`text-2xl min-[375px]:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${scheme.textMain} pb-1 ${animate ? "animate-fadeIn" : ""}`}
        >
          {text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}
        </p>
        {pronunciation && (
          <div className="mt-1.5">
            <span
              className={`${scheme.accent} text-xs min-[375px]:text-sm sm:text-base font-bold bg-black/5 dark:bg-white/10 px-3 py-0.5 sm:py-1 rounded-full border border-black/10 dark:border-white/15 backdrop-blur-sm ${animate ? "animate-fadeIn" : ""}`}
              style={{ animationDelay: "150ms" }}
            >
              {pronunciation.hindi}
            </span>
          </div>
        )}
      </div>
      <div className="pb-1 h-7 flex items-center justify-center relative z-10">
        {showHint && (
          <div
            className={`${scheme.textSecondary} text-[9px] sm:text-[10px] font-mono font-semibold tracking-wider uppercase select-none flex items-center justify-center opacity-80 bg-black/5 dark:bg-white/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-black/10 dark:border-white/15`}
          >
            <span>Tap to flip · Swipe to next</span>
          </div>
        )}
      </div>
    </div>
  );
};

const CardBack = ({
  content_eng,
  example_eng,
  content_hindi,
  example_hindi,
  synonyms,
  antonyms,
  scheme = DEFAULT_SCHEME
}: CardBackPropsWithStyle) => {
  const hindiexample = example_hindi && example_hindi[0].split("।");
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(-180deg)",
      }}
      className={`bg-gradient-to-br ${scheme.bg} ${scheme.textMain} rounded-3xl flex flex-col justify-between gap-2.5 sm:gap-3.5 shadow-2xl ${scheme.border} text-left px-4 py-3.5 sm:px-6 sm:py-5 overflow-hidden`}
    >
      {/* 1. Definition Section */}
      <div id="flashcard_definition" className="space-y-1 relative z-10">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase ${scheme.accent} bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/15 backdrop-blur-md`}>
            Definition
          </span>
        </div>
        <p className={`text-sm sm:text-base md:text-lg font-bold leading-snug tracking-tight ${scheme.textMain}`}>
          {content_eng}
        </p>
        {content_hindi && content_hindi.length > 0 && (
          <p className={`text-xs sm:text-sm font-semibold ${scheme.accent} opacity-95`}>
            ({content_hindi.join(", ")})
          </p>
        )}
      </div>

      {/* 2. Synonyms & Antonyms Subcards */}
      {((synonyms && synonyms.length > 0) || (antonyms && antonyms.length > 0)) && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full relative z-10">
          {synonyms && synonyms.length > 0 && (
            <div className="flex flex-col gap-1 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-black/[0.03] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 backdrop-blur-md shadow-xs">
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                Synonyms
              </span>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {synonyms.slice(0, 3).map((syn) => (
                  <span
                    key={syn}
                    className={`px-2 py-0.5 text-[10px] sm:text-xs font-mono font-bold rounded-lg bg-white/90 dark:bg-white/10 ${scheme.textMain} border border-black/5 dark:border-white/15 shadow-2xs`}
                  >
                    {syn.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {antonyms && antonyms.length > 0 && (
            <div className="flex flex-col gap-1 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-black/[0.03] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 backdrop-blur-md shadow-xs">
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase">
                Antonyms
              </span>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {antonyms.slice(0, 3).map((ant) => (
                  <span
                    key={ant}
                    className={`px-2 py-0.5 text-[10px] sm:text-xs font-mono font-bold rounded-lg bg-white/90 dark:bg-white/10 ${scheme.textMain} border border-black/5 dark:border-white/15 shadow-2xs`}
                  >
                    {ant.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Example Subcard */}
      {example_eng && example_eng.length > 0 && (
        <div id="flashcard_examples" className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-black/[0.03] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 backdrop-blur-md space-y-0.5 sm:space-y-1 relative z-10 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className={`text-[8px] sm:text-[9px] font-mono font-bold ${scheme.accent} tracking-widest uppercase`}>
              Example
            </span>
          </div>
          <div>
            <p className={`text-xs sm:text-sm md:text-base font-semibold italic ${scheme.textMain} leading-relaxed`}>
              &ldquo;{example_eng[0]}&rdquo;
            </p>
            {hindiexample?.[0] && (
              <p className={`text-[11px] sm:text-xs font-medium ${scheme.textSecondary} mt-0.5 leading-normal`}>
                {hindiexample[0]}
                {hindiexample[0] ? "।" : ""}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Flashcard = ({ card, onFlipChange, colorScheme, activeFilters = [], isDragging = false }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Reset flipped state when card changes
  useEffect(() => {
    setIsFlipped(false);
    if (onFlipChange) onFlipChange(false);
  }, [card._id]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging) return;
    
    const newState = !isFlipped;
    setIsFlipped(newState);
    if (newState && typeof window !== "undefined") {
      localStorage.setItem("hasFlippedFlashcard", "true");
    }
    
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
    }

    if (onFlipChange) {
      if (newState) {
        flipTimeoutRef.current = setTimeout(() => onFlipChange(true), 200);
      } else {
        onFlipChange(false);
      }
    }
  };

  return (
    <div
      style={{
        perspective: "1000px",
        WebkitPerspective: "1000px",
      }}
      className="w-full h-[380px] min-[375px]:h-[440px] sm:h-[500px] cursor-pointer select-none"
      onClick={handleClick}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(-180deg)" : "rotateY(0deg)",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className="relative w-full h-full"
      >
        <CardFront
          text={card.front.text}
          pronunciation={card.front.pronunciation}
          scheme={colorScheme}
          tags={card.tags}
          type={card.type}
          activeFilters={activeFilters}
        />
        <CardBack
          content_eng={card.back.content_eng}
          example_eng={card.back.example_eng}
          content_hindi={card.back.content_hindi}
          example_hindi={card.back.example_hindi}
          antonyms={card.back.antonyms}
          synonyms={card.back.synonyms}
          scheme={colorScheme}
        />
      </div>
    </div>
  );
};

export default Flashcard;
