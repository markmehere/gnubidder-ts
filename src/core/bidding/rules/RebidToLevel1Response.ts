import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { Rebid } from "./Rebid";

export abstract class RebidToLevel1Response extends Rebid {
  constructor(a: Auctioneer, h: Hand) {
    super(a, h);
  }

  public applies(): boolean {
    return super.applies() && this.response.value == 1;
  }
}
