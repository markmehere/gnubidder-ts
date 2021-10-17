import { NoTrump } from "../../deck/NoTrump";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { BiddingRule } from "./BiddingRule";


export class Overcall1NT extends BiddingRule {
  private pc: PointCalculator;
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
    this.pc = new PointCalculator(this.hand);
  }

  public applies(): boolean {
    return ((this.auction.may2ndOvercall() && this.pc.getHighCardPoints() >= 15 && this.pc.getHighCardPoints() <= 18)
      || (this.auction.may4thOvercall() && this.pc.getHighCardPoints() >= 12 && this.pc.getHighCardPoints() <= 15))
      && this.pc.isBalanced() && this.haveStopperInEnemySuit();
  }

  public prepareBid(): Bid {
    return BidCollection.makeBid(1, NoTrump, true);
  }
}
