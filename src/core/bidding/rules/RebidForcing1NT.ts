
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Hearts, Spades, Clubs, Diamonds } from "../../deck/SuitValues";
import { Trump } from "../../deck/Trump";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { PartnersRebid } from "./PartnersRebid";

export class RebidForcing1NT extends PartnersRebid {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.response.trump.isNoTrump() && this.response.value == 1 && this.opening.trump.isMajorSuit() && this.rebid.hasTrump();
  }

  public prepareBid(): Bid {
    const pc: PointCalculator = new PointCalculator(this.hand);
    const level: number = this.rebid.value;
    const HCP: number = pc.getHighCardPoints();
    const open: Trump = this.opening.trump;
    const trump: Trump = this.rebid.trump;
    const lengthOfTrump: number = this.hand.getSuitLength(open as Suit);
    if (level == 2) {
      if (trump.isNoTrump()) {
        if (this.hand.getSuitLength(open as Suit) >= 3) {
          if (HCP >= 8) {
            return BidCollection.makeBid(3, open, true);
          } else {
            return BidCollection.makeBid(4, open, true);
          }
        }
        if (HCP >= 9) {
          const unbidSuit: Suit = this.getLongestUnbidSuit();
          if (unbidSuit != null) {
            return BidCollection.makeBid(3, unbidSuit, true);
          } else if (pc.isBalanced()) {
            return BidCollection.cloneBid(BidCollection.THREE_NOTRUMP);
          }

        }
      } else if (trump.isMinorSuit()) {
        if (lengthOfTrump >= 2) {
          if (lengthOfTrump == 2 || HCP <= 7) {
            return BidCollection.makeBid(2, open, true);
          } else {
            return BidCollection.makeBid(3, open, true);
          }
        }
        if (this.hand.getSuitLength(trump as Suit) >= 5) {
          if (HCP >= 8) {
            return BidCollection.makeBid(3, trump, true);
          }
        }
        if (HCP >= 10 && HCP <= 12) {
          return BidCollection.cloneBid(BidCollection.TWO_NOTRUMP);
        }
        if (HCP <= 10) {
          const color: Suit = this.getUnbidSuitWithAtLeast5Cards();
          if (color != null) {
            return BidCollection.makeBid(2, color, true);
          }
        }
      } else {
        if (trump === open) {
          if (HCP >= 10) {
            return BidCollection.makeBid(3, open, true);
          }
        } else {
          if (trump === Hearts) {
            if (HCP >= 11 && this.hand.getSuitLength(Hearts) >= 5) {
              return BidCollection.FOUR_HEARTS_C();
            } else if (HCP >= 8 && this.hand.getSuitLength(Hearts) >= 4) {
              return BidCollection.THREE_HEARTS_C();
            }

          } else {
            if (HCP >= 8) {
              if (this.hand.getSuitLength(Hearts) >= 3) {
                return BidCollection.FOUR_HEARTS_C();
              } else if (this.hand.getSuitLength(Spades) >= 4) {
                return BidCollection.FOUR_SPADES_C();
              }

            } else {
              if (this.hand.getSuitLength(Hearts) >= 3) {
                return BidCollection.THREE_HEARTS_C()
              } else if (this.hand.getSuitLength(Spades) >= 4) {
                return BidCollection.THREE_SPADES_C();
              }

            }
            if (pc.isBalanced()) {
              if (HCP <= 9) {
                return BidCollection.TWO_NOTRUMP_C();
              } else if (this.hand.haveStrongStopper(Clubs) && this.hand.haveStrongStopper(Diamonds)) {
                return BidCollection.THREE_NOTRUMP_C();
              }

            }
          }
        }
      }
    }
    return null;
  }

  private getUnbidSuitWithAtLeast5Cards(): Suit {
    return SuitCollection.reverseList.find((color: Suit) => 
      (this.hand.getSuitLength(color) >= 5 && this.hasNotBeenBid(color)));
  }

  private getLongestUnbidSuit(): Suit {
    let longer: Suit = null;
    SuitCollection.mmList.forEach((color: Suit) => {
      if (this.hand.getSuitLength(color) >= 5 && this.hand.AisStronger(color, longer) && color !== this.opening.trump) {
        longer = color;
      }
    });
    return longer;
  }

  private hasNotBeenBid(suit: Suit): boolean {
    return suit !== this.rebid.trump && suit !== this.opening.trump;
  }
}
