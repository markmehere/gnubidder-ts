import { Hand } from "../Hand";
import { Auctioneer } from "./Auctioneer";
import { Bid } from "./Bid";
import { AlwaysPass } from "./rules/AlwaysPass";
import { BiddingRule } from "./rules/BiddingRule";
import { Open1Color } from "./rules/Open1Color";
import { Open1NT } from "./rules/Open1NT";
import { Open2NT } from "./rules/Open2NT";
import { Overcall1NT } from "./rules/Overcall1NT";
import { OvercallSuit } from "./rules/OvercallSuit";
import { PRebidAfter1NT } from "./rules/PRebidAfter1NT";
import { PRebidToCorrect } from "./rules/PRebidToCorrect";
import { PRebidWeakTwo } from "./rules/PRebidWeakTwo";
import { PreemptiveBid } from "./rules/PreemptiveBid";
import { Rebid1ColorOriginalSuit } from "./rules/Rebid1ColorOriginalSuit";
import { Rebid1ColorRaiseOpener } from "./rules/Rebid1ColorRaiseOpener";
import { Rebid1ColorRaisePartner } from "./rules/Rebid1ColorRaisePartner";
import { Rebid1ColorWithNewSuit } from "./rules/Rebid1ColorWithNewSuit";
import { Rebid1ColorWithNT } from "./rules/Rebid1ColorWithNT";
import { Rebid1NT } from "./rules/Rebid1NT";
import { Rebid2C } from "./rules/Rebid2C";
import { Rebid2NT } from "./rules/Rebid2NT";
import { RebidAfter1NT } from "./rules/RebidAfter1NT";
import { RebidAfterForcing1NT } from "./rules/RebidAfterForcing1NT";
import { RebidForcing1NT } from "./rules/RebidForcing1NT";
import { RebidJacobyTransfer } from "./rules/RebidJacobyTransfer";
import { RebidMinorSuitStayman } from "./rules/RebidMinorSuitStayman";
import { RebidStayman } from "./rules/RebidStayman";
import { RebidTakeoutDouble } from "./rules/RebidTakeoutDouble";
import { RebidWeakTwo } from "./rules/RebidWeakTwo";
import { Respond1ColorRaiseMajorSuit } from "./rules/Respond1ColorRaiseMajorSuit";
import { Respond1ColorRaiseMinorSuit } from "./rules/Respond1ColorRaiseMinorSuit";
import { Respond1ColorWithNewSuit } from "./rules/Respond1ColorWithNewSuit";
import { Respond1ColorWithNT } from "./rules/Respond1ColorWithNT";
import { Respond1NT } from "./rules/Respond1NT";
import { Respond2C } from "./rules/Respond2C";
import { Respond2NT } from "./rules/Respond2NT";
import { RespondOvercallSuit } from "./rules/RespondOvercallSuit";
import { RespondPreemptiveBid } from "./rules/RespondPreemptiveBid";
import { RespondTakeoutDouble } from "./rules/RespondTakeoutDouble";
import { RespondWeakTwo } from "./rules/RespondWeakTwo";
import { Strong2C } from "./rules/Strong2C";
import { TakeoutDouble } from "./rules/TakeoutDouble";
import { WeakTwo } from "./rules/WeakTwo";

export class BiddingAgent {
  private rules: BiddingRule[];

  constructor(a: Auctioneer, h: Hand) {
    this.rules = [];
    this.rules.push(new Strong2C(a, h));
    this.rules.push(new Open2NT(a, h));
    this.rules.push(new Open1NT(a, h));
    this.rules.push(new Open1Color(a, h));
    this.rules.push(new OvercallSuit(a, h));
    this.rules.push(new Overcall1NT(a, h));
    this.rules.push(new TakeoutDouble(a, h));
    this.rules.push(new PreemptiveBid(a, h));
    this.rules.push(new WeakTwo(a, h));
    this.rules.push(new RespondPreemptiveBid(a, h));
    this.rules.push(new RespondWeakTwo(a, h));
    this.rules.push(new RespondOvercallSuit(a, h));
    this.rules.push(new RespondTakeoutDouble(a, h));
    this.rules.push(new Respond2C(a, h));
    this.rules.push(new Respond2NT(a, h));
    this.rules.push(new Respond1NT(a, h));
    this.rules.push(new Respond1ColorRaiseMajorSuit(a, h));
    this.rules.push(new Respond1ColorWithNewSuit(a, h));
    this.rules.push(new Respond1ColorRaiseMinorSuit(a, h));
    this.rules.push(new Respond1ColorWithNT(a, h));
    this.rules.push(new RebidWeakTwo(a, h));
    this.rules.push(new RebidTakeoutDouble(a, h));
    this.rules.push(new Rebid2C(a, h));
    this.rules.push(new Rebid2NT(a, h));
    this.rules.push(new Rebid1NT(a, h));
    this.rules.push(new RebidAfterForcing1NT(a, h));
    this.rules.push(new Rebid1ColorRaiseOpener(a, h));
    this.rules.push(new Rebid1ColorRaisePartner(a, h));
    this.rules.push(new Rebid1ColorWithNT(a, h));
    this.rules.push(new Rebid1ColorWithNewSuit(a, h));
    this.rules.push(new Rebid1ColorOriginalSuit(a, h));
    this.rules.push(new RebidAfter1NT(a, h));
    this.rules.push(new PRebidWeakTwo(a, h));
    this.rules.push(new RebidStayman(a, h));
    this.rules.push(new RebidJacobyTransfer(a, h));
    this.rules.push(new RebidMinorSuitStayman(a, h));
    this.rules.push(new RebidForcing1NT(a, h));
    this.rules.push(new PRebidAfter1NT(a, h));
    this.rules.push(new PRebidToCorrect(a, h));
    this.rules.push(new AlwaysPass());
  }

  public getBid(): Bid {
    let result: Bid = null;
    const rule = this.rules.find((rule: BiddingRule) => {
      result = rule.getBid();
      return result;
    });
    console.log("rule: " + rule.constructor.name + " recommends: " + result);
    return result;
  }
}
