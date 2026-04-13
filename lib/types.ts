export interface SectionCardProps {
  title: string;
  description: string;
  linkTo: string;
  buttonText: string;
  knowMoreText?: string;
  className?: string;
}

export interface FlashCardInterface {
  _id: string;
  type: string;
  difficulty: string;
  subject: string;
  front: FlashCardFrontProps;
  back: FlashCardBackProps;
  tags: string[];
}
export interface FlashCardFrontProps {
  text: string;
  pronunciation?: {
    english: string;
    hindi: string;
  };
}

export interface FlashCardBackProps {
  content_eng: string;
  example_eng?: [string];
  content_hindi?: [string];
  example_hindi?: [string];
  synonyms?: [string];
  antonyms?: [string];
}
