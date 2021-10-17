
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Hearts, Spades } from "../../deck/SuitValues";
import { Trump } from "../../deck/Trump";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { BiddingRule } from "./BiddingRule";

export class RespondTakeoutDouble extends BiddingRule {
  private pc: PointCalculator;
  private lastBid: Bid;
  private highest: Suit;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    if (this.auction.getPartnersLastCall() == null) {
      return false;
    }
    const partnersBid: Bid = this.auction.getPartnersLastCall().getBid();
    if (this.auction.isOvercall(partnersBid) && partnersBid.isDouble()) {
      this.lastBid = this.auction.enemyCallBeforePartner(null).getBid();
      if (this.lastBid.value < 4 && !this.lastBid.trump.isNoTrump()) {
        return true;
      }
    }
    return false;
  }

  public prepareBid(): Bid {
    this.pc = new PointCalculator(this.hand);
    let result: Bid = null;
    this.highest = this.longestSuit();
    const HCP: number = this.pc.getHighCardPoints();
    if (HCP < 3) return BidCollection.PASS;
    if (HCP <= 12 && this.highest != null) {
      result = BidCollection.makeBid(this.levelToBid(), this.highest, true);
      if (!this.auction.isValid(result)) {
        if (HCP >= 9) {
          result = BidCollection.makeBid(this.levelToBid() + 1, this.highest, true);
        } else {
          if (this.hand.getSuitLength(Hearts) >= 4) {
            this.highest = Hearts;
            result = BidCollection.makeBid(this.levelToBid(), this.highest, true);
          }
          if (!this.auction.isValid(result) && this.hand.getSuitLength(Spades) >= 4) {
            this.highest = Spades;
            result = BidCollection.makeBid(this.levelToBid(), this.highest, true);
            if (!this.auction.isValid(result)) {
              result = null;
            }
          }
        }
      }
      if (result != null) {
        return result;
      }
    }
    if (HCP >= 6 && this.haveStopperInEnemySuit()) {
      if (HCP < 10) {
        return BidCollection.ONE_NOTRUMP_C();
      } else if (HCP <= 12) {
        return BidCollection.TWO_NOTRUMP_C();
      } else if (HCP <= 16) {
        return BidCollection.THREE_NOTRUMP_C();
      }
    }
    const enemy: Suit = this.lastBid.trump as Suit;
    if (HCP >= 10) {
      return BidCollection.makeBid(this.lastBid.value + 1, enemy, true);
    } else if (this.hand.isGood5LengthSuits(enemy)) {
      return BidCollection.PASS;
    } else {
      return this.makeCheapestBid(this.desperateSuit());
    }
  }

  private longestSuit(): Suit {
    let longest: Suit = null;
    SuitCollection.list.forEach((color: Suit) => {
      if (this.enemyHasBid(color) && (this.hand.getSuitLength(color) >= 5 || (this.hand.getSuitLength(color)) == 4 && color.isMajorSuit())) {
        if (this.hand.AisStronger(color, longest)) {
          longest = color;
        }
      }
    });
    return longest;
  }

  private desperateSuit(): Suit {
    let longest: Suit = null;
    SuitCollection.list.forEach((color: Suit) => {
      if (this.enemyHasBid(color) && this.hand.getSuitLength(color) >= 3) {
        if (this.hand.AisStronger(color, longest)) {
          longest = color;
        }
      }
    });
    return longest;
  }

  private enemyHasBid(suit: Suit): boolean {
    return this.auction.getEnemyTrumps().contains(suit);
  }

  private levelToBid(): number {
    if (this.lastBid.greaterThan(BidCollection.makeBid(this.lastBid.value, this.highest, true))) {
      return this.lastBid.value + 1;
    } else {
      return this.lastBid.value;
    }
  }

  private makeCheapestBid(trump: Trump): Bid {
    if (trump == null) {
      return null;
    }
    const candidate: Bid = BidCollection.makeBid(this.lastBid.value, trump, true);
    if (this.auction.isValid(candidate)) {
      return candidate;
    } else {
      return BidCollection.makeBid(this.lastBid.value + 1, trump, true);
    }
  }
}
