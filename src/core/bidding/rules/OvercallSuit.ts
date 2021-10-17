import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { PointCalculator } from "../PointCalculator";
import { BiddingRule } from "./BiddingRule";

import { BidCollection } from "../BidCollection";
import { Suit } from "../../deck/Suit";

export class OvercallSuit extends BiddingRule {
  private pc: PointCalculator;
  public isFourthOvercall = false;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
    this.pc = new PointCalculator(this.hand);
  }

  public applies(): boolean {
    if (this.pc.getCombinedPoints() >= 8) {
      if (this.auction.may2ndOvercall()) {
        return true;
      } else if (this.auction.may4thOvercall()) {
        this.isFourthOvercall = true;
        return true;
      }

    }
    return false;
  }

  public prepareBid(): Bid {
    const points: number = this.pc.getCombinedPoints();
    if (points < 11) {
      return this.firstValidBid(this.bidSuit(1, this.hand.getSuitsWithAtLeastCards(6)), this.bidSuit(1, this.hand.getDecent5LengthSuits()));
    }
    if ((points >= 11 && points <= 17) || (this.isFourthOvercall && points >= 8 && points <= 14)) {
      return this.firstValidBid(this.bidSuit(1, this.hand.getSuitsWithAtLeastCards(5)), this.bidSuit(2, this.hand.getSuitsWithAtLeastCards(6)), this.bidSuit(2, this.hand.getGood5LengthSuits()));
    }
    return null;
  }

  private bidSuit(bidLevel: number, suits: Suit[]): Bid {
    let result = null;
    suits.forEach((suit: Suit) => {
      if (!result && this.auction.isValid(BidCollection.makeBid(bidLevel, suit, false))) {
        result = BidCollection.makeBid(bidLevel, suit, true);
      }
    });
    return result;
  }

  private firstValidBid(...bids: Bid[]): Bid {
    return bids.find((bid: Bid) => bid);
  }
}
