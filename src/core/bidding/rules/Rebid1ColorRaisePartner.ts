import { Suit } from "../../deck/Suit";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { ResponseCalculator } from "../ResponseCalculator";
import { RebidToLevel1Response } from "./RebidToLevel1Response";


export class Rebid1ColorRaisePartner extends RebidToLevel1Response {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.response.trump.isSuit() && this.getTrumpCount() >= 4;
  }

  public prepareBid(): Bid {
    const calc: ResponseCalculator = new ResponseCalculator(this.hand, this.response);
    if (calc.getCombinedPoints() >= 19) {
      return BidCollection.makeBid(4, this.response.trump, true);
    } else if (calc.getCombinedPoints() >= 16) {
      return BidCollection.makeBid(3, this.response.trump, true);
    } else {
      return BidCollection.makeBid(2, this.response.trump, true);
    }
  }

  private getTrumpCount(): number {
    return this.hand.getSuitLength(this.response.trump as Suit);
  }
}
