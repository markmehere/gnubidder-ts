import { Suit } from "../../deck/Suit";
import { Trump } from "../../deck/Trump";
import { Hand } from "../../Hand";
import { HashSet } from "../../utility/HashSet";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";


export abstract class BiddingRule {
  public auction: Auctioneer;
  public hand: Hand;

  constructor(a: Auctioneer, h: Hand) {
    this.auction = a;
    this.hand = h;
  }

  public abstract prepareBid(): Bid;

  public getBid(): Bid {
    if (!this.applies()) {
      return null;
    }
    const candidate: Bid = this.prepareBid();
    if (this.auction == null || this.auction.isValid(candidate)) {
      return candidate;
    } else {
      return null;
    }
  }

  public haveStopperInEnemySuit(): boolean {
    const enemyTrumps: HashSet<Trump> = this.auction.getEnemyTrumps();
    return !enemyTrumps.asArray().find((trump: Trump) => {
      if (trump.isNoTrump()) {
        return true;
      }
      if (!this.hand.haveStopper(trump as Suit)) {
        return true;
      }
    });
  }

  public abstract applies(): boolean;
}
