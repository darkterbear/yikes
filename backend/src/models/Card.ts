import fs from 'fs';

/** Cards are either "likes" or "yikes". */
export enum CardType {
  Likes = 'likes',
  Yikes = 'yikes',
}

/** Card represents a single card. */
export default class Card {

  public static likesPerPlayer = Number(process.env.LIKES_PER_PLAYER);
  public static yikesPerPlayer = Number(process.env.YIKES_PER_PLAYER);

  /** Returns a deep copy of likesCardSet. */
  public static newLikesDeck() {
    const deck = [];
    for (const card of likesCardSet) {
      deck.push(Card.clone(card));
    }
    return deck;
  }

  /** Returns a deep copy of yikesCardSet. */
  public static newYikesDeck() {
    const deck = [];
    for (const card of yikesCardSet) {
      deck.push(Card.clone(card));
    }
    return deck;
  }

  /** Shuffles a deck in-place. */
  public static shuffle(deck: Card[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  /** Draws a card from the deck w/o replacement. */
  public static draw(deck: Card[]) {
    return deck.splice(0, 1)[0];
  }

  public static clone(card: Card) {
    return new Card(card.text, card.type);
  }

  /** All card text, including blanks represented by 5 underscores. */
  public text!: string;

  /** Represents the type of the card. */
  public type!: CardType;

  /** Represents the text that the player uses to fill blanks. */
  public filledText!: string[];

  constructor(text: string, type: CardType) {
    this.text = text;
    this.type = type;
    this.filledText = [];
  }
}

// Load cards from card files
const likesFile = './cards/likes.txt';
const yikesFile = './cards/yikes.txt';

const likesCardSet: Card[] = [];
const yikesCardSet: Card[] = [];

for (const likeText of fs.readFileSync(likesFile, 'utf8').split('\n')) {
  if (likeText.length > 0) {
    likesCardSet.push(new Card(likeText, CardType.Likes));
  }
}

for (const yikeText of fs.readFileSync(yikesFile, 'utf8').split('\n')) {
  if (yikeText.length > 0) {
    yikesCardSet.push(new Card(yikeText, CardType.Yikes));
  }
}
