
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Clubs, Diamonds } from "../../deck/SuitValues";
import { Trump } from "../../deck/Trump";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { BiddingRule } from "./BiddingRule";

export class Open1Color extends BiddingRule {
  private pc: PointCalculator;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
    this.pc = new PointCalculator(this.hand);
  }

  public applies(): boolean {
    return this.auction.isOpeningBid() && this.pc.getCombinedPoints() >= 13;
  }

  public prepareBid(): Bid {
    let result: Bid = null;
    let highest: Suit = null;
    SuitCollection.list.forEach((color: Suit) => {
        if (this.hand.getSuitLength(color) >= 5) {
          if (this.hand.AisStronger(color, highest)) {
            highest = color;
          }
        }
    });
    if (highest != null) {
      result = BidCollection.makeBid(1, highest, true);
    } else {
      result = BidCollection.makeBid(1, this.getStrongerMinor(), true);
    }
    return result;
  }

  private getStrongerMinor(): Trump {
    let result: Trump = null;
    if (this.hand.getSuitLength(Clubs) > this.hand.getSuitLength(Diamonds)) {
      result = Clubs;
    } else if (this.hand.getSuitLength(Clubs) == 3 && this.hand.getSuitLength(Diamonds) == 3) {
      if (this.pc.getHighCardPoints(this.hand.getSuitHi2Low(Clubs)) > this.pc.getHighCardPoints(this.hand.getSuitHi2Low(Diamonds))) {
        result = Clubs;
      } else {
        result = Diamonds;
      }
    } else {
      result = Diamonds;
    }
    return result;
  }
}
