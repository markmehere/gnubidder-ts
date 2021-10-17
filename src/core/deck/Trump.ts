export abstract class Trump {

  public abstract index;

  public abstract toString(): string;

  public abstract toDebugString(): string;

  public isMajorSuit(): boolean {
    return false;
  }

  public isMinorSuit(): boolean {
    return false;
  }

  public isSuit(): boolean {
    return false;
  }

  public isNoTrump(): boolean {
    return false;
  }
}
