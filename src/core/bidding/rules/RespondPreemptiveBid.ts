import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { TrickCalculator } from "../TrickCalculator";
import { BidResponse } from "./BidResponse";

import { BidCollection } from "../BidCollection";
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";

export class RespondPreemptiveBid extends BidResponse {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    if (super.applies() && (this.auction.isOpening(this.partnersOpeningBid) || (this.auction.isOvercall(this.partnersOpeningBid) && this.auction.enemyCallBeforePartner(null).getBid().is1Suit()))) {
      return this.partnersOpeningBid.value == 3 && this.partnersOpeningBid.trump.isSuit() && this.hand.getSuitLength(this.partnersOpeningBid.trump as Suit) != 0;
    }
    return false;
  }

  public prepareBid(): Bid {
    const calc: TrickCalculator = new TrickCalculator(this.hand);
    const suit: Suit = this.partnersOpeningBid.trump as Suit;
    const vulnerabilityIndex: number = this.auction.getVulnerabilityIndex();
    let doubledTricks = 0;
    SuitCollection.list.forEach((color: Suit) => {
      doubledTricks += calc.doublePlayingTricks(color);
    });
    if (suit.isMajorSuit()) {
      if ((vulnerabilityIndex == 2 && doubledTricks > 4) || (vulnerabilityIndex == 1 && doubledTricks > 8) || (vulnerabilityIndex == 0 && doubledTricks > 6)) {
        return BidCollection.makeBid(4, suit, true);
      }
    } else {
      if ((vulnerabilityIndex == 2 && doubledTricks > 6) || (vulnerabilityIndex == 1 && doubledTricks > 10) || (vulnerabilityIndex == 0 && doubledTricks > 8)) {
        return BidCollection.makeBid(5, suit, true);
      }
    }
    if ((vulnerabilityIndex == 2 && doubledTricks > 2) || (vulnerabilityIndex == 1 && doubledTricks > 6) || (vulnerabilityIndex == 0 && doubledTricks > 4)) {
      if (this.hand.getSuitLength(suit) >= 3) {
        let possible = true;
        SuitCollection.list.forEach((color: Suit) => {
            if (possible && color !== suit && (this.hand.getSuitLength(color) < 2 || !this.hand.haveStrongStopper(color))) {
              possible = false;
            }
        });
        if (possible) {
          return BidCollection.THREE_NOTRUMP_C();
        }
      }
      const colorResult = SuitCollection.mmList.find((color: Suit) => {
        if (color !== suit && this.hand.getSuitLength(color) >= 6 && this.hand.isDecent5LengthSuits(color)) {
          return this.auction.isValid(BidCollection.makeBid(3, color, false));
        }
        return false;
      });
      if (colorResult) return BidCollection.makeBid(3, colorResult, true);
    }
    return BidCollection.PASS;
  }
}
