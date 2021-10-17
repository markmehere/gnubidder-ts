import { NoTrump } from "../deck/NoTrump";
import { Clubs, Diamonds, Hearts, Spades } from "../deck/SuitValues";
import { Trump } from "../deck/Trump";

const do_not_use_outside = "shouldnotconstructotherthanBidCollection.ts";

/*
  Unlike suits, cards and directions - there is no guarantee two equal bids
  are the same instance. This is because the bids have certain variable
  properties (forcing, gameForcing and doubled). You still should not construct
  a bid but instead clone the existing bid and toggle these properties. You
  definitely should not use indexOf() or === on bids as you might with suits,
  cards and directions.
*/

const PASS_VALUE = -1;
const DOUBLE_VALUE = -2;
const REDOUBLE_VALUE = -3;

export const PASS = "PASS";
export const DOUBLE = "DOUBLE";
export const REDOUBLE = "REDOUBLE";

export class Bid {
  public readonly value: number;
  public readonly trump: Trump;
  private forcing = false;
  private gameForcing = false;
  private doubled = false;
  private redoubled = false;

  constructor(v: number, c: Trump, secret: string) {
    if (secret !== do_not_use_outside) {
      throw new Error("Assert failure: Bid constructed without secret");
    }
    this.value = v;
    this.trump = c;
  }

  public equals(other: Bid): boolean {
    if (!other) return false;
    return this.value === other.value && this.trump === other.trump;
  }
  
  public greaterThan(other: Bid): boolean {
    if (other == null) {
      return true;
    }
    if (this.value === -1) {
      return false;
    }
    if (other.value === -1) {
      return true;
    }
    if (this.value > other.value) {
      return true;
    }
    else if (this.value < other.value) {
      return false;
    }
    else {
      return this.isColorGreater(other);
    }
  }

  private isColorGreater(other: Bid): boolean {
    if (Clubs === this.trump) {
      return false;
    }

    if (this.trump === Diamonds) {
      if (other.trump === Clubs) {
        return true;
      } else {
        return false;
      }
    }

    if (this.trump === Hearts) {
      if (other.trump === Clubs || other.trump === Diamonds) {
        return true;
      } else {
        return false;
      }
    }

    if (this.trump === Spades) {
      if (other.trump === Clubs || other.trump === Diamonds || other.trump === Hearts) {
        return true;
      } else {
        return false;
      }
    }

    if (other.trump !== NoTrump) {
      return true;
    } else {
      return false;
    }
  }
  
  public toString(): string {
    return `${this.value} ${this.trump}`;
  }

  public toUniversal(): string {
    return `${this.value}${this.trump.isNoTrump() ? 'NT' : this.trump.toString()[0]}`;
  }

  public isPass(): boolean {
    return this.value === PASS_VALUE;
  }

  public isForcing(): boolean {
    return this.forcing;
  }
  
  public isGameForcing(): boolean {
    return this.gameForcing;
  }

  public makeForcing() {
    this.forcing = true;
  }

  public makeForcingAndClone() {
    const clone = new Bid(this.value, this.trump, do_not_use_outside);
    clone.doubled = this.doubled;
    clone.forcing = true;
    clone.gameForcing = this.gameForcing;
    clone.redoubled = this.redoubled;
    return clone;
  }

  public makeGameForcing() {
    this.forcing = true;
    this.gameForcing = true;
  }

  public makeGameForcingAndClone() {
    const clone = new Bid(this.value, this.trump, do_not_use_outside);
    clone.doubled = this.doubled;
    clone.forcing = true;
    clone.gameForcing = true;
    clone.redoubled = this.redoubled;
    return clone;
  }

  public is1Suit(): boolean {
    if (this.value === 1 && this.trump.isSuit()) {
      return true;
    } else {
      return false;
    }
  }

  public makeDoubled() {
    this.doubled = true;
  }

  public makeRedoubled() {
    this.redoubled = true;
  }

  public makeDoubledAndClone(): Bid {
    const clone = new Bid(this.value, this.trump, do_not_use_outside);
    clone.doubled = true;
    clone.forcing = this.forcing;
    clone.gameForcing = this.gameForcing;
    clone.redoubled = false;
    return clone;
  }

  public makeRedoubledAndClone(): Bid {
    const clone = new Bid(this.value, this.trump, do_not_use_outside);
    clone.doubled = true;
    clone.forcing = this.forcing;
    clone.gameForcing = this.gameForcing;
    clone.redoubled = false;
    return clone;
  }

  public isDoubled(): boolean {
    return this.doubled;
  }
  
  public isRedoubled(): boolean {
    return this.redoubled;
  }

  /*
   * A note misnomer as no trumps will have trump - used to distinguish bids that are PASS, DOUBLE or REDOUBLE
   */
  public hasTrump(): boolean {
    return this.trump !== null;
  }

  public isDouble(): boolean {
    return this.value === DOUBLE_VALUE;
  }

  public isRedouble(): boolean {
    return this.value === REDOUBLE_VALUE;
  }

  public longDescription(): string {
    let result: string = this.toString();
    if (this.isDoubled()) {
      result += " (Doubled)";
    }
    return result;
  }
}

export class Pass extends Bid {
  constructor(secret: string) {
    super(PASS_VALUE, null, secret);
  }

  public toString(): string {
    return PASS;
  }
}

export class Double extends Bid {
  constructor(secret: string) {
    super(DOUBLE_VALUE, null, secret);
  }

  public toString(): string {
    return "DOUBLE";
  }
}

export class Redouble extends Bid {
  constructor(secret: string) {
    super(REDOUBLE_VALUE, null, secret);
  }

  public toString(): string {
    return "REDOUBLE";
  }
}
