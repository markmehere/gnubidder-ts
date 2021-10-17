import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { PointCalculator } from "../PointCalculator";
import { BidResponse } from "./BidResponse";

import { BidCollection } from "../BidCollection";
import { Suit } from "../../deck/Suit";
import { Hearts, Spades, Clubs, Diamonds } from "../../deck/SuitValues";

export class Respond1NT extends BidResponse {
  private pc: PointCalculator;
  public fourthOvercalled = false;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
    this.pc = new PointCalculator(this.hand);
  }

  public prepareBid(): Bid {
    let longer: Suit = Hearts;
    const hearts: number = this.hand.getSuitLength(Hearts);
    const spades: number = this.hand.getSuitLength(Spades);
    let length: number = hearts;
    if (spades > hearts) {
      longer = Spades;
      length = spades;
    }
    const points: number = this.fourthOvercalled ? this.pc.getCombinedPoints() - 3 : this.pc.getCombinedPoints();
    if (length > 3) {
      if (length == 5 && (hearts == 4 || spades == 4) && points >= 8 && points <= 9) {
        return BidCollection.TWO_CLUBS_C();
      } else if (length == 4) {
        if (points >= 8) {
          return BidCollection.TWO_CLUBS_C();
        }
      } else if (length >= 6 && points >= 10 && points <= 13) {
        return BidCollection.makeBid(3, longer, true);
      } else {
        if (longer === Hearts) {
          return BidCollection.TWO_DIAMONDS_C();
        } else {
          return BidCollection.TWO_HEARTS_C();
        }
      }
    }
    longer = Clubs;
    const clubs: number = this.hand.getSuitLength(Clubs);
    const diamonds: number = this.hand.getSuitLength(Diamonds);
    length = clubs;
    if (diamonds > clubs) {
      longer = Diamonds;
      length = diamonds;
    }
    if (length >= 5) {
      if (points >= 14 || (length >= 6 && points >= 12)) {
        return BidCollection.TWO_CLUBS_C();
      } else if (points <= 7 && diamonds >= 5 && (diamonds == 6 || clubs >= 5)) {
        return BidCollection.TWO_SPADES_C(); /* double checked it is spades */
      } else if (points >= 10 && clubs >= 4 && diamonds >= 4) {
        return BidCollection.TWO_SPADES_C(); /* double checked it is spades */
      } else if (length >= 6 && points >= 6 && points <= 9) {
        return BidCollection.makeBid(3, longer, true);
      }
    }
  
    const HCP: number = this.fourthOvercalled ? this.pc.getHighCardPoints() - 3 : this.pc.getHighCardPoints();
    if (HCP <= 7) {
      return BidCollection.PASS;
    } else if (HCP <= 9 && this.pc.isSemiBalanced()) {
      return BidCollection.TWO_NOTRUMP_C();
    } else if (HCP <= 15 && this.pc.isSemiBalanced()) {
      return BidCollection.THREE_NOTRUMP_C();
    }
  
    return null;
  }
  public applies(): boolean {
    if (super.applies() && BidCollection.ONE_NOTRUMP_C().equals(this.partnersOpeningBid)) {
      if (this.auction.isFourthOvercall(this.partnersOpeningBid)) {
        this.fourthOvercalled = true;
      }
      return true;
    }
    return false;
  }
}
