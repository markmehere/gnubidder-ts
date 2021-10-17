
import { NoTrump } from "../../deck/NoTrump";
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Trump } from "../../deck/Trump";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { Call } from "../Call";
import { ResponseCalculator } from "../ResponseCalculator";
import { BiddingRule } from "./BiddingRule";

export class RebidTakeoutDouble extends BiddingRule {
  public response: Bid;
  public opening: Bid;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    const responderCall: Call = this.auction.getPartnersLastCall();
    if (responderCall != null && responderCall.getBid().hasTrump()) {
      const myOpeningBid: Call = this.auction.getPartnersCall(responderCall);
      if (myOpeningBid != null) {
        this.opening = myOpeningBid.getBid();
        if (this.opening.isDouble() && this.auction.isOvercall(this.opening)) {
          this.response = responderCall.getBid();
          return true;
        }
      }
    }
    return false;
  }

  public prepareBid(): Bid {
    const doubledBid: Bid = this.auction.enemyCallBeforePartner(this.response).getBid();
    const calc: ResponseCalculator = new ResponseCalculator(this.hand, this.response);
    const level: number = this.response.value;
    const trump: Trump = this.response.trump;
    const dblTrump: Trump = doubledBid.trump;
    const points: number = calc.getCombinedPoints();
    if (trump.isNoTrump()) {
      if (level == 1) {
        if (points >= 15) {
          if (points >= 16) {
            const suit = this.hand.getGood5LengthSuits().find((suit: Suit) =>
              (suit !== dblTrump && this.auction.isValid(BidCollection.makeBid(2, suit, false))));
            if (suit) return BidCollection.makeBid(2, suit, true);
          }
          if (calc.isSemiBalanced() && this.haveStopperInEnemySuit()) {
            return BidCollection.TWO_NOTRUMP_C();
          }
        }
      } else if (level == 2) {
        if (points >= 14) {
          const suit = this.hand.getGood5LengthSuits().find((suit: Suit) => 
            (suit !== dblTrump && this.auction.isValid(BidCollection.makeBid(3, suit, false))));
          if (suit) return BidCollection.makeBid(3, suit, true);
          if (calc.isSemiBalanced() && this.haveStopperInEnemySuit()) {
            return BidCollection.cloneBid(BidCollection.THREE_NOTRUMP);
          }
        }
      }
    } else if (BidCollection.makeBid(doubledBid.value + 1, dblTrump, false).greaterThan(this.response)) {
      if (points >= 16) {
        let result: Bid = null;
        SuitCollection.mmList.forEach((suit: Suit) => {
            if (suit !== dblTrump && this.hand.isDecent5LengthSuits(suit)) {
              const aresult = this.makeCheapestBid(suit);
              if (this.auction.isValid(aresult)) {
                result = aresult;
              }
          }
        });
        if (result) return result;
      }
      if (points >= 19 && calc.isSemiBalanced() && this.haveStopperInEnemySuit()) {
        return this.makeCheapestBid(NoTrump);
      }
    } else {
      if (points >= 16) {
        if (this.hand.getSuitLength(trump as Suit) >= 3) {
          if (trump.isMajorSuit()) {
            return BidCollection.makeBid(4, trump, true);
          } else if (calc.getHighCardPoints(this.hand.getSuitHi2Low(trump as Suit)) >= 6) {
            return BidCollection.makeBid(5, trump, true);
          }
        }
        if (points >= 18 && calc.isBalanced() && this.haveStopperInEnemySuit()) {
          return this.makeCheapestBid(NoTrump);
        }
        let result: Bid = null;
        this.hand.getGood5LengthSuits().forEach((suit: Suit) => {
          if (!result && suit !== dblTrump && this.auction.isValid(BidCollection.makeBid(3, suit, false))) {
            result = BidCollection.makeBid(3, suit, true);
          }
        });
        return result;
      }
    }
    return null;
  }

  private makeCheapestBid(trump: Trump): Bid {
    if (trump == null) {
      return null;
    }
    const candidate: Bid = BidCollection.makeBid(this.response.value, trump, true);
    if (this.auction.isValid(candidate)) {
      return candidate;
    } else {
      return BidCollection.makeBid(this.response.value + 1, trump, true);
    }
  }
}
