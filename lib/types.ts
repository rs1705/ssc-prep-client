export interface SectionCardProps {
  title: string;
  description: string;
  linkTo: string;
  buttonText: string;
  knowMoreText?:string
  className?:string;
};

export interface FlashCardInterface {
  type:string,
  front: string; // word/question
  back:FlashCardBackProps,
}

export interface FlashCardBackProps {
  definition_eng: string;
  example_eng?: string; // make optional (matches Card.example_sentence)
  definition_hindi?: string; // make optional (matches Card.hindi_meaning)
  example_hindi?: string; // make optional (matches Card.hindi_sentence)
}