import { Bid } from "../Bid";

import { Card } from "../../Card";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { PointCalculator } from "../PointCalculator";
import { BiddingRule } from "./BiddingRule";
import { BidCollection } from "../BidCollection";
import { Suit } from "../../deck/Suit";
import { Clubs, Hearts, Spades } from "../../deck/SuitValues";

export class WeakTwo extends BiddingRule {
  private pc: PointCalculator;
  private sixCardSuit: Suit;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
    this.pc = new PointCalculator(this.hand);
  }

  public applies(): boolean {
    if (this.auction.isOpeningBid() && this.pc.getHighCardPoints() >= 6) {
      this.sixCardSuit = this.hand.getLongestSuit();
      const cards: Card[] = this.hand.getSuitHi2Low(this.sixCardSuit);
      if (this.sixCardSuit === Clubs || this.hand.getSuitLength(this.sixCardSuit) < 6 || cards[0].value < Card.KING) {
        return false;
      }
      if (this.auction.getVulnerabilityIndex() >= 2) {
        let bigThree = 0, bigFive = 0;
        for (let i = 0; i < 5; ++i) {
          const value: number = cards[i].value;
          if (value >= Card.QUEEN) {
            bigThree++;
          }
          if (value >= Card.TEN) {
            bigFive++;
          }
        }
        if (bigThree < 2 && bigFive < 3) {
          return false;
        }
      }
      if (this.sixCardSuit !== Hearts && this.hand.getSuitLength(Hearts) >= 4 && this.hand.getSuitHi2Low(Hearts)[0].value >= Card.QUEEN) {
        return false;
      }
      if (this.sixCardSuit !== Spades && this.hand.getSuitLength(Spades) >= 4 && this.hand.getSuitHi2Low(Spades)[0].value >= Card.QUEEN) {
        return false;
      }
      return true;
    }
    return false;
  }

  public prepareBid(): Bid {
    return BidCollection.makeBid(2, this.sixCardSuit, true);
  }
}
