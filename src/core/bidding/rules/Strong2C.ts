import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { BiddingRule } from "./BiddingRule";

export class Strong2C extends BiddingRule {
  private pc: PointCalculator;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
    this.pc = new PointCalculator(this.hand);
  }

  public prepareBid(): Bid {
    return BidCollection.TWO_CLUBS_C();
  }

  public applies(): boolean {
    return this.auction.isOpeningBid() && this.pc.getCombinedPoints() >= 23;
  }
}
