import { Card } from "../Card";
import { Ace, King, Queen, Jack } from "../deck/CardValues";
import { Suit } from "../deck/Suit";
import { SuitCollection } from "../deck/SuitCollection";

import { Hand } from "../Hand";

export class PointCalculator {
  public hand: Hand;

  constructor(hand: Hand) {
    this.hand = hand;
  }

  public getHighCardPoints(cards?: Card[]): number {
    let highCardPoints = 0;
    if (!cards) cards = this.hand.cards;
    cards.forEach((card: Card) => {
      if (Ace.isValueOf(card)) {
        highCardPoints += 4;
      } else if (King.isValueOf(card)) {
        highCardPoints += 3;
      } else if (Queen.isValueOf(card)) {
        highCardPoints += 2;
      } else if (Jack.isValueOf(card)) {
        highCardPoints += 1;
      }
    });
    return highCardPoints;
  }

  public getDistributionalPoints(): number {
    let result = 0;
    SuitCollection.list.forEach((suit: Suit) => {
      result += this.distributionalValueForCardsInSuit(suit);
    });
    return result;
  }

  public distributionalValueForCardsInSuit(suit?: Suit): number {
    const cardsInColor: Card[] = this.hand.getSuitHi2Low(suit);
    const cardsCount: number = cardsInColor.length;
    let result = 0;
    if (cardsCount == 0) {
      result = 3;
    } else if (cardsCount == 1) {
      result = 2;
    } else if (cardsCount == 2) {
      result = 1;
    }
    return result;
  }

  public getCombinedPoints(): number {
    let result = 0;
    SuitCollection.list.forEach((color: Suit) => {
      const cardsInColor: Card[] = this.hand.getSuitHi2Low(color);
      result += this.getHighCardPoints(cardsInColor);
      if (!this.isFlawed(cardsInColor)) {
        result += this.distributionalValueForCardsInSuit(color);
      }
    });
    return result;
  }

  private isFlawed(cardsInColor: Card[]): boolean {
    if (cardsInColor.length == 1) {
      if (this.isKorQorJ(cardsInColor[0])) {
        return true;
      }
    } else if (cardsInColor.length == 2) {
      if (King.isValueOf(cardsInColor[0]) && this.isQorJ(cardsInColor[1])) {
        return true;
      } else if (this.isQorJ(cardsInColor[0])) {
        return true;
      }
    }

    return false;
  }

  private isKorQorJ(card: Card): boolean {
    return King.isValueOf(card) || this.isQorJ(card);
  }

  private isQorJ(card: Card): boolean {
    return Queen.isValueOf(card) || Jack.isValueOf(card);
  }

  public isBalanced(): boolean {
    let doubletons = 0;
    let singletons = false;
    let voids = false;
    SuitCollection.list.forEach((color: Suit) => {
      const cardsInColor: number = this.hand.getSuitLength(color);
      if (cardsInColor == 0) {
        voids = true;
      } else if (cardsInColor == 1) {
        singletons = true;
      } else if (cardsInColor == 2) {
        doubletons++;
      }
    });
    if (doubletons >= 2 || singletons || voids) {
      return false;
    } else {
      return true;
    }
  }

  public isSemiBalanced(): boolean {
    let singletons = false;
    let voids = false;
    SuitCollection.list.forEach((color: Suit) => {
      const cardsInColor: number = this.hand.getSuitLength(color);
      if (cardsInColor == 0) {
        voids = true;
      } else if (cardsInColor == 1) {
        singletons = true;
      }
    });
    if (singletons || voids) {
      return false;
    } else {
      return true;
    }
  }

  public isTame(): boolean {
    if (this.hand.matchesSuitLengthsLongToShort(4, 4, 4, 1)) {
      return true;
    }
    if (this.hand.matchesSuitLengthsLongToShort(5, 4, 2, 2)) {
      return true;
    }
    if (this.hand.matchesSuitLengthsLongToShort(5, 4, 3, 1)) {
      return true;
    }
    if (this.hand.matchesSuitLengthsLongToShort(6, 3, 2, 2)) {
      return true;
    }
    if (this.hand.matchesSuitLengthsLongToShort(6, 3, 3, 1)) {
      return true;
    }
    return false;
  }
}
