import { Trump } from "../deck/Trump";
import { DirectionInstance, DirectionCollection } from "../Direction";
import { Bid } from "./Bid";


export class Call {
  private bid: Bid;
  private direction: DirectionInstance;

  constructor(b: Bid, d: DirectionInstance) {
    this.bid = b;
    this.direction = d;
  }

  public getBid(): Bid {
    return this.bid;
  }

  public getDirection(): DirectionInstance {
    return this.direction;
  }

  public toString(): string {
    return `${this.direction}: ${this.bid}`;
  }

  public toAltString(): string {
    return `${this.bid.toString().replace(' ', '').substr(0, 2)}${this.bid.toString()[2] === 'N' ? 'T' : ''} by ${DirectionCollection.toUniversalFromDirection(this.direction.getValue())}`;
  }

  public getTrump(): Trump {
    return this.bid.trump;
  }

  public isPass(): boolean {
    return this.bid.isPass();
  }

  public pairMatches(candidate: DirectionInstance): boolean {
    if (this.direction.equals(candidate) || this.direction.opposite().equals(candidate)) {
      return true;
    } else {
      return false;
    }
  }
}
