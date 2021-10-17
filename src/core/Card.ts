import { Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King, Ace } from "./deck/CardValues";
import { Suit } from "./deck/Suit";
import { SuitCollection } from "./deck/SuitCollection";
import { Spades, Hearts, Diamonds, Clubs } from "./deck/SuitValues";
import { Trump } from "./deck/Trump";

const do_not_use_outside = "shouldnotconstructotherthanCardValues.ts";

export class Card {
  public static TWO = 0;
  public static THREE = 1;
  public static FOUR = 2;
  public static FIVE = 3;
  public static SIX = 4;
  public static SEVEN = 5;
  public static EIGHT = 6;
  public static NINE = 7;
  public static TEN = 8;
  public static JACK = 9;
  public static QUEEN = 10;
  public static KING = 11;
  public static ACE = 12;
  public static FullSuit: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  public static COUNT = 52;

  public debug: string;
  public value: number;
  public denomination: Suit;

  constructor(value: number | string, d: Suit, secret: string) {
    if (secret !== do_not_use_outside) {
      throw new Error("Assert failure: Card constructed without secret");
    }
    this.value = (typeof value === 'number') ? value : Card.strToIntValue(value);
    this.denomination = d;
    this.debug = this.getUniversal();
  }

  public static strToIntValue(value: string): number {
    if ("2" === value) {
      return Card.TWO;
    } else if ("3" === value) {
      return Card.THREE;
    } else if ("4" === value) {
      return Card.FOUR;
    } else if ("5" === value) {
      return Card.FIVE;
    } else if ("6" === value) {
      return Card.SIX;
    } else if ("7" === value) {
      return Card.SEVEN;
    } else if ("8" === value) {
      return Card.EIGHT;
    } else if ("9" === value) {
      return Card.NINE;
    } else if ("10" === value) {
      return Card.TEN;
    } else if ("J" === value.toUpperCase()) {
      return Card.JACK;
    } else if ("Q" === value.toUpperCase()) {
      return Card.QUEEN;
    } else if ("K" === value.toUpperCase()) {
      return Card.KING;
    } else if ("A" === value.toUpperCase()) {
      return Card.ACE;
    } else {
      throw new Error("'" + value + "' is not a valid card value");
    }
  }

  public toString(): string {
    return Card.valueToString(this.value) + " of " + this.denomination;
  }

  public static valueToString(i: number): string {
    switch (i) {
      case Card.TWO:
        return "2";
      case Card.THREE:
        return "3";
      case Card.FOUR:
        return "4";
      case Card.FIVE:
        return "5";
      case Card.SIX:
        return "6";
      case Card.SEVEN:
        return "7";
      case Card.EIGHT:
        return "8";
      case Card.NINE:
        return "9";
      case Card.TEN:
        return "10";
      case Card.JACK:
        return "J";
      case Card.QUEEN:
        return "Q";
      case Card.KING:
        return "K";
      case Card.ACE:
        return "A";
    }
    return null;
  }

  public trumps(other: Card, trump: Trump): boolean {
    return this.denomination === trump && other.denomination !== trump;
  }

  public hasSameColorAs(other: Card): boolean {
    return this.denomination === other.denomination;
  }

  public hasGreaterValueThan(other: Card): boolean {
    return this.value > other.value;
  }

  public beats(other: Card, trump: Trump, ifDifferingSuit?: boolean): boolean {
    if (this.denomination === trump &&  other.denomination !== trump) return true; /* if we're trump we always beat the other */
    if (other.denomination === trump && this.denomination !== trump) return false; /* if the the other is trump it always beats us */
    if (this.denomination === trump &&  other.denomination === trump) return this.value > other.value; /* if both are trumps it comes down to value */
    if (this.denomination === other.denomination) return this.value > other.value; /* if both are the same suit it comes down to value */
    return ifDifferingSuit; /* if both are differing suits it's unclear */
  }

  public getIndex(): number {
    return this.value + SuitCollection.getIndex(this.denomination) * (Card.ACE + 1);
  }

  public getUniversal(): string {
    if (this.denomination === Spades) {
      return Card.valueToString(this.value) + "S";
    }
    else if (this.denomination === Hearts) {
      return Card.valueToString(this.value) + "H";
    }
    else if (this.denomination === Diamonds) {
      return Card.valueToString(this.value) + "D";
    }
    else if (this.denomination === Clubs) {
      return Card.valueToString(this.value) + "C";
    }
    throw new Error("Unable to translate card");
  }

  public toDebugString(): string {
    let result = "";
    switch (this.value) {
      case Card.TWO:
        result = "Two";
        break;
      case Card.THREE:
        result = "Three";
        break;
      case Card.FOUR:
        result = "Four";
        break;
      case Card.FIVE:
        result = "Five";
        break;
      case Card.SIX:
        result = "Six";
        break;
      case Card.SEVEN:
        result = "Seven";
        break;
      case Card.EIGHT:
        result = "Eight";
        break;
      case Card.NINE:
        result = "Nine";
        break;
      case Card.TEN:
        result = "Ten";
        break;
      case Card.JACK:
        result = "Jack";
        break;
      case Card.QUEEN:
        result = "Queen";
        break;
      case Card.KING:
        result = "King";
        break;
      case Card.ACE:
        result = "Ace";
        break;
    }
    result += ".of(" + this.denomination.toDebugString() + ")";
    return result;
  }

  public static getFromValues(nomination: string, suit: Suit) {
    if ("2" === nomination) {
      return Two.of(suit);
    } else if ("3" === nomination) {
      return Three.of(suit);
    } else if ("4" === nomination) {
      return Four.of(suit);
    } else if ("5" === nomination) {
      return Five.of(suit);
    } else if ("6" === nomination) {
      return Six.of(suit);
    } else if ("7" === nomination) {
      return Seven.of(suit);
    } else if ("8" === nomination) {
      return Eight.of(suit);
    } else if ("9" === nomination) {
      return Nine.of(suit);
    } else if ("T" === nomination || "10" === nomination) {
      return Ten.of(suit);
    } else if ("J" === nomination) {
      return Jack.of(suit);
    } else if ("Q" === nomination) {
      return Queen.of(suit);
    } else if ("K" === nomination) {
      return King.of(suit);
    } else if ("A" === nomination) {
      return Ace.of(suit);
    } else {
      throw new Error(`do not know how to make card of denomination: ${nomination} (needs to be one of: 2,3,....9,T,J,Q,K,A)`);
    }
  }

  public static get(icard: string): Card {
    const card = icard.replace('10', 'T');
    const suit: Suit = SuitCollection.get(card.toUpperCase().substring(1, 2));
    const nomination: string = card.toUpperCase().substring(0, 1);
    return this.getFromValues(nomination, suit);
  }
}
