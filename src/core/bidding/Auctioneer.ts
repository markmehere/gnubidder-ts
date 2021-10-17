import { Trump } from "../deck/Trump";
import { DirectionInstance, Direction, DirectionCollection } from "../Direction";
import { HashSet } from "../utility/HashSet";
import { Bid } from "./Bid";
import { BidCollection } from "./BidCollection";
import { Call } from "./Call";
import { Vulnerability } from "./Vulnerability";

export class Auctioneer {
  public nextToBid: DirectionInstance;
  private passCount: number;
  private highBid: Bid;
  private bidCount: number;
  private last: Call;
  private beforeLast: Call;
  private calls: Call[];
  private vulnerability: Vulnerability;

  constructor(firstToBid: DirectionInstance) {
    this.nextToBid = firstToBid;
    this.bidCount = 0;
    this.passCount = 0;
    this.last = null;
    this.beforeLast = null;
    this.highBid = null;
    this.vulnerability = new Vulnerability(false, false);
    this.calls = [];
  }

  public setVulnerability(v: Vulnerability): void {
    this.vulnerability = v;
  }

  public getVulnerabilityIndex(): number {
    let result = 0;
    if (this.nextToBid.getValue() == Direction.NORTH || this.nextToBid.getValue() == Direction.SOUTH) {
      result += this.vulnerability.isDeclarerVulnerable() ? 2 : 0;
      result += this.vulnerability.isDefenderVulnerable() ? 1 : 0;
    } else {
      result += this.vulnerability.isDefenderVulnerable() ? 2 : 0;
      result += this.vulnerability.isDeclarerVulnerable() ? 1 : 0;
    }
    return result;
  }

  public getCalls(): Call[] {
    return this.calls.slice();
  }

  public bid(b: Bid): void {
    const bid: Bid = BidCollection.cloneBid(b);
    this.beforeLast = this.last;
    this.last = new Call(bid, this.nextToBid);
    this.calls.push(this.last);
    this.bidCount++;
    if (bid.isPass()) {
      this.passCount++;
    } else {
      this.passCount = 0;
      if (bid.isRedoubled()) {
        this.getHighBid().makeRedoubled();
      }
      if (bid.isDouble()) {
        this.getHighBid().makeDoubled();
      } else {
        this.highBid = bid;
      }
    }
    this.nextToBid = this.nextToBid.clockwise();
  }

  public biddingFinished(): boolean {
    return (this.passCount === 3 && this.highBid != null) || this.passCount === 4;
  }

  public getHighBid(): Bid {
    return this.highBid;
  }

  public isOpeningBid(): boolean {
    return !this.calls.reduce((acc, call) => acc || !call.isPass(), false);
  }

  public getPartnersLastCall(): Call {
    return this.beforeLast;
  }

  public getPartnersCall(playerCall: Call): Call {
    const current: number = this.calls.indexOf(playerCall);
    if (current >= 2) {
      return this.calls[current - 2];
    } else {
      return null;
    }
  }

  public getLastCall(): Call {
    return this.last;
  }

  public isValid(candidate: Bid): boolean {
    let result = false;

    if (candidate != null) {
      if (candidate.equals(BidCollection.DOUBLE)) {
        if (this.getHighCall() != null && !this.getHighCall().pairMatches(this.nextToBid) && !this.getHighBid().isDoubled()) {
          return true;
        }
      } else if (candidate.isPass() || candidate.greaterThan(this.getHighBid())) {
        result = true;
      }
    }

    return result;
  }

  public getDummy(): DirectionInstance {
    if (this.biddingFinished() && this.getHighCall() !== null) {
      const firstCall = this.calls.find((call: Call) => {
        return call.getBid().hasTrump() && call.getTrump() === this.getHighCall().getTrump() &&
          call.pairMatches(this.getHighCall().getDirection())
      });
      if (firstCall) return firstCall.getDirection().opposite();
    }
    return null;
  }

  public getHighCall(): Call {
    return this.calls.find(c => c.getBid().equals(this.highBid));
  }

  public enemyCallBeforePartner(myBid: Bid): Call {
    let myOrder: number;
    if (myBid == null) {
      myOrder = this.bidCount;
    } else {
      myOrder = this.getCallOrderZeroBased(myBid);
    }
    return this.getDirectEnemyCall(myOrder - 2);
  }

