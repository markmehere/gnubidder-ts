import { PRebidNoTrump } from "./PRebidNoTrump";

import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { NoTrump } from "../../deck/NoTrump";
import { Diamonds, Hearts, Spades } from "../../deck/SuitValues";
import { Trump } from "../../deck/Trump";

export class RebidJacobyTransfer extends PRebidNoTrump {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.response.value == this.level + 1 && (this.response.trump === Diamonds || this.response.trump === Hearts);
  }

  public prepareBid(): Bid {
    const pc: PointCalculator = new PointCalculator(this.hand);
    const transfer: Trump = this.response.trump;
    const trump: Trump = this.rebid.trump;
    const HCP: number = this.fourthOvercalled ? pc.getHighCardPoints() - 3 : pc.getHighCardPoints();
    const INVITATION: number = (this.level == 1) ? 10 : 5;
    if (transfer === Diamonds) {
      if (trump === Spades) {
        if (HCP >= 8) {
          return BidCollection.FOUR_HEARTS_C();
        } else {
          return BidCollection.cloneBid(BidCollection.THREE_NOTRUMP);
        }
      } else {
        if (HCP >= INVITATION) {
          if (this.hand.getSuitLength(Hearts) >= 3) {
            return BidCollection.FOUR_HEARTS_C();
          } else {
            return BidCollection.cloneBid(BidCollection.THREE_NOTRUMP);
          }
        }
      }
    } else {
      if (trump === NoTrump) {
        if (HCP >= 8) {
          return BidCollection.FOUR_SPADES_C();
        } else {
          return BidCollection.cloneBid(BidCollection.THREE_NOTRUMP);
        }
      } else {
        if (HCP >= INVITATION) {
          if (this.hand.getSuitLength(Hearts) >= 3) {
            return BidCollection.FOUR_SPADES_C();
          } else {
            return BidCollection.cloneBid(BidCollection.THREE_NOTRUMP);
          }
        }
      }
    }
    return null;
  }
}
