import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { ResponseCalculator } from "../ResponseCalculator";
import { PartnersRebid } from "./PartnersRebid";

import { BidCollection } from "../BidCollection";
import { NoTrump } from "../../deck/NoTrump";
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Clubs, Diamonds, Spades, Hearts } from "../../deck/SuitValues";
import { Trump } from "../../deck/Trump";

export class PRebidWeakTwo extends PartnersRebid {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    if (super.applies()) {
      return this.opening.value == 2 && this.opening.trump !== Clubs && this.response.value == 2 && this.response.trump.isNoTrump() && this.rebid.value == 3;
    }
    return false;
  }

  public prepareBid(): Bid {
    const open: Suit = this.opening.trump as Suit;
    const trump: Trump = this.rebid.trump;
    if (open === Diamonds) {
      if (trump.isNoTrump()) {
        return null;
      }
      if (trump !== Diamonds) {
        let result: Bid = null;
        SuitCollection.mmList.forEach((color: Suit) => {
          if (!result && color !== trump && this.hand.isDecent5LengthSuits(color)) {
            result = BidCollection.makeBid(3, color, true);
            if (!this.auction.isValid(result)) {
              result = BidCollection.makeBid(4, color, true);
            }
          }
        });
      }
    } else {
      const calc: ResponseCalculator = new ResponseCalculator(this.hand, this.opening);
      if (trump.isNoTrump()) {
        let allStopped = true;
        SuitCollection.list.forEach((color: Suit) => {
          if (allStopped && color !== open && !this.hand.haveStrongStopper(color)) {
            allStopped = false;
          }                  
        });
        if (allStopped) {
          return BidCollection.makeBid(3, NoTrump, true);
        }
      } else if (trump === Spades) {
        if (this.hand.getSuitLength(open) >= 2) {
          return BidCollection.makeBid(4, open, true);
        } else if (calc.getHighCardPoints() >= 16) {
          let allStopped = true;
          SuitCollection.list.forEach((color: Suit) => {
            if (allStopped && color !== open && !this.hand.haveStrongStopper(color)) {
              allStopped = false;
            }
          });
          if (allStopped) {
            return BidCollection.makeBid(3, NoTrump, true);
          }
        }
        if (this.hand.getSuitLength(open) != 0) {
          return BidCollection.makeBid(4, open, true);
        }
      } else if (trump === Hearts) {
        if (this.hand.getSuitLength(open) >= 2 && calc.getHighCardPoints(this.hand.getSuitHi2Low(open)) >= 4) {
          return BidCollection.makeBid(4, open, true);
        } else {
          return BidCollection.makeBid(3, open, true);
        }
      } else {
        return BidCollection.makeBid(3, open, true);
      }
    }

    return null;
  }
}
