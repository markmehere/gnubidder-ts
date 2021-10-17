import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { Call } from "../Call";
import { BiddingRule } from "./BiddingRule";

export abstract class BidResponse extends BiddingRule {
  public partnersOpeningBid: Bid;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    const partnersCall: Call = this.auction.getPartnersLastCall();
    if (partnersCall != null && partnersCall.getBid().hasTrump()) {
      this.partnersOpeningBid = partnersCall.getBid();
      const myOpeningCall: Call = this.auction.getPartnersCall(partnersCall);
      if (myOpeningCall == null || myOpeningCall.isPass()) {
        return true;
      }
    }
    return false;
  }

  public abstract prepareBid(): Bid;
}
