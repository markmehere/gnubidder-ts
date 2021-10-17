

import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Hearts, Spades, Clubs, Diamonds } from "../../deck/SuitValues";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { RebidToLevel1Response } from "./RebidToLevel1Response";

export class RebidAfterForcing1NT extends RebidToLevel1Response {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.response.trump.isNoTrump() && this.opening.trump.isMajorSuit();
  }

  public prepareBid(): Bid {
    const pc: PointCalculator = new PointCalculator(this.hand);
    const HCP: number = pc.getHighCardPoints();
    const open: Suit = this.opening.trump as Suit;
    if (HCP >= 19) {
      let result: Bid = null;
      SuitCollection.mmList.forEach((color: Suit) => {
        {
          if (color.isLowerRankThan(open) && this.hand.getSuitLength(color) >= 4) {
            result = BidCollection.makeBid(3, color, true);
            if (this.auction.isValid(result)) {
              return result;
            }
            result = null;
          }
        }
      });
    } else {
      if (this.hand.getSuitLength(open) >= 6) {
        if (this.hand.getSuitLength(open) == 6 && HCP <= 15) {
          return BidCollection.makeBid(2, open, true);
        } else if (HCP >= 15 && HCP <= 18) {
          return BidCollection.makeBid(3, open, true);
        }

      }
    }
    if (HCP >= 18 && pc.isBalanced()) {
      return BidCollection.cloneBid(BidCollection.TWO_NOTRUMP);
    }
    if (open === Hearts) {
      if (HCP >= 17 && this.hand.getSuitLength(open) >= 5 && this.hand.getSuitLength(Spades) >= 4) {
        return BidCollection.TWO_SPADES_C();
      }
    } else if (this.hand.getSuitLength(Hearts) >= 4) {
      return BidCollection.TWO_HEARTS_C();
    }

    let longer: Suit = Clubs;
    if (this.hand.AisStronger(Diamonds, longer)) {
      longer = Diamonds;
    }
    if (this.hand.getSuitLength(longer) >= 3) {
      return BidCollection.makeBid(2, longer, true);
    }
    return BidCollection.PASS;
  }
}
