import { NoTrump } from "./NoTrump";
import { Suit } from "./Suit";
import { Spades, Clubs, Diamonds, Hearts } from "./SuitValues";
import { Trump } from "./Trump";

export class SuitCollection {

  public static list: Suit[] = [Spades, Hearts, Diamonds, Clubs];

  public static reverseList: Suit[] = [Clubs, Diamonds, Hearts, Spades];

  public static mmList: Suit[] = [Hearts, Spades, Clubs, Diamonds];
  
  public static getIndex(denomination: Suit): number {
    return SuitCollection.reverseList.findIndex((x) => x === denomination);
  }

  public static toUniversal(suit: Trump) {
    if (suit === NoTrump) return 'NT';
    if (suit === Spades) return 'S';
    if (suit === Hearts) return 'H';
    if (suit === Diamonds) return 'D';
    if (suit === Clubs) return 'C';
    throw new Error("Unrecognized suit");
  }

  public static get(s: string): Suit {
    if ("S" === s) {
      return Spades;
    } else if ("H" === s) {
      return Hearts;
    } else if ("D" === s) {
      return Diamonds;
    } else if ("C" === s) {
      return Clubs;
    } else {
      throw new Error(`do not know how to translate string '${s}' to a suit (need one of: S,H,D,C)`);
    }
  }
}
