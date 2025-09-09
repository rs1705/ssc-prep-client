import { FlashCardInterface, FlashCardBackProps } from "@/lib/types";

interface FlashCardProps {
  card: FlashCardInterface;
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

import { useState, useEffect } from "react";

const CardFront = ({ definition }: { definition: string }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Reset animation whenever definition changes
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 10); // tiny delay to restart
    return () => clearTimeout(timeout);
  }, [definition]);

  return (
    <div className="absolute w-full h-full bg-slate-800 flex flex-col items-center justify-center rounded-xl shadow-xl [backface-visibility:hidden] text-center">
      <h2
        key={definition} // ensures React re-renders element
        className={`text-3xl bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-300 bg-clip-text text-transparent font-bold opacity-0 ${
          animate ? "animate-fadeIn" : ""
        }`}
      >
        {definition.toUpperCase()}
      </h2>

      <p
        className={`text-sm text-slate-300 italic font-light opacity-0 mt-1 ${
          animate ? "animate-dropIn" : ""
        }`}
      >
        Tap the card to reveal the meaning
      </p>
    </div>
  );
};

const CardBack = ({
  definition_eng,
  example_eng,
  definition_hindi,
  example_hindi,
}: FlashCardBackProps) => {
  return (
    <div className="absolute w-full h-full bg-slate-800 text-black text-lg flex flex-col gap-10 justify-center rounded-xl shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] p-4 text-left">
      <div>
        <p className="text-xs text-slate-400 font-semibold italic underline">
          DEFINITION:
        </p>
        <h2 className="text-xl/tight text-white font-semibold ">
          {definition_eng.charAt(0).toUpperCase() + definition_eng.slice(1)}
        </h2>
        <p className="text-sm font-semibold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-300 bg-clip-text text-transparent">
          ({definition_hindi})
        </p>
      </div>
      <div>
        <p className="text-xs text-slate-400 font-semibold italic underline">
          {" "}
          EXAMPLE
        </p>
        <h2 className="text-xl text-white font-semibold">{example_eng}</h2>
        <p className="text-sm  font-semibold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-300 bg-clip-text text-transparent">
          {example_hindi}
        </p>
      </div>
    </div>
  );
};

const Flashcard = ({ card, isFlipped, setIsFlipped }: FlashCardProps) => {
  return (
    <div
      className="w-auto h-100 [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full 
          "transition-transform duration-500
        [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(-180deg)]" : ""
        }`}
      >
        <CardFront definition={card.front} />
        <CardBack
          definition_eng={card.back.definition_eng}
          example_eng={card.back.example_eng}
          definition_hindi={card.back.definition_hindi}
          example_hindi={card.back.example_hindi}
        />
      </div>
    </div>
  );
};

export default Flashcard;
