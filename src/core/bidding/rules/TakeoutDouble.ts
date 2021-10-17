import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { PointCalculator } from "../PointCalculator";
import { BiddingRule } from "./BiddingRule";

import { BidCollection } from "../BidCollection";
import { HashSet } from "../../utility/HashSet";
import { Suit } from "../../deck/Suit";
import { SuitCollection } from "../../deck/SuitCollection";
import { Trump } from "../../deck/Trump";

export class TakeoutDouble extends BiddingRule {
  private pc: PointCalculator;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
    this.pc = new PointCalculator(this.hand);
  }

  public applies(): boolean {
    const HCP: number = this.pc.getHighCardPoints();
    if ((this.auction.may2ndOvercall() && HCP >= 12) || (this.auction.may4thOvercall() && HCP >= 8)) {
      if (this.auction.getHighBid().trump.isNoTrump()) {
        if (HCP >= 16 && this.pc.isSemiBalanced()) {
          let allStopped = true;
          SuitCollection.list.forEach((color: Suit) => {
            if (allStopped && !this.hand.haveStopper(color)) {
              allStopped = false;
            }
          });
          if (allStopped) {
            return true;
          }
        }
      } else {
        return HCP >= 16 || (HCP == 15 && this.auction.may4thOvercall()) || this.EachUnbidSuitWithAtLeast3Cards();
      }
    }
    return false;
  }

  public prepareBid(): Bid {
    return BidCollection.cloneBid(BidCollection.DOUBLE);
  }

  private EachUnbidSuitWithAtLeast3Cards(): boolean {
    return !SuitCollection.list.find(
      color => (this.hasNotBeenBid(color) && this.hand.getSuitLength(color) < 3));
  }

  private hasNotBeenBid(suit: Suit): boolean {
    const enemyTrumps: HashSet<Trump> = this.auction.getEnemyTrumps();
    let result = false;
    enemyTrumps.forEach((trump: Trump) => {
      if (suit === trump) {
        result = true;
      }
    });
    return result;
  }
}
