import { NoTrump } from "../../deck/NoTrump";
import { Suit } from "../../deck/Suit";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { PartnersRebid } from "./PartnersRebid";

export class PRebidToCorrect extends PartnersRebid {
  
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }
  
  public applies(): boolean {
    if (super.applies()) {
      if (this.rebid.trump !== NoTrump &&
        this.rebid.trump !== this.response.trump &&
        this.rebid.trump !== this.opening.trump &&
        this.rebid === this.auction.getHighCall().getBid() &&
        this.hand.getSuitLength(this.rebid.trump as Suit) <= 2
      ) {
        const pc: PointCalculator = new PointCalculator(this.hand);
        const HCP: number = pc.getHighCardPoints();
        if (HCP < 6) return true;
      }
    }
    return false;
  }
  
  public prepareBid(): Bid {
    if (this.auction.isValid(BidCollection.makeBid(this.rebid.value, this.opening.trump, false))) {
      return BidCollection.makeBid(this.rebid.value, this.opening.trump, true);
    }
    else if (this.rebid.value < 7 && this.auction.isValid(BidCollection.makeBid(this.rebid.value + 1, this.opening.trump, false))) {
      return BidCollection.makeBid(this.rebid.value + 1, this.opening.trump, true);
    }
    else {
      return BidCollection.PASS;
    }
  }
}
