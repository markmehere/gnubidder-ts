import { NoTrump } from "../deck/NoTrump";
import { SuitCollection } from "../deck/SuitCollection";
import { Spades, Hearts, Diamonds, Clubs } from "../deck/SuitValues";
import { Trump } from "../deck/Trump";
import { Bid, DOUBLE, Double, PASS, Pass, Redouble } from "./Bid";


const secret = "shouldnotconstructotherthanBidCollection.ts";

export class BidCollection {
  public static PASS: Bid = new Pass(secret);
  public static DOUBLE: Bid = new Double(secret);
  public static REDOUBLE: Bid = new Redouble(secret);
  public static ONE_NOTRUMP: Bid = new Bid(1, NoTrump, secret);
  public static ONE_SPADES: Bid = new Bid(1, Spades, secret);
  public static ONE_HEARTS: Bid = new Bid(1, Hearts, secret);
  public static ONE_DIAMONDS: Bid = new Bid(1, Diamonds, secret);
  public static ONE_CLUBS: Bid = new Bid(1, Clubs, secret);
  public static TWO_NOTRUMP: Bid = new Bid(2, NoTrump, secret);
  public static TWO_SPADES: Bid = new Bid(2, Spades, secret);
  public static TWO_HEARTS: Bid = new Bid(2, Hearts, secret);
  public static TWO_DIAMONDS: Bid = new Bid(2, Diamonds, secret);
  public static TWO_CLUBS: Bid = new Bid(2, Clubs, secret);
  public static THREE_NOTRUMP: Bid = new Bid(3, NoTrump, secret);
  public static THREE_SPADES: Bid = new Bid(3, Spades, secret);
  public static THREE_HEARTS: Bid = new Bid(3, Hearts, secret);
  public static THREE_DIAMONDS: Bid = new Bid(3, Diamonds, secret);
  public static THREE_CLUBS: Bid = new Bid(3, Clubs, secret);
  public static FOUR_NOTRUMP: Bid = new Bid(4, NoTrump, secret);
  public static FOUR_SPADES: Bid = new Bid(4, Spades, secret);
  public static FOUR_HEARTS: Bid = new Bid(4, Hearts, secret);
  public static FOUR_DIAMONDS: Bid = new Bid(4, Diamonds, secret);
  public static FOUR_CLUBS: Bid = new Bid(4, Clubs, secret);
  public static FIVE_NOTRUMP: Bid = new Bid(5, NoTrump, secret);
  public static FIVE_SPADES: Bid = new Bid(5, Spades, secret);
  public static FIVE_HEARTS: Bid = new Bid(5, Hearts, secret);
  public static FIVE_DIAMONDS: Bid = new Bid(5, Diamonds, secret);
  public static FIVE_CLUBS: Bid = new Bid(5, Clubs, secret);
  public static SIX_NOTRUMP: Bid = new Bid(6, NoTrump, secret);
  public static SIX_SPADES: Bid = new Bid(6, Spades, secret);
  public static SIX_HEARTS: Bid = new Bid(6, Hearts, secret);
  public static SIX_DIAMONDS: Bid = new Bid(6, Diamonds, secret);
  public static SIX_CLUBS: Bid = new Bid(6, Clubs, secret);
  public static SEVEN_NOTRUMP: Bid = new Bid(7, NoTrump, secret);
  public static SEVEN_SPADES: Bid = new Bid(7, Spades, secret);
  public static SEVEN_HEARTS: Bid = new Bid(7, Hearts, secret);
  public static SEVEN_DIAMONDS: Bid = new Bid(7, Diamonds, secret);
  public static SEVEN_CLUBS: Bid = new Bid(7, Clubs, secret);

