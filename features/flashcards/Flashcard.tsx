import { FlashCardInterface, FlashCardBackProps } from "@/lib/types";

interface FlashCardProps {
  card: FlashCardInterface;
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

const CardFront = ({ definition }: { definition: string }) => {
  return (
    <div>
      <div className="absolute w-full h-full bg-slate-800 text-2xl flex items-center justify-center rounded-xl shadow-xl [backface-visibility:hidden] text-center">
        <div>
          <h2 className="text-3xl bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 bg-clip-text text-transparent font-bold ">
            {definition.toUpperCase()}
          </h2>
          <p className="font-light  text-sm text-slate-300 italic">
            Tap the card to reveal the meaning
          </p>
        </div>
      </div>
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
    <div className="absolute w-full h-full bg-slate-800 text-black text-lg flex flex-col gap-10 justify-center rounded-xl shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] p-4 text-center">
      <div>
        <p className="text-center text-sm text-slate-400 font-semibold">
          DEFINITION
        </p>
        <h2 className="text-2xl text-white font-semibold">
          {definition_eng.charAt(0).toUpperCase() + definition_eng.slice(1)}
        </h2>
        <p className="text-md bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 bg-clip-text text-transparent">
          ({definition_hindi})
        </p>
      </div>
      <div>
        <p className="text-center  text-sm font-semibold text-slate-400">
          EXAMPLE
        </p>
        <h2 className="text-2xl text-white font-semibold">{example_eng}</h2>
        <p className="text-md bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 bg-clip-text text-transparent">
          {example_hindi}
        </p>
      </div>
    </div>
  );
};

const Flashcard = ({ card, isFlipped, setIsFlipped }: FlashCardProps) => {
  return (
    <div
      className="w-100 h-100 [perspective:1000px] cursor-pointer flex justify-center"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full 
          "transition-transform duration-500
        [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(-180deg)]" : ""
        }`}
      >
        {/* Front */}
        <CardFront definition={card.front} />
        {/* Back */}
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
