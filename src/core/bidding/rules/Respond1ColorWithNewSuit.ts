

import { NoTrump } from "../../deck/NoTrump";
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Diamonds, Clubs } from "../../deck/SuitValues";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { ResponseCalculator } from "../ResponseCalculator";
import { BidResponse } from "./BidResponse";

export class Respond1ColorWithNewSuit extends BidResponse {
  private pc: ResponseCalculator;
  private unbidSuit: Suit;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    let result = false;
    if (super.applies() && this.partnerBid1Color()) {
      this.pc = new ResponseCalculator(this.hand, this.partnersOpeningBid);
      this.unbidSuit = this.findHighestColorWithFourOrMoreCards();
      if (this.pc.getCombinedPoints() >= 6 && this.unbidSuit != null) {
        result = true;
      }
    }
    return result;
  }

  public prepareBid(): Bid {
    const points: number = this.pc.getCombinedPoints();
    const length: number = this.hand.getSuitLength(this.unbidSuit);
    if (this.unbidSuit === Diamonds && points >= 12 && this.partnersOpeningBid.trump === Clubs) {
      if (this.hand.getSuitLength(Diamonds) >= 5 && (length == 6 || this.hand.getSuitLength(Clubs) >= 4)) {
        return BidCollection.makeBid(2, this.unbidSuit, true);
      }
    }
    if (length == 6) {
      if (points <= 7 && this.unbidSuit !== Diamonds) {
        return BidCollection.makeBid(2, this.unbidSuit, true);
      }
    }
    const result: Bid = BidCollection.makeBid(1, this.unbidSuit, true);
    if (!this.auction.isValid(result) && points >= 12) {
      this.unbidSuit = this.findTwoOverOneSuit();
      if (this.unbidSuit != null) {
        return BidCollection.makeBid(2, this.unbidSuit, true);
      }
    } else {
      return result;
    }
    this.unbidSuit = this.getLowerUnbidSuitWithAtLeast6Cards();
    if (this.unbidSuit != null && points >= 9 && points <= 11) {
      return BidCollection.makeBid(3, this.unbidSuit, true);
    }
    return null;
  }

  private partnerBid1Color(): boolean {
    if (NoTrump !== this.partnersOpeningBid.trump && 1 == this.partnersOpeningBid.value) {
      return true;
    } else {
      return false;
    }
  }

  private findHighestColorWithFourOrMoreCards(): Suit {
    let longer: Suit = null;
    SuitCollection.list.forEach((color: Suit) => {
      if (this.hand.getSuitLength(color) >= 4 && this.hand.AisStronger(color, longer) && color !== this.partnersOpeningBid.trump) {
        longer = color;
      }
    });
    return longer;
  }

  private findTwoOverOneSuit(): Suit {
    let longer: Suit = null;
    SuitCollection.mmList.forEach((color: Suit) => {
      if (color.isLowerRankThan(this.partnersOpeningBid.trump) && this.hand.AisStronger(color, longer)) {
        longer = color;
      }
    });
    if (longer == null) {
      return null;
    }
    const length: number = this.hand.getSuitLength(longer);
    if (length < 4 || (length == 4 && this.partnersOpeningBid.trump !== Diamonds)) {
      longer = null;
    }
    return longer;
  }

  private getLowerUnbidSuitWithAtLeast6Cards(): Suit {
    return SuitCollection.mmList.find((color: Suit) => this.hand.getSuitLength(color) >= 6 && color.isLowerRankThan(this.partnersOpeningBid.trump));
  }
}
