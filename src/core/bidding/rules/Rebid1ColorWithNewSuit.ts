
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { RebidToLevel1Response } from "./RebidToLevel1Response";

export class Rebid1ColorWithNewSuit extends RebidToLevel1Response {
  private unbidSuit: Suit;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    if (super.applies()) {
      this.unbidSuit = this.getUnbidSuitWithAtLeast4Cards();
      if (this.unbidSuit != null) {
        return true;
      }
    }
    return false;
  }

  public prepareBid(): Bid {
    const calc: PointCalculator = new PointCalculator(this.hand);
    const minimumBid: number = this.getMinimumBidInSuit(this.unbidSuit);
    if (calc.getCombinedPoints() >= 19) {
      const bid: Bid = BidCollection.makeBid(minimumBid + 1, this.unbidSuit, true);
      bid.makeGameForcing();
      return bid;
    }
    if ((minimumBid == 2 && !calc.isBalanced())) {
      if (calc.getCombinedPoints() >= 16) {
        return BidCollection.makeBid(minimumBid, this.unbidSuit, true);
      }
      this.unbidSuit = this.getLowerUnbidSuitWithAtLeast4Cards();
      if (this.unbidSuit != null) {
        return BidCollection.makeBid(minimumBid, this.unbidSuit, true);
      }
    }
    if (minimumBid == 1) {
      return BidCollection.makeBid(minimumBid, this.unbidSuit, true);
    }
    return null;
  }

  private getMinimumBidInSuit(suit: Suit): number {
    if (this.auction.isValid(BidCollection.makeBid(1, suit, false))) {
      return 1;
    } else {
      return 2;
    }
  }

  private getUnbidSuitWithAtLeast4Cards(): Suit {
    return SuitCollection.list.find((color: Suit) => this.hand.getSuitLength(color) >= 4 && this.hasNotBeenBid(color));
  }

  private getLowerUnbidSuitWithAtLeast4Cards(): Suit {
    return SuitCollection.list.find((color: Suit) => this.hand.getSuitLength(color) >= 4 &&
      color.isLowerRankThan(this.opening.trump) && this.hasNotBeenBid(color));
  }

  private hasNotBeenBid(suit: Suit): boolean {
    return suit !== this.response.trump && suit !== this.opening.trump;
  }
}
