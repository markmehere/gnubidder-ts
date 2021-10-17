
import { Clubs, Hearts, Spades, Diamonds } from "../../deck/SuitValues";
import { Trump } from "../../deck/Trump";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { Rebid } from "./Rebid";

export class Rebid2NT extends Rebid {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public prepareBid(): Bid {
    let result: Bid = null;
    const level: number = this.response.value;
    const trump: Trump = this.response.trump;
    if (level == 3) {
      if (trump.isNoTrump()) {
        result = BidCollection.PASS;
      }
      if (trump === Clubs) {
        if (this.hand.getSuitLength(Hearts) >= 4) {
          result = BidCollection.makeBid(3, Hearts, true);
        } else if (this.hand.getSuitLength(Spades) >= 4) {
          result = BidCollection.makeBid(3, Spades, true);
        } else {
          result = BidCollection.makeBid(3, Diamonds, true);
        }
      } else {
        if (trump === Diamonds) {
          result = BidCollection.makeBid(3, Hearts, true);
        } else if (trump === Hearts) {
          result = BidCollection.makeBid(3, Spades, true);
        }
      }
    }
    return result;
  }

  private partnerWasRespondingToMy2NT(): boolean {
    return super.applies() && BidCollection.TWO_NOTRUMP.equals(this.opening);
  }

  public applies(): boolean {
    return this.partnerWasRespondingToMy2NT();
  }
}
