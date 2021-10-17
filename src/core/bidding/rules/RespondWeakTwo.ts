import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { ResponseCalculator } from "../ResponseCalculator";
import { BidResponse } from "./BidResponse";

import { BidCollection } from "../BidCollection";
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Clubs, Diamonds, Spades, Hearts } from "../../deck/SuitValues";

export class RespondWeakTwo extends BidResponse {
  private calc: ResponseCalculator;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    if (super.applies() && this.auction.isOpening(this.partnersOpeningBid) && this.partnersOpeningBid.value == 2 && this.partnersOpeningBid.trump !== Clubs && this.partnersOpeningBid.trump.isSuit()) {
      this.calc = new ResponseCalculator(this.hand, this.partnersOpeningBid);
      return this.calc.getCombinedPoints() >= 8;
    }
    return false;
  }

  public prepareBid(): Bid {
    const points: number = this.calc.getCombinedPoints();
    if (this.partnersOpeningBid.trump === Diamonds) {
      if (points < 10) {
        return null;
      }
      let result: Bid = null;
      let noMoreAnalysis = false;
      SuitCollection.mmList.forEach((color: Suit) => {
        if (noMoreAnalysis) return;
        if (color !== Diamonds && (this.hand.getSuitLength(color) >= 6 || this.hand.isDecent5LengthSuits(color))) {
          if (points >= 16) {
            result = BidCollection.TWO_NOTRUMP_C();
            noMoreAnalysis = true;
          } else {
            if (color === Clubs && this.hand.getSuitLength(Diamonds) < 3) {
              result = BidCollection.makeBid(3, color, true);
            } else {
              result = BidCollection.makeBid(2, color, true);
            }
          }
        }
      });
      if (this.auction.isValid(result)) {
        return result;
      }
      if (this.hand.getSuitLength(Diamonds) >= 3) {
        if (points >= 16) {
          return BidCollection.TWO_NOTRUMP_C();
        } else {
          return BidCollection.THREE_DIAMONDS_C(); /* this was 2D not 3D in earlier versions */
        }
      }
    } else {
      const suit: Suit = this.partnersOpeningBid.trump as Suit;
      if (points < 8) {
        return null;
      }
      if (this.hand.getSuitLength(suit) >= 3) {
        if (points <= 13) {
          return BidCollection.makeBid(3, suit, true);
        } else if (points <= 16) {
          return BidCollection.TWO_NOTRUMP_C();
        } else if (points <= 19) {
          return BidCollection.makeBid(4, suit, true);
        } else {
          return BidCollection.TWO_NOTRUMP_C();
        }
      }
      let result: Bid = null;
      SuitCollection.mmList.forEach((color: Suit) => {
        if (color !== suit && (this.hand.getSuitLength(color) >= 6 || this.hand.isDecent5LengthSuits(color))) {
          if (points >= 16) {
            result = BidCollection.TWO_NOTRUMP_C();
          } else {
            if (color === Spades && suit === Hearts) {
              result = BidCollection.makeBid(2, color, true);
            } else if (this.hand.getSuitLength(suit) < 2) {
              result = BidCollection.makeBid(3, color, true);
            }
          }
        }
      });
      if (this.auction.isValid(result)) {
        return result;
      }
    }
    const HCP: number = this.calc.getHighCardPoints();
    if (HCP >= 14) {
      if (HCP >= 16 && this.calc.isSemiBalanced()) {
        let allStopped = true;
        SuitCollection.list.forEach((color: Suit) => {
          if (allStopped && color !== Diamonds && !this.hand.haveStopper(color)) {
            allStopped = false;
          }
        });
        if (allStopped) {
          return BidCollection.THREE_NOTRUMP_C();
        }
      }
      return BidCollection.TWO_NOTRUMP_C();
    }
    return null;
  }
}
