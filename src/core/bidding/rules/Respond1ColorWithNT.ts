
import { Suit } from "../../deck/Suit";
import { Trump } from "../../deck/Trump";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { ResponseCalculator } from "../ResponseCalculator";
import { BidResponse } from "./BidResponse";

export class Respond1ColorWithNT extends BidResponse {
  private calc: ResponseCalculator;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    let result = false;
    if (super.applies()) {
      this.calc = new ResponseCalculator(this.hand, this.partnersOpeningBid);
      if (this.partnersOpeningBid.trump.isSuit() && this.partnersOpeningBid.value == 1 && this.calc.getCombinedPoints() >= 6) {
        result = true;
      }
    }
    return result;
  }

  public prepareBid(): Bid {
    let result: Bid = null;
    const trump: Trump = this.partnersOpeningBid.trump;
    const HCP: number = this.calc.getHighCardPoints();
    if (trump.isMajorSuit()) {
      if (HCP >= 12 && this.calc.isBalanced()) {
        if (HCP <= 15 && this.hand.getSuitLength(trump as Suit) >= 4) {
          result = BidCollection.THREE_NOTRUMP_C();
        } else if (HCP >= 13) {
          result = BidCollection.TWO_NOTRUMP_C();
        }

      } else if (HCP <= 12) {
        result = BidCollection.ONE_NOTRUMP_C();
        result.makeForcing();
      }
    } else {
      if (HCP >= 6 && HCP <= 10) {
        result = BidCollection.ONE_NOTRUMP_C();
      } else if (HCP >= 11 && HCP <= 12 && this.calc.isBalanced()) {
        result = BidCollection.TWO_NOTRUMP_C();
      } else if (HCP >= 13 && HCP <= 15 && this.calc.isBalanced()) {
        result = BidCollection.THREE_NOTRUMP_C();
      }
    }
    return result;
  }
}
