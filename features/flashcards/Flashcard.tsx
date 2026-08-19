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
  accentBg?: string;
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
  border: "border-2 border-stone-200/80 dark:border-zinc-800",
};

const CardFront = ({ text, pronunciation, scheme = DEFAULT_SCHEME }: CardFrontPropsWithStyle) => {
  const [animate, setAnimate] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 10);
    
    // Always show hint
    setShowHint(true);
    
    return () => clearTimeout(timeout);
  }, [text]);

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
      className={`bg-gradient-to-br ${scheme.bg} flex flex-col items-center justify-between gap-2 rounded-3xl shadow-2xl ${scheme.border} text-center p-4 sm:p-6 md:p-7 overflow-hidden`}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 my-auto">
        <p
          key={text}
          className={`text-3xl min-[375px]:text-4xl sm:text-5xl font-black tracking-tight ${scheme.textMain} pb-1 ${animate ? "animate-fadeIn" : ""}`}
        >
          {text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}
        </p>
        {pronunciation && (
          <div className="mt-1.5">
            <span
              className={`${scheme.accent} text-xs min-[375px]:text-sm sm:text-base font-bold bg-black/5 dark:bg-white/10 px-3 py-0.5 sm:py-1 rounded-full border-2 border-black/10 dark:border-white/15 backdrop-blur-sm ${animate ? "animate-fadeIn" : ""}`}
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
            className={`${scheme.textSecondary} text-[9px] sm:text-[10px] font-mono font-semibold tracking-wider uppercase select-none flex items-center justify-center opacity-80 bg-black/5 dark:bg-white/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border-2 border-black/10 dark:border-white/15`}
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
      className={`bg-gradient-to-br ${scheme.bg} ${scheme.textMain} rounded-3xl flex flex-col justify-center gap-3.5 sm:gap-4.5 md:gap-5 shadow-2xl ${scheme.border} text-left p-4 sm:p-6 md:p-7 overflow-hidden`}
    >
      {/* 1. Definition Section */}
      <div id="flashcard_definition" className="space-y-1.5 relative z-10">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase ${scheme.accent} bg-black/5 dark:bg-white/10 border-2 border-black/5 dark:border-white/15 backdrop-blur-md`}>
            Definition
          </span>
        </div>
        <p className={`text-base sm:text-lg md:text-xl font-bold leading-snug tracking-tight ${scheme.textMain}`}>
          {content_eng}
        </p>
        {content_hindi && content_hindi.length > 0 && (
          <p className={`text-sm sm:text-base font-semibold ${scheme.accent} opacity-95`}>
            ({content_hindi.join(", ")})
          </p>
        )}
      </div>

      {/* 2. Synonyms & Antonyms Subcards */}
      {((synonyms && synonyms.length > 0) || (antonyms && antonyms.length > 0)) && (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full relative z-10">
          {synonyms && synonyms.length > 0 && (
            <div className={`flex flex-col gap-1.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${scheme.accentBg || "bg-black/[0.03] dark:bg-white/[0.06] border-2 border-black/5 dark:border-white/10"} backdrop-blur-md shadow-xs`}>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase text-center w-full">
                Synonyms
              </span>
              <div className="grid grid-cols-1 gap-1.5 w-full">
                {synonyms.slice(0, 2).map((syn) => (
                  <span
                    key={syn}
                    className="px-2.5 py-1.5 text-xs sm:text-sm font-mono font-bold rounded-lg bg-white/90 dark:bg-zinc-800/80 text-stone-900 dark:text-zinc-100 border-2 border-black/5 dark:border-white/15 shadow-2xs flex items-center justify-center text-center leading-none"
                  >
                    {syn.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {antonyms && antonyms.length > 0 && (
            <div className={`flex flex-col gap-1.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${scheme.accentBg || "bg-black/[0.03] dark:bg-white/[0.06] border-2 border-black/5 dark:border-white/10"} backdrop-blur-md shadow-xs`}>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase text-center w-full">
                Antonyms
              </span>
              <div className="grid grid-cols-1 gap-1.5 w-full">
                {antonyms.slice(0, 2).map((ant) => (
                  <span
                    key={ant}
                    className="px-2.5 py-1.5 text-xs sm:text-sm font-mono font-bold rounded-lg bg-white/90 dark:bg-zinc-800/80 text-stone-900 dark:text-zinc-100 border-2 border-black/5 dark:border-white/15 shadow-2xs flex items-center justify-center text-center leading-none"
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
        <div id="flashcard_examples" className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${scheme.accentBg || "bg-black/[0.03] dark:bg-white/[0.06] border-2 border-black/5 dark:border-white/10"} backdrop-blur-md space-y-1.5 relative z-10 shadow-xs`}>
          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase ${scheme.accent} bg-black/5 dark:bg-white/10 border-2 border-black/5 dark:border-white/15 backdrop-blur-md`}>
              Example
            </span>
          </div>
          <div>
            <p className={`text-sm sm:text-base md:text-lg font-semibold italic ${scheme.textMain} leading-relaxed`}>
              &ldquo;{example_eng[0]}&rdquo;
            </p>
            {hindiexample?.[0] && (
              <p className={`text-sm sm:text-base md:text-lg font-medium ${scheme.textSecondary} mt-1 leading-relaxed`}>
                {hindiexample[0]}
                {hindiexample[0] && !hindiexample[0].endsWith("।") && !hindiexample[0].endsWith(".") ? "।" : ""}
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
      className="w-full h-full cursor-pointer select-none"
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
