
import { Suit } from "../../deck/Suit";
import { Hearts, Spades } from "../../deck/SuitValues";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { BidResponse } from "./BidResponse";

export class Respond2NT extends BidResponse {
  private pc: PointCalculator;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public prepareBid(): Bid {
    this.pc = new PointCalculator(this.hand);
    let result: Bid = null;
    let longer: Suit = Hearts;
    let length: number = this.hand.getSuitLength(Hearts);
    if (this.hand.getSuitLength(Spades) > length) {
      longer = Spades;
      length = this.hand.getSuitLength(Spades);
    }
    const points: number = this.pc.getCombinedPoints();
    if (length > 3) {
      if (length == 4) {
        if (points >= 5) {
          result = BidCollection.THREE_CLUBS_C();
        }
      } else if (longer === Hearts) {
        result = BidCollection.THREE_DIAMONDS_C();
      } else {
        result = BidCollection.THREE_HEARTS_C();
      }

    }
    if (result == null) {
      if (this.pc.getHighCardPoints() >= 5) {
        result = BidCollection.THREE_NOTRUMP_C();
      } else {
        result = BidCollection.PASS
      }
    }
    return result;
  }

  public applies(): boolean {
    return super.applies() && BidCollection.TWO_NOTRUMP.equals(this.partnersOpeningBid);
  }
}
