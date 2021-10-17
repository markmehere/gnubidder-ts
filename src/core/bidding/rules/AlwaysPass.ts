import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { BiddingRule } from "./BiddingRule";

export class AlwaysPass extends BiddingRule {
  constructor() {
    super(null, null);
  }

  public prepareBid(): Bid {
    return BidCollection.PASS;
  }

  public applies(): boolean {
    return true;
  }
}