  public static ONE_NOTRUMP_C = () => new Bid(1, NoTrump, secret);
  public static ONE_SPADES_C = () => new Bid(1, Spades, secret);
  public static ONE_HEARTS_C = () => new Bid(1, Hearts, secret);
  public static ONE_DIAMONDS_C = () => new Bid(1, Diamonds, secret);
  public static ONE_CLUBS_C = () => new Bid(1, Clubs, secret);
  public static TWO_NOTRUMP_C = () => new Bid(2, NoTrump, secret);
  public static TWO_SPADES_C = () => new Bid(2, Spades, secret);
  public static TWO_HEARTS_C = () => new Bid(2, Hearts, secret);
  public static TWO_DIAMONDS_C = () => new Bid(2, Diamonds, secret);
  public static TWO_CLUBS_C = () => new Bid(2, Clubs, secret);
  public static THREE_NOTRUMP_C = () => new Bid(3, NoTrump, secret);
  public static THREE_SPADES_C = () => new Bid(3, Spades, secret);
  public static THREE_HEARTS_C = () => new Bid(3, Hearts, secret);
  public static THREE_DIAMONDS_C = () => new Bid(3, Diamonds, secret);
  public static THREE_CLUBS_C = () => new Bid(3, Clubs, secret);
  public static FOUR_NOTRUMP_C = () => new Bid(4, NoTrump, secret);
  public static FOUR_SPADES_C = () => new Bid(4, Spades, secret);
  public static FOUR_HEARTS_C = () => new Bid(4, Hearts, secret);
  public static FOUR_DIAMONDS_C = () => new Bid(4, Diamonds, secret);
  public static FOUR_CLUBS_C = () => new Bid(4, Clubs, secret);
  public static FIVE_NOTRUMP_C = () => new Bid(5, NoTrump, secret);
  public static FIVE_SPADES_C = () => new Bid(5, Spades, secret);
  public static FIVE_HEARTS_C = () => new Bid(5, Hearts, secret);
  public static FIVE_DIAMONDS_C = () => new Bid(5, Diamonds, secret);
  public static FIVE_CLUBS_C = () => new Bid(5, Clubs, secret);
  public static SIX_NOTRUMP_C = () => new Bid(6, NoTrump, secret);
  public static SIX_SPADES_C = () => new Bid(6, Spades, secret);
  public static SIX_HEARTS_C = () => new Bid(6, Hearts, secret);
  public static SIX_DIAMONDS_C = () => new Bid(6, Diamonds, secret);
  public static SIX_CLUBS_C = () => new Bid(6, Clubs, secret);
  public static SEVEN_NOTRUMP_C = () => new Bid(7, NoTrump, secret);
  public static SEVEN_SPADES_C = () => new Bid(7, Spades, secret);
  public static SEVEN_HEARTS_C = () => new Bid(7, Hearts, secret);
  public static SEVEN_DIAMONDS_C = () => new Bid(7, Diamonds, secret);
  public static SEVEN_CLUBS_C = () => new Bid(7, Clubs, secret);

  public static cloneBid(b: Bid): Bid {
    if (b.hasTrump()) {
      return new Bid(b.value, b.trump, secret);
    } else if (b.isPass()) {
      return new Pass(secret);
    } else if (b.isDouble()) {
      return new Double(secret);
    } else if (b.isRedouble()) {
      return new Redouble(secret);
    }
    return null;
  }

  public static makeBid(bidSize: number, suit: string | Trump, clone: boolean): Bid {
    let bid: Bid;
    const t = (typeof suit === 'string') ? suit : suit.toString();
    if (t.toUpperCase() === PASS) {
      bid = this.PASS;
    } else if (t.toUpperCase() === DOUBLE) {
      bid = this.DOUBLE;
    } else {
      const numbers = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN"];
      bid = this[`${numbers[bidSize]}_${t.toUpperCase()}`];
    }
    if (!bid) throw new Error(`Cannot find requested bid (${bidSize}, ${t})`);
    return clone ? this.cloneBid(bid) : bid;
  }

  public static toUniversal(bid: Bid) {
    if (bid.isPass()) return '-';
    if (bid.isDouble()) return 'D';
    if (bid.isRedouble()) return 'R';
    return `${bid.value}${SuitCollection.toUniversal(bid.trump)}`;
  }

  public static fromUniversal(value: string): Bid {
    // eslint-disable-next-line
    let result, furtherInfo;

    switch (value) {
      case '-':
        return this.PASS;
      case 'D':
        return this.DOUBLE;
      case 'R':
        return this.REDOUBLE;
      default:
        try {
          if (value.endsWith('NT'))
            result = BidCollection.makeBid(parseInt(value[0], 10), NoTrump, false);
          else
            result = BidCollection.makeBid(parseInt(value[0], 10), SuitCollection.get(value[1]), false);
        }
        catch (e) {
          furtherInfo = e && e.message;
        }
        if (result) return result;
        throw new Error(`Unable to parse bid ${value}`);
    }
  }
}
