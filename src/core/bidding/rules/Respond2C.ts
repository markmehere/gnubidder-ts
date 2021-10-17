
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { BidResponse } from "./BidResponse";

export class Respond2C extends BidResponse {
  private pc: PointCalculator;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public prepareBid(): Bid {
    this.pc = new PointCalculator(this.hand);
    let result: Bid = null;
    if (this.pc.getHighCardPoints() >= 8) {
      let longest: Suit = null;
      SuitCollection.mmList.forEach((color: Suit) => {
        if (this.hand.getSuitLength(color) >= 5) {
          if (this.hand.AisStronger(color, longest)) {
            longest = color;
          }
        }
      });
      if (longest != null) {
        if (longest.isMajorSuit()) {
          result = BidCollection.makeBid(2, longest, true);
          result.makeGameForcing();
        } else {
          result = BidCollection.makeBid(3, longest, true);
          result.makeGameForcing();
        }
      }
      if (result == null && this.pc.isBalanced()) {
        result = BidCollection.TWO_NOTRUMP_C();
        result.makeGameForcing();
      }
    }
    if (result == null) {
      result = BidCollection.TWO_DIAMONDS_C();
    }
    return result;
  }

  public applies(): boolean {
    return super.applies() && BidCollection.TWO_CLUBS.equals(this.partnersOpeningBid) && this.auction.isOpening(this.partnersOpeningBid);
  }
}
