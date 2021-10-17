
import { NoTrump } from "../../deck/NoTrump";
import { Diamonds, Hearts, Spades, Clubs } from "../../deck/SuitValues";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { PartnersRebid } from "./PartnersRebid";

export class PRebidAfter1NT extends PartnersRebid {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    if (super.applies()) {
      return this.rebid.equals(BidCollection.ONE_NOTRUMP);
    }
    return false;
  }

  public prepareBid(): Bid {
    const pc: PointCalculator = new PointCalculator(this.hand);
    const points: number = pc.getCombinedPoints();
    if (this.response.trump.isMinorSuit()) {
      if (points >= 11) {
        if (points >= 13) {
          if (this.hand.getSuitLength(Diamonds) == 4) {
            if (this.hand.getSuitLength(Hearts) >= 5) {
              return BidCollection.makeBid(2, Hearts, true);
            } else if (this.hand.getSuitLength(Spades) >= 5) {
              return BidCollection.makeBid(2, Spades, true);
            }

          }
        }
        if (this.hand.getSuitLength(Diamonds) >= 5) {
          if (this.hand.getSuitLength(Diamonds) != 5) {
            return BidCollection.makeBid(3, Diamonds, true);
          } else if (this.hand.getSuitLength(Clubs) >= 4) {
            return BidCollection.makeBid(3, Clubs, true);
          }

        }
        if (pc.isSemiBalanced()) {
          return BidCollection.makeBid(2, NoTrump, true);
        }
      }
      if (this.hand.getSuitLength(Diamonds) >= 6) {
        return BidCollection.makeBid(2, Diamonds, true);
      } else if (this.hand.getSuitLength(Clubs) >= 3) {
        return BidCollection.makeBid(2, Clubs, true);
      }

    } else {
      const hearts: number = this.hand.getSuitLength(Hearts);
      const spades: number = this.hand.getSuitLength(Spades);
      if (points <= 10) {
        if (this.response.trump === Spades) {
          if (spades == 5 && hearts >= 4) {
            return BidCollection.makeBid(2, Hearts, true);
          }
        } else if (hearts >= 5) {
          return BidCollection.makeBid(2, Hearts, true);
        } else if (spades >= 5) {
          return BidCollection.makeBid(2, Spades, true);
        }
      } else {
        if (this.response.trump === Hearts) {
          if (hearts >= 6) {
            return BidCollection.makeBid(3, Hearts, true);
          } else if (spades == 4 && hearts == 4) {
            return BidCollection.makeBid(2, Spades, true);
          }

        } else if (spades >= 5) {
          if (spades >= 6) {
            return BidCollection.makeBid(3, Spades, true);
          } else {
            return BidCollection.makeBid(2, Spades, true);
          }
        } else if (pc.isSemiBalanced()) {
          return BidCollection.makeBid(2, NoTrump, true);
        }
      }
    }
    return null;
  }
}
