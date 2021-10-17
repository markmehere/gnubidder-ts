import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { Call } from "../Call";
import { BiddingRule } from "./BiddingRule";

export abstract class Rebid extends BiddingRule {
  public response: Bid;
  public opening: Bid;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    if (this.auction.biddingSequenceLength() === 2) {
      const getCall: Call = this.auction.getPartnersLastCall();
      this.response = getCall.getBid();
      this.opening = this.auction.getPartnersCall(getCall).getBid();
      if (this.auction.isOpening(this.opening)) {
        return true;
      }
    }
    return false;
  }

  public abstract prepareBid(): Bid;
}
