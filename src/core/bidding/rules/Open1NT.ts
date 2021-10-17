import { NoTrump } from "../../deck/NoTrump";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { BiddingRule } from "./BiddingRule";


export class Open1NT extends BiddingRule {
  private pc: PointCalculator;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
    this.pc = new PointCalculator(this.hand);
  }

  public prepareBid(): Bid {
    return BidCollection.makeBid(1, NoTrump, true);
  }

  public applies(): boolean {
    return this.auction.isOpeningBid() && this.pc.getHighCardPoints() >= 15 && this.pc.getHighCardPoints() <= 17 && this.pc.isBalanced();
  }
}
