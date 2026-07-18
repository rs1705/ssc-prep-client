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
}

interface CardFrontPropsWithStyle extends FlashCardFrontProps {
  scheme?: ColorScheme;
}

interface CardBackPropsWithStyle extends FlashCardBackProps {
  scheme?: ColorScheme;
}


const DEFAULT_SCHEME: ColorScheme = {
  bg: "from-slate-700 to-slate-800",
  textMain: "text-white",
  textSecondary: "text-slate-400",
  accent: "text-amber-400",
  accentBg: "bg-amber-400/10 border-amber-400/20",
  border: "border border-slate-600/50"
};

const CardFront = ({ text, pronunciation, scheme = DEFAULT_SCHEME }: CardFrontPropsWithStyle) => {
  const [animate, setAnimate] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 10);
    
    // Only show hint if they haven't flipped a card yet
    const hasFlipped = localStorage.getItem("hasFlippedFlashcard");
    if (!hasFlipped) {
      setShowHint(true);
    }
    
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <div className={`absolute w-full h-full bg-gradient-to-br ${scheme.bg} flex flex-col items-center justify-center gap-2 rounded-2xl shadow-xl ${scheme.border} [backface-visibility:hidden] text-center px-6 py-4`}>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <p
          key={text}
          className={`text-3xl min-[375px]:text-4xl font-extrabold tracking-tight ${scheme.textMain} opacity-0 pb-2 ${animate ? "animate-fadeIn" : ""}`}
        >
          {text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}
        </p>
        {pronunciation && (
          <div className="mt-3">
            <span
              className={`${scheme.accent} text-base min-[375px]:text-lg font-bold opacity-0 ${animate ? "animate-fadeIn" : ""}`}
              style={{ animationDelay: "150ms" }}
            >
              {pronunciation.hindi}
            </span>
          </div>
        )}
      </div>
      <div className="pb-4 h-8 flex items-center justify-center">
        {showHint && (
          <div
            className={`px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-[11px] font-semibold tracking-wide opacity-0 ${animate ? "animate-dropIn animate-pulse" : ""} shadow-sm select-none flex items-center gap-2`}
            style={{ animationDelay: "300ms", animationDuration: "2s" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M18 9v6a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-4a2 2 0 0 1 2-2h1.5"/><path d="M22 13a4 4 0 0 0-4-4h-2"/></svg>
            <span>Tap to reveal • Swipe to navigate</span>
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
    <div className={`absolute w-full h-full bg-gradient-to-br ${scheme.bg} ${scheme.textMain} text-lg rounded-2xl flex flex-col gap-2.5 justify-start shadow-xl ${scheme.border} [backface-visibility:hidden] [transform:rotateY(180deg)] text-left leading-relaxed px-6 py-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
      <div id="flashcard_definition" className="space-y-1.5 mt-auto">
        <p className={`text-xs font-bold ${scheme.accent} tracking-widest uppercase`}>
          Definition
        </p>
        <p className="text-base min-[375px]:text-lg font-medium leading-snug">{content_eng}</p>
        <p className={`text-xs min-[375px]:text-sm font-semibold ${scheme.accent}`}>
          ({content_hindi?.join(", ")})
        </p>
      </div>

      <div className="flex w-full gap-4 items-stretch">
        {synonyms && synonyms.length > 0 && (
          <div className="flex-1 space-y-2 flex flex-col items-start text-left">
            <p className={`text-xs font-bold ${scheme.accent} tracking-widest uppercase`}>
              Synonyms
            </p>
            <div className="flex flex-col gap-1.5 items-start w-full">
              {synonyms.slice(0, 2).map((syn) => (
                <span
                  key={syn}
                  className={`px-2 py-0.5 text-xs font-semibold rounded-md ${scheme.textMain} bg-white/40 border border-black/5 text-left`}
                >
                  {syn.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {synonyms && synonyms.length > 0 && antonyms && antonyms.length > 0 && (
          <div className="w-[1px] bg-black/10 self-stretch" />
        )}

        {antonyms && antonyms.length > 0 && (
          <div className="flex-1 space-y-2 flex flex-col items-start text-left">
            <p className={`text-xs font-bold ${scheme.accent} tracking-widest uppercase`}>
              Antonyms
            </p>
            <div className="flex flex-col gap-1.5 items-start w-full">
              {antonyms.slice(0, 2).map((ant) => (
                <span
                  key={ant}
                  className={`px-2 py-0.5 text-xs font-semibold rounded-md ${scheme.textMain} bg-white/40 border border-black/5 text-left`}
                >
                  {ant.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div id="flashcard_examples" className={`space-y-1 bg-transparent p-3.5 -mx-1 rounded-xl border ${scheme.accentBg}`}>
        <p className={`text-xs font-bold ${scheme.accent} tracking-widest uppercase`}>
          Example
        </p>
        <div>
          <p className={`text-sm min-[375px]:text-base font-semibold italic ${scheme.textMain} leading-normal`}>
            &quot;{example_eng?.[0]}&quot;
          </p>
          <p className={`text-xs min-[375px]:text-sm font-semibold ${scheme.textSecondary} mt-0.5 leading-normal`}>
            {hindiexample?.[0]}
            {hindiexample?.[0] ? "।" : ""}
          </p>
        </div>
      </div>
      <div className="mb-auto"></div>
    </div>
  );
};

const Flashcard = ({ card, onFlipChange, colorScheme }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    const newState = !isFlipped;
    setIsFlipped(newState);
    if (newState && typeof window !== "undefined") {
      localStorage.setItem("hasFlippedFlashcard", "true");
    }
    if (onFlipChange) onFlipChange(newState);
  };

  return (
    <div
      className="w-full h-[380px] min-[375px]:h-[440px] sm:h-[500px] [perspective:1000px] cursor-pointer select-none"
      onClick={handleClick}
    >
      <div
        className={`relative w-full h-full 
          transition-transform duration-500
        [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(-180deg)]" : ""
          }`}
      >
        <CardFront
          text={card.front.text}
          pronunciation={card.front.pronunciation}
          scheme={colorScheme}
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
