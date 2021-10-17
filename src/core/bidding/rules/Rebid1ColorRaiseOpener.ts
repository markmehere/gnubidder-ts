import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { ResponseCalculator } from "../ResponseCalculator";
import { RebidToLevel2Response } from "./RebidToLevel2Response";

import { BidCollection } from "../BidCollection";
import { Trump } from "../../deck/Trump";

export class Rebid1ColorRaiseOpener extends RebidToLevel2Response {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.response.trump.isSuit() && this.response.trump === this.opening.trump;
  }

  public prepareBid(): Bid {
    const trump: Trump = this.response.trump;
    if (trump.isMinorSuit()) {
      return BidCollection.makeBid(3, trump, true);
    } else {
      const calc: ResponseCalculator = new ResponseCalculator(this.hand, this.response);
      const points: number = calc.getCombinedPoints();
      if (points >= 19) {
        return BidCollection.makeBid(4, trump, true);
      } else if (points >= 16) {
        return BidCollection.makeBid(3, trump, true);
      }
    }

    return null;
  }
}
