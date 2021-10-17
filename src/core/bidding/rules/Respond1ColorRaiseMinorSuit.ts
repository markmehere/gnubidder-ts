import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { ResponseCalculator } from "../ResponseCalculator";
import { BidResponse } from "./BidResponse";

import { BidCollection } from "../BidCollection";
import { Suit } from "../../deck/Suit";
import { Trump } from "../../deck/Trump";

export class Respond1ColorRaiseMinorSuit extends BidResponse {
  private calc: ResponseCalculator;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    let result = false;
    if (super.applies()) {
      this.calc = new ResponseCalculator(this.hand, this.partnersOpeningBid);
      if (this.partnersOpeningBid.trump.isMinorSuit() && this.partnersOpeningBid.value == 1 &&
        this.hand.getSuitLength(this.partnersOpeningBid.trump as Suit) >= 4) {
        result = true;
      }
    }
    return result;
  }

  public prepareBid(): Bid {
    const points: number = this.calc.getCombinedPoints();
    const trump: Trump = this.partnersOpeningBid.trump;
    if (points >= 10 && (this.hand.getSuitLength(trump as Suit) != 4 || this.calc.getHighCardPoints(this.hand.getSuitHi2Low(trump as Suit)) > 4)) {
      return BidCollection.makeBid(2, trump, true);
    }
    const vulnerabilityIndex: number = this.auction.getVulnerabilityIndex();
    if (this.hand.getSuitLength(trump as Suit) >= 5 && ((vulnerabilityIndex >= 2 && points >= 5 && points <= 9) || (vulnerabilityIndex == 1 && points <= 8) || (vulnerabilityIndex == 0 && points >= 5 && points <= 8))) {
      return BidCollection.makeBid(3, trump, true);
    }
    return null;
  }
}
