
import { Spades, Clubs, Diamonds } from "../../deck/SuitValues";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { BidCollection } from "../BidCollection";
import { PointCalculator } from "../PointCalculator";
import { PRebidNoTrump } from "./PRebidNoTrump";

export class RebidMinorSuitStayman extends PRebidNoTrump {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.response.trump === Spades && this.response.value == 2;
  }

  public prepareBid(): Bid {
    const pc: PointCalculator = new PointCalculator(this.hand);
    let result: Bid = null;
    const points: number = this.fourthOvercalled ? pc.getCombinedPoints() - 3 : pc.getCombinedPoints();
    const clubs: number = this.hand.getSuitLength(Clubs);
    const diamonds: number = this.hand.getSuitLength(Diamonds);

    if (points <= 7 && diamonds >= 5) {
      if (diamonds >= 6) {
        result = BidCollection.THREE_DIAMONDS_C();
      } else if (clubs >= 5) {
        result = BidCollection.THREE_CLUBS_C();
      }
      if (this.auction.isValid(result)) {
        return result;
      }
    }
    return result;
  }
}
