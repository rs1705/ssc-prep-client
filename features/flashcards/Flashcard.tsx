import React, { useState, useEffect } from "react";
import {
  FlashCardInterface,
  FlashCardBackProps,
  FlashCardFrontProps,
} from "@/lib/types";

interface FlashCardProps {
  card: FlashCardInterface;
  onFlipChange?: (flipped: boolean) => void;
}


const CardFront = ({ text, pronunciation }: FlashCardFrontProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <div className="absolute w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex flex-col items-center justify-center gap-2 rounded-2xl shadow-xl border border-slate-600/50 [backface-visibility:hidden] text-center px-6 py-4">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <p
          key={text}
          className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent opacity-0 pb-2 ${animate ? "animate-fadeIn" : ""
            }`}
        >
          {text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}
        </p>
        {pronunciation && (
          <div className="mt-3">
            <span
              className={`text-slate-200 text-lg font-medium opacity-0 ${animate ? "animate-fadeIn" : ""
                }`}
              style={{ animationDelay: "150ms" }}
            >
              {pronunciation.hindi} &bull; {pronunciation.english}
            </span>
          </div>
        )}
      </div>
      <div className="pb-4">
        <div
          className={`px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold tracking-wide opacity-0 ${animate ? "animate-dropIn" : ""
            } animate-pulse shadow-sm`}
          style={{ animationDelay: "300ms" }}
        >
          Tap the card to reveal the meaning
        </div>
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
}: FlashCardBackProps) => {
  const hindiexample = example_hindi && example_hindi[0].split("।");
  return (
    <div className="absolute w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 text-slate-100 text-lg rounded-2xl flex flex-col gap-5 justify-start shadow-xl border border-slate-600/50 [backface-visibility:hidden] [transform:rotateY(180deg)] text-left leading-relaxed px-6 py-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div id="flashcard_definition" className="space-y-1.5 mt-auto">
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
          Definition
        </p>
        <p className="text-xl font-medium leading-snug text-white">{content_eng}</p>
        <p className="text-sm font-semibold bg-gradient-to-r from-amber-400 via-amber-400 to-amber-400 bg-clip-text text-transparent">
          ({content_hindi?.join(", ")})
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {synonyms && synonyms.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
              Synonyms
            </p>
            <p className="text-sm font-medium bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-clip-text text-transparent">
              {synonyms.slice(0, 3).join(", ").toUpperCase()}
            </p>
          </div>
        )}
        {antonyms && antonyms.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
              Antonyms
            </p>
            <p className="text-sm font-medium bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-clip-text text-transparent">
              {antonyms.slice(0, 3).join(", ").toUpperCase()}
            </p>
          </div>
        )}
      </div>

      <div id="flashcard_examples" className="space-y-1.5 bg-transparent p-3 -mx-2 rounded-xl border border-slate-500/70">
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
          Example
        </p>
        <div>
          <p className="text-base font-medium text-white">
            {example_eng?.[0]}
          </p>
          <p className="text-sm font-medium bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-clip-text text-transparent mt-1">
            {hindiexample?.[0]}
            {hindiexample?.[0] ? "।" : ""}
            <span className="text-slate-200 ml-1">{hindiexample?.[1]}</span>
          </p>
        </div>
      </div>
      <div className="mb-auto"></div>
    </div>
  );
};

const Flashcard = ({ card, onFlipChange }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    const newState = !isFlipped;
    setIsFlipped(newState);
    if (onFlipChange) onFlipChange(newState);
  };

  return (
    <div
      className="w-full h-[380px] sm:h-[420px] [perspective:1000px] cursor-pointer"
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
        />
        <CardBack
          content_eng={card.back.content_eng}
          example_eng={card.back.example_eng}
          content_hindi={card.back.content_hindi}
          example_hindi={card.back.example_hindi}
          antonyms={card.back.antonyms}
          synonyms={card.back.synonyms}
        />
      </div>
    </div>
  );
};

export default Flashcard;
