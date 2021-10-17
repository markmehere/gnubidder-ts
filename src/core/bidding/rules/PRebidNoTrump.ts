import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Bid } from "../Bid";
import { PartnersRebid } from "./PartnersRebid";

export abstract class PRebidNoTrump extends PartnersRebid {
  public level: number;
  public fourthOvercalled = false;

  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    if (super.applies()) {
      this.level = this.opening.value;
      if (this.opening.trump.isNoTrump() && this.level < 3) {
        if (this.auction.isFourthOvercall(this.opening)) {
          this.fourthOvercalled = true;
        }
        return true;
      }
    }
    return false;
  }

  public abstract prepareBid(): Bid;
}
