
import { Suit } from "../deck/Suit";
import { Hand } from "../Hand";
import { Bid } from "./Bid";
import { PointCalculator } from "./PointCalculator";

export class ResponseCalculator extends PointCalculator {
  private partnersBid: Bid = null;

  constructor(hand: Hand, partnersBid?: Bid) {
    super(hand);
    this.partnersBid = partnersBid;
  }

  public distributionalValueForCardsInSuit(suit: Suit): number {
    if (!this.partnersBidIsASuit()) {
      return super.distributionalValueForCardsInSuit(suit);
    }
    if (suit === this.partnersBid.trump) {
      return 0;
    }
    let result: number = super.distributionalValueForCardsInSuit(suit);
    if (4 <= this.hand.getSuitLength(this.partnersBid.trump as Suit)) {
      const colorLength: number = this.hand.getSuitLength(suit);
      if (colorLength == 0) {
        result += 2;
      } else if (colorLength == 1) {
        result += 1;
      }
    }
    return result;
  }

  private partnersBidIsASuit(): boolean {
    return this.partnersBid.trump.isSuit();
  }
}
