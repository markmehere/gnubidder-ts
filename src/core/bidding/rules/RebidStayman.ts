
import { Suit } from "../../deck/Suit";
import { Clubs, Hearts, Spades, Diamonds } from "../../deck/SuitValues";
import { Trump } from "../../deck/Trump";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { PRebidNoTrump } from "./PRebidNoTrump";

export class RebidStayman extends PRebidNoTrump {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.response.trump === Clubs && this.response.value == this.level + 1 && this.rebid.trump.isSuit();
  }

  public prepareBid(): Bid {
    const pc: PointCalculator = new PointCalculator(this.hand);
    const trump: Trump = this.rebid.trump;
    const hearts: number = this.hand.getSuitLength(Hearts);
    const spades: number = this.hand.getSuitLength(Spades);
    const points: number = this.fourthOvercalled ? pc.getCombinedPoints() - 3 : pc.getCombinedPoints();
    if (trump === Diamonds) {
      if (hearts == 5 && spades == 4) {
        return BidCollection.makeBid(this.level + 1, Hearts, true);
      } else if (spades == 5 && hearts == 4) {
        return BidCollection.makeBid(this.level + 1, Spades, true);
      }
      if (this.level == 1) {
        if (points >= 10) {
          if (hearts >= 5 && spades >= 5) {
            return BidCollection.THREE_SPADES_C();
          } else if (this.hand.getSuitLength(Clubs) >= 5) {
            return BidCollection.THREE_CLUBS_C();
          } else if (this.hand.getSuitLength(Diamonds) >= 5) {
            return BidCollection.THREE_DIAMONDS_C();
          } else if (pc.isSemiBalanced()) {
            return BidCollection.cloneBid(BidCollection.THREE_NOTRUMP);
          }
        } else {
          if (hearts >= 5 && spades >= 5) {
            return BidCollection.THREE_HEARTS_C();
          } else {
            return BidCollection.cloneBid(BidCollection.TWO_NOTRUMP);
          }
        }
      }
    } else if (trump.isMajorSuit()) {
      if (trump === Hearts) {
        if (hearts == 4 && spades == 5) {
          return BidCollection.makeBid(this.level + 1, Spades, true);
        }
      }
      if (this.level == 1) {
        if (this.hand.getSuitLength(trump as Suit) >= 4) {
          if (points >= 8 && points <= 9) {
            return BidCollection.makeBid(3, trump, true);
          } else if (points >= 10 && points <= 14) {
            return BidCollection.makeBid(4, trump, true);
          }
        }
        if (points >= 12) {
          if (this.hand.getSuitLength(Clubs) >= 5) {
            return BidCollection.THREE_CLUBS_C();
          } else if (this.hand.getSuitLength(Diamonds) >= 5) {
            return BidCollection.THREE_DIAMONDS_C();
          }
        }
      } else if (this.level == 2) {
        if (this.hand.getSuitLength(trump as Suit) >= 4) {
          return BidCollection.makeBid(4, trump, true);
        }
      }
    }

    return null;
  }
}
