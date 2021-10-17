
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Clubs, Diamonds } from "../../deck/SuitValues";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { Rebid } from "./Rebid";

export class RebidWeakTwo extends Rebid {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.opening.value == 2 && this.opening.trump !== Clubs && this.response.value == 2 && this.response.trump.isNoTrump();
  }

  public prepareBid(): Bid {
    const pc: PointCalculator = new PointCalculator(this.hand);
    const HCP: number = pc.getHighCardPoints();
    if (this.opening.trump === Diamonds) {
      if (HCP >= 9) {
        if (pc.isSemiBalanced() && this.hand.isGood5LengthSuits(Diamonds)) {
          return BidCollection.THREE_NOTRUMP_C();
        }
        SuitCollection.reverseList.forEach((color: Suit) => {
          {
            if (this.hand.getSuitLength(color) <= 1) {
              return BidCollection.makeBid(3, color, true);
            }
          }
        });
      }
      return BidCollection.THREE_DIAMONDS_C();
    }
    else {
      const color: Suit = this.opening.trump as Suit;
      if (HCP >= 9) {
        if (pc.getHighCardPoints(this.hand.getSuitHi2Low(color)) >= 8) {
          return BidCollection.THREE_NOTRUMP_C();
        }
        if (this.hand.isGood5LengthSuits(color)) {
          return BidCollection.THREE_SPADES_C();
        } else {
          return BidCollection.THREE_HEARTS_C();
        }
      } else {
        if (this.hand.isGood5LengthSuits(color)) {
          return BidCollection.THREE_DIAMONDS_C();
        } else {
          return BidCollection.THREE_CLUBS_C();
        }
      }
    }
  }

}