  private getDirectEnemyCall(callOrder: number): Call {
    let enemyCall: Call = this.calls[callOrder - 1];
    if (enemyCall.isPass()) {
      enemyCall = this.calls[callOrder - 3];
    }
    return enemyCall;
  }

  public getDummyOffsetDirection(original: DirectionInstance): DirectionInstance {
    let d: DirectionInstance = this.getDummy();
    let offset: DirectionInstance = original;
    for (let i = 0; i < 4; i++) {
      if (d === DirectionCollection.NORTH_INSTANCE) {
        break;
      } else {
        d = d.clockwise();
        offset = offset.clockwise();
      }
    }
    return offset;
  }

  public may2ndOvercall(): boolean {
    if (this.bidCount === 0 || this.bidCount > 6) {
      return false;
    }
    let opening: Bid = this.calls[this.bidCount - 1].getBid();
    if (opening.value === 1) {
      if (this.bidCount >= 3) {
        if (!this.calls[this.bidCount - 3].isPass()) {
          opening = this.calls[this.bidCount - 3].getBid();
        }
      }
      return this.isOpening(opening);
    }
    return false;
  }

  public may4thOvercall(): boolean {
    if (this.passCount !== 2 || this.bidCount < 3 || this.bidCount > 6) {
      return false;
    }
    const opening: Bid = this.calls[this.bidCount - 3].getBid();
    if (this.isOpening(opening) && opening.value === 1) {
      return true;
    }
    return false;
  }

  private getCallOrderZeroBased(bid: Bid): number {
    return this.calls.findIndex(c => c.getBid().equals(bid));
  }

  private OvercallIndex(bid: Bid): number {
    if (bid.equals(BidCollection.PASS)) return 0;
    let countPass = 0;
    let callOrder: number = this.getCallOrderZeroBased(bid);
    if (this.isOpening(this.calls[callOrder].getBid())) {
      return 0;
    }
    let ourBid = false;
    let getOut = false;
    while (callOrder !== 0 && !getOut) {
      callOrder--;
      const call: Call = this.calls[callOrder];
      if (!call.isPass()) {

        if (ourBid) {
          countPass = -1;
          getOut = true;
        } else if (this.isOpening(call.getBid())) {
          getOut = true;
        }
        
        if (!getOut && callOrder >= 2) {
          if (this.calls[callOrder - 1].isPass() && this.isOpening(this.calls[callOrder - 2].getBid())) {
            getOut = true;
          } else {
            countPass = -1;
            getOut = true;
          }
        }

        getOut = true;
      }
      if (!getOut) {
        countPass++;
        ourBid = !ourBid;
      }
    }
    if (countPass === 0) {
      return 1;
    } else if (countPass === 2) {
      return -1;
    } else {
      return 0;
    }
  }

  public isOvercall(bid: Bid): boolean {
    return this.OvercallIndex(bid) !== 0;
  }

  public isFourthOvercall(bid: Bid): boolean {
    return this.OvercallIndex(bid) == -1;
  }

  public getEnemyTrumps(): HashSet<Trump> {
    const result = new HashSet<Trump>();
    const reversedCalls = this.getCalls().reverse();
    let enemyBid = true;
    reversedCalls.forEach((call: Call) => {
      if (call.getBid().hasTrump() && enemyBid) {
        result.add(call.getTrump());
      }
      enemyBid = !enemyBid;
    });
    return result;
  }

  public biddingSequenceLength(): number {
    const reversedCalls = this.getCalls().reverse();
    let ourBid = false;
    let seqLength = 0;
    for (let i = 0; i < reversedCalls.length; i++) {
      if (ourBid) {
        const call = reversedCalls[i];
        if (call.getBid().hasTrump()) {
          seqLength++;
        }
        else {
          return seqLength;
        }
      }
      ourBid = !ourBid;
    }
    return seqLength;
  }

  public isOpening(bidWithTrump: Bid): boolean {
    const index: number = this.getCallOrderZeroBased(bidWithTrump);

    if (index > 3) {
      return false;
    }
    if (index === 0) {
      return true;
    }
    if (index === 1 && this.calls[0].isPass()) {
      return true;
    }
    if (index === 2 && this.calls[0].isPass() && this.calls[1].isPass()) {
      return true;
    }
    if (index === 3 && this.calls[0].isPass() && this.calls[1].isPass() && this.calls[2].isPass()) {
      return true;
    }

    return false;
  }
}
