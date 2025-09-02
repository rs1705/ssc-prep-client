interface Card {
  front: string; // word/question
  back: string; // definition/answer
  example_sentence?: string; // optional example usage
  hindi_meaning?: string; // optional Hindi meaning
  hindi_sentence?: string; // optional Hindi sentence
}

interface FlashCardBackProps {
  definition: string;
  example?: string; // make optional (matches Card.example_sentence)
  hindi_definition?: string; // make optional (matches Card.hindi_meaning)
  hindi_example?: string; // make optional (matches Card.hindi_sentence)
}

interface FlashCardProps {
  card: Card;
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}
const CardBack = ({
  definition,
  example,
  hindi_definition,
  hindi_example,
}: FlashCardBackProps) => {
  return (
    <div className="absolute w-full h-full bg-slate-800 text-black text-lg flex flex-col gap-10 justify-center rounded-xl shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] p-4 text-center">
      <div>
        <p className="text-center text-sm text-slate-400 font-semibold">
          DEFINITION
        </p>
        <h2 className="text-2xl text-white font-bold">
          {definition.toUpperCase()}
        </h2>
        <p className="text-lg font-semibold bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 bg-clip-text text-transparent">
          ({hindi_definition})
        </p>
      </div>
      <div>
        <p className="text-center  text-sm font-semibold text-slate-400">
          EXAMPLE
        </p>
        <h2 className="text-2xl text-white font-bold">{example}</h2>
        <p className="text-lg bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 bg-clip-text text-transparent font-semibold">
          {hindi_example}
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
        <div>
          <div className="absolute w-full h-full bg-slate-800 text-4xl flex items-center justify-center rounded-xl shadow-xl [backface-visibility:hidden] text-center">
            <div>
              <h2 className="text-4xl bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 bg-clip-text text-transparent font-bold ">
                {card.front.toUpperCase()}
              </h2>
              <p className="font-light  text-sm text-slate-300 italic">
                Tap the card to reveal the meaning
              </p>
            </div>
          </div>
        </div>
        {/* Back */}
        <CardBack
          definition={card.back}
          example={card.example_sentence}
          hindi_definition={card.hindi_meaning}
          hindi_example={card.hindi_sentence}
        />
      </div>
    </div>
  );
};

export default Flashcard;
