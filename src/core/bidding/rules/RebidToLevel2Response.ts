import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Rebid } from "./Rebid";

export abstract class RebidToLevel2Response extends Rebid {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.opening.value == 1 && this.response.value == 2;
  }
}
