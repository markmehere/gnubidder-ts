import { Card } from "./Card";
import { Suit } from "./deck/Suit";
import { SuitCollection } from "./deck/SuitCollection";

export class Hand {

  public cards: Card[];
  public orderedCards: Card[];
  public color: Suit;
  public colorInOrder: Card[];

  private static createCards(colorSuit: string, color: Suit): Card[] {
    if (!colorSuit.trim()) return [];
    return colorSuit.split(",").map(ct => Card.getFromValues(ct, color));
  }

  public static fromSuits(...colorSuits: string[]) {
    return new Hand(colorSuits.reduce((acc, colorSuitStr, i) => acc.concat(this.createCards(colorSuitStr, SuitCollection.list[i])), []));
  }

  constructor(cards?: Card[]) {
    this.cards = cards ? cards.slice() : [];
  }

  public add(c: Card) {
    this.cards.push(c);
    this.orderedCards = null;
    if (c.denomination === this.color) {
      this.colorInOrder = null;
    }
  }

  public getSuitHi2Low(suit: Suit): Card[] {
    if (suit === this.color && this.colorInOrder != null) {
      return this.colorInOrder;
    }
    const result: Card[] = this.cards
      .filter(c => c.denomination === suit)
      .sort((a, b) => a.hasGreaterValueThan(b) ? -1 : 1);
    this.color = suit;
    this.colorInOrder = result;
    return result;
  }

  public getSuitLength(suit: Suit): number {
    return this.cards.filter(c => c.denomination === suit).length;
  }

  public getCardsHighToLow(): Card[] {
    if (this.orderedCards != null) {
      return this.orderedCards.slice();
    }
    const orderedCards: Card[] = SuitCollection.list.reduce((acc: Card[], color: Suit) => {
      return acc.concat(this.getSuitHi2Low(color));
    }, []);
    this.orderedCards = orderedCards;
    return orderedCards.slice();
  }

  public getLongestSuit(): Suit {
    let longest = 0;
    let result: Suit = null;
    
    SuitCollection.list.forEach((suit: Suit) => {
      const curLength = this.getSuitLength(suit);
      if (longest < curLength) {
        longest = curLength;
        result = suit;
      }
    });
  
    return result;
  }

  public getLongestColorLength(): number {
    return SuitCollection.list.reduce(
      (acc: number, color: Suit) => Math.max(acc, this.getSuitLength(color)), 0);
  }

  public contains(card: Card): boolean {
    if (this.cards.length === 0 && card == null) {
      return true;
    } else {
      return (
        this.cards.indexOf(card) > -1
      );
    }
  }

  public isEmpty(): boolean {
    return this.cards.length === 0;
  }

  public matchesSuitLengthsLongToShort(suitLength1: number, suitLength2: number, suitLength3: number, suitLength4: number): boolean {
    const suitLengths: number[] = SuitCollection.list.map(color => this.getSuitLength(color));
    suitLengths.sort();
    suitLengths.reverse();
    if (suitLengths[0] == suitLength1 && suitLengths[1] == suitLength2 && suitLengths[2] == suitLength3 && suitLengths[3] == suitLength4) {
      return true;
    } else {
      return false;
    }
  }

  public getSuitsWithAtLeastCards(minimumSuitLength: number): Suit[] {
    // What is mmList?
    return SuitCollection.mmList.filter((suit: Suit) => this.getSuitLength(suit) >= minimumSuitLength);
  }

  public getSuitsWithCardCount(suitLength: number): Suit[] {
    return SuitCollection.list.filter((suit: Suit) => this.getSuitLength(suit) === suitLength);
  }

  public getGood5LengthSuits(): Suit[] {
    return SuitCollection.list.filter(suit => this.isGood5LengthSuits(suit));
  }

  public isGood5LengthSuits(suit: Suit): boolean {
    const cardsInSuit: Card[] = this.getSuitHi2Low(suit);
    return cardsInSuit.length >= 5 && (this.isAtLeastAQJXX(cardsInSuit) || this.isAtLeastKQTXX(cardsInSuit));
  }

  public getDecent5LengthSuits(): Suit[] {
    return SuitCollection.list.filter(s => this.isDecent5LengthSuits(s));
  }

  public isDecent5LengthSuits(suit: Suit): boolean {
    const cardsInSuit: Card[] = this.getSuitHi2Low(suit);
    return this.getSuitLength(suit) >= 5 && this.isAtLeastQJXXX(cardsInSuit);
  }

  private isAtLeastQJXXX(fiveCards: Card[]): boolean {
    if (fiveCards[0].value >= Card.QUEEN && fiveCards[1].value >= Card.JACK) {
      return true;
    }
    return false;
  }

  private isAtLeastKQTXX(fiveCards: Card[]): boolean {
    if (fiveCards[0].value >= Card.KING && fiveCards[1].value >= Card.QUEEN && fiveCards[2].value >= Card.TEN) {
      return true;
    }
    return false;
  }

  private isAtLeastAQJXX(fiveCards: Card[]): boolean {
    if (fiveCards[0].value >= Card.ACE && fiveCards[1].value >= Card.QUEEN && fiveCards[2].value >= Card.JACK) {
      return true;
    }
    return false;
  }

  public haveStopper(suit: Suit): boolean {
    const cardsInSuit: Card[] = this.getSuitHi2Low(suit);
  
    if (cardsInSuit.length > 0 && cardsInSuit[0].value == Card.ACE) {
      return true;
    }
    if (cardsInSuit.length > 1 && cardsInSuit[0].value == Card.KING) {
      return true;
    }
    if (cardsInSuit.length > 2 && cardsInSuit[0].value == Card.QUEEN) {
      return true;
    }
    if (cardsInSuit.length > 3 && cardsInSuit[0].value == Card.JACK) {
      return true;
    }
  
    return false;
  }

  public haveStrongStopper(suit: Suit): boolean {
    const cardsInSuit: Card[] = this.getSuitHi2Low(suit);
    const size: number = cardsInSuit.length;

    if (size < 2) {
      return false;
    } else if (size <= 3) {
      if (cardsInSuit[0].value != Card.ACE && cardsInSuit[0].value != Card.KING) {
        return false;
      }
    } else {
      let bigThree = 0, bigFive = 0;
      for (let i = 0; i < size; ++i) {
        const value: number = this.cards[i].value;
        if (value >= Card.QUEEN) {
          bigThree++;
        }
        if (value >= Card.TEN) {
          bigFive++;
        }
      }
      if (bigThree < 2 && bigFive < 3) {
        return false;
      }
    }

    return true;
  }

  public AisStronger(A: Suit, B: Suit): boolean {
    return (B == null || this.getSuitLength(A) > this.getSuitLength(B));
  }
}
