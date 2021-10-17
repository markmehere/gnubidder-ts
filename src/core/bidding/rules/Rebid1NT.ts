import { BidCollection } from "../BidCollection";

import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { PointCalculator } from "../PointCalculator";
import { Rebid } from "./Rebid";
import { NoTrump } from "../../deck/NoTrump";
import { Suit } from "../../deck/Suit";
import { Clubs, Hearts, Spades, Diamonds } from "../../deck/SuitValues";
import { Trump } from "../../deck/Trump";

export class Rebid1NT extends Rebid {
  public fourthOvercalled = false;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public prepareBid(): Bid {
    let result: Bid = null;
    const pc: PointCalculator = new PointCalculator(this.hand);
    const level: number = this.response.value;
    const trump: Trump = this.response.trump;
    const maximum: number = this.fourthOvercalled ? 14 : 17;
    if (level == 2) {
      if (trump === Clubs) {
        if (this.hand.getSuitLength(Hearts) >= 4) {
          result = BidCollection.TWO_HEARTS_C();
        } else if (this.hand.getSuitLength(Spades) >= 4) {
          result = BidCollection.TWO_SPADES_C();
        } else {
          result = BidCollection.TWO_DIAMONDS_C();
        }
      } else if (trump === Spades) {
        if (this.hand.getSuitLength(Clubs) >= 4) {
          result = BidCollection.THREE_CLUBS_C();
        } else if (this.hand.getSuitLength(Diamonds) >= 4) {
          result = BidCollection.THREE_DIAMONDS_C();
        } else {
          result = BidCollection.TWO_NOTRUMP_C();
        }
      } else if (trump.isNoTrump()) {
        if (pc.getHighCardPoints() >= maximum) {
          result = BidCollection.THREE_NOTRUMP_C();
        } else {
          result = BidCollection.PASS;
        }
      } else if (trump === Diamonds) {
        if (pc.getCombinedPoints() >= maximum) {
          result = BidCollection.TWO_SPADES_C();
        } else {
          result = BidCollection.TWO_HEARTS_C();
        }
      } else {
        if (pc.getCombinedPoints() >= maximum) {
          result = BidCollection.TWO_NOTRUMP_C();
        } else {
          result = BidCollection.TWO_SPADES_C();
        }
      }
    } else if (level == 3) {
      if (trump.isNoTrump()) {
        result = BidCollection.PASS;
      } else if (this.hand.getSuitLength(trump as Suit) >= 2) {
        if (trump.isMajorSuit()) {
          result = BidCollection.makeBid(4, trump, true);
        } else if (pc.getHighCardPoints() >= maximum) {
          result = BidCollection.THREE_NOTRUMP_C();
        }
      }
    }

    return result;
  }

  private partnerWasRespondingToMy1NT(): boolean {
    if (super.applies()) {
      return BidCollection.makeBid(1, NoTrump, true).equals(this.opening);
    } else {
      if (this.opening != null) {
        if (this.auction.isOvercall(this.opening)) {
          if (this.auction.isFourthOvercall(this.opening)) {
            this.fourthOvercalled = true;
          }
          return BidCollection.makeBid(1, NoTrump, true).equals(this.opening);
        }
      }
      return false;
    }
  }

  public applies(): boolean {
    return this.partnerWasRespondingToMy1NT();
  }
}
