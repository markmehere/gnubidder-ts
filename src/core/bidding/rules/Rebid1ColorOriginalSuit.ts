import { Suit } from "../../deck/Suit";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { RebidToLevel1Response } from "./RebidToLevel1Response";


export class Rebid1ColorOriginalSuit extends RebidToLevel1Response {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.opening.trump.isSuit() && this.response.trump !== this.opening.trump;
  }

  public prepareBid(): Bid {
    const points: number = new PointCalculator(this.hand).getCombinedPoints();
    if (this.opening.trump.isMajorSuit()) {
      if (this.response.equals(BidCollection.THREE_NOTRUMP)) {
        return BidCollection.makeBid(4, this.opening.trump, true);
      }
      if (points >= 19 && this.hand.getSuitLength(this.opening.trump as Suit) >= 7) {
        return BidCollection.makeBid(4, this.opening.trump, true);
      }
    }
    if (this.hand.getSuitLength(this.opening.trump as Suit) >= 6) {
      if (points <= 15) {
        return BidCollection.makeBid(2, this.opening.trump, true);
      } else if (points <= 18) {
        return BidCollection.makeBid(3, this.opening.trump, true);
      }

    }
    return null;
  }
}
