/** Cards are either "likes" or "yikes". */
export enum CardType {
  Likes = 'likes',
  Yikes = 'yikes',
}

/** Card represents a single card. */
export default class Card {
  /** All card text, including blanks represented by 5 underscores. */
  public text!: string;

  /** Represents the type of the card. */
  public type!: CardType;
}
