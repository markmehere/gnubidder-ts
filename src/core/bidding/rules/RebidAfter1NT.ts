import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { RebidToLevel1Response } from "./RebidToLevel1Response";

export class RebidAfter1NT extends RebidToLevel1Response {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.response.trump.isNoTrump();
  }

  public prepareBid(): Bid {
    const pc: PointCalculator = new PointCalculator(this.hand);
    const HCP: number = pc.getHighCardPoints();
    if (HCP >= 19 && (pc.isTame() || pc.isBalanced())) {
      return BidCollection.THREE_NOTRUMP_C();
    } else if (HCP >= 16 && pc.isTame()) {
      return BidCollection.TWO_NOTRUMP_C();
    } else {
      return null;
    }
  }
}
