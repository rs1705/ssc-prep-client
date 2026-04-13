import {
  FlashCardInterface,
  FlashCardBackProps,
  FlashCardFrontProps,
} from "@/lib/types";

interface FlashCardProps {
  card: FlashCardInterface;
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

import { useState, useEffect } from "react";

const CardFront = ({ text, pronunciation }: FlashCardFrontProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Reset animation whenever definition changes
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 10); // tiny delay to restart
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <div className="absolute w-full h-full bg-slate-800 flex flex-col items-center justify-center  gap-1 rounded-xl shadow-xl [backface-visibility:hidden] text-center px-5 py-2">
      <div>
        <p
          key={text} // ensures React re-renders element
          className={`text-3xl bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent font-bold opacity-0 ${
            animate ? "animate-fadeIn" : ""
          }`}
        >
          {text.toUpperCase()}
        </p>
        {pronunciation && (
          <div>
            <span
              className={`text-slate-200 text-md  ${animate} ? "animate-fadeIn" : ""`}
            >
              {pronunciation.hindi}&nbsp;{pronunciation.english}
            </span>
          </div>
        )}
      </div>
      <div className="flex-col items-center justify-center">
        <p
          className={`text-sm text-slate-500 italic font-semibold opacity-0 mt-1 ${
            animate ? "animate-dropIn" : ""
          }`}
        >
          Tap the card to reveal the meaning
        </p>
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
    <div className="absolute w-full h-full bg-slate-800 text-black text-lg rounded-xl flex flex-col  gap-5  justify-center shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] text-left leading-tight px-4 py-2 font-semibold">
      <div id="flashcard_definition">
        <p className="text-xs text-slate-400">DEFINITION:</p>
        <p className="text-xl/tight text-white">{content_eng}</p>
        <p className="text-sm font-semibold bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
          ({content_hindi?.join(", ")})
        </p>
      </div>
      <div>
        {synonyms && synonyms.length > 0 && (
          <div>
            <p className="text-xs text-slate-400">SYNONYMS:</p>
            <p className="text-sm bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
              {synonyms?.join(", ").toUpperCase()}
            </p>
          </div>
        )}
        {antonyms && antonyms.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 ">ANTONYMS:</p>
            <p className="text-sm bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
              {antonyms?.join(", ").toUpperCase()}
            </p>
          </div>
        )}
      </div>
      <div id="flashcard_examples" className="leading-tight">
        <p className="text-xs text-slate-400 ">EXAMPLE</p>
        <div>
          <p className="text-md text-white">{example_eng?.[0]}</p>
          <span className="text-sm/tight bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
            {hindiexample?.[0]}
            {"।"}
          </span>
          <span className="text-sm "> {hindiexample?.[1]}</span>
        </div>
      </div>
    </div>
  );
};

const Flashcard = ({ card, isFlipped, setIsFlipped }: FlashCardProps) => {
  return (
    <div
      className="w-90 h-100 [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full 
          "transition-transform duration-500
        [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(-180deg)]" : ""
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
