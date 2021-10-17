import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { ResponseCalculator } from "../ResponseCalculator";
import { BidResponse } from "./BidResponse";

import { BidCollection } from "../BidCollection";
import { Suit } from "../../deck/Suit";
import { Trump } from "../../deck/Trump";

export class Respond1ColorRaiseMajorSuit extends BidResponse {
  private calc: ResponseCalculator;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    let result = false;
    if (super.applies()) {
      this.calc = new ResponseCalculator(this.hand, this.partnersOpeningBid);
      if (this.partnersOpeningBid.hasTrump() && this.partnersOpeningBid.trump.isMajorSuit() && this.partnersOpeningBid.value == 1 &&
        this.calc.getCombinedPoints() >= 8 && this.hand.getSuitLength(this.partnersOpeningBid.trump as Suit) >= 3) {
        result = true;
      }
    }
    return result;
  }

  public prepareBid(): Bid {
    const points: number = this.calc.getCombinedPoints();
    const trump: Trump = this.partnersOpeningBid.trump;
    if (points >= 10 && points <= 12 && this.hand.getSuitLength(trump as Suit) >= 4) {
      return BidCollection.makeBid(3, trump, true);
    } else if (points >= 8 && points <= 10) {
      return BidCollection.makeBid(2, trump, true);
    } else {
      return null;
    }
  }
}
