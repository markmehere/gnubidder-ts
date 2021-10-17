import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { RebidToLevel1Response } from "./RebidToLevel1Response";

export class Rebid1ColorWithNT extends RebidToLevel1Response {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    const pc: PointCalculator = new PointCalculator(this.hand);
    return super.applies() && pc.isBalanced();
  }

  public prepareBid(): Bid {
    const pc: PointCalculator = new PointCalculator(this.hand);
    const HCP: number = pc.getHighCardPoints();
    if (HCP >= 12 && HCP <= 14) {
      return BidCollection.ONE_NOTRUMP_C();
    } else if (HCP >= 18 && HCP <= 19) {
      return BidCollection.TWO_NOTRUMP_C();
    } else {
      return null;
    }
  }
}
