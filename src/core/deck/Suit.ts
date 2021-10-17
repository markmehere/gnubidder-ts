import { Trump } from "./Trump";

export abstract class Suit extends Trump {
  
  public index = -1;

  public isLowerRankThan(other: Trump): boolean {
    if (!other.isSuit()) {
      return false;
    }
    return this.index < other.index;
  }

  public isSuit(): boolean {
    return true;
  }

  public isMinorSuit(): boolean {
    return false;
  }

  public isMajorSuit(): boolean {
    return false;
  }

  public isNoTrump(): boolean {
    return false;
  }
  
}
