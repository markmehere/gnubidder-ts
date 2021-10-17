import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { ResponseCalculator } from "../ResponseCalculator";
import { BidResponse } from "./BidResponse";

import { BidCollection } from "../BidCollection";
import { NoTrump } from "../../deck/NoTrump";
import { Suit } from "../../deck/Suit";
import { Trump } from "../../deck/Trump";

export class RespondOvercallSuit extends BidResponse {
  private static MAJOR_SUIT_GAME = 4;
  private static NOTRUMP_GAME = 3;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.auction.isOvercall(this.partnersOpeningBid) && this.partnersOpeningBid.trump.isSuit();
  }

  public prepareBid(): Bid {
    const calc: ResponseCalculator = new ResponseCalculator(this.hand, this.partnersOpeningBid);
    const points: number = calc.getCombinedPoints();
    const level: number = this.partnersOpeningBid.value;
    const length: number = this.hand.getSuitLength(this.partnersOpeningBid.trump as Suit);
    if (length >= 3) {
      if (length != 3 && points <= 7 && level == 1 && this.auction.getVulnerabilityIndex() < 2) {
        return BidCollection.makeBid(3, this.partnersOpeningBid.trump, true);
      } else if (points >= 7 && points <= 14) {
        const result: Bid = BidCollection.makeBid(level + 1, this.partnersOpeningBid.trump, true);
        if (this.auction.isValid(result)) {
          return result;
        }
      } else if (points >= 15) {
        return BidCollection.makeBid(RespondOvercallSuit.MAJOR_SUIT_GAME, this.partnersOpeningBid.trump, true);
      }
    }
    if (points >= 8) {
      if (level == 1) {
        if (points >= 10) {
          let result = null;
          this.hand.getSuitsWithAtLeastCards(5).forEach((color: Suit) => {
            if (!result && this.auction.isValid(BidCollection.makeBid(2, color, false))) {
              result = BidCollection.makeBid(2, color, true);
            }
          });
          if (result) return result;
          if (points <= 12 && calc.isBalanced()) return this.makeCheapestBid(NoTrump);
        } else if (calc.isBalanced() && this.haveStopperInEnemySuit()) {
          return this.makeCheapestBid(NoTrump);
        } else {
          let result = null;
          this.hand.getSuitsWithAtLeastCards(4).forEach((color: Suit) => {
            if (!result && this.auction.isValid(BidCollection.makeBid(1, color, false))) {
              result = BidCollection.makeBid(1, color, true);
            }
          });
          return result;
        }
      }
      if (level == 2) {
        let result = null;
        this.hand.getDecent5LengthSuits().forEach((color: Suit) => {
          if (!result) {
            if (points >= 13) {
              result = BidCollection.makeBid(3, color, true);
            } else if (this.auction.isValid(BidCollection.makeBid(2, color, false))) {
              result = BidCollection.makeBid(2, color, true);
            }
          }
        });
        return result;
      }
    }
    if (level <= 3 && this.haveStopperInEnemySuit()) {
      if (level == 3) {
        if (points >= 18 && calc.isSemiBalanced()) {
          return BidCollection.makeBid(RespondOvercallSuit.NOTRUMP_GAME, NoTrump, true);
        }
      } else {
        if (points >= 8 && points <= 11) {
          return this.makeCheapestBid(NoTrump);
        }
        if (points >= 12 && points <= 14) {
          const bid: Bid = this.makeCheapestBid(NoTrump);
          return BidCollection.makeBid(bid.value + 1, NoTrump, true);
        }
        if (points >= 15) {
          return BidCollection.makeBid(RespondOvercallSuit.NOTRUMP_GAME, NoTrump, true);
        }
      }
    }
    return null;
  }

  private makeCheapestBid(trump: Trump): Bid {
    const candidate: Bid = BidCollection.makeBid(this.partnersOpeningBid.value, trump, true);
    if (this.auction.isValid(candidate)) {
      return candidate;
    } else {
      return BidCollection.makeBid(this.partnersOpeningBid.value + 1, trump, true);
    }
  }
}
