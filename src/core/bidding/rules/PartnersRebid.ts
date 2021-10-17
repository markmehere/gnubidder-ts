import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { Call } from "../Call";
import { BiddingRule } from "./BiddingRule";

export abstract class PartnersRebid extends BiddingRule {
  public rebid: Bid;
  public response: Bid;
  public opening: Bid;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    if (this.auction.biddingSequenceLength() === 3) {
      let getCall: Call = this.auction.getPartnersLastCall();
      this.rebid = getCall.getBid();
      getCall = this.auction.getPartnersCall(getCall);
      this.response = getCall.getBid();
      this.opening = this.auction.getPartnersCall(getCall).getBid();
      return true;
    }
    return false;
  }

  public abstract prepareBid(): Bid;
}
