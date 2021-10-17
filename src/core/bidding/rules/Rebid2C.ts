
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Diamonds, Clubs } from "../../deck/SuitValues";
import { Trump } from "../../deck/Trump";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { Rebid } from "./Rebid";

export class Rebid2C extends Rebid {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }
  public prepareBid(): Bid {
    let result: Bid = null;
    const pc: PointCalculator = new PointCalculator(this.hand);
    const rank: number = this.response.value;
    const trump: Trump = this.response.trump;
    const HCP: number = pc.getHighCardPoints();
    if (rank == 2) {
      if (trump === Diamonds) {
        result = this.getLowestBid(2);
        if (result == null) {
          if (HCP <= 24) {
            if (pc.isBalanced()) {
              result = BidCollection.TWO_NOTRUMP_C();
            }
          } else if (HCP <= 27) {
            result = BidCollection.THREE_NOTRUMP_C();
          } else if (HCP <= 30) {
            result = BidCollection.FOUR_NOTRUMP_C();
          }
        }
      } else {
        if (HCP >= 3) {
          if (this.hand.getSuitLength(trump as Suit) >= 3) {
            result = BidCollection.makeBid(3, trump, true);
          } else {
            result = this.getLowestBid(2);
          }
        }
        if (result == null) {
          result = BidCollection.TWO_NOTRUMP_C();
        }
      }
    } else if (rank == 3) {
      if (HCP >= 3) {
        if (this.hand.getSuitLength(trump as Suit) >= 3) {
          result = BidCollection.makeBid(3, trump, true);
        } else {
          result = this.getLowestBid(3);
        }
      }
      if (result == null) {
        if (trump === Clubs) {
          result = BidCollection.THREE_DIAMONDS_C();
        } else if (trump === Diamonds) {
          result = BidCollection.THREE_HEARTS_C();
        }

      }
    }

    return result;
  }
  public applies(): boolean {
    return super.applies() && BidCollection.TWO_CLUBS.equals(this.opening);
  }

  private getLowestBid(level: number): Bid {
    const lowestColor: Suit = SuitCollection.mmList.find(color => this.hand.getSuitLength(color) >= 5)
    return lowestColor ? BidCollection.makeBid(this.getLowestLevel(level, lowestColor), lowestColor, true) : null;
  }

  private getLowestLevel(base: number, suit: Suit): number {
    if (this.auction.isValid(BidCollection.makeBid(base, suit, false))) {
      return base;
    } else {
      return base + 1;
    }
  }
}
