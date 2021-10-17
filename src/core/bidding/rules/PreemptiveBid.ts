import { Card } from "../../Card";
import { Suit } from "../../deck/Suit";
import { Hearts, Spades } from "../../deck/SuitValues";

import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { TrickCalculator } from "../TrickCalculator";
import { BiddingRule } from "./BiddingRule";

export class PreemptiveBid extends BiddingRule {
  private longestSuit: Suit;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    if (this.auction.isOpeningBid() || (this.auction.may2ndOvercall() || this.auction.may4thOvercall())) {
      const calc: TrickCalculator = new TrickCalculator(this.hand);
      this.longestSuit = this.hand.getLongestSuit();
      if (this.hand.getSuitLength(this.longestSuit) < 6) {
        return false;
      }
      if (this.longestSuit !== Hearts && this.hand.getSuitLength(Hearts) >= 4 && this.hand.getSuitHi2Low(Hearts)[0].value >= Card.QUEEN) {
        return false;
      }
      if (this.longestSuit !== Spades && this.hand.getSuitLength(Spades) >= 4 && this.hand.getSuitHi2Low(Spades)[0].value >= Card.QUEEN) {
        return false;
      }
      let tricks: number = calc.playingTricks();
      const vulnerabilityIndex: number = this.auction.getVulnerabilityIndex();
      if (vulnerabilityIndex == 2) {
        tricks += 2;
      } else if (vulnerabilityIndex == 1) {
        tricks += 4;
      } else {
        tricks += 3;
      }

      if (tricks >= 9) {
        return true;
      }
    }
    return false;
  }

  public prepareBid(): Bid {
    return BidCollection.makeBid(3, this.longestSuit, true);
  }
}
